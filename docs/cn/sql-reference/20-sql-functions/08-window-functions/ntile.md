---
title: NTILE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本：v1.1.50"/>

将行划分为指定数量的桶（bucket），并为每一行分配一个桶号。行在桶之间的分布尽可能均匀。

## 语法

```sql
NTILE(bucket_count)
OVER (
    [ PARTITION BY partition_expression ]
    ORDER BY sort_expression [ ASC | DESC ]
)
```

**参数：**
- `bucket_count`：必需。要创建的桶的数量（必须是正整数）。
- `PARTITION BY`：可选。将行划分为分区。
- `ORDER BY`：必需。确定分布顺序。
- `ASC | DESC`：可选。排序方向（默认为 ASC）。

**注意：**
- 桶号的范围从 1 到 `bucket_count`。
- 行的分布尽可能均匀。
- 如果行不能被平均分配，则较早的桶会多分配一行。
- 可用于创建百分位数和等大小的分组。

## 示例

```sql
-- 创建示例数据
CREATE TABLE scores (
    student VARCHAR(20),
    subject VARCHAR(20),
    score INT
);

INSERT INTO scores VALUES
    ('Alice', 'Math', 95),
    ('Alice', 'English', 87),
    ('Alice', 'Science', 92),
    ('Bob', 'Math', 85),
    ('Bob', 'English', 85),
    ('Bob', 'Science', 80),
    ('Charlie', 'Math', 88),
    ('Charlie', 'English', 85),
    ('Charlie', 'Science', 85);
```

**将所有分数分为 3 个桶（tertile，三分位数）：**

```sql
SELECT student, subject, score,
       NTILE(3) OVER (ORDER BY score DESC) AS score_bucket
FROM scores
ORDER BY score DESC, student, subject;
```

结果：
```
student | subject | score | score_bucket
--------+---------+-------+-------------
Alice   | Math    |    95 | 1
Alice   | Science |    92 | 1
Charlie | Math    |    88 | 1
Alice   | English |    87 | 2
Bob     | English |    85 | 2
Bob     | Math    |    85 | 2
Charlie | English |    85 | 3
Charlie | Science |    85 | 3
Bob     | Science |    80 | 3
```

**在每个学生内部将分数分为两半：**

```sql
SELECT student, subject, score,
       NTILE(2) OVER (PARTITION BY student ORDER BY score DESC) AS performance_half
FROM scores
ORDER BY student, score DESC, subject;
```

结果：
```
student | subject | score | performance_half
--------+---------+-------+-----------------
Alice   | Math    |    95 | 1
Alice   | Science |    92 | 1
Alice   | English |    87 | 2
Bob     | English |    85 | 1
Bob     | Math    |    85 | 1
Bob     | Science |    80 | 2
Charlie | Math    |    88 | 1
Charlie | English |    85 | 2
Charlie | Science |    85 | 2
```