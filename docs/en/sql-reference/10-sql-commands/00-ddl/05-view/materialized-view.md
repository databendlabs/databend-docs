---
title: Materialized Views
sidebar_position: 6
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.934"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MATERIALIZED VIEW'/>

A materialized view stores the result of a query physically. It is defined on one persistent FUSE table in the `default` catalog. Databend enables change tracking on the source table when the materialized view is created.

Unlike a logical view, a materialized view can be explicitly refreshed to persist the changes from its source table. Reads are consistent even when physical storage lags behind the source table. Before the first refresh, Databend evaluates the definition against the source. When there are unrefreshed source changes, Databend uses **read fix**: it unions the persisted materialized-view data with the required incremental source data at read time (and applies the view definition to that increment). The query therefore returns current results rather than stale materialized data.

## Limitations

- A definition must be a simple `SELECT ... FROM ... [WHERE ...] [GROUP BY ...]` query over exactly one base table. Joins, subqueries, set operations, and non-deterministic functions are not supported.
- Aggregations are supported only for `sum`, `min`, `max`, `avg`, `count`, and `approx_count_distinct`. `DISTINCT`, `FILTER`, window, and ordered aggregate forms are not supported.
- The source must be a persistent FUSE base table in the `default` catalog. A materialized view cannot use another view or a different table engine as its source.
- Materialized views are read-only. Use `REFRESH MATERIALIZED VIEW` to maintain their contents; `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, and ordinary `ALTER TABLE` operations are not supported.

## Create a materialized view

```sql
CREATE [ OR REPLACE ] MATERIALIZED VIEW [ IF NOT EXISTS ]
  [ <catalog_name>. ][ <database_name>. ]<view_name>
  [ ( <column_name>, ... ) ]
  [ CLUSTER BY ( <expr>, ... ) ]
  [ COMMENT = '<comment>' ]
  [ <fuse_table_option> = <value> ... ]
AS <query>
```

`CLUSTER BY` requires an explicit column list and can reference non-aggregate output columns or `GROUP BY` keys. The optional Fuse table options control the physical storage layout; see [CREATE TABLE](../01-table/10-ddl-create-table.md) for supported options.

Creation records the definition but does not synchronously populate physical storage. Run `REFRESH MATERIALIZED VIEW` to materialize the initial data.

```sql
CREATE TABLE orders (
  order_id INT,
  customer_id INT,
  amount DECIMAL(10, 2),
  paid BOOLEAN
);

CREATE MATERIALIZED VIEW paid_orders_by_customer
  (customer_id, total_amount, order_count)
  CLUSTER BY (customer_id)
  COMMENT = 'Paid-order totals by customer'
AS
SELECT customer_id, sum(amount), count(*)
FROM orders
WHERE paid
GROUP BY customer_id;

