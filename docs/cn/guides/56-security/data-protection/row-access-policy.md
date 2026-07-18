---
title: 行访问策略
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='ROW ACCESS POLICY'/>

行访问策略在查询时过滤表中的行。集中定义一次布尔谓词并绑定到表，用户只能看到满足策略的行。

若只需对列值脱敏、而不是隐藏整行，请使用[脱敏策略](/guides/security/data-protection/masking-policy)。

:::note
实验性功能。会话启用：`SET enable_experimental_row_access_policy = 1`；账号启用：`SET GLOBAL enable_experimental_row_access_policy = 1`。
:::

## 适用场景

- 多租户隔离 — 每个租户只看到自己的行
- 区域 / 部门隔离 — 销售只看自己负责范围
- 时间窗口控制 — 告警扫 1 天，离线分析扫 7 天
- 向量 / RAG 检索 — 知识库混存，按角色控制文档可见性
- 合规审计 — 审计人员只能看批准的时间范围或子集

## 快速开始

```sql
SET enable_experimental_row_access_policy = 1;

CREATE TABLE employees (
  id INT,
  name STRING,
  department STRING
);

INSERT INTO employees VALUES
  (1, 'Alice', 'Engineering'),
  (2, 'Bob', 'Sales'),
  (3, 'Charlie', 'Engineering');

CREATE ROW ACCESS POLICY rap_engineering
AS (dept STRING)
RETURNS BOOLEAN ->
CASE
  WHEN IS_ROLE_IN_SESSION('admin') THEN true
  WHEN dept = 'Engineering' THEN true
  ELSE false
END;

-- ON (列) 按位置映射到策略参数
ALTER TABLE employees ADD ROW ACCESS POLICY rap_engineering ON (department);

SELECT id, name, department FROM employees ORDER BY id;
```

```
id | name    | department
---|---------|-------------
 1 | Alice   | Engineering
 3 | Charlie | Engineering
```

**工作方式**

- 仅查询时生效 — 不改存储数据
- 一张表一个策略；`ON (...)` 中的列按位置绑定参数
- 优先用 `IS_ROLE_IN_SESSION()`，避免用户用 `SET ROLE` 绕过

多列策略：

```sql
CREATE ROW ACCESS POLICY rap_region_dept
AS (region STRING, dept STRING)
RETURNS BOOLEAN ->
  region = 'APAC' AND dept = 'Engineering';

ALTER TABLE employees
ADD ROW ACCESS POLICY rap_region_dept ON (office_region, department);
```

## 示例

### 向量 / RAG 文档可见性

知识库文档混存 + 向量检索。策略配置一次，检索 SQL 无需携带文档 ID 过滤。参见[向量检索](/guides/query/vector-db)。

| 角色 | 可见范围 |
|------|----------|
| `admin` | 全部 |
| `sales` | `dept = 'sales'` + 公开 |
| `finance` | `dept = 'finance'` + 公开 |

```sql
SET enable_experimental_row_access_policy = 1;

CREATE ROLE IF NOT EXISTS admin;
CREATE ROLE IF NOT EXISTS sales;
CREATE ROLE IF NOT EXISTS finance;

CREATE TABLE knowledge_docs (
  doc_id    BIGINT,
  title     STRING,
  dept      STRING,
  is_public BOOLEAN,
  embedding VECTOR(4),
  VECTOR INDEX idx_emb(embedding) distance='cosine'
);

INSERT INTO knowledge_docs VALUES
  (1, 'Sales contract template',  'sales',   false, [0.90, 0.10, 0.05, 0.05]),
  (2, 'Q2 financial draft',       'finance', false, [0.10, 0.90, 0.05, 0.05]),
  (3, 'Public company handbook',  'hr',      true,  [0.20, 0.20, 0.90, 0.10]),
  (4, 'Competitor pricing notes', 'sales',   false, [0.85, 0.15, 0.10, 0.05]),
  (5, 'Internal audit checklist', 'finance', false, [0.15, 0.85, 0.10, 0.05]);

CREATE ROW ACCESS POLICY rap_knowledge_docs
AS (dept STRING, is_public BOOLEAN)
RETURNS BOOLEAN ->
CASE
  WHEN IS_ROLE_IN_SESSION('admin') THEN true
  WHEN is_public THEN true
  WHEN IS_ROLE_IN_SESSION('sales') AND dept = 'sales' THEN true
  WHEN IS_ROLE_IN_SESSION('finance') AND dept = 'finance' THEN true
  ELSE false
END;

ALTER TABLE knowledge_docs
ADD ROW ACCESS POLICY rap_knowledge_docs ON (dept, is_public);

GRANT SELECT ON knowledge_docs TO ROLE sales;
GRANT SELECT ON knowledge_docs TO ROLE finance;

-- 为当前会话激活一个角色，再执行同一条检索 SQL
SET ROLE sales;
SET SECONDARY ROLES NONE;

SELECT doc_id, title,
       round(cosine_distance(embedding, [0.88, 0.12, 0.08, 0.05]::VECTOR(4)), 4) AS dist
FROM knowledge_docs
ORDER BY dist
LIMIT 10;
```

| `sales` | `finance`（`SET ROLE finance`） |
|---------|----------------------------------|
| 1 Sales contract template `0.0009` | 3 Public company handbook `0.6731` |
| 4 Competitor pricing notes `0.0011` | 5 Internal audit checklist `0.6855` |
| 3 Public company handbook `0.6731` | 2 Q2 financial draft `0.7504` |

### 按角色限制可查询时间范围

不同服务账户只能扫描不同长度的历史窗口。

| 账户 | 角色 | 窗口 |
|------|------|------|
| `svc_realtime_alert` | `rap_role_1_day` | 最近 1 天 |
| `svc_offline_analysis` | `rap_role_1_day`、`rap_role_7_day` | 最多 7 天 |

```sql
SET enable_experimental_row_access_policy = 1;

CREATE ROLE rap_role_7_day;
CREATE ROLE rap_role_1_day;

-- CASE 从上到下求值：更宽的窗口放前面
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

CREATE TABLE metrics(id INT, start_time TIMESTAMP);
INSERT INTO metrics VALUES
  (1, now() - INTERVAL 15 DAY),
  (2, now() - INTERVAL 5 DAY),
  (3, now() - INTERVAL 12 HOUR),
  (4, now() - INTERVAL 1 HOUR),
  (5, now() - INTERVAL 8 DAY);

ALTER TABLE metrics ADD ROW ACCESS POLICY rap_time_range ON (start_time);

GRANT ROLE rap_role_1_day TO USER svc_realtime_alert;
GRANT ROLE rap_role_1_day TO USER svc_offline_analysis;
GRANT ROLE rap_role_7_day TO USER svc_offline_analysis;

SELECT id, start_time FROM metrics ORDER BY id;
```

登录后 Databend 会激活全部已授予角色（`SECONDARY ROLES ALL`）。

| 会话 | 可见行 |
|------|--------|
| `svc_realtime_alert`（仅 1 天） | 最近 1 天 |
| `svc_offline_analysis`（两个角色） | 默认最近 7 天 |

离线账户缩窄到 1 天：

```sql
SET ROLE rap_role_1_day;
SET SECONDARY ROLES NONE;
SELECT id, start_time FROM metrics ORDER BY id;
```

再切回 7 天：

```sql
SET ROLE rap_role_7_day;
SELECT id, start_time FROM metrics ORDER BY id;
```

账户只能激活被授予的角色。`svc_realtime_alert` 无法 `SET ROLE rap_role_7_day`。

## 读写行为

| 操作 | 效果 |
|------|------|
| `SELECT` | 只返回策略可见行 |
| `UPDATE` / `DELETE` / `MERGE` | 只匹配 / 修改可见目标行 |
| `INSERT` | 不过滤 — 即使当前不可见也会写入 |

要查看全部存储数据，使用满足策略的角色，或临时解绑策略。

```sql
SET enable_experimental_row_access_policy = 1;

CREATE ROW ACCESS POLICY rap_sales_only
AS (dept STRING) RETURNS BOOLEAN -> dept = 'sales';

CREATE TABLE orders(id INT, dept STRING, amount INT);
ALTER TABLE orders ADD ROW ACCESS POLICY rap_sales_only ON (dept);

INSERT INTO orders VALUES (1, 'sales', 100), (2, 'eng', 200), (3, 'sales', 300);

SELECT * FROM orders ORDER BY id;
-- 1 sales 100
-- 3 sales 300

UPDATE orders SET amount = amount + 10;
DELETE FROM orders WHERE dept = 'eng';   -- 无效：eng 行不可见
DELETE FROM orders WHERE id = 1;         -- 删除可见行 1

-- MERGE 只匹配可见目标
CREATE TABLE src(id INT, new_amount INT);
INSERT INTO src VALUES (2, 777), (3, 888);

MERGE INTO orders AS t
USING src AS s
ON t.id = s.id
WHEN MATCHED THEN UPDATE SET t.amount = s.new_amount;

-- 解绑后查看存储
ALTER TABLE orders DROP ROW ACCESS POLICY rap_sales_only;
SELECT * FROM orders ORDER BY id;
-- 2 eng 200   （从未被更新）
-- 3 sales 888 （被 MERGE）
```

## 管理策略

```sql
DESC ROW ACCESS POLICY rap_engineering;

ALTER TABLE employees DROP ROW ACCESS POLICY rap_engineering;
DROP ROW ACCESS POLICY rap_engineering;

ALTER TABLE employees DROP ALL ROW ACCESS POLICIES;
```

`DROP ROW ACCESS POLICY` 前先解绑。修改受保护列前先解绑或删除策略。

## 限制

- 一张表同一时间只能有一个行访问策略
- 仅常规表 — 不支持视图、流表、临时表、ICE 库
- 单列只能绑定一种安全策略（脱敏 **或** 行访问，不能同时）
- 不支持 `CREATE OR REPLACE` / `ALTER` 策略 — 先删再建
- 策略名在脱敏策略与行访问策略间全局唯一
- 策略参数名创建时规范为小写

## 最佳实践

1. 优先 `IS_ROLE_IN_SESSION()`，少用 `current_role()`。
2. `CASE` 从宽到窄排列（admin 优先）。
3. 策略若引用查找表，与被保护表放同一 database。
4. 绑定后用多角色验证 — admin、受限、无匹配。
5. 需要全量数据时，优先用高权限角色，而不是反复解绑。

## 权限与参考

- `CREATE ROW ACCESS POLICY`（通常 `*.*`）用于创建策略（创建者获得 OWNERSHIP）
- 表 `ALTER` + 全局 `APPLY ROW ACCESS POLICY` 或 `APPLY ON ROW ACCESS POLICY <name>` 用于绑定/解绑
- 审计：`SHOW GRANTS ON ROW ACCESS POLICY <name>`
- 引用：[`POLICY_REFERENCES`](/sql/sql-functions/table-functions/policy-references)

延伸阅读：

- [User & Role](/sql/sql-commands/ddl/user)
- [CREATE ROW ACCESS POLICY](/sql/sql-commands/ddl/row-access-policy/create-row-access-policy)
- [ALTER TABLE](/sql/sql-commands/ddl/table/alter-table#row-access-policy-操作)
- [Row Access Policy Commands](/sql/sql-commands/ddl/row-access-policy)
