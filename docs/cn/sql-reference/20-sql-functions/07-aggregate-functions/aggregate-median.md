---
title: MEDIAN
---

聚合函数。

MEDIAN() 函数计算数值数据序列的中位数。

:::caution
NULL 值不计入计算。
:::

## 语法

```sql
MEDIAN(<expr>)
```

## 参数

| 参数      | 描述               |
|-----------|--------------------|                                                                                                                 
| `<expr>`  | 任何数值表达式     |                                                                                                     

## 返回类型

返回值的类型。

## 示例

**创建表并插入示例数据**
```sql
CREATE TABLE exam_scores (
  id INT,
  student_id INT,
  score INT
);

INSERT INTO exam_scores (id, student_id, score)
VALUES (1, 1, 80),
       (2, 2, 90),
       (3, 3, 75),
       (4, 4, 95),
       (5, 5, 85);
```

**查询示例：计算考试成绩的中位数**
```sql
SELECT MEDIAN(score) AS median_score
FROM exam_scores;
```

**结果**
```sql
|  median_score  |
|----------------|
|      85.0      |
```