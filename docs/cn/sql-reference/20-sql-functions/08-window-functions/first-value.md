---
title: FIRST_VALUE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.697"/>

返回窗口框架（window frame）中的第一个值。

另请参阅：

- [LAST_VALUE](last-value.md)
- [NTH_VALUE](nth-value.md)

## 语法

```sql
FIRST_VALUE(expression)
OVER (
    [ PARTITION BY partition_expression ]
    ORDER BY sort_expression [ ASC | DESC ]
    [ window_frame ]
)
```

**参数：**
- `expression`：必需。要返回第一个值的列或表达式。
- `PARTITION BY`：可选。将行划分为分区。
- `ORDER BY`：必需。确定窗口内的排序方式。
- `window_frame`：可选。定义窗口框架（默认值：RANGE UNBOUNDED PRECEDING）。

**注意：**
- 返回有序窗口框架中的第一个值。
- 支持 `IGNORE NULLS` 和 `RESPECT NULLS` 选项。
- 可用于查找每个组中最早/最低的值。

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

**获取最高分（按分数降序排列时的第一个值）：**

```sql
SELECT student, score,
       FIRST_VALUE(score) OVER (ORDER BY score DESC) AS highest_score,
       FIRST_VALUE(student) OVER (ORDER BY score DESC) AS top_student
FROM scores
ORDER BY score DESC;
```

结果：
```
student | score | highest_score | top_student
--------+-------+---------------+------------
Alice   |    95 |            95 | Alice
Eve     |    92 |            95 | Alice
Bob     |    87 |            95 | Alice
Charlie |    82 |            95 | Alice
David   |    78 |            95 | Alice
```