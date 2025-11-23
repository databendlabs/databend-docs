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

## 权限与参考

- 将 `CREATE MASKING POLICY`（通常授予 `*.*`）赋予负责创建或替换策略的角色，创建者会自动获得策略的 OWNERSHIP。
- 需要在全局授予 `APPLY MASKING POLICY`，或针对单个策略授予 `APPLY ON MASKING POLICY <policy_name>`，角色才能使用 `ALTER TABLE` 设置或解除策略；拥有 OWNERSHIP 的角色也可以执行这些操作。
- 使用 `SHOW GRANTS ON MASKING POLICY <policy_name>` 审计哪些角色拥有 APPLY/OWNERSHIP。
- 延伸阅读：
  - [User & Role](/sql/sql-commands/ddl/user/)
  - [CREATE MASKING POLICY](/sql/sql-commands/ddl/mask-policy/create-mask-policy)
  - [ALTER TABLE](/sql/sql-commands/ddl/table/alter-table#column-operations)
  - [Masking Policy Commands](/sql/sql-commands/ddl/mask-policy/)
