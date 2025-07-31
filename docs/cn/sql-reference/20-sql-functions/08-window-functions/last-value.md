---
title: LAST_VALUE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="新增或更新于：v1.2.697"/>

返回窗口框架（Window Frame）中的最后一个值。

另请参阅：

- [FIRST_VALUE](first-value.md)
- [NTH_VALUE](nth-value.md)

## 语法

```sql
LAST_VALUE(expression)
OVER (
    [ PARTITION BY partition_expression ]
    ORDER BY sort_expression [ ASC | DESC ]
    [ window_frame ]
)
```

**参数：**
- `expression`：必需。要返回最后一个值的列或表达式。
- `PARTITION BY`：可选。将行划分为分区。
- `ORDER BY`：必需。确定窗口内的排序方式。
- `window_frame`：可选。定义窗口框架（默认为：RANGE UNBOUNDED PRECEDING）。

**注意：**
- 返回有序窗口框架中的最后一个值。
- 支持 `IGNORE NULLS` 和 `RESPECT NULLS` 选项。
- 通常需要显式指定窗口框架才能获得预期结果。
- 可用于查找每个组中的最新/最高值。

## 示例

```sql
-- 创建示例数据
CREATE TABLE scores (
    student VARCHAR(20),
    score INT
);

INSERT INTO scores VALUES
    ('Alice', 95),
    ('Bob', 87),
    ('Charlie', 82),
    ('David', 78),
    ('Eve', 92);
```

**获取最低分（按分数降序排列时的最后一个值）：**

```sql
SELECT student, score,
       LAST_VALUE(score) OVER (
           ORDER BY score DESC 
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS lowest_score,
       LAST_VALUE(student) OVER (
           ORDER BY score DESC 
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS lowest_student
FROM scores
ORDER BY score DESC;
```

结果：
```
student | score | lowest_score | lowest_student
--------+-------+--------------+---------------
Alice   |    95 |           78 | David
Eve     |    92 |           78 | David
Bob     |    87 |           78 | David
Charlie |    82 |           78 | David
David   |    78 |           78 | David
```