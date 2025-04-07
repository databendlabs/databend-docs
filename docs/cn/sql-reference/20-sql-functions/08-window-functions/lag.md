---
title: LAG
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.45"/>

LAG 允许您访问同一结果集中前一行中的列的值。它通常用于检索前一行中列的值，基于指定的排序。

另请参阅：[LEAD](lead.md)

## 语法

```sql
LAG(expression [, offset [, default]]) OVER (PARTITION BY partition_expression ORDER BY sort_expression)
```

- *offset*: 指定要从分区中检索值的当前行之前 (LEAD) 或之后 (LAG) 的行数。默认为 1。
> 请注意，设置负偏移量与使用 [LEAD](lead.md) 函数具有相同的效果。

- *default*: 指定当 LEAD 或 LAG 函数遇到由于偏移量超出分区的边界而没有可用值的情况时要返回的值。默认为 NULL。

## 示例

```sql
CREATE TABLE sales (
  sale_id INT,
  product_name VARCHAR(50),
  sale_amount DECIMAL(10, 2)
);

INSERT INTO sales (sale_id, product_name, sale_amount)
VALUES (1, 'Product A', 1000.00),
       (2, 'Product A', 1500.00),
       (3, 'Product A', 2000.00),
       (4, 'Product B', 500.00),
       (5, 'Product B', 800.00),
       (6, 'Product B', 1200.00);

SELECT product_name, sale_amount, LAG(sale_amount) OVER (PARTITION BY product_name ORDER BY sale_id) AS previous_sale_amount
FROM sales;

product_name | sale_amount | previous_sale_amount
-----------------------------------------------
Product A    | 1000.00     | NULL
Product A    | 1500.00     | 1000.00
Product A    | 2000.00     | 1500.00
Product B    | 500.00      | NULL
Product B    | 800.00      | 500.00
Product B    | 1200.00     | 800.00

-- The following statements return the same result.
SELECT product_name, sale_amount, LAG(sale_amount, -1) OVER (PARTITION BY product_name ORDER BY sale_id) AS next_sale_amount
FROM sales;

SELECT product_name, sale_amount, LEAD(sale_amount) OVER (PARTITION BY product_name ORDER BY sale_id) AS next_sale_amount
FROM sales;

product_name|sale_amount|next_sale_amount|
------------+-----------+----------------+
Product A   |    1000.00|         1500.00|
Product A   |    1500.00|         2000.00|
Product A   |    2000.00|                |
Product B   |     500.00|          800.00|
Product B   |     800.00|         1200.00|
Product B   |    1200.00|                |
```