---
title: ARG_MAX
---

计算最大 `val` 值的 `arg` 值。如果最大 `val` 值对应多个 `arg` 值，则返回遇到的第一个值。

## 语法

```sql
ARG_MAX(<arg>, <val>)
```

## 参数

| 参数    | 描述                                                                                       |
|-----------|---------------------------------------------------------------------------------------------------|
| `<arg>`   | [Databend 支持的任何数据类型](../../00-sql-reference/10-data-types/index.md)的参数 |
| `<val>`   | [Databend 支持的任何数据类型](../../00-sql-reference/10-data-types/index.md)的值    |

## 返回类型

与最大 `val` 值对应的 `arg` 值。

与 `arg` 类型匹配。

## 示例

**创建表并插入示例数据**

让我们创建一个名为 "sales" 的表并插入一些示例数据：
```sql
CREATE TABLE sales (
  id INTEGER,
  product VARCHAR(50),
  price FLOAT
);

INSERT INTO sales (id, product, price)
VALUES (1, 'Product A', 10.5),
       (2, 'Product B', 20.75),
       (3, 'Product C', 30.0),
       (4, 'Product D', 15.25),
       (5, 'Product E', 25.5);
```

**查询：使用 ARG_MAX() 函数**

现在，让我们使用 ARG_MAX() 函数找到价格最高的产品：
```sql
SELECT ARG_MAX(product, price) AS max_price_product
FROM sales;
```

结果应如下所示：
```sql
| max_price_product |
| ----------------- |
| Product C         |
```