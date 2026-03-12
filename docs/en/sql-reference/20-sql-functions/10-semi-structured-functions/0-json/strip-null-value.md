---
title: STRIP_NULL_VALUE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.762"/>

Converts a JSON null value to a SQL NULL value. All other variant values are passed unchanged.

## Syntax

```sql
STRIP_NULL_VALUE(<variant_expr>)
```

## Arguments

An expression of type VARIANT.

## Return Type

- If the expression contains a JSON null value, the function returns a SQL NULL.
- If the expression does not contain a JSON null value, the function returns the input value.

## Examples

```sql
SELECT STRIP_NULL_VALUE(PARSE_JSON('null')) AS value;

╭───────╮
│ value │
├───────┤
│ NULL  │
╰───────╯

SELECT STRIP_NULL_VALUE(PARSE_JSON('{"name": "Alice", "age": 30, "city": null}')) AS value;

╭───────────────────────────────────────╮
│                 value                 │
├───────────────────────────────────────┤
│ {"age":30,"city":null,"name":"Alice"} │
╰───────────────────────────────────────╯
```
