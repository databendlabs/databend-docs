---
title: CREATE VIEW
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

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

<a id="name-resolution-and-compatibility"></a>

## 名称解析与兼容性

新视图将目标视图的 catalog 和数据库保存为定义命名空间。不带限定符的基础表名称在该命名空间中解析。创建或查询时使用不同的会话数据库不会改变此选择。若要使用其他数据库中的基础表，请为其名称添加限定符。

CTE 引用必须不带限定符。即使查询定义了名为 `t1` 的 CTE，`db.t1` 也引用表。请参阅 [WITH 子句](../../20-query-syntax/with-clause.md#name-resolution)。

例如，在数据库名称尚未使用的测试环境中执行以下语句：

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

视图读取 `view_data.items`，而不是 `view_reader.items`。目标视图命名空间决定不带限定符的 `items` 表名指向哪张表。

命名空间元数据仅供内部使用，不会为 `SHOW CREATE VIEW` 语法添加选项。不含此元数据的旧存储定义保留传统的带限定符 CTE 查找。升级不会自动迁移这些定义。若要采用新规则，请先检查查询，再使用 `CREATE OR REPLACE VIEW`。以前选择 CTE 的带限定符名称现在可能选择表，或因表不存在而失败。

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