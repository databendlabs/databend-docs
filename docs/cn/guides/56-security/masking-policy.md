---
title: 动态脱敏
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MASKING POLICY'/>

动态脱敏策略在查询时对列值进行转换，帮助你按照角色控制谁能看到真实数据、谁只能看到脱敏后的结果。

## 脱敏策略如何工作

策略会在查询阶段读取 `current_role()` 等信息并决定返回值。

**Managers 查看真实数据**
```sql
id | email           |
---|-----------------|
 2 | eric@example.com|
 1 | sue@example.com |
```

**其他角色看到掩码**
```sql
id | email    |
---|----------|
 2 | *********|
 1 | *********|
```

### 核心特性

- **查询时生效**：仅在 SELECT 中转换值。
- **逻辑灵活**：可结合 `current_role()` 或其他表达式判断。
- **列级控制**：策略附着在列上，可跨表复用。
- **不改原值**：存储中的真实数据不会被修改。

## 全流程示例

下面的步骤展示了如何为列添加脱敏保护。

### 1. 创建目标表

```sql
CREATE TABLE user_info (id INT, email STRING NOT NULL);
```

### 2. 定义脱敏策略

```sql
CREATE MASKING POLICY email_mask
AS (val STRING)
RETURNS STRING ->
CASE
  WHEN current_role() IN ('MANAGERS') THEN val
  ELSE '*********'
END;
```

### 3. 绑定到列

```sql
ALTER TABLE user_info MODIFY COLUMN email SET MASKING POLICY email_mask;
```

### 4. 写入并查询

```sql
INSERT INTO user_info VALUES (1, 'user@example.com');
SELECT * FROM user_info;
```

**返回结果**

```sql
id | email
---|----------
 1 | *********
```

## 读写行为

脱敏策略只影响读取路径。INSERT/UPDATE/DELETE 始终写入真实值，保证应用逻辑和存储一致。

```sql
-- 写入真实数据
INSERT INTO user_info VALUES (2, 'admin@example.com');

-- 读取时应用脱敏
SELECT * FROM user_info WHERE id = 2;
```

**返回结果**

```sql
id | email
---|----------
 2 | *********
```

## 管理策略

### DESCRIBE MASKING POLICY

查看策略的创建时间、签名、返回类型及定义。

```sql
DESCRIBE MASKING POLICY email_mask;
```

**返回结果**

```sql
Name       | Created On                  | Signature    | Return Type | Body                                                     | Comment
-----------+-----------------------------+--------------+-------------+----------------------------------------------------------+---------
email_mask | 2025-11-19 10:29:06.005 UTC | (val STRING) | STRING      | CASE WHEN current_role() IN('MANAGERS') THEN val ELSE... |
```

### DROP MASKING POLICY

删除不再需要的策略（删除前需先从所有列上解除）。

```sql
DROP MASKING POLICY [IF EXISTS] email_mask;
```

### 解除列上的策略

```sql
ALTER TABLE user_info MODIFY COLUMN email UNSET MASKING POLICY;
```

## 条件脱敏（Conditional Masking）

使用 `USING` 子句可以让策略引用其他列。例如根据 `is_vip` 字段判断是否需要掩码：

```sql
CREATE MASKING POLICY vip_mask
AS (val STRING, is_vip BOOLEAN)
RETURNS STRING ->
CASE
  WHEN is_vip = true THEN val
  ELSE '*********'
END;

ALTER TABLE user_info MODIFY COLUMN email SET MASKING POLICY vip_mask USING (email, is_vip);
INSERT INTO user_info (id, email, is_vip)
VALUES (1, 'vip@example.com', true), (2, 'normal@example.com', false);
SELECT * FROM user_info;
```

**返回结果**

```sql
id | email              | is_vip
---|--------------------|-------
 1 | vip@example.com    | true
 2 | *********          | false
```

## Variant 字段级脱敏

