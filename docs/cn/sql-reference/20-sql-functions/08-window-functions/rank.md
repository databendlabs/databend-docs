---
title: RANK
---

为分区（Partition）内的每一行分配一个排名。值相等的行会获得相同的排名，但后续排名会出现跳跃。

## 语法

```sql
RANK() 
OVER (
    [ PARTITION BY partition_expression ]
    ORDER BY sort_expression [ ASC | DESC ]
)
```

**参数：**
- `PARTITION BY`：可选。将行划分为分区（Partition）。
- `ORDER BY`：必需。决定排名顺序。
- `ASC | DESC`：可选。排序方向（默认为 ASC）。

**说明：**
- 排名从 1 开始。
- 值相等的行获得相同排名。
- 并列排名后，排名序列会产生跳跃。
- 示例：1, 2, 2, 4, 5（而非 1, 2, 2, 3, 4）。

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

**对所有分数排名（展示并列排名时的跳跃处理）：**

```sql
SELECT student, subject, score,
       RANK() OVER (ORDER BY score DESC) AS score_rank
FROM scores
ORDER BY score DESC, student, subject;
```

结果：
```
student | subject | score | score_rank
--------+---------+-------+-----------
Alice   | Math    |    95 | 1
Alice   | Science |    92 | 2
Charlie | Math    |    88 | 3
Alice   | English |    87 | 4
Bob     | English |    85 | 5
Bob     | Math    |    85 | 5
Charlie | English |    85 | 5
Charlie | Science |    85 | 5
Bob     | Science |    80 | 9
```

**在每个学生内部排名（展示分区内的并列排名）：**

```sql
SELECT student, subject, score,
       RANK() OVER (PARTITION BY student ORDER BY score DESC) AS subject_rank
FROM scores
ORDER BY student, score DESC, subject;
```

结果：
```
student | subject | score | subject_rank
--------+---------+-------+-------------
Alice   | Math    |    95 | 1
Alice   | Science |    92 | 2
Alice   | English |    87 | 3
Bob     | English |    85 | 1
Bob     | Math    |    85 | 1
Bob     | Science |    80 | 3
Charlie | Math    |    88 | 1
Charlie | English |    85 | 2
Charlie | Science |    85 | 2
```