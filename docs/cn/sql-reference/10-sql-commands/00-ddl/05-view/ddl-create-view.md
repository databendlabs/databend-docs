---
title: CREATE VIEW
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.339"/>

基于查询创建一个新的视图；逻辑视图不存储任何物理数据，当我们访问一个逻辑视图时，它会将 SQL 转换为子查询格式来完成它。

例如，如果您创建一个如下的逻辑视图：

```sql
CREATE VIEW view_t1 AS SELECT a, b FROM t1;
```
并执行如下查询：
```sql
SELECT a FROM view_t1;
```
结果等同于以下查询
```sql
SELECT a FROM (SELECT a, b FROM t1);
```

因此，如果您删除视图所依赖的表，则会发生原始表不存在的错误。您可能需要删除旧视图并重新创建所需的新视图。

## 语法

```sql
CREATE [ OR REPLACE ] VIEW [ IF NOT EXISTS ] [ db. ]view_name [ (<column>, ...) ] AS SELECT query
```

## 示例

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