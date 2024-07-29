---
title: JSON_PATH_QUERY_ARRAY
---

获取指定 JSON 值通过 JSON 路径返回的所有 JSON 项，并将结果包装成一个数组。

## 语法

```sql
JSON_PATH_QUERY_ARRAY(<variant>, '<path_name>')
```


## 返回类型

VARIANT

## 示例

**创建表并插入示例数据**

```sql
CREATE TABLE products (
    name VARCHAR,
    details VARIANT
);

INSERT INTO products (name, details)
VALUES ('Laptop', '{"brand": "Dell", "colors": ["Black", "Silver"], "price": 1200, "features": {"ram": "16GB", "storage": "512GB"}}'),
       ('Smartphone', '{"brand": "Apple", "colors": ["White", "Black"], "price": 999, "features": {"ram": "4GB", "storage": "128GB"}}'),
       ('Headphones', '{"brand": "Sony", "colors": ["Black", "Blue", "Red"], "price": 150, "features": {"battery": "20h", "bluetooth": "5.0"}}');
```

**查询示例：从产品详情中提取所有特性作为数组**

```sql
SELECT
    name,
    JSON_PATH_QUERY_ARRAY(details, '$.features.*') AS all_features
FROM
    products;
```

**结果**

```
   name    |         all_features
-----------+-----------------------
 Laptop    | ["16GB", "512GB"]
 Smartphone | ["4GB", "128GB"]
 Headphones | ["20h", "5.0"]
```