在脱敏策略中使用 `object_delete` 可以隐藏 VARIANT 列中的指定 key。所有访问方式（下标访问、`json_path_query`、`get_path`、CAST、`json_object_keys`）都会生效——被隐藏的 key 返回 NULL 或从结果中消失。

### 第一步：创建表并插入示例数据

```sql
CREATE TABLE events (
  id INT,
  data VARIANT
);

INSERT INTO events VALUES
  (1, parse_json('{"name": "alice", "content": "secret data", "secret_key": "sk_123", "age": 30}')),
  (2, parse_json('{"name": "bob", "content": "private info", "secret_key": "sk_456", "age": 25}'));
```

### 第二步：创建角色

```sql
-- 可以看到完整 VARIANT 数据的角色
CREATE ROLE data_admin;

-- 看不到敏感字段的角色
CREATE ROLE data_reader;
```

### 第三步：创建脱敏策略

```sql
-- 对非管理员角色隐藏 'content' 和 'secret_key'
CREATE MASKING POLICY mask_variant_sensitive
  AS (val VARIANT) RETURNS VARIANT ->
    CASE
      WHEN current_role() IN ('data_admin', 'account_admin') THEN val
      ELSE object_delete(val, 'content', 'secret_key')
    END;
```

### 第四步：绑定到 VARIANT 列

```sql
ALTER TABLE events MODIFY COLUMN data SET MASKING POLICY mask_variant_sensitive;
```

### 第五步：授权

```sql
GRANT SELECT ON default.events TO ROLE data_admin;
GRANT SELECT ON default.events TO ROLE data_reader;
GRANT ROLE data_admin TO USER 'admin_user';
GRANT ROLE data_reader TO USER 'normal_user';
```

### 第六步：验证

```sql
-- 以 data_admin 身份查询：完整数据可见
SET ROLE data_admin;
SELECT data FROM events;
-- {"age":30,"content":"secret data","name":"alice","secret_key":"sk_123"}
-- {"age":25,"content":"private info","name":"bob","secret_key":"sk_456"}

-- 以 data_reader 身份查询：敏感字段已删除
SET ROLE data_reader;

SELECT data FROM events;
-- {"age":30,"name":"alice"}
-- {"age":25,"name":"bob"}

SELECT data['content'] FROM events;
-- NULL
-- NULL

SELECT data['name'] FROM events;
-- "alice"
-- "bob"

SELECT json_path_query_first(data, '$.content') FROM events;
-- NULL

SELECT data::STRING FROM events;
-- {"age":30,"name":"alice"}

SELECT json_object_keys(data) FROM events;
-- ["age","name"]

SELECT * FROM events WHERE data['content'] IS NOT NULL;
-- （空结果）
```

:::tip
如需隐藏嵌套 key，使用 `delete_by_keypath`：
```sql
ELSE delete_by_keypath(val, 'nested:secret')
```
:::

## 权限与参考

- 将 `CREATE MASKING POLICY`（通常授予 `*.*`）赋予负责创建或替换策略的角色，创建者会自动获得策略的 OWNERSHIP。
- 需要在全局授予 `APPLY MASKING POLICY`，或针对单个策略授予 `APPLY ON MASKING POLICY <policy_name>`，角色才能使用 `ALTER TABLE` 设置或解除策略；拥有 OWNERSHIP 的角色也可以执行这些操作。
- 使用 `SHOW GRANTS ON MASKING POLICY <policy_name>` 审计哪些角色拥有 APPLY/OWNERSHIP。
- 延伸阅读：
  - [User & Role](/sql/sql-commands/ddl/user)
  - [CREATE MASKING POLICY](/sql/sql-commands/ddl/mask-policy/create-mask-policy)
  - [ALTER TABLE](/sql/sql-commands/ddl/table/alter-table#column-operations)
  - [Masking Policy Commands](/sql/sql-commands/ddl/mask-policy)
