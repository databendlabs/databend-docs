---
title: STDDEV_POP
title_includes: STD, STDDEV
---

聚合函数。

STDDEV_POP() 函数返回表达式的总体标准差（VAR_POP() 的平方根）。

:::tip
也可以使用 STD() 或 STDDEV()，它们是等价的但不是标准 SQL。
:::

:::caution
NULL 值不会被计算在内。
:::

## 语法

```sql
STDDEV_POP(<expr>)
STDDEV(<expr>)
STD(<expr>)
```

## 参数

| 参数       | 描述                 |
|-----------|----------------------|
| `<expr>`  | 任何数值表达式       |

## 返回类型

double

## 示例

**创建表并插入示例数据**
```sql
CREATE TABLE test_scores (
  id INT,
  student_id INT,
  score FLOAT
);

INSERT INTO test_scores (id, student_id, score)
VALUES (1, 1, 80),
       (2, 2, 85),
       (3, 3, 90),
       (4, 4, 95),
       (5, 5, 100);
```

**查询示例：计算测试成绩的总体标准差**
```sql
SELECT STDDEV_POP(score) AS test_score_stddev_pop
FROM test_scores;
```

**结果**
```sql
| test_score_stddev_pop |
|-----------------------|
|        7.07107        |
```