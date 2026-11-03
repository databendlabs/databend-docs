---
title: CREATE VIEW
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

Creates a new view based on a query; the Logical View does not store any physical data, when we access a logical view, it will convert the sql into the subquery format to finish it.

For example, if you create a Logical View like:

```sql
CREATE VIEW view_t1 AS SELECT a, b FROM t1;
```
And do a query like:
```sql
SELECT a FROM view_t1;
```
the result equals the below query
```sql
SELECT a FROM (SELECT a, b FROM t1);
```

So, if you delete the table which the view depends on, it occurs an error that the original table does not exist. And you may need to drop the old view and recreate the new view you need.

## Syntax

```sql
CREATE [ OR REPLACE ] VIEW [ IF NOT EXISTS ] [ db. ]view_name [ (<column>, ...) ] AS SELECT query
```

## Name Resolution and Compatibility

Since v1.2.957, new views capture the target view's catalog and database as their definition namespace. Unqualified base-table names resolve in that namespace. A different session database at creation or query time does not change that choice. Qualify a base-table name to use another database.

CTE references must remain unqualified. A name such as `db.t1` refers to a table, even if the query defines a CTE named `t1`. See [WITH Clause](../../20-query-syntax/with-clause.md#name-resolution).

For example, run the following in a test environment with unused database names:

```sql
CREATE DATABASE view_data;
CREATE DATABASE view_reader;
CREATE TABLE view_data.items (n INT);
INSERT INTO view_data.items VALUES (11);
CREATE TABLE view_reader.items (m INT);
INSERT INTO view_reader.items VALUES (22);

USE view_reader;
CREATE VIEW view_data.v AS SELECT n FROM items;
SELECT n FROM view_data.v;
```

The view reads `view_data.items`, not `view_reader.items`. The target view namespace determines which unqualified table `items` names.

Namespace metadata is internal. It does not add options to the `SHOW CREATE VIEW` syntax. Older stored definitions without this metadata keep legacy qualified-CTE lookup. An upgrade does not automatically migrate them. To adopt the new rules, check the query and use `CREATE OR REPLACE VIEW`. A qualified name that previously selected a CTE can now select a table or fail if the table does not exist.

## Access control requirements

To access a view, users only require the SELECT privilege on the view itself. 

Separate permissions are not required on the view’s underlying tables. This mechanism simplifies access control and enhances data security.

## Examples

```sql
CREATE VIEW tmp_view(c1, c2) AS SELECT number % 3 AS a, avg(number) FROM numbers(1000) GROUP BY a ORDER BY a;

SELECT * FROM tmp_view;
+------+-------+
| c1   | c2    |
+------+-------+
|    0 | 499.5 |
|    1 | 499.0 |
|    2 | 500.0 |
+------+-------+
```
