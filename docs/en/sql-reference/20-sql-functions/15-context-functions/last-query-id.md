---
title: LAST_QUERY_ID
---

Returns the last query ID of query in current session, index can be (-1, 1, 1+2)..., out of range index will return empty string.

## Syntax

```sql
LAST_QUERY_ID(<index>)
```

## Examples

```sql
SELECT LAST_QUERY_ID(-1);

┌──────────────────────────────────────┐
│         last_query_id((- 1))         │
├──────────────────────────────────────┤
│ a6f615c6-5bad-4863-8558-afd01889448c │
└──────────────────────────────────────┘
```