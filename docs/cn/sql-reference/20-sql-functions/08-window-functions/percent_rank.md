---
title: PERCENT_RANK
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.780"/>

返回给定值在一组值中的相对排名（Percent Rank）。结果值介于 0 和 1 之间（含 0 和 1）。请注意，任何集合中的第一行的 PERCENT_RANK 均为 0。

另请参阅：[CUME_DIST](cume-dist.md)

## 语法

```sql
PERCENT_RANK() OVER (
	PARTITION BY expr, ...
	ORDER BY expr [ASC | DESC], ...
)
```

## 示例

```sql
-- 创建示例数据
CREATE TABLE scores (
    student VARCHAR(20),
    score INT
);

INSERT INTO scores VALUES
    ('Alice', 85),
    ('Bob', 92),
    ('Carol', 78),
    ('David', 95),
    ('Eve', 88);

-- PERCENT_RANK 示例
SELECT 
    student,
    score,
    PERCENT_RANK() OVER (ORDER BY score) AS percent_rank,
    ROUND(PERCENT_RANK() OVER (ORDER BY score) * 100, 1) AS percentile
FROM scores
ORDER BY score;
```

结果：

```
student|score|percent_rank|percentile|
-------+-----+------------+----------+
Carol  |   78|         0.0|       0.0|
Alice  |   85|        0.25|      25.0|
Eve    |   88|         0.5|      50.0|
Bob    |   92|        0.75|      75.0|
David  |   95|         1.0|     100.0|
```