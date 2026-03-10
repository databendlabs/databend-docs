---
title: LAG
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.45"/>

返回结果集中前一行的值。

另请参阅：[LEAD](lead.md)

## 语法

```sql
LAG(
    expression 
    [, offset ]
    [, default ]
) 
OVER (
    [ PARTITION BY partition_expression ] 
    ORDER BY sort_expression
)
```

**参数：**
- `expression`：要计算的列或表达式
- `offset`：当前行之前的行数（默认：1）
- `default`：当不存在前一行时返回的值（默认：NULL）

**说明：**
- 负偏移量值的行为类似于 LEAD 函数
- 如果偏移量超出分区边界，则返回 NULL

## 示例

```sql
-- 创建示例数据
CREATE TABLE scores (
    student VARCHAR(20),
    test_date DATE,
    score INT
);

INSERT INTO scores VALUES
    ('Alice', '2024-01-01', 85),
    ('Alice', '2024-02-01', 90),
    ('Alice', '2024-03-01', 88),
    ('Bob', '2024-01-01', 78),
    ('Bob', '2024-02-01', 82),
    ('Bob', '2024-03-01', 85);
```

**获取每个学生的上一次考试成绩：**

```sql
SELECT student, test_date, score,
       LAG(score) OVER (PARTITION BY student ORDER BY test_date) AS previous_score
FROM scores
ORDER BY student, test_date;
```

结果：
```
student | test_date  | score | previous_score
--------+------------+-------+---------------
Alice   | 2024-01-01 |    85 | NULL
Alice   | 2024-02-01 |    90 | 85
Alice   | 2024-03-01 |    88 | 90
Bob     | 2024-01-01 |    78 | NULL
Bob     | 2024-02-01 |    82 | 78
Bob     | 2024-03-01 |    85 | 82
```

**获取两次考试前的成绩：**

```sql
SELECT student, test_date, score,
       LAG(score, 2, 0) OVER (PARTITION BY student ORDER BY test_date) AS score_2_tests_ago
FROM scores
ORDER BY student, test_date;
```

结果：
```
student | test_date  | score | score_2_tests_ago
--------+------------+-------+------------------
Alice   | 2024-01-01 |    85 | 0
Alice   | 2024-02-01 |    90 | 0
Alice   | 2024-03-01 |    88 | 85
Bob     | 2024-01-01 |    78 | 0
Bob     | 2024-02-01 |    82 | 0
Bob     | 2024-03-01 |    85 | 78
```