---
title: QUANTILE_TDIGEST_WEIGHTED
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.174"/>

使用[t-digest](https://github.com/tdunning/t-digest/blob/master/docs/t-digest-paper/histo.pdf)算法计算数值数据序列的近似分位数。该函数考虑了每个序列成员的权重。内存消耗为**log(n)**，其中**n**是值的数量。

:::caution
NULL值不包括在计算中。
:::

## 语法

```sql
QUANTILE_TDIGEST_WEIGHTED(<level1>[, <level2>, ...])(<expr>, <weight_expr>)
```

## 参数

| 参数            | 描述                                                                                                               |
|-----------------|--------------------------------------------------------------------------------------------------------------------|
| `<level n>`     | 分位数级别表示一个从0到1的常量浮点数。建议使用[0.01, 0.99]范围内的级别值。                                         |
| `<expr>`        | 任何数值表达式                                                                                                     |
| `<weight_expr>` | 任何无符号整数表达式。权重是值的出现次数。                                                                         |

## 返回类型

根据指定的分位数级别数量，返回一个Float64值或一个Float64值数组。

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

SELECT QUANTILE_TDIGEST_WEIGHTED(0.5)(sales_amount, 1) AS median_sales_amount
FROM sales_data;

median_sales_amount|
-------------------+
             6000.0|

SELECT QUANTILE_TDIGEST_WEIGHTED(0.5, 0.8)(sales_amount, 1)
FROM sales_data;

quantile_tdigest_weighted(0.5, 0.8)(sales_amount)|
-------------------------------------------------+
[6000.0,7000.0]                                  |
```