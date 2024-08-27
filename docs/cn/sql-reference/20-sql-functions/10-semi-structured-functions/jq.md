---
title: JQ
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.622"/>

JQ 函数是一个集合返回的 SQL 函数，允许您将 [jq](https://jqlang.github.io/jq/) 过滤器应用于存储在 Variant 列中的 JSON 数据。通过此函数，您可以通过应用指定的 jq 过滤器来处理 JSON 数据，并将结果作为行集合返回。

## 语法

```sql
JQ (<jq_expression>, <json_data>)
```

| 参数            | 描述                                                                                                                                                                                                                                                                                                                                                 |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `jq_expression` | 一个 `jq` 过滤器表达式，定义了如何使用 `jq` 语法处理和转换 JSON 数据。该表达式可以指定如何选择、修改和操作 JSON 对象和数组中的数据。有关 jq 支持的语法、过滤器和函数的信息，请参阅 [jq 手册](https://jqlang.github.io/jq/manual/#basic-filters)。 |
| `json_data`     | 您希望使用 `jq` 过滤器表达式处理或转换的 JSON 格式输入。它可以是一个 JSON 对象、数组或任何有效的 JSON 数据结构。                                                                                                                                                                                          |

## 返回类型

JQ 函数返回一组 JSON 值，其中每个值对应于根据 `<jq_expression>` 转换或提取的结果的元素。

## 示例

首先，我们创建一个名为 `customer_data` 的表，其中包含 `id` 和 `profile` 列，`profile` 是用于存储用户信息的 JSON 类型：

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

此示例从 JSON 数据中提取特定字段：

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

此示例选择用户 ID 和每个用户年龄加 1：

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

此示例将城市名称转换为大写：

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