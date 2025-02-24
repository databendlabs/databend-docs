---
title: PERCENT_RANK
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本：v1.1.50"/>

返回给定值在一组值中的相对排名。结果值介于 0 和 1 之间，包括 0 和 1。请注意，任何集合中的第一行的 PERCENT_RANK 为 0。

另请参阅：[CUME_DIST](cume-dist.md)

## 语法

```sql
PERCENT_RANK() OVER (
	PARTITION BY expr, ...
	ORDER BY expr [ASC | DESC], ...
)
```

## 示例

本示例使用 PERCENT_RANK() 窗口函数获取学生的姓名、分数、等级以及每个等级内的百分位排名（percent_rank）。

```sql
CREATE TABLE students (
    name VARCHAR(20),
    score INT NOT NULL,
    grade CHAR(1) NOT NULL
);

INSERT INTO students (name, score, grade)
VALUES
    ('Smith', 81, 'A'),
    ('Jones', 55, 'C'),
    ('Williams', 55, 'C'),
    ('Taylor', 62, 'B'),
    ('Brown', 62, 'B'),
    ('Davies', 84, 'A'),
    ('Evans', 87, 'A'),
    ('Wilson', 72, 'B'),
    ('Thomas', 72, 'B'),
    ('Johnson', 100, 'A');

SELECT
    name,
    score,
    grade,
    PERCENT_RANK() OVER (PARTITION BY grade ORDER BY score) AS percent_rank
FROM
    students;

name    |score|grade|percent_rank      |
--------+-----+-----+------------------+
Smith   |   81|A    |               0.0|
Davies  |   84|A    |0.3333333333333333|
Evans   |   87|A    |0.6666666666666666|
Johnson |  100|A    |               1.0|
Taylor  |   62|B    |               0.0|
Brown   |   62|B    |               0.0|
Wilson  |   72|B    |0.6666666666666666|
Thomas  |   72|B    |0.6666666666666666|
Jones   |   55|C    |               0.0|
Williams|   55|C    |               0.0|
```