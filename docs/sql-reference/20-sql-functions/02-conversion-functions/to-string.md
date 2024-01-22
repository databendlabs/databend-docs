---
title: TO_STRING
---

Converts a value to String data type, or converts a Date value to a specific string format. Alias for [DATE_FORMAT](/sql/sql-functions/datetime-functions/date-format).

## Syntax

```sql
TO_STRING( <expr> )

TO_STRING('<date>', '<format>')
```

## Examples

```sql
SELECT TO_STRING('2022-12-25', '%m/%d/%Y'), TO_STRING('2022-12-25');

┌───────────────────────────────────────────────────────────────┐
│ to_string('2022-12-25', '%m/%d/%y') │ to_string('2022-12-25') │
│                String               │          String         │
├─────────────────────────────────────┼─────────────────────────┤
│ 12/25/2022                          │ 2022-12-25              │
└───────────────────────────────────────────────────────────────┘
```