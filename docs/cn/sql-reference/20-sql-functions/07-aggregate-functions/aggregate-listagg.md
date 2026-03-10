---
title: LISTAGG
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.725"/>

将多行中的值连接成一个字符串，并用指定的分隔符分隔。此操作可以使用两种不同的函数类型执行：
- 聚合函数：连接发生在整个结果集的所有行中。
- 窗口函数：连接发生在结果集的每个分区中，由 `PARTITION BY` 子句定义。

## 语法

```sql
-- Aggregate Function
LISTAGG([DISTINCT] <expr> [, <delimiter>])
  [WITHIN GROUP (ORDER BY <order_by_expr>)]

-- Window Function
LISTAGG([DISTINCT] <expr> [, <delimiter>])
  [WITHIN GROUP (ORDER BY <order_by_expr>)]
  OVER ([PARTITION BY <partition_expr>])
```

| Parameter                       | Description                                                                                       |
|---------------------------------|---------------------------------------------------------------------------------------------------|
| `DISTINCT`                      | 可选。在连接之前删除重复的值。                                          |
| `<expr>`                        | 要连接的表达式（通常是列或表达式）。                              |
| `<delimiter>`                   | 可选。用于分隔每个连接值的字符串。如果省略，则默认为空字符串。 |
| `ORDER BY <order_by_expr>`      | 定义连接值的顺序。                                           |
| `PARTITION BY <partition_expr>` | 将行划分为分区，以便在每个组中单独执行聚合。                 |

## 别名

- [STRING_AGG](aggregate-string-agg.md)
- [GROUP_CONCAT](aggregate-group-concat.md)

## 返回类型

字符串。

## 示例

在此示例中，我们有一个客户订单表。每个订单都属于一个客户，我们想要创建一个列表，其中包含每个客户购买的所有产品。

```sql
CREATE TABLE orders (
  customer_id INT,
  product_name VARCHAR
);

INSERT INTO orders (customer_id, product_name) VALUES
(1, 'Laptop'),
(1, 'Mouse'),
(1, 'Laptop'),
(2, 'Phone'),
(2, 'Headphones');
```

以下示例使用 `LISTAGG` 作为聚合函数与 GROUP BY 结合使用，将每个客户购买的所有产品连接成一个字符串：

```sql
SELECT
  customer_id,
  LISTAGG(product_name, ', ') WITHIN GROUP (ORDER BY product_name) AS product_list
FROM orders
GROUP BY customer_id;
```

```sql
┌─────────────────────────────────────────┐
│   customer_id   │      product_list     │
├─────────────────┼───────────────────────┤
│               2 │ Headphones, Phone     │
│               1 │ Laptop, Laptop, Mouse │
└─────────────────────────────────────────┘
```

以下示例使用 `LISTAGG` 作为窗口函数，因此每行都保留其原始详细信息，但也显示客户组的完整产品列表：

```sql
SELECT
  customer_id,
  product_name,
  LISTAGG(product_name, ', ') WITHIN GROUP (ORDER BY product_name)
    OVER (PARTITION BY customer_id) AS product_list
FROM orders;
```

```sql
┌────────────────────────────────────────────────────────────┐
│   customer_id   │   product_name   │      product_list     │
├─────────────────┼──────────────────┼───────────────────────┤
│               2 │ Phone            │ Headphones, Phone     │
│               2 │ Headphones       │ Headphones, Phone     │
│               1 │ Laptop           │ Laptop, Laptop, Mouse │
│               1 │ Mouse            │ Laptop, Laptop, Mouse │
│               1 │ Laptop           │ Laptop, Laptop, Mouse │
└────────────────────────────────────────────────────────────┘
```