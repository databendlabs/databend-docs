---
title: COVAR_SAMP
---

聚合函数。

covar_samp() 函数返回两个数据列的样本协方差（Σ((x - x̅)(y - y̅)) / (n - 1)）。

:::caution
NULL 值不计入。
:::

## 语法

```sql
COVAR_SAMP(<expr1>, <expr2>)
```

## 参数

| 参数       | 描述               |
| ---------- | ------------------ |
| `<expr1>`  | 任何数值表达式     |
| `<expr2>`  | 任何数值表达式     |

## 返回类型

float64，当 `n <= 1` 时，返回 +∞。

## 示例

**创建表并插入示例数据**

```sql
CREATE TABLE store_sales (
  id INT,
  store_id INT,
  items_sold INT,
  profit FLOAT
);

INSERT INTO store_sales (id, store_id, items_sold, profit)
VALUES (1, 1, 100, 1000),
       (2, 2, 200, 2000),
       (3, 3, 300, 3000),
       (4, 4, 400, 4000),
       (5, 5, 500, 5000);
```

**查询示例：计算售出商品数量与利润之间的样本协方差**

```sql
SELECT COVAR_SAMP(items_sold, profit) AS covar_samp_items_profit
FROM store_sales;
```

**结果**

```sql
| covar_samp_items_profit |
|-------------------------|
|        250000.0         |
```