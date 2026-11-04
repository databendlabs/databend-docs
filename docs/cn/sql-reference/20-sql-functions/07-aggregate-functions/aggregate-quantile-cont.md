---
title: QUANTILE_CONT
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.959"/>

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

| 输入类型 | 一个分位数水平 | 多个分位数水平 |
|----------|----------------|----------------|
| 整数或浮点数 | Float64 | Array(Float64) |
| DECIMAL(P, S) | DECIMAL(P, S) | Array(DECIMAL(P, S)) |

聚合结果可为 NULL。

<a id="decimal-interpolation"></a>

## Decimal 插值

对于 DECIMAL 输入，插值使用十进制系数，不会将数据值转换为 Float64。最终插值结果舍入到输入标度。恰好在中点时向远离零的方向舍入。`numeric_cast_option` 设置不会改变此规则。

分位数水平和插值位置的小数部分仍使用浮点值，而不是任意精度十进制数。结果保留数据的十进制精度和标度。

[MEDIAN](aggregate-median.md) 使用与 `QUANTILE_CONT(0.5)` 相同的插值规则。

```sql
SELECT
    QUANTILE_CONT(0.5)(v::DECIMAL(10, 0)),
    MEDIAN(v::DECIMAL(10, 0))
FROM (VALUES (-1), (-2), (-3), (-4)) AS t(v);
-- Expected values: -3, -3

SELECT QUANTILE_CONT(0.0, 0.5, 1.0)(v::DECIMAL(10, 2))
FROM (VALUES (1), (2), (3), (4)) AS t(v);
-- Expected array: [1.00, 2.50, 4.00]
```

第一个查询的插值为 `-2.5`。输入标度为零，因此两个结果均为 `-3`，而不是 `-2` 或 Float64 值。

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