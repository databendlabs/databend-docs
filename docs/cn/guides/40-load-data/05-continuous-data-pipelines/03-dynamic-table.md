---
title: 动态表
sidebar_label: 动态表
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.945"/>

动态表可以存储来自一个或多个 FUSE 表的可复用查询结果。例如，可以关联订单表和客户表，为报表应用存储汇总结果。

创建时会执行查询并存储结果。源表变更不会自动更新该结果。当应用需要更新的数据时，执行 `REFRESH DYNAMIC TABLE` 重新计算结果。

:::note
你可以自行决定动态表的刷新时机。在数据加载后，或报表需要更新结果之前，执行 `REFRESH DYNAMIC TABLE`。如需定期刷新，可以由应用程序或外部调度器执行此命令。每次刷新都会重建完整结果。
:::

## 1. 准备源表

```sql
CREATE OR REPLACE TABLE orders (
  order_id INT NOT NULL,
  customer_id INT NOT NULL,
  amount INT NOT NULL
);

CREATE OR REPLACE TABLE customers (
  customer_id INT NOT NULL,
  customer_name STRING NOT NULL
);

INSERT INTO orders VALUES (1, 10, 100), (2, 20, 200);
INSERT INTO customers VALUES (10, 'alice'), (20, 'bob');
```

## 2. 物化关联查询

```sql
CREATE OR REPLACE DYNAMIC TABLE customer_totals AS
SELECT c.customer_name, SUM(o.amount) AS total_amount
FROM orders AS o
JOIN customers AS c ON o.customer_id = c.customer_id
GROUP BY c.customer_name;

SELECT customer_name, total_amount
FROM customer_totals
ORDER BY customer_name;
```

```text
┌───────────────┬──────────────┐
│ customer_name │ total_amount │
├───────────────┼──────────────┤
│ alice         │          100 │
│ bob           │          200 │
└───────────────┴──────────────┘
```

创建完成时即可读取初始结果，无需额外执行首次刷新。

## 3. 观察旧结果

```sql
INSERT INTO orders VALUES (3, 10, 300);

SELECT customer_name, total_amount
FROM customer_totals
ORDER BY customer_name;
```

结果仍为 `alice = 100` 和 `bob = 200`。读取不会重新执行定义查询，也不会修正尚未刷新的源表变更。

## 4. 刷新结果

```sql
REFRESH DYNAMIC TABLE customer_totals;

SELECT customer_name, total_amount
FROM customer_totals
ORDER BY customer_name;
```

```text
┌───────────────┬──────────────┐
│ customer_name │ total_amount │
├───────────────┼──────────────┤
│ alice         │          400 │
│ bob           │          200 │
└───────────────┴──────────────┘
```

每次刷新都会重新执行完整查询，也会纳入源表的更新和删除。如果刷新失败，读取者仍可查询之前的结果。

应用程序或外部调度器必须自行决定刷新时机。不支持 `TARGET_LAG`、`WAREHOUSE`、`REFRESH_MODE` 和 `INITIALIZE`。源表无需启用变更跟踪，也不需要 Stream。

## 5. 查看和删除动态表

```sql
SHOW CREATE TABLE customer_totals;
DESC customer_totals;
DROP TABLE IF EXISTS customer_totals;
```

如需修改定义查询，使用 `CREATE OR REPLACE DYNAMIC TABLE` 重新创建动态表。不要通过 DML 直接写入动态表。

## 选择合适的方案

- 使用[视图](/sql/sql-commands/ddl/view/ddl-create-view)在读取时基于源表执行查询。
- 对于需要当前结果和增量维护的受支持单表查询，使用[物化视图](/sql/sql-commands/ddl/view/materialized-view)。
- 对于可接受显式全量刷新和旧结果的 JOIN 或聚合查询，使用动态表存储结果。
- 如需使用自定义 SQL 逻辑增量消费变更的管道，使用 [Stream](01-stream.md) 和 [Task](02-task.md)。

动态表不会自动加速针对源表的查询。请让应用直接查询动态表本身。

## 后续步骤

- [CREATE DYNAMIC TABLE](/sql/sql-commands/ddl/dynamic-table/ddl-create-dynamic-table)：语法、受支持的源表和权限要求。
- [REFRESH DYNAMIC TABLE](/sql/sql-commands/ddl/dynamic-table/ddl-refresh-dynamic-table)：刷新保证和源表身份检查。
