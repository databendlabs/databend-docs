---
title: SHOW INDEXES
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.190"/>

显示已创建的聚合索引。等同于 `SELECT * FROM system.indexes`。

另请参阅：[system.indexes](../../../00-sql-reference/20-system-tables/system-indexes.md)

## 语法

```sql
SHOW INDEXES [LIKE '<pattern>' | WHERE <expr>] | [LIMIT <limit>]
```

## 示例

```sql
CREATE TABLE t1(a int,b int);

CREATE AGGREGATING INDEX agg_idx AS SELECT avg(a), abs(sum(b)), abs(b) AS bs FROM t1 GROUP BY bs;

SHOW INDEXES;


┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   name  │     type    │                               original                               │                                     definition                                     │         created_on         │      updated_on     │
├─────────┼─────────────┼──────────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────┼─────────────────────┤
│ agg_idx │ AGGREGATING │ SELECT avg(a), abs(sum(b)), abs(b) AS bs FROM default.t1 GROUP BY bs │ SELECT abs(b) AS bs, COUNT(), COUNT(a), SUM(a), SUM(b) FROM default.t1 GROUP BY bs │ 2024-01-29 07:15:34.856234 │ NULL                │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```