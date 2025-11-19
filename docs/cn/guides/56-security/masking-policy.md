---
title: 动态脱敏策略（Masking Policy）
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MASKING POLICY'/>

动态脱敏策略（Masking Policy）在查询执行期间动态转换列值，从而保护敏感数据。它实现基于角色的机密信息访问：授权用户看到真实数据，其他用户则看到脱敏后的值。

## 工作原理

动态脱敏策略（Masking Policy）根据当前用户的角色，对列数据应用转换表达式：

**对于 managers：**
```sql
id | email           |
---|-----------------|
 2 | eric@example.com|
 1 | sue@example.com |
```

**对于其他用户：**
```sql
id | email    |
---|----------|
 2 | *********|
 1 | *********|
```

## 关键特性

- **查询时脱敏**：策略仅在 SELECT 操作期间转换数据
- **基于角色**：访问规则依赖当前用户的角色，通过 `current_role()` 判断
- **列级粒度**：作用于特定表列
- **可复用**：一个策略可保护不同表中的多个列
- **非侵入式**：原始数据在存储中保持不变

## 读操作与写操作

**重要**：动态脱敏策略（Masking Policy）**仅作用于读操作**（SELECT 查询）。写操作（INSERT、UPDATE、DELETE）始终处理原始、未脱敏的数据，从而确保：

- 查询结果按用户权限受到保护
- 应用程序可存储并修改真实数据值
- 底层存储的数据完整性得以保持

## 快速入门

### 1. 创建动态脱敏策略（Masking Policy）

```sql
CREATE MASKING POLICY email_mask
AS (val STRING)
RETURNS STRING ->
CASE
  WHEN current_role() IN ('MANAGERS') THEN val
  ELSE '*********'
END;
```

### 2. 应用到表列

```sql
ALTER TABLE user_info MODIFY COLUMN email SET MASKING POLICY email_mask;
```

### 3. 测试策略

```sql
-- 创建测试数据
CREATE TABLE user_info (id INT, email STRING NOT NULL);
INSERT INTO user_info VALUES (1, 'user@example.com');

-- 以不同角色查询，观察脱敏效果
SELECT * FROM user_info;
```

## 前提条件

- 创建策略前，先定义用户角色及其访问权限
- 确保用户已分配适当角色
- 角色管理请参考 [User & Role](/sql/sql-commands/ddl/user/)

### 所需权限

- 需要将 `CREATE MASKING POLICY`（通常授予 `*.*`）赋予负责创建或替换脱敏策略的角色。Databend 会在策略创建完成后自动将该策略的 OWNERSHIP 授予当前角色。
- 需要将全局 `APPLY MASKING POLICY` 权限，或使用 `GRANT APPLY ON MASKING POLICY <policy_name>` 为角色授予特定策略的控制权，才能在 `ALTER TABLE` 中设置/解除策略；拥有该策略的 OWNERSHIP 也可执行这些操作。
- 通过 `SHOW GRANTS ON MASKING POLICY <policy_name>` 可以审计哪些角色拥有 APPLY 或 OWNERSHIP 权限。

## 策略管理

有关创建、修改和管理动态脱敏策略（Masking Policy）的详细命令，请查阅：
- [CREATE MASKING POLICY](/sql/sql-commands/ddl/mask-policy/create-mask-policy)
- [ALTER TABLE](/sql/sql-commands/ddl/table/alter-table#column-operations)
- [Masking Policy Commands](/sql/sql-commands/ddl/mask-policy/)
