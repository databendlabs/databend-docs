---
title: VALUES
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.65"/>

VALUES 子句用于显式定义一组行，以便在查询中使用。它允许您提供一个值列表，这些值可以用作 SQL 语句中的临时表。

## 语法

```sql
VALUES (value_1_1, value_1_2, ...), (value_2_1, value_2_2, ...), ...
```

- VALUES 子句后跟用括号括起来的值集。
- 每个值集表示要插入到临时表中的一行。
- 在每个值集中，各个值以逗号分隔，并对应于临时表的列。
- 当您插入多行而不指定列名时，Databend 会自动分配默认列名，如 _col0_、_col1_、_col2_ 等。

## 示例

这些示例演示了如何使用 VALUES 子句以各种格式显示城市数据：直接显示或按人口排序：

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

这些示例演示了如何在 SELECT 语句中使用 VALUES 子句：

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

此示例演示了如何在公共表表达式 (CTE) 中使用 VALUES 子句创建临时表：

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
