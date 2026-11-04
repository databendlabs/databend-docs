---
title: MEDIAN
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.959"/>

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

对于整数或浮点数输入，结果为可为 NULL 的 Float64。对于 `DECIMAL(P, S)` 输入，结果为可为 NULL 的 `DECIMAL(P, S)`。

MEDIAN 使用与 `QUANTILE_CONT(0.5)` 相同的计算。十进制插值舍入到输入标度，恰好在中点时向远离零的方向舍入。示例以及十进制数据与浮点分位数位置的区别，请参阅 [Decimal 插值](aggregate-quantile-cont.md#decimal-interpolation)。

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