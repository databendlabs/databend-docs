---
title: JSON_ARRAY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.98"/>

使用指定的值创建 JSON 数组。

## 语法

```sql
JSON_ARRAY(value1[, value2[, ...]])
```

## 返回类型

JSON 数组。

## 示例

### 示例 1：使用常量值或表达式创建 JSON 数组

```sql
SELECT JSON_ARRAY('Databend', 3.14, NOW(), TRUE, NULL);

json_array('databend', 3.14, now(), true, null)         |
--------------------------------------------------------+
["Databend",3.14,"2023-09-06 07:23:55.399070",true,null]|

SELECT JSON_ARRAY('fruits', JSON_ARRAY('apple', 'banana', 'orange'), JSON_OBJECT('price', 1.2, 'quantity', 3));

json_array('fruits', json_array('apple', 'banana', 'orange'), json_object('price', 1.2, 'quantity', 3))|
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

SELECT JSON_ARRAY(ProductName, Price) FROM products;

json_array(productname, price)|
------------------------------+
["Apple",1.2]                 |
["Banana",0.5]                |
["Orange",0.8]                |
```