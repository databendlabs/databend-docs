---
title: JQ
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.622"/>

JQ 函数是一个返回集合的 SQL 函数，允许你将 [jq](https://jqlang.github.io/jq/) 过滤器应用于存储在 Variant (Variant) 列中的 JSON 数据。通过此函数，你可以应用指定的 jq 过滤器来处理 JSON 数据，并将结果作为行集返回。

## 语法

```sql
JQ (<jq_expression>, <json_data>)
```

| 参数             | 描述                                                                                                                                                                                                                                                                                                                                 |
|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `jq_expression` | 定义 JSON 数据处理方式的 `jq` 过滤器表达式，使用 `jq` 语法进行转换。该表达式可指定 JSON 对象和数组中的数据选择、修改及操作方式。有关 jq 支持的语法、过滤器和函数，请参阅 [jq 手册](https://jqlang.github.io/jq/manual/#basic-filters)。 |
| `json_data`     | 需用 `jq` 过滤器处理的 JSON 格式输入，支持 JSON 对象、数组或任何有效数据结构。                                                                                                                                                                                                                     |

## 返回类型

JQ 函数返回 JSON 值集合，每个值对应基于 `<jq_expression>` 转换或提取结果的元素。

## 示例

创建包含 `id` 和 `profile` 列的 `customer_data` 表，其中 `profile` 为存储用户信息的 JSON 类型：

```sql
CREATE TABLE customer_data (
    id INT,
    profile JSON
);

INSERT INTO customer_data VALUES
    (1, '{"name": "Alice", "age": 30, "city": "New York"}'),
    (2, '{"name": "Bob", "age": 25, "city": "Los Angeles"}'),
    (3, '{"name": "Charlie", "age": 35, "city": "Chicago"}');
```

从 JSON 数据提取特定字段：

```sql
SELECT
    id,
    jq('.name', profile) AS customer_name
FROM
    customer_data;

┌─────────────────────────────────────┐
│        id       │   customer_name   │
├─────────────────┼───────────────────┤
│               1 │ "Alice"           │
│               2 │ "Bob"             │
│               3 │ "Charlie"         │
└─────────────────────────────────────┘
```

查询用户 ID 及年龄增加 1 后的结果：

```sql
SELECT
    id,
    jq('.age + 1', profile) AS updated_age
FROM
    customer_data;

┌─────────────────────────────────────┐
│        id       │    updated_age    │
├─────────────────┼───────────────────┤
│               1 │ 31                │
│               2 │ 26                │
│               3 │ 36                │
└─────────────────────────────────────┘
```

将城市名称转为大写：

```sql
SELECT
    id,
    jq('.city | ascii_upcase', profile) AS city_uppercase
FROM
    customer_data;

┌─────────────────────────────────────┐
│        id       │   city_uppercase  │
├─────────────────┼───────────────────┤
│               1 │ "NEW YORK"        │
│               2 │ "LOS ANGELES"     │
│               3 │ "CHICAGO"         │
└─────────────────────────────────────┘
```