---
title: SHOW STREAMS
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.223"/>

Displays a list of all available streams.

## Syntax

```sql
SHOW [FULL] STREAMS [FROM <database_name>] 
    [LIKE '<pattern>' | WHERE <expr>]
```

## Examples

```sql
SHOW STREAMS;

┌───────────────────────────────────────────────────────────────────────────────────────────┐
│         created_on         │        name       │ database │ catalog │       table_on      │
│          Timestamp         │       String      │  String  │  String │        String       │
├────────────────────────────┼───────────────────┼──────────┼─────────┼─────────────────────┤
│ 2023-11-29 02:38:29.588518 │ books_stream_2023 │ default  │ default │ default.books_total │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```