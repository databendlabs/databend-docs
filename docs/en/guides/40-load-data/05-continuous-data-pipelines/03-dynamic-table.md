---
title: Dynamic Tables
sidebar_label: Dynamic Tables
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.945"/>

Use a dynamic table to store a reusable query result from one or more FUSE tables. For example, join orders with customers and store the totals for a reporting application.

Creation runs the query and stores its result. Source changes do not update that result automatically. Run `REFRESH DYNAMIC TABLE` to rebuild it when your application needs newer data.

:::caution
This implementation supports explicit full refresh only and is not yet production-ready. There is no built-in scheduler or maximum staleness guarantee. Do not use a dynamic table when every read must reflect current source data.
:::

## 1. Prepare the source tables

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

## 2. Materialize a joined query

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

The initial result is available when creation completes. No separate initial refresh is required.

## 3. Observe stale reads

```sql
INSERT INTO orders VALUES (3, 10, 300);

SELECT customer_name, total_amount
FROM customer_totals
ORDER BY customer_name;
```

The result is still `alice = 100` and `bob = 200`. Reads do not rerun the defining query or correct unrefreshed source changes.

## 4. Refresh the result

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

Each refresh re-executes the complete query. It also incorporates source updates and deletes. If refresh fails, readers can still query the previous result.

Your application or an external scheduler must decide when to refresh. `TARGET_LAG`, `WAREHOUSE`, `REFRESH_MODE`, and `INITIALIZE` are not supported. Source tables do not need change tracking or streams.

## 5. Inspect and remove the table

```sql
SHOW CREATE TABLE customer_totals;
DESC customer_totals;
DROP TABLE IF EXISTS customer_totals;
```

To change the defining query, recreate the dynamic table with `CREATE OR REPLACE DYNAMIC TABLE`. Do not write directly to it with DML.

## Choose the right approach

- Use a [view](/sql/sql-commands/ddl/view/ddl-create-view) to evaluate a query against the sources at read time.
- Use a [materialized view](/sql/sql-commands/ddl/view/materialized-view) for supported single-table queries that need current results and incremental maintenance.
- Use a dynamic table for stored results from joins or aggregates when explicit full refresh and stale reads are acceptable.
- Use [streams](01-stream.md) and [tasks](02-task.md) when you need a pipeline that consumes changes incrementally with your own SQL logic.

A dynamic table does not automatically accelerate queries against its sources. Point your application at the dynamic table itself.

## Next steps

- [CREATE DYNAMIC TABLE](/sql/sql-commands/ddl/dynamic-table/ddl-create-dynamic-table): syntax, supported sources, and access requirements.
- [REFRESH DYNAMIC TABLE](/sql/sql-commands/ddl/dynamic-table/ddl-refresh-dynamic-table): refresh guarantees and source identity checks.
