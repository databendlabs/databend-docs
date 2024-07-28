---
title: QUANTILE_TDIGEST
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.41"/>

使用 [t-digest](https://github.com/tdunning/t-digest/blob/master/docs/t-digest-paper/histo.pdf) 算法计算数值数据序列的近似分位数。

:::caution
计算中不包括 NULL 值。
:::

## 语法

```sql
QUANTILE_TDIGEST(<level1>[, <level2>, ...])(<expr>)
```

## 参数

| 参数         | 描述                                                                                      |
|--------------|-------------------------------------------------------------------------------------------|
| `<level n>`  | 分位数级别，表示一个常量浮点数，范围从 0 到 1。建议使用 [0.01, 0.99] 范围内的级别值。 |
| `<expr>`     | 任何数值表达式                                                                            |

## 返回类型

根据指定的分位数级别数量，返回一个 Float64 值或一个 Float64 值数组。

## 示例

```sql
-- 创建表并插入示例数据
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

SELECT QUANTILE_TDIGEST(0.5)(sales_amount) AS median_sales_amount
FROM sales_data;

median_sales_amount|
-------------------+
             6000.0|

SELECT QUANTILE_TDIGEST(0.5, 0.8)(sales_amount)
FROM sales_data;

quantile_tdigest(0.5, 0.8)(sales_amount)|
----------------------------------------+
[6000.0,7000.0]                         |
```