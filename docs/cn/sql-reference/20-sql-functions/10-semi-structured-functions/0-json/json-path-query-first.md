---
title: JSON_PATH_QUERY_FIRST
---

获取对指定 JSON 值应用 JSON 路径 (JSON Path) 后返回的第一个 JSON 项。

## 语法

```sql
JSON_PATH_QUERY_FIRST(<variant>, '<path_name>')
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

**查询演示：从产品详情中提取第一个特性**

```sql
SELECT
    name,
    JSON_PATH_QUERY(details, '$.features.*') AS all_features,
    JSON_PATH_QUERY_FIRST(details, '$.features.*') AS first_feature
FROM
    products;
```

**结果**

```sql
+------------+--------------+---------------+
| name       | all_features | first_feature |
+------------+--------------+---------------+
| Laptop     | "16GB"       | "16GB"        |
| Laptop     | "512GB"      | "16GB"        |
| Smartphone | "4GB"        | "4GB"         |
| Smartphone | "128GB"      | "4GB"         |
| Headphones | "20h"        | "20h"         |
| Headphones | "5.0"        | "20h"         |
+------------+--------------+---------------+
```