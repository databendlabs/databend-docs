---
title: ARRAY_CONSTRUCT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

使用指定的值创建 JSON 数组。

## 别名

- `JSON_ARRAY`

## 语法

```sql
ARRAY_CONSTRUCT(value1[, value2[, ...]])
```

## 返回类型

JSON 数组。

## 示例

### 示例 1：使用常量值或表达式创建 JSON 数组

```sql
SELECT ARRAY_CONSTRUCT('Databend', 3.14, NOW(), TRUE, NULL);

array_construct('databend', 3.14, now(), true, null)         |
--------------------------------------------------------+
["Databend",3.14,"2023-09-06 07:23:55.399070",true,null]|

SELECT ARRAY_CONSTRUCT('fruits', ARRAY_CONSTRUCT('apple', 'banana', 'orange'), OBJECT_CONSTRUCT('price', 1.2, 'quantity', 3));

array_construct('fruits', array_construct('apple', 'banana', 'orange'), object_construct('price', 1.2, 'quantity', 3))|
-------------------------------------------------------------------------------------------------------+
["fruits",["apple","banana","orange"],{"price":1.2,"quantity":3}]                                      |
```

### 示例 2：从表数据创建 JSON 数组

```sql
CREATE TABLE products (
    ProductName VARCHAR(255),
    Price DECIMAL(10, 2)
);

INSERT INTO products (ProductName, Price)
VALUES
    ('Apple', 1.2),
    ('Banana', 0.5),
    ('Orange', 0.8);

SELECT ARRAY_CONSTRUCT(ProductName, Price) FROM products;

array_construct(productname, price)|
------------------------------+
["Apple",1.2]                 |
["Banana",0.5]                |
["Orange",0.8]                |
```