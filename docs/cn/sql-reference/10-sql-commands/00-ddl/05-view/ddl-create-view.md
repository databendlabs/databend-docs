---
title: CREATE VIEW
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.339"/>

基于查询创建新视图；逻辑视图（Logical View）不存储任何物理数据，访问时会把 SQL 转换为子查询（Subquery）来完成。

例如，创建如下逻辑视图：

```sql
CREATE VIEW view_t1 AS SELECT a, b FROM t1;
```
再执行查询：
```sql
SELECT a FROM view_t1;
```
结果等同于：
```sql
SELECT a FROM (SELECT a, b FROM t1);
```

因此，如果删除视图依赖的表，会报“原始表不存在”的错误，此时需删除旧视图并重新创建所需的新视图。

## 语法

```sql
CREATE [ OR REPLACE ] VIEW [ IF NOT EXISTS ] [ db. ]view_name [ (<column>, ...) ] AS SELECT query
```

## 访问控制要求

访问视图只需拥有该视图本身的 SELECT 权限，无需对底层表再单独授权，简化了访问控制并提升数据安全。

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