---
title: VALUES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.65"/>

VALUES 子句通过显式定义数据行来创建内联表。这个临时表可以直接使用，也可以在其他 SQL 语句中使用。

## 语法

```sql
SELECT ...
FROM ( VALUES ( <expr> [ , <expr> [ , ... ] ] ) [ , ( ... ) ] ) [ [ AS ] <table_alias> [ ( <column_alias> [, ... ] ) ] ]
[ ... ]
```

**要点：**
- 当 VALUES 子句在 FROM 子句中使用时，必须用括号括起来：`FROM (VALUES ...)`
- 每个带括号的表达式组代表一行
- 列名自动分配为 **col0**、**col1** 等（从零开始的索引）
- 您可以使用表别名提供自定义列名

## 示例

### 基本用法

```sql
-- 直接使用，自动生成列名 (col0, col1)
VALUES ('Toronto', 2731571), ('Vancouver', 631486), ('Montreal', 1704694);

col0     |col1   |
---------+-------+
Toronto  |2731571|
Vancouver| 631486|
Montreal |1704694|

-- 使用 ORDER BY
VALUES ('Toronto', 2731571), ('Vancouver', 631486), ('Montreal', 1704694) ORDER BY col1;

col0     |col1   |
---------+-------+
Vancouver| 631486|
Montreal |1704694|
Toronto  |2731571|
```

### 在 SELECT 语句中

```sql
-- 选择特定列 - 注意 VALUES 周围的括号
SELECT col1
FROM (VALUES ('Toronto', 2731571), ('Vancouver', 631486), ('Montreal', 1704694));

-- 自定义列名 - VALUES 必须用括号括起来
SELECT * FROM (
    VALUES ('Toronto', 2731571),
           ('Vancouver', 631486),
           ('Montreal', 1704694)
) AS CityPopulation(City, Population);

-- 使用列别名和排序
SELECT col0 AS City, col1 AS Population
FROM (VALUES ('Toronto', 2731571), ('Vancouver', 631486), ('Montreal', 1704694))
ORDER BY col1 DESC
LIMIT 1;
```

### 使用公共表表达式 (CTE)

```sql
WITH citypopulation(city, population) AS (
    VALUES ('Toronto', 2731571),
           ('Vancouver', 631486),
           ('Montreal', 1704694)
)
SELECT city, population FROM citypopulation;
```

> **重要提示**：在 FROM 子句或 CTE 中使用 VALUES 时，必须将其括在括号中：`FROM (VALUES ...)` 或 `AS (VALUES ...)`。这是必需的语法。
