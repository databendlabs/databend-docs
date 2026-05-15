---
title: 行访问策略
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='ROW ACCESS POLICY'/>

行访问策略（Row Access Policy）通过在查询时过滤表中的行来保护数据。你可以集中定义行级谓词，并将其绑定到表上，确保用户只能看到满足策略条件的行。

:::note
Row Access Policy 当前为实验性功能。可通过 `SET enable_experimental_row_access_policy = 1` 在当前会话启用，或通过 `SET GLOBAL enable_experimental_row_access_policy = 1` 在账号范围启用。
:::

## 行访问策略如何工作

策略会为每一行计算一个布尔表达式。只有表达式返回 `TRUE` 的行才可见。

**Admin 角色查看所有行**

```sql
id | name    | department
---|---------|-------------
 1 | Alice   | Engineering
 2 | Bob     | Sales
 3 | Charlie | Engineering
```

**其他角色只看到策略允许的行**

```sql
id | name    | department
---|---------|-------------
 1 | Alice   | Engineering
 3 | Charlie | Engineering
```

### 核心特性

- **查询时生效**：在 SELECT 和 DML 目标行匹配时过滤行，存储中的数据不会改变。
- **角色感知**：表达式可引用 `current_role()` 或其他上下文函数。
- **表级绑定**：一张表绑定一个行访问策略，并将一个或多个表列映射到策略参数。
- **可复用**：当映射列类型兼容时，同一个策略可以绑定到多张表。

## 全流程示例

### 1. 启用功能

```sql
SET enable_experimental_row_access_policy = 1;
```

### 2. 创建目标表

```sql
CREATE TABLE employees (
    id INT,
    name STRING,
    department STRING
);

INSERT INTO employees VALUES
    (1, 'Alice', 'Engineering'),
    (2, 'Bob', 'Sales'),
    (3, 'Charlie', 'Engineering');
```

### 3. 定义行访问策略

```sql
CREATE ROW ACCESS POLICY rap_engineering
AS (dept STRING)
RETURNS BOOLEAN ->
CASE
  WHEN current_role() = 'admin' THEN true
  WHEN dept = 'Engineering' THEN true
  ELSE false
END;
```

### 4. 绑定到表

```sql
ALTER TABLE employees ADD ROW ACCESS POLICY rap_engineering ON (department);
```

`ON (department)` 会将表列 `department` 映射到策略参数 `dept`。

### 5. 查询表

```sql
SELECT id, name, department FROM employees ORDER BY id;
```

**返回结果**

```sql
id | name    | department
---|---------|-------------
 1 | Alice   | Engineering
 3 | Charlie | Engineering
```

## 读写行为

Row Access Policy 会影响读取路径，也会影响 DML 的目标行匹配。`UPDATE`、`DELETE` 和 `MERGE` 只会匹配并修改策略可见的行；不可见行不会被匹配或修改。

`INSERT` 不同：它会正常写入数据。如果插入的行不满足策略条件，该行仍会存储下来，只是在受策略保护的读取和 DML 中不可见。

### 完整 DML 示例

下面的示例使用一个只允许查看 `sales` 行的策略。示例中会在每次操作后临时解除策略，仅用于检查真实存储结果。

```sql
SET enable_experimental_row_access_policy = 1;

DROP TABLE IF EXISTS rap_dml_orders;
DROP TABLE IF EXISTS rap_dml_src;
DROP ROW ACCESS POLICY IF EXISTS rap_sales_only;

CREATE ROW ACCESS POLICY rap_sales_only
AS (dept STRING)
RETURNS BOOLEAN -> dept = 'sales';

CREATE TABLE rap_dml_orders(id INT, dept STRING, amount INT);
ALTER TABLE rap_dml_orders ADD ROW ACCESS POLICY rap_sales_only ON (dept);

-- INSERT 不受影响：可见行和不可见行都会被写入。
INSERT INTO rap_dml_orders VALUES
    (1, 'sales', 100),
    (2, 'eng',   200),
    (3, 'sales', 300);

-- SELECT 受影响：只返回策略可见的行。
SELECT id, dept, amount FROM rap_dml_orders ORDER BY id;

id | dept  | amount
---|-------|-------
 1 | sales |    100
 3 | sales |    300

-- 仅为检查结果临时解除策略：刚插入的 'eng' 行实际存在。
ALTER TABLE rap_dml_orders DROP ROW ACCESS POLICY rap_sales_only;
SELECT id, dept, amount FROM rap_dml_orders ORDER BY id;

id | dept  | amount
---|-------|-------
 1 | sales |    100
 2 | eng   |    200
 3 | sales |    300

ALTER TABLE rap_dml_orders ADD ROW ACCESS POLICY rap_sales_only ON (dept);

-- UPDATE 受影响：只更新策略可见的目标行。
UPDATE rap_dml_orders SET amount = amount + 10;

ALTER TABLE rap_dml_orders DROP ROW ACCESS POLICY rap_sales_only;
SELECT id, dept, amount FROM rap_dml_orders ORDER BY id;

id | dept  | amount
---|-------|-------
 1 | sales |    110
 2 | eng   |    200
 3 | sales |    310

ALTER TABLE rap_dml_orders ADD ROW ACCESS POLICY rap_sales_only ON (dept);

-- DELETE 受影响：不可见的目标行不会被删除。
DELETE FROM rap_dml_orders WHERE dept = 'eng';

ALTER TABLE rap_dml_orders DROP ROW ACCESS POLICY rap_sales_only;
SELECT id, dept, amount FROM rap_dml_orders ORDER BY id;

id | dept  | amount
---|-------|-------
 1 | sales |    110
 2 | eng   |    200
 3 | sales |    310

ALTER TABLE rap_dml_orders ADD ROW ACCESS POLICY rap_sales_only ON (dept);

-- DELETE 仍会删除策略可见的目标行。
DELETE FROM rap_dml_orders WHERE id = 1;

ALTER TABLE rap_dml_orders DROP ROW ACCESS POLICY rap_sales_only;
SELECT id, dept, amount FROM rap_dml_orders ORDER BY id;

id | dept  | amount
---|-------|-------
 2 | eng   |    200
 3 | sales |    310

CREATE TABLE rap_dml_src(id INT, new_amount INT);
INSERT INTO rap_dml_src VALUES (2, 777), (3, 888);

ALTER TABLE rap_dml_orders ADD ROW ACCESS POLICY rap_sales_only ON (dept);

-- MERGE 受影响：不可见的目标行不会被匹配或更新。
MERGE INTO rap_dml_orders AS t
USING rap_dml_src AS s
ON t.id = s.id
WHEN MATCHED THEN UPDATE SET t.amount = s.new_amount;

ALTER TABLE rap_dml_orders DROP ROW ACCESS POLICY rap_sales_only;
SELECT id, dept, amount FROM rap_dml_orders ORDER BY id;

id | dept  | amount
---|-------|-------
 2 | eng   |    200
 3 | sales |    888

DROP TABLE rap_dml_src;
DROP TABLE rap_dml_orders;
DROP ROW ACCESS POLICY rap_sales_only;
```

如果需要查看或修改全部行，请使用满足策略条件的角色，或先解除策略绑定。

## 多参数策略

策略可以依赖多个列。`ON (...)` 中的列会按位置绑定到策略参数，而不是按名称绑定。

```sql
CREATE ROW ACCESS POLICY rap_region_dept
AS (region STRING, dept STRING)
RETURNS BOOLEAN ->
  region = 'APAC' AND dept = 'Engineering';

ALTER TABLE employees ADD ROW ACCESS POLICY rap_region_dept ON (office_region, department);
```

## 管理策略

### DESCRIBE ROW ACCESS POLICY

查看策略的创建时间、签名、返回类型、表达式和注释。

```sql
DESC ROW ACCESS POLICY rap_engineering;
```

### DROP ROW ACCESS POLICY

删除不再需要的策略。删除前必须先从所有表上解除绑定。

```sql
ALTER TABLE employees DROP ROW ACCESS POLICY rap_engineering;
DROP ROW ACCESS POLICY rap_engineering;
```

### 移除表上的所有行访问策略

```sql
ALTER TABLE employees DROP ALL ROW ACCESS POLICIES;
```

## 限制与要求

- 一张表同一时间最多只能绑定一个 Row Access Policy。
- Row Access Policy 只能绑定到常规表；视图、流表和临时表不支持 `ADD ROW ACCESS POLICY`。
- 每个策略参数必须映射到一个类型兼容的表列。
- 单个列最多只能附加一个安全策略：脱敏策略或行访问策略二选一。
- `INSERT` 不会被 Row Access Policy 过滤。即使插入的行不满足策略谓词，也会被正常存储。
- `SELECT` 会被 Row Access Policy 过滤，只返回策略可见的行。
- `UPDATE`、`DELETE` 和 `MERGE` 在匹配目标行时会被 Row Access Policy 过滤。不可见的目标行不会被更新、删除或合并。
- 修改或删除受保护列前，需要先解除相关策略。
- 当前不支持 `CREATE OR REPLACE ROW ACCESS POLICY` 和 `ALTER ROW ACCESS POLICY`。

## 权限与参考

- 将 `CREATE ROW ACCESS POLICY`（通常授予 `*.*`）赋予负责创建策略的角色，创建者会自动获得策略的 OWNERSHIP。
- 角色需要拥有目标表的 `ALTER` 权限，并在全局拥有 `APPLY ROW ACCESS POLICY`，或针对单个策略拥有 `APPLY ON ROW ACCESS POLICY <policy_name>`，才能使用 `ALTER TABLE` 绑定或解除策略。
- 使用 `SHOW GRANTS ON ROW ACCESS POLICY <policy_name>` 审计哪些角色拥有 APPLY/OWNERSHIP。
- 使用 [`POLICY_REFERENCES`](/sql/sql-functions/table-functions/policy-references) 查找策略引用：`POLICY_REFERENCES(POLICY_NAME => '<policy_name>')`。
- 延伸阅读：
  - [User & Role](/sql/sql-commands/ddl/user)
  - [CREATE ROW ACCESS POLICY](/sql/sql-commands/ddl/row-access-policy/create-row-access-policy)
  - [ALTER TABLE](/sql/sql-commands/ddl/table/alter-table#row-access-policy-操作)
  - [Row Access Policy Commands](/sql/sql-commands/ddl/row-access-policy)
