---
title: 行访问策略
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='ROW ACCESS POLICY'/>

行访问策略（Row Access Policy）通过在查询时过滤表中的行来保护数据。你可以集中定义行级谓词，并将其绑定到表上，确保用户只能看到满足策略条件的行。

## 适用场景

- **多租户 SaaS**：每个租户只能查到自己的数据，无需为每个租户建单独的表或视图。
- **区域隔离**：销售只能看自己负责区域的订单，管理层看全部。
- **时间窗口控制**：实时告警系统只能查最近 1 天，离线分析系统可查 7 天。
- **合规审计**：外部审计人员只能看到特定时间段的数据。

如果你需要所有用户都能看到行但敏感列值需要脱敏，请使用[脱敏策略](/guides/security/data-protection/masking-policy)。

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
  WHEN IS_ROLE_IN_SESSION('admin') THEN true
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

## 示例：按系统限制可查询的时间范围

在时序数据场景（监控指标、日志、事件流）中，不同系统对历史数据的查询范围需求不同。例如，实时告警系统只需要查最近 1 天的数据，而离线分析系统需要查最近 7 天或 15 天。Row Access Policy 可以在数据库层面强制执行这些边界 — 每个系统的服务账户只能扫描它实际需要的时间范围，防止意外全表扫描，减少资源争用。

### 场景说明

| 服务账户 | 被授予的角色 | 可查询时间范围 | 用途 |
|---------|-------------|---------------|------|
| `svc_realtime_alert` | `rap_role_1_day` | 仅最近 1 天 | 实时告警 |
| `svc_offline_analysis` | `rap_role_1_day`、`rap_role_7_day` | 最多 7 天 | 离线分析 |

### 管理员配置（以 account_admin 执行）

```sql
SET enable_experimental_row_access_policy = 1;

-- 创建代表不同时间范围层级的角色
CREATE ROLE rap_role_7_day;
CREATE ROLE rap_role_1_day;

-- 策略逻辑：检查会话中哪个角色处于激活状态，据此过滤行。
-- CASE 从上到下求值：7 天优先检查（更宽的窗口优先级更高）。
CREATE ROW ACCESS POLICY rap_time_range
AS (start_time TIMESTAMP)
RETURNS BOOLEAN ->
  CASE
    WHEN IS_ROLE_IN_SESSION('rap_role_7_day') THEN
      start_time >= now() - INTERVAL 7 DAY
    WHEN IS_ROLE_IN_SESSION('rap_role_1_day') THEN
      start_time >= now() - INTERVAL 1 DAY
    ELSE false
  END;

-- 示例指标表
CREATE TABLE metrics(id INT, start_time TIMESTAMP);

INSERT INTO metrics VALUES
  (1, now() - INTERVAL 15 DAY),
  (2, now() - INTERVAL 5 DAY),
  (3, now() - INTERVAL 12 HOUR),
  (4, now() - INTERVAL 1 HOUR),
  (5, now() - INTERVAL 8 DAY);

-- 绑定策略
ALTER TABLE metrics ADD ROW ACCESS POLICY rap_time_range ON (start_time);

-- 授予角色给服务账户
GRANT ROLE rap_role_1_day TO USER svc_realtime_alert;

GRANT ROLE rap_role_1_day TO USER svc_offline_analysis;
GRANT ROLE rap_role_7_day TO USER svc_offline_analysis;
```

### 登录后的行为

Databend 默认 `SET SECONDARY ROLES ALL` — 登录后所有被授予的角色都自动在 session 中激活。策略 CASE 从上到下求值，第一个命中的分支生效。

### svc_realtime_alert 连接（只有 `rap_role_1_day`）

登录后，所有被授予的角色都处于激活状态（secondary roles 默认 ALL）。由于该账户只有 `rap_role_1_day`，CASE 跳过 `rap_role_7_day` 分支，命中 1 天分支。它无法扩大范围，因为从未被授予 `rap_role_7_day`。

```sql
-- 实时告警系统连接（secondary roles 默认 ALL）
SELECT id, start_time FROM metrics ORDER BY id;
```

```
id | start_time
---|---------------------
 3 | 12 hours ago
 4 | 1 hour ago
```

只能看到 2 行 — 最近 1 天内的数据。告警系统物理上无法扫描更早的数据。

### svc_offline_analysis 连接（拥有两个角色）

