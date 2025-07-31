---
title: ROW_NUMBER
---

为分区（Partition）内的每一行分配一个从 1 开始的连续序号。

## 语法

```sql
ROW_NUMBER() 
OVER (
    [ PARTITION BY partition_expression ]
    ORDER BY sort_expression [ ASC | DESC ]
)
```

**参数：**
- `PARTITION BY`：可选。将行划分为分区（Partition）。
- `ORDER BY`：必需。决定行号的排序顺序。
- `ASC | DESC`：可选。排序方向（默认为 ASC）。

**注意：**
- 返回从 1 开始的连续整数。
- 每个分区（Partition）的编号都从 1 重新开始。
- 常用于排名和分页。

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
    ('Bob', 'Math', 78),
    ('Bob', 'English', 85),
    ('Bob', 'Science', 80),
    ('Charlie', 'Math', 88),
    ('Charlie', 'English', 90),
    ('Charlie', 'Science', 85);
```

**对所有行进行连续编号（即使分数相同）：**

```sql
SELECT student, subject, score,
       ROW_NUMBER() OVER (ORDER BY score DESC, student, subject) AS row_num
FROM scores
ORDER BY score DESC, student, subject;
```

结果：
```
student | subject | score | row_num
--------+---------+-------+--------
Alice   | Math    |    95 | 1
Alice   | Science |    92 | 2
Charlie | English |    90 | 3
Charlie | Math    |    88 | 4
Alice   | English |    87 | 5
Bob     | English |    85 | 6
Charlie | Science |    85 | 7
Bob     | Science |    80 | 8
Bob     | Math    |    78 | 9
```

**在每个学生内对行进行编号（用于分页/Top-N）：**

```sql
SELECT student, subject, score,
       ROW_NUMBER() OVER (PARTITION BY student ORDER BY score DESC) AS subject_rank
FROM scores
ORDER BY student, score DESC;
```

结果：
```
student | subject | score | subject_rank
--------+---------+-------+-------------
Alice   | Math    |    95 | 1
Alice   | Science |    92 | 2
Alice   | English |    87 | 3
Bob     | English |    85 | 1
Bob     | Science |    80 | 2
Bob     | Math    |    78 | 3
Charlie | English |    90 | 1
Charlie | Math    |    88 | 2
Charlie | Science |    85 | 3
```