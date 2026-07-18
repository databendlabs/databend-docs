---
title: 动态脱敏
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MASKING POLICY'/>

动态脱敏策略在查询时转换列值。授权角色看到真实数据，其他角色看到脱敏结果；存储中的数据不会被修改。

若要隐藏整行而不是脱敏列值，请使用[行访问策略](/guides/security/data-protection/row-access-policy)。

## 适用场景

- 客服系统 — 能看订单，身份证显示为 `3201**********1234`
- 数据分析 — 邮箱显示为 `***@***.com`，不影响聚合
- VARIANT 日志 — 对非管理员隐藏 `secret_key` / `token`
- 部分脱敏 — 只展示卡号后四位用于核实

## 快速开始

```sql
CREATE TABLE user_info (id INT, email STRING NOT NULL);

CREATE MASKING POLICY email_mask
AS (val STRING)
RETURNS STRING ->
CASE
  WHEN is_role_in_session('managers') THEN val
  ELSE '*********'
END;

ALTER TABLE user_info MODIFY COLUMN email SET MASKING POLICY email_mask;

INSERT INTO user_info VALUES (1, 'user@example.com');
SELECT * FROM user_info;
```

```
id | email
---|----------
 1 | *********
```

**工作方式**

- 仅查询时生效 — `SELECT` 脱敏；`INSERT` / `UPDATE` / `DELETE` 使用真实值
- 列级绑定 — 一列一个策略，可跨表复用
- 优先 `is_role_in_session()`，避免用户用 `SET ROLE` 绕过

## 示例

### 条件脱敏（`USING`）

根据其他列决定是否脱敏：

```sql
CREATE MASKING POLICY vip_mask
AS (val STRING, is_vip BOOLEAN)
RETURNS STRING ->
CASE
  WHEN is_vip = true THEN val
  ELSE '*********'
END;

ALTER TABLE user_info
MODIFY COLUMN email SET MASKING POLICY vip_mask USING (email, is_vip);

INSERT INTO user_info (id, email, is_vip) VALUES
  (1, 'vip@example.com', true),
  (2, 'normal@example.com', false);

SELECT * FROM user_info;
```

```
id | email           | is_vip
---|-----------------|-------
 1 | vip@example.com | true
 2 | *********       | false
```

只有策略体真正用到的列，才放进 `USING`。

### VARIANT 字段级脱敏

用 `object_delete` 隐藏指定 JSON key。下标、路径函数、CAST、`json_object_keys` 都会遵守脱敏。

```sql
CREATE TABLE events (id INT, data VARIANT);

INSERT INTO events VALUES
  (1, parse_json('{"name":"alice","content":"secret data","secret_key":"sk_123","age":30}')),
  (2, parse_json('{"name":"bob","content":"private info","secret_key":"sk_456","age":25}'));

CREATE ROLE data_admin;
CREATE ROLE data_reader;

CREATE MASKING POLICY mask_variant_sensitive
AS (val VARIANT) RETURNS VARIANT ->
CASE
  WHEN is_role_in_session('data_admin') OR is_role_in_session('account_admin') THEN val
  ELSE object_delete(val, 'content', 'secret_key')
END;

ALTER TABLE events MODIFY COLUMN data SET MASKING POLICY mask_variant_sensitive;

GRANT SELECT ON default.events TO ROLE data_admin;
GRANT SELECT ON default.events TO ROLE data_reader;
```

| `data_admin` | `data_reader` |
|--------------|---------------|
| 完整 JSON | 去掉 `content` / `secret_key` |

```sql
SET ROLE data_reader;

SELECT data FROM events;
-- {"age":30,"name":"alice"}

SELECT data['content'] FROM events;                 -- NULL
SELECT data['name'] FROM events;                    -- "alice"
SELECT json_path_query_first(data, '$.content');    -- NULL
SELECT data::STRING FROM events;                    -- {"age":30,"name":"alice"}
SELECT json_object_keys(data) FROM events;          -- ["age","name"]
SELECT * FROM events WHERE data['content'] IS NOT NULL;
-- 空
```

嵌套 key：

```sql
ELSE delete_by_keypath(val, 'nested:secret')
```

## 读写行为

| 操作 | 效果 |
|------|------|
| `SELECT` | 返回脱敏值 |
| `INSERT` / `UPDATE` / `DELETE` | 使用真实值（写路径不脱敏） |

```sql
INSERT INTO user_info VALUES (2, 'admin@example.com');  -- 写入真实邮箱
SELECT * FROM user_info WHERE id = 2;                   -- 返回 *********
```

## 管理策略

```sql
DESCRIBE MASKING POLICY email_mask;

ALTER TABLE user_info MODIFY COLUMN email UNSET MASKING POLICY;
DROP MASKING POLICY IF EXISTS email_mask;
```

`DROP MASKING POLICY` 前先从所有列解绑。可用 `POLICY_REFERENCES(POLICY_NAME => 'email_mask')` 查找绑定。

## 脱敏 vs 行访问

| | 脱敏策略 | 行访问策略 |
|---|---|---|
| 范围 | 列值 | 整行 |
| 返回类型 | 与列类型一致 | 固定 BOOLEAN |
| 每表限制 | 每列一个 | 每表一个 |
| 影响操作 | `SELECT` | `SELECT`、`UPDATE`、`DELETE`、`MERGE` |

同一列不能同时绑定两种策略。行仍可见但字段要打码 → 脱敏；整行不该被看到 → 行访问。

## 限制

- 一列最多一个脱敏策略
- 返回类型必须与列类型匹配
- 修改 / 删除受保护列前先 `UNSET MASKING POLICY`
- 仍被引用的策略不能 DROP
- 不支持 `CREATE OR REPLACE MASKING POLICY` — 先删再建
- 不支持临时表、视图、stream
- 策略名在脱敏与行访问之间全局唯一
- 参数名创建时规范为小写

## 最佳实践

1. 优先 `is_role_in_session()`，少用 `current_role()`。
2. `USING` 尽量少 — 只放策略体需要的列。
3. 脱敏占位符保持类型/格式一致（如邮箱用 `***@***.com`），避免破坏 `LENGTH` / `LIKE`。
4. VARIANT 用 `object_delete` / `delete_by_keypath`，不要整列替换。
5. 先解绑再删除；绑定后用受限角色验证。

## 权限与参考

- `CREATE MASKING POLICY`（通常 `*.*`）用于创建策略（创建者获得 OWNERSHIP）
- 全局 `APPLY MASKING POLICY` 或 `APPLY ON MASKING POLICY <name>` 用于绑定/解绑
- 审计：`SHOW GRANTS ON MASKING POLICY <name>`

延伸阅读：

- [User & Role](/sql/sql-commands/ddl/user)
- [CREATE MASKING POLICY](/sql/sql-commands/ddl/mask-policy/create-mask-policy)
- [ALTER TABLE](/sql/sql-commands/ddl/table/alter-table#column-operations)
- [Masking Policy Commands](/sql/sql-commands/ddl/mask-policy)
- [行访问策略](/guides/security/data-protection/row-access-policy)