登录后，`rap_role_7_day` 和 `rap_role_1_day` 都在 session 中激活（secondary roles ALL）。CASE 先检查 `rap_role_7_day` — 命中，所以该账户默认看到 7 天窗口：

```sql
-- 离线分析系统连接（secondary roles ALL，两个角色都激活）
SELECT id, start_time FROM metrics ORDER BY id;
```

```
id | start_time
---|---------------------
 2 | 5 days ago
 3 | 12 hours ago
 4 | 1 hour ago
```

可见 3 行 — 最近 7 天内的数据。

**需要时缩窄到 1 天** — 例如离线系统执行一次快速的近期数据检查：

```sql
SET ROLE rap_role_1_day;
SET SECONDARY ROLES NONE;

SELECT id, start_time FROM metrics ORDER BY id;
```

```
id | start_time
---|---------------------
 3 | 12 hours ago
 4 | 1 hour ago
```

现在只有 2 行 — 1 天窗口。`SET SECONDARY ROLES NONE` 关闭所有 secondary roles，session 中只剩主角色（`rap_role_1_day`）。

**切回 7 天窗口：**

```sql
SET ROLE rap_role_7_day;

SELECT id, start_time FROM metrics ORDER BY id;
```

```
id | start_time
---|---------------------
 2 | 5 days ago
 3 | 12 hours ago
 4 | 1 hour ago
```

回到 3 行。离线分析账户可以在同一个会话中通过 `SET ROLE` 自由切换时间范围。

### 为什么这样设计有效

- Databend 登录后默认 `SECONDARY ROLES ALL` — 所有被授予的角色都在 session 中激活。
- `IS_ROLE_IN_SESSION('<role>')` 检查角色是否为当前主角色**或**已激活的 secondary role。
- CASE 表达式从上到下求值。把最宽的窗口放在最前面，这样当账户拥有多个角色时，默认优先使用最宽的窗口。
- 账户只能激活被授予的角色。`svc_realtime_alert` 无法执行 `SET ROLE rap_role_7_day` — 数据库会拒绝。
- 要缩窄可见范围，使用 `SET SECONDARY ROLES NONE` 关闭所有 secondary roles，再用 `SET ROLE` 选择目标层级。
- 无需应用层代码：策略在查询规划阶段由存储层强制执行。

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
- 当前不支持 `CREATE OR REPLACE ROW ACCESS POLICY` 和 `ALTER ROW ACCESS POLICY`，需先 DROP 再重建。
- 策略名称在行访问策略和脱敏策略之间全局唯一。
- 策略参数名在创建时会被规范化为小写。
- Row Access Policy 不能应用于 ICE 类型数据库中的表。

## 最佳实践

### 使用 IS_ROLE_IN_SESSION() 而非 current_role()

`IS_ROLE_IN_SESSION()` 检查用户被授予的所有角色，包括 session 中激活的 secondary roles。用户无法通过 `SET ROLE` 绕过策略。`current_role()` 只检查当前活跃的单个角色，可以被规避。

```sql
-- 推荐：考虑角色继承
CASE
  WHEN IS_ROLE_IN_SESSION('admin') THEN true
  WHEN IS_ROLE_IN_SESSION('sales_apac') THEN region = 'APAC'
  ELSE false
END

-- 避免：可通过 SET ROLE 绕过
CASE WHEN current_role() = 'admin' THEN true ELSE false END
```

### CASE 分支从宽到窄排列

CASE 表达式从上到下求值。把最宽松的条件放在最前面（如 admin 直接返回 true），可以为高权限角色短路求值，减少不必要的计算。

### Mapping table 与被保护表放在同一 database

如果策略引用了查找表（如角色到区域的映射表），将其存放在与被保护表相同的 database 中，简化权限管理，避免跨库访问问题。

### 用多个角色测试

绑定策略后，用不同用户/角色分别连接并对比查询结果。验证：
- Admin 角色能看到所有行
- 受限角色只能看到其被允许的子集
- 没有匹配条件的角色看到零行

### 用 account_admin 查看全量数据

需要检查所有行时（调试、审计），使用满足策略条件的角色（如 `account_admin`），而不是反复解绑再绑定策略。

### 先解绑再删除

`DROP ROW ACCESS POLICY` 在策略仍绑定到表时会失败。先用 `ALTER TABLE ... DROP ROW ACCESS POLICY` 或 `DROP ALL ROW ACCESS POLICIES` 解绑，再执行 DROP。

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
