---
title: STDDEV_SAMP
---

聚合函数。

STDDEV_SAMP() 函数返回表达式的样本标准差（VAR_SAMP() 的平方根）。

:::caution
NULL 值不计入。
:::

## 语法

```sql
STDDEV_SAMP(<expr>)
```

## 参数

| 参数      | 描述               |
| --------- | ------------------ |
| `<expr>`  | 任何数值表达式     |

## 返回类型

double

## 示例

**创建表并插入示例数据**

```sql
CREATE TABLE height_data (
  id INT,
  person_id INT,
  height FLOAT
);

INSERT INTO height_data (id, person_id, height)
VALUES (1, 1, 5.8),
       (2, 2, 6.1),
       (3, 3, 5.9),
       (4, 4, 5.7),
       (5, 5, 6.3);
```

**查询示例：计算身高的样本标准差**

```sql
SELECT STDDEV_SAMP(height) AS height_stddev_samp
FROM height_data;
```

**结果**

```sql
| height_stddev_samp |
|--------------------|
|      0.240         |
```