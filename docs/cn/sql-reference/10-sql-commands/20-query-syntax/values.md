---
title: VALUES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.65"/>

VALUES 子句用于显式定义一组行以在查询中使用。它允许您提供一个值列表，可以在 SQL 语句中用作临时表。

## 语法

```sql
VALUES (value_1_1, value_1_2, ...), (value_2_1, value_2_2, ...), ...
```
- VALUES 子句后跟一组用括号括起来的值。
- 每组值代表要插入临时表的一行。
- 在每组值中，各个值用逗号分隔，并对应于临时表的列。
- 当您插入多行而不指定列名时，Databend 会自动分配像 *col0*、*col1*、*col2* 等默认列名。

## 示例

这些示例展示了如何使用 VALUES 子句以各种格式显示城市数据：直接显示，或按人口排序：

```sql
-- 直接返回数据
VALUES ('Toronto', 2731571), ('Vancouver', 631486), ('Montreal', 1704694);

col0     |col1   |
---------+-------+
Toronto  |2731571|
Vancouver| 631486|
Montreal |1704694|

-- 排序数据
VALUES ('Toronto', 2731571), ('Vancouver', 631486), ('Montreal', 1704694) ORDER BY col1;

col0     |col1   |
---------+-------+
Vancouver| 631486|
Montreal |1704694|
Toronto  |2731571|
```

这些示例展示了如何在 SELECT 语句中使用 VALUES 子句：

```sql
-- 选择单列
SELECT col1 
FROM (VALUES ('Toronto', 2731571), ('Vancouver', 631486), ('Montreal', 1704694));

col1   |
-------+
2731571|
 631486|
1704694|

-- 选择带有别名的列
SELECT * FROM (
    VALUES ('Toronto', 2731571), 
           ('Vancouver', 631486), 
           ('Montreal', 1704694)
) AS CityPopulation(City, Population);

city     |population|
---------+----------+
Toronto  |   2731571|
Vancouver|    631486|
Montreal |   1704694|

-- 选择带有别名和排序的列
SELECT col0 AS City, col1 AS Population
FROM (VALUES ('Toronto', 2731571), ('Vancouver', 631486), ('Montreal', 1704694))
ORDER BY col1 DESC
LIMIT 1;

city   |population|
-------+----------+
Toronto|   2731571|
```

此示例展示了如何在公用表表达式 (CTE) 中使用 VALUES 子句创建临时表：

```sql
WITH citypopulation(city, population) AS (
    VALUES ('Toronto', 2731571),
           ('Vancouver', 631486),
           ('Montreal', 1704694)
)
SELECT citypopulation.city, citypopulation.population FROM citypopulation;

city     |population|
---------+----------+
Toronto  |   2731571|
Vancouver|    631486|
Montreal |   1704694|
```