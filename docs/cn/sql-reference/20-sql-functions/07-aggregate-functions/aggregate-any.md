---
title: ANY
---

聚合函数。

ANY() 函数选择第一个遇到的（非 NULL）值，除非该列的所有行都是 NULL 值。查询可以以任何顺序执行，甚至每次顺序都不同，因此该函数的结果是不确定的。要获得确定的结果，可以使用 'min' 或 'max' 函数代替 'any'。

## 语法

```sql
ANY(<expr>)
```

## 参数

| 参数       | 描述         |
|-----------|--------------|
| `<expr>`  | 任何表达式   |

## 返回类型

第一个遇到的（非 NULL）值，类型与值相同。如果所有值都是 NULL，则返回值为 NULL。

## 示例

**创建表并插入示例数据**
```sql
CREATE TABLE product_data (
  id INT,
  product_name VARCHAR NULL,
  price FLOAT NULL
);

INSERT INTO product_data (id, product_name, price)
VALUES (1, 'Laptop', 1000),
       (2, NULL, 800),
       (3, 'Keyboard', NULL),
       (4, 'Mouse', 25),
       (5, 'Monitor', 150);
```

**查询示例：检索第一个遇到的非 NULL 产品名称**
```sql
SELECT ANY(product_name) AS any_product_name
FROM product_data;
```

**结果**
```sql
| any_product_name |
|------------------|
| Laptop           |
```