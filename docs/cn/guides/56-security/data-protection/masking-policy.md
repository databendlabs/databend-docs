---
title: 动态脱敏
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.956"/>

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

## 在 SELECT WHERE 中按原始值过滤 {/* #filter-on-original-values-in-select-where */}

从 v1.2.956 开始，列的脱敏策略绑定可以允许 `SELECT WHERE` 使用原始值。返回结果仍然显示脱敏值。此选项名为 `where_use_unmasked_value`，默认值为 `false`。

:::caution[此选项会暴露原始值的相关信息]
这是列绑定上的持久化授权，不是会话设置，也不是针对某个角色的绕过选项。读取此绑定的所有用户，都可以在符合条件的 `SELECT WHERE` 中测试原始值。行数和匹配行的 ID 可能泄露敏感信息。只有可以接受此类信息披露时，才应启用此选项。
:::

以下示例从返回的 JSON 中删除 `secret`。最初按此键过滤时没有匹配行。启用选项后，过滤可以找到一行，但选出的键仍为 `NULL`。

```sql
CREATE TABLE mask_lookup (id INT, data VARIANT);

INSERT INTO mask_lookup VALUES
  (1, parse_json('{"secret":"alice","public":1}')),
  (2, parse_json('{"secret":"bob","public":2}'));

CREATE MASKING POLICY lookup_mask
AS (val VARIANT) RETURNS VARIANT -> object_delete(val, 'secret');

ALTER TABLE mask_lookup MODIFY COLUMN data SET MASKING POLICY lookup_mask;

SELECT count(*) FROM mask_lookup WHERE data['secret']::STRING = 'alice';
-- 0

ALTER TABLE mask_lookup MODIFY COLUMN data SET MASKING POLICY lookup_mask
OPTIONS (where_use_unmasked_value = true);

SELECT id, data['secret']::STRING, data['public']::INT
FROM mask_lookup
WHERE data['secret']::STRING = 'alice';
-- 1 | NULL | 1
```

### 范围与重置

- 例外规则适用于当前 `SELECT WHERE` 中已授权的基础列引用。当该 WHERE 将 SELECT 列表中的别名解析为这类引用时，同样适用。
- SELECT 列表、`JOIN ON`、`GROUP BY`、`HAVING` 和 `ORDER BY` 仍使用脱敏值。外层 WHERE 对子查询或 CTE 的脱敏输出进行过滤时，不会恢复原始值。
- 此选项只属于一个列绑定。使用同一策略的其他列不会继承此选项。
- 只修改此选项时，请使用相同的策略再次执行 `SET MASKING POLICY`。如有 `USING` 列，也必须保持相同。将 `OPTIONS` 放在 `USING` 之后。要更换策略或参数列，请先执行 `UNSET MASKING POLICY`。
- 将选项设为 `false`、再次执行不带 `OPTIONS` 的 `SET MASKING POLICY`，或取消策略绑定，都会清除此授权。
- 修改此选项需要与绑定策略相同的表权限和策略权限。它不会授予额外的写入权限。

```sql
ALTER TABLE mask_lookup MODIFY COLUMN data SET MASKING POLICY lookup_mask
OPTIONS (where_use_unmasked_value = false);

SELECT count(*) FROM mask_lookup WHERE data['secret']::STRING = 'alice';
-- 0
```

### 混合版本部署

旧版 query 节点会忽略此元数据，并在 WHERE 中使用脱敏值。如果旧节点重写表元数据，可能移除此选项。升级或降级后，在依赖原始值过滤之前，请验证此绑定。并非所有节点都支持此选项时，不应假定各节点的过滤结果一致。

## 读写行为

| 操作 | 效果 |
|------|------|
| `SELECT` | 使用脱敏值，但已授权的 `WHERE` 原始值过滤除外 |
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
