---
title: MEDIAN_TDIGEST
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.41"/>

使用 [t-digest](https://github.com/tdunning/t-digest/blob/master/docs/t-digest-paper/histo.pdf) 算法计算数值数据序列的中位数。

:::note
NULL 值不包含在计算中。
:::

## 语法

```sql
MEDIAN_TDIGEST(<expr>)
```

## 参数

| 参数       | 描述               |
|-----------|--------------------|                                                                                                                 
| `<expr>`  | 任何数值表达式     |                                                                                                     

## 返回类型

返回与输入值相同数据类型的值。

## 示例

```sql
-- 创建表并插入示例数据
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

-- 计算考试成绩的中位数
SELECT MEDIAN_TDIGEST(score) AS median_score
FROM exam_scores;

|  median_score  |
|----------------|
|      85.0      |
```