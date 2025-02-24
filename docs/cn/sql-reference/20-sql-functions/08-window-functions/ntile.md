---
title: NTILE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本：v1.1.50"/>

将排序后的结果集划分为指定数量的桶或组。它将排序后的行均匀地分布到这些桶中，并为每一行分配一个桶号。NTILE 函数通常与 ORDER BY 子句一起使用以对结果进行排序。

请注意，NTILE 函数根据行的排序顺序将行均匀地分布到桶中，并确保每个桶中的行数尽可能相等。如果行数无法均匀分布到桶中，某些桶可能会比其他桶多出一行。

## 语法

```sql
NTILE(n) OVER (
	PARTITION BY expr, ...
	ORDER BY expr [ASC | DESC], ...
)
```

## 示例

此示例检索学生的姓名、分数、年级，并使用 NTILE() 窗口函数根据每个年级内的分数将他们分配到桶中。

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
    ntile(3) OVER (PARTITION BY grade ORDER BY score DESC) AS bucket
FROM
    students;

name    |score|grade|bucket|
--------+-----+-----+------+
Johnson |  100|A    |     1|
Evans   |   87|A    |     1|
Davies  |   84|A    |     2|
Smith   |   81|A    |     3|
Wilson  |   72|B    |     1|
Thomas  |   72|B    |     1|
Taylor  |   62|B    |     2|
Brown   |   62|B    |     3|
Jones   |   55|C    |     1|
Williams|   55|C    |     2|
```