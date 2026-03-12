---
title: STRIP_NULL_VALUE
title_includes: JSON_STRIP_NULLS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.762"/>

Removes all properties with null values from a JSON object. 

## Syntax

```sql
STRIP_NULL_VALUE(<variant_expr>)
```

## Arguments

An expression of type VARIANT.

## Return Type

Variant.

## Examples

```sql
SELECT JSON_STRIP_NULLS(PARSE_JSON('{"name": "Alice", "age": 30, "city": null}')) AS value;

╭───────────────────────────╮
│           value           │
├───────────────────────────┤
│ {"age":30,"name":"Alice"} │
╰───────────────────────────╯
```
