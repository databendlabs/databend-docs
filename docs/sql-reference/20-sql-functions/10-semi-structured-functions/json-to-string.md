---
title: JSON_TO_STRING
---

Converts a JSON value to its string representation..

## Syntax

```sql
JSON_TO_STRING( <Variant> )
```

## Return Type

String.

## Examples

```sql
SELECT JSON_TO_STRING(parse_json('["Cooking", "Reading", "Cycling"]'));

┌─────────────────────────────────────────────────────────────────┐
│ json_to_string(parse_json('["cooking", "reading", "cycling"]')) │
├─────────────────────────────────────────────────────────────────┤
│ ["Cooking","Reading","Cycling"]                                 │
└─────────────────────────────────────────────────────────────────┘
```