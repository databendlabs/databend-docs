---
title: JQ
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.622"/>

The JQ function is a set-returning SQL function that allows you to apply [jq](https://jqlang.github.io/jq/) filters to JSON data stored in Variant columns. With this function, you can process JSON data by applying a specified jq filter, returning the results as a set of rows.

## Syntax

```sql
JQ (<jq_expression>, <json_data>)
```

| Parameter       | Description                                                                                                                                                                                                                                                                                                                                                 |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `jq_expression` | A `jq` filter expression that defines how to process and transform JSON data using the `jq` syntax. This expression can specify how to select, modify, and manipulate data within JSON objects and arrays. For a comprehensive list of supported filters and functions, please refer to the [jq Manual](https://jqlang.github.io/jq/manual/#basic-filters). |
| `json_data`     | The JSON-formatted input that you want to process or transform using the `jq` filter expression. It can be a JSON object, array, or any valid JSON data structure.                                                                                                                                                                                          |

## Return Type

The JQ function returns a set of JSON values, where each value corresponds to an element of the transformed or extracted result based on the `<jq_expression>`.

## Examples

This example demonstrates how to use the JQ function to extract fields from JSON data and perform calculations within SQL queries.

```sql
CREATE TABLE customer_data (
    id INT,
    profile JSON
);

INSERT INTO customer_data VALUES
    (1, '{"name": "Alice", "age": 30, "city": "New York"}'),
    (2, '{"name": "Bob", "age": 25, "city": "Los Angeles"}'),
    (3, '{"name": "Charlie", "age": 35, "city": "Chicago"}');

-- Extract specific fields from the JSON data
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

-- Select the user ID and the age incremented by 1 for each user

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