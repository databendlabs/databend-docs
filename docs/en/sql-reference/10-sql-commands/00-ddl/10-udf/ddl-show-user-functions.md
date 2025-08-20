---
title: SHOW USER FUNCTIONS
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.558"/>

Lists all user-defined functions (UDFs) and Tabular SQL UDFs (UDTFs), including their names, types, descriptions, arguments, languages, and creation timestamps.

## Syntax

```sql
SHOW USER FUNCTIONS
```

## Examples

```sql
SHOW USER FUNCTIONS;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  name  │    is_aggregate   │ description │           arguments           │ language │         created_on         │
│ String │ Nullable(Boolean) │    String   │            Variant            │  String  │          Timestamp         │
├────────┼───────────────────┼─────────────┼───────────────────────────────┼──────────┼────────────────────────────┤
│ get_v1 │ NULL              │             │ {"parameters":["input_json"]} │ SQL      │ 2024-11-18 23:20:28.432842 │
│ get_v2 │ NULL              │             │ {"parameters":["input_json"]} │ SQL      │ 2024-11-18 23:21:46.838744 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```