---
title: QUANTILE_CONT
---

聚合函数。

QUANTILE_CONT() 函数计算数值数据序列的插值分位数。

:::caution
NULL 值不计入。
:::

## 语法

```sql
QUANTILE_CONT(<levels>)(<expr>)
    
QUANTILE_CONT(level1, level2, ...)(<expr>)
```

## 参数

| 参数        | 描述                                                                                      |
|-------------|------------------------------------------------------------------------------------------|
| `<level(s)` | 分位数水平。每个水平是一个从 0 到 1 的常量浮点数。建议使用 [0.01, 0.99] 范围内的水平值   |
| `<expr>`    | 任何数值表达式                                                                            |

## 返回类型

基于水平数的 Float64 或 float64 数组。

## 示例

**创建表并插入示例数据**
```sql
CREATE TABLE sales_data (
  id INT,
  sales_person_id INT,
  sales_amount FLOAT
);

INSERT INTO sales_data (id, sales_person_id, sales_amount)
VALUES (1, 1, 5000),
       (2, 2, 5500),
       (3, 3, 6000),
       (4, 4, 6500),
       (5, 5, 7000);
```

**查询示例：使用插值计算销售金额的第 50 百分位数（中位数）**
```sql
SELECT QUANTILE_CONT(0.5)(sales_amount) AS median_sales_amount
FROM sales_data;
```

**结果**
```sql
|  median_sales_amount  |
|-----------------------|
|        6000.0         |
```