REFRESH MATERIALIZED VIEW paid_orders_by_customer;
```

`CREATE OR REPLACE` replaces an existing materialized view. `IF NOT EXISTS` is a no-op if the name already exists.

## Refresh a materialized view

```sql
REFRESH MATERIALIZED VIEW [ <catalog_name>. ][ <database_name>. ]<view_name>
```

The first refresh materializes the source data. Later refreshes process append-only changes incrementally. If the source has `UPDATE`, `DELETE`, or `TRUNCATE` changes, Databend rebuilds the materialized view from the current source state so that the result remains correct.

## Change physical layout

Use dedicated `ALTER MATERIALIZED VIEW` syntax for supported maintenance operations:

```sql
ALTER MATERIALIZED VIEW <view_name> CLUSTER BY ( <expr>, ... );
ALTER MATERIALIZED VIEW <view_name> DROP CLUSTER KEY;
ALTER MATERIALIZED VIEW <view_name> RECLUSTER [ FINAL ] [ LIMIT <n> ];
ALTER MATERIALIZED VIEW <view_name> SET OPTIONS ( <option> = <value>, ... );
ALTER MATERIALIZED VIEW <view_name> UNSET OPTIONS ( <option>, ... );
ALTER MATERIALIZED VIEW <view_name> COMMENT = '<comment>';
```

For example, set a layout option before a refresh:

```sql
ALTER MATERIALIZED VIEW paid_orders_by_customer SET OPTIONS (row_per_block = 2);
REFRESH MATERIALIZED VIEW paid_orders_by_customer;
```

`RECLUSTER WHERE` is not supported for materialized views. To change the definition, use `CREATE OR REPLACE MATERIALIZED VIEW`; `ALTER VIEW` does not apply.

<h3 id="optimize-mv-recluster">Re-cluster with OPTIMIZE TABLE</h3>

<FunctionDescription description="Introduced or updated: Unreleased"/>

Use `OPTIMIZE TABLE` to re-cluster a materialized view with a cluster key. This operation still requires an Enterprise license. `WHERE` is not supported.

```sql
OPTIMIZE TABLE [catalog.][database.]view_name RECLUSTER [FINAL] [LIMIT <n>];
```

The `ALTER MATERIALIZED VIEW ... RECLUSTER` syntax above remains a compatibility alias. `ALTER TABLE ... RECLUSTER` also resolves materialized-view targets. This does not enable other ordinary `ALTER TABLE` operations on materialized views. Keep using `ALTER MATERIALIZED VIEW` for the other layout changes above.

Re-clustering reorganizes physical storage. It does not replace `REFRESH MATERIALIZED VIEW`. See [RECLUSTER TABLE](../06-clusterkey/dml-recluster-table.md#optimize-recluster) for execution precautions and [OPTIMIZE TABLE](../01-table/60-optimize-table.md#recluster-syntax) for the unified syntax.

## View and remove definitions

```sql
SHOW MATERIALIZED VIEWS
  [ { FROM | IN } <database_name> ]
  [ LIKE '<pattern>' | WHERE <expr> ];

SHOW CREATE MATERIALIZED VIEW
  [ <catalog_name>. ][ <database_name>. ]<view_name>;

DROP MATERIALIZED VIEW [ IF EXISTS ]
  [ <catalog_name>. ][ <database_name>. ]<view_name>;
```

```sql
SHOW MATERIALIZED VIEWS LIKE 'paid_orders%';
SHOW CREATE MATERIALIZED VIEW paid_orders_by_customer;
DROP MATERIALIZED VIEW IF EXISTS paid_orders_by_customer;
```

## Access control requirements

<FunctionDescription description="Introduced or updated: Unreleased"/>

Direct reads require effective `SELECT` on the materialized view. A database-level `SELECT` grant (`db.*`) or global `SELECT` grant (`*.*`) also authorizes these reads. Source-table `SELECT` alone no longer authorizes a direct materialized-view read.

An administrator can grant access to an existing role:

```sql
GRANT SELECT ON MATERIALIZED VIEW default.paid_orders_by_customer TO ROLE reader;
```

A user with that effective role can query the materialized view without source-table access. This applies before the first refresh, after a refresh, and when reads include pending source changes. An explicit reference to the source table in the same query still requires source-table access. Optimizer rewrites of source-table queries continue to require source-table `SELECT`, not materialized-view `SELECT`.

Creating a materialized view requires database `CREATE` and source-table `SELECT`. Creation does not automatically grant ownership or `SELECT` on the materialized view. This also applies to the creator. Before an upgrade, grant materialized-view `SELECT` to readers who previously relied only on source-table access. Existing effective database-level or global `SELECT` grants do not require an additional per-view grant.

`system.materialized_views` visibility follows effective materialized-view `SELECT`. Materialized-view `SELECT` does not grant maintenance privileges. Existing management requirements are unchanged. For example, refresh and definition inspection still require source-table `SELECT` or equivalent access. Dropping a materialized view still requires database `DROP`. Source-table renames do not change source-identity checks.

Use `ON MATERIALIZED VIEW` for object-level grants and revocations. Bare `ON db.view_name` syntax is rejected for materialized views. `GRANT ALL` and wildcard targets are not supported with `ON MATERIALIZED VIEW`. To remove a per-view grant:

```sql
REVOKE SELECT ON MATERIALIZED VIEW default.paid_orders_by_customer FROM ROLE reader;
```

`REVOKE ALL [PRIVILEGES] ON MATERIALIZED VIEW` also removes legacy privileges on that object. It does not remove broader database-level or global grants. See [GRANT](../02-user/10-grant.md#granting-materialized-view-privileges) and [REVOKE](../02-user/11-revoke.md#revoking-materialized-view-privileges).
