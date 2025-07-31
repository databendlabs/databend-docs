---
title: NTH_VALUE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.697"/>

返回窗口框架（Window Frame）内指定位置（N）的值。

另请参阅：

- [FIRST_VALUE](first-value.md)
- [LAST_VALUE](last-value.md)

## 语法

```sql
NTH_VALUE(
    expression, 
    n
) 
[ { IGNORE | RESPECT } NULLS ] 
OVER (
    [ PARTITION BY partition_expression ] 
    ORDER BY order_expression 
    [ window_frame ]
)
```

**参数：**
- `expression`：要计算的列或表达式
- `n`：要返回的值的位置编号（从 1 开始的索引）
- `IGNORE NULLS`：可选。指定后，在计算位置时将跳过 NULL 值
- `RESPECT NULLS`：默认行为。在计算位置时将包含 NULL 值

**注意：**
- 位置计数从 1 开始（而不是 0）
- 如果指定的位置在窗口框架中不存在，则返回 NULL
- 关于窗口框架语法，请参阅[窗口框架语法](index.md#window-frame-syntax)

## 示例

```sql
-- 创建示例数据
CREATE TABLE scores (
    student VARCHAR(20),
    score INT
);

INSERT INTO scores VALUES
    ('Alice', 85),
    ('Bob', 90),
    ('Charlie', 78),
    ('David', 92),
    ('Eve', 88);
```

**获取得分第二高的学生：**

```sql
SELECT student, score,
       NTH_VALUE(student, 2) OVER (ORDER BY score DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS second_highest_student
FROM scores;
```

结果：
```
student  | score | second_highest_student
---------+-------+-----------------------
David    |    92 | Bob
Bob      |    90 | Bob
Eve      |    88 | Bob
Alice    |    85 | Bob
Charlie  |    78 | Bob
```

**获取得分第三高的学生：**

```sql
SELECT student, score,
       NTH_VALUE(student, 3) OVER (ORDER BY score DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS third_highest_student
FROM scores;
```

结果：
```
student  | score | third_highest_student
---------+-------+----------------------
David    |    92 | Eve
Bob      |    90 | Eve
Eve      |    88 | Eve
Alice    |    85 | Eve
Charlie  |    78 | Eve
```