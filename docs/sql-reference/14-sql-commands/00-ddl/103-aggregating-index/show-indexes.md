---
title: SHOW INDEXES
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.190"/>

Shows the created aggregating indexes. Equivalent to `SELECT * FROM system.indexes`.

See also: [system.indexes](../../../13-sql-reference/20-system-tables/system-indexes.md)

## Syntax

```sql
SHOW INDEXES [LIKE '<pattern>' | WHERE <expr>] | [LIMIT <limit>]
```

## Example

```sql
CREATE TABLE t1(a int,b int);

CREATE AGGREGATING INDEX idx1 AS SELECT SUM(a), b FROM default.t1 WHERE b > 3 GROUP BY b；

SHOW INDEXES;

+----------+-------------+------------------------------------------------------------+----------------------------+
| name     | type        | definition                                                 | created_on                 |
+----------+-------------+------------------------------------------------------------+----------------------------+
| test_idx | AGGREGATING | SELECT b, SUM(a) FROM default.t1 WHERE (b > 3) GROUP BY b  | 2023-05-17 11:53:54.474377 |
+----------+-------------+------------------------------------------------------------+----------------------------+
```