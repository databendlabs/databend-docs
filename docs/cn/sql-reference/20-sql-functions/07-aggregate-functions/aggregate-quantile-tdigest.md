---
title: QUANTILE_TDIGEST
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.41"/>

使用 [t-digest](https://github.com/tdunning/t-digest/blob/master/docs/t-digest-paper/histo.pdf) 算法计算数值数据序列的近似分位数。

:::caution
NULL 值不包含在计算中。
:::

## 语法

```sql
QUANTILE_TDIGEST(<level1>[, <level2>, ...])(<expr>)
```

## 参数

| 参数      | 描述                                                                                                                                     |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| `<level n>` | 分位数的 level 表示一个从 0 到 1 的常量浮点数。建议使用 [0.01, 0.99] 范围内的 level 值。                                                                 |
| `<expr>`    | 任何数值表达式                                                                                                                        |

## 返回类型

返回 Float64 值或 Float64 值数组，具体取决于指定的分位数 level 的数量。

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