---
title: Variant
---

VARIANT（变体）可以存储任何其他类型的值，包括 NULL、BOOLEAN、NUMBER、STRING、ARRAY 和 OBJECT，并且内部值可以是任意层级的嵌套结构，非常灵活地存储各种数据。VARIANT 也可以称为 JSON，更多信息请参考 [JSON 网站](https://www.json.org/json-en.html)。

以下是在 Databend 中插入和查询 Variant 数据的示例：

创建表：

```sql
-- Create a table for storing customer orders
CREATE TABLE customer_orders(id INT64, order_data VARIANT);
```

向表中插入不同类型的值：

```sql
INSERT INTO customer_orders 
VALUES
    (1, parse_json('{"customer_id": 123, "order_id": 1001, "items": [{"name": "Shoes", "price": 59.99}, {"name": "T-shirt", "price": 19.99}]}')),
    (2, parse_json('{"customer_id": 456, "order_id": 1002, "items": [{"name": "Backpack", "price": 79.99}, {"name": "Socks", "price": 4.99}]}')),
    (3, parse_json('{"customer_id": 123, "order_id": 1003, "items": [{"name": "Shoes", "price": 59.99}, {"name": "Socks", "price": 4.99}]}'));
```

查询结果：

```sql
SELECT * FROM custom_orders;
```

结果：

```
┌──────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ id   │ order_data                                                                                                │
├──────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1    │ {"customer_id":123,"items":[{"name":"Shoes","price":59.99},{"name":"T-shirt","price":19.99}],"order_id":1001} │
│ 2    │ {"customer_id":456,"items":[{"name":"Backpack","price":79.99},{"name":"Socks","price":4.99}],"order_id":1002} │
│ 3    │ {"customer_id":123,"items":[{"name":"Shoes","price":59.99},{"name":"Socks","price":4.99}],"order_id":1003}    │
└──────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 按索引获取

Variant 包含 ARRAY 是一个从零开始的数组，类似于许多其他编程语言，每个元素也是 Variant 类型。可以通过索引访问元素。

### 示例

在此示例中，我们演示如何访问包含 ARRAY 的 VARIANT 列中的元素。

创建表：

```sql
-- Create a table to store user hobbies
CREATE TABLE user_hobbies(user_id INT64, hobbies VARIANT NULL);
```

向表中插入示例数据：

```sql
INSERT INTO user_hobbies 
VALUES
    (1, parse_json('["Cooking", "Reading", "Cycling"]')),
    (2, parse_json('["Photography", "Travel", "Swimming"]'));
```

检索每个用户的第一个爱好：

```sql
SELECT user_id, hobbies[0] as first_hobby FROM user_hobbies;
```

结果：

```
┌─────────┬─────────────┐
│ user_id │ first_hobby │
├─────────┼─────────────┤
│       1 │ Cooking     │
│       2 │ Photography │
└─────────┴─────────────┘
```

检索每个用户的第三个爱好：

```sql
SELECT user_id, hobbies[2] as third_hobby FROM user_hobbies;
```

结果：

```
┌─────────┬─────────────┐
│ user_id │ third_hobby │
├─────────┼─────────────┤
│       1 │ Cycling     │
│       2 │ Swimming    │
└─────────┴─────────────┘
```

按照爱好进行分组检索：

```sql
SELECT hobbies[2], count() as third_hobby FROM user_hobbies GROUP BY hobbies[2];
```

结果：

```
┌────────────┬─────────────┐
│ hobbies[2] │ third_hobby │
├────────────┼─────────────┤
│ "Cycling"  │           1 │
│ "Swimming" │           1 │
└────────────┴─────────────┘
```

## 按字段名获取

Variant 包含 OBJECT 是键值对，每个键是一个 VARCHAR，每个值是一个 Variant。它类似于其他编程语言中的“字典”、“哈希”或“映射”。
可以通过字段名访问值。

### 示例 1

创建一个带有 VARIANT 类型的表来存储用户偏好：

```sql
CREATE TABLE user_preferences(user_id INT64, preferences VARIANT NULL);
```

向表中插入示例数据：

```sql
INSERT INTO user_preferences 
VALUES
    (1, parse_json('{"color":"red", "fontSize":16, "theme":"dark"}')),
    (2, parse_json('{"color":"blue", "fontSize":14, "theme":"light"}'));
```

检索每个用户的首选颜色：

```sql
SELECT user_id, preferences:color as color FROM user_preferences;
```

结果：

```
┌─────────┬───────┐
│ user_id │ color │
├─────────┼───────┤
│       1 │ red   │
│       2 │ blue  │
└─────────┴───────┘
```

## 数据类型转换

默认情况下，从 VARIANT 列中检索到的元素是返回的。要将返回的元素转换为特定类型，请添加 `::` 运算符和目标数据类型（例如 expression::type）。

创建一个带有 VARIANT 列的表来存储用户偏好：

```sql
CREATE TABLE user_pref(user_id INT64, pref VARIANT NULL);
```

向表中插入示例数据：

```sql
INSERT INTO user_pref 
VALUES
    (1, parse_json('{"age": 25, "isPremium": "true", "lastActive": "2023-04-10"}')),
    (2, parse_json('{"age": 30, "isPremium": "false", "lastActive": "2023-03-15"}'));
```

将年龄转换为 INT64：

```sql
SELECT user_id, pref:age::INT64 as age FROM user_pref;
```

结果：

```
┌─────────┬─────┐
│ user_id │ age │
├─────────┼─────┤
│       1 │  25 │
│       2 │  30 │
└─────────┴─────┘
```

## 函数

请参阅 [Variant 函数](sql/sql-functions/semi-structured-functions)。
