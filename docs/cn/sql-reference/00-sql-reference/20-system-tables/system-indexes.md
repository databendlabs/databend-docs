---
title: system.indexes
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.1.50"/>

Contains information about the created aggregating indexes.

See also: [SHOW INDEXES](../../10-sql-commands/00-ddl/07-aggregating-index/show-indexes.md)

```sql
CREATE TABLE t1(a int,b int);

CREATE AGGREGATING INDEX idx1 AS SELECT SUM(a), b FROM default.t1 WHERE b > 3 GROUP BY b；

SELECT * FROM system.indexes；

+----------+-------------+------------------------------------------------------------+----------------------------+
| name     | type        | definition                                                 | created_on                 |
+----------+-------------+------------------------------------------------------------+----------------------------+
| test_idx | AGGREGATING | SELECT b, SUM(a) FROM default.t1 WHERE (b > 3) GROUP BY b  | 2023-05-17 11:53:54.474377 |
+----------+-------------+------------------------------------------------------------+----------------------------+
```