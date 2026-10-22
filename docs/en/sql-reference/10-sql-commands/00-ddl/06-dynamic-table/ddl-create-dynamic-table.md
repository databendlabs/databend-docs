---
title: CREATE DYNAMIC TABLE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.945"/>

Creates a dynamic table and stores the result of its defining query. Creation completes only after the initial data is materialized. Queries read this stored result until you run [REFRESH DYNAMIC TABLE](ddl-refresh-dynamic-table.md).

## Syntax

```sql
CREATE [ OR REPLACE ] [ TRANSIENT ] DYNAMIC TABLE [ IF NOT EXISTS ]
  [ <catalog_name>. ][ <database_name>. ]<table_name>
  [ ( <column_name> <data_type> [ NULL | NOT NULL ] [ COMMENT '<comment>' ], ... )
    | LIKE [ <database_name>. ]<source_table_name> ]
  [ CLUSTER BY ( <expr>, ... ) ]
  [ <fuse_table_option> = <value> ... ]
AS <query>
```

Use either `OR REPLACE` or `IF NOT EXISTS`, not both.

## Parameters

| Parameter | Description |
|-----------|-------------|
| `OR REPLACE` | Replaces an existing table after successful initialization. If initialization fails, the previous table remains available. |
| `TRANSIENT` | Uses transient storage behavior. See [CREATE TRANSIENT TABLE](../01-table/10-ddl-create-transient-table.md). |
| `IF NOT EXISTS` | Leaves an existing table unchanged. This clause does not refresh its data or change its definition. |
| `table_name` | Name of the dynamic table to create. |
| Column definitions | Optional output schema. If omitted, Databend infers names and types from the query. |
| `LIKE` | Copies column definitions from an existing table. The `AS` query still supplies the data. |
| `CLUSTER BY` | Clustering expressions that reference columns in the stored result. |
| `fuse_table_option` | Storage options, including `COMMENT`. See [CREATE TABLE](../01-table/10-ddl-create-table.md). |
| `query` | Defining query over at least one supported source table. Joins, self-joins, and aggregations are supported. |

Unqualified source names resolve in the session's current database at creation, even when the target is in another database. The stored definition preserves this database resolution for later refreshes.

## Requirements and limitations

- All query sources must be persistent, writable FUSE base tables in the same catalog as the target. Sources can be in different databases within that catalog.
- Views, streams, temporary tables, other dynamic tables, and non-FUSE tables cannot be query sources.
- Source tables do not require change tracking.
- Index definitions and column or table constraints are not supported.
- `TARGET_LAG` and `WAREHOUSE` are not supported and are rejected. Creation and refresh run in the caller's session.
- `REFRESH_MODE` and `INITIALIZE` are not supported syntax. Creation always materializes the initial result. Refresh always rebuilds the complete result.
- Direct data changes are blocked. This includes `INSERT`, `UPDATE`, `DELETE`, `MERGE`, `REPLACE`, and `TRUNCATE`. Adding or dropping columns with `ALTER TABLE` is also blocked.
- To change the defining query, use `CREATE OR REPLACE DYNAMIC TABLE`.

Creation requires `CREATE` on the target database and `SELECT` on the query sources.

## Examples

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

Inspect or remove the dynamic table with standard table commands:

```sql
SHOW CREATE TABLE customer_totals;
DESC customer_totals;
DROP TABLE IF EXISTS customer_totals;
```
