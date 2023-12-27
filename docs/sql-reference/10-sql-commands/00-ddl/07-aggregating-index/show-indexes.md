---
title: SHOW INDEXES
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.190"/>

Shows the created aggregating indexes. Equivalent to `SELECT * FROM system.indexes`.

See also: [system.indexes](../../../00-sql-reference/20-system-tables/system-indexes.md)

## Syntax

```sql
SHOW INDEXES [LIKE '<pattern>' | WHERE <expr>] | [LIMIT <limit>]
```

:::tip
The sql that user used to create aggregating index may be rewritten by Databend. See example below for detail.
:::

## Example

```sql
CREATE TABLE t1(a int,b int);

CREATE AGGREGATING INDEX idx1 AS SELECT avg(a), abs(sum(b): Int32), abs(b) AS bs FROM t1 GROUP BY bs;

SHOW INDEXES;

+----------+-------------+----------------------------------------------------------------------------+----------------------------------------------------------------------------+----------------------------+
| name     | type        |                          original                                          |                                 definition                                 | created_on                 |
+----------+-------------+----------------------------------------------------------------------------+----------------------------------------------------------------------------+----------------------------+
| test_idx | AGGREGATING | SELECT avg(a), abs(sum(b): Int32), abs(b) AS bsFROM default.t1 GROUP BY bs | SELECT abs(b) AS bs, sum(b), sum(a), count(a) FRONM default.t1 GROUP BY bs | 2023-05-17 11:53:54.474377 |
+----------+-------------+----------------------------------------------------------------------------+----------------------------------------------------------------------------+----------------------------+
```