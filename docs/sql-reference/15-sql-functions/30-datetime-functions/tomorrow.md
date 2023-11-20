---
title: TOMORROW
---

Returns tomorrow date, same as `today() + 1`.

## Syntax

```sql
TOMORROW()
```

## Return Type

`DATE`, returns date in “YYYY-MM-DD” format.

## Examples

```sql
SELECT TOMORROW();
+------------+
| TOMORROW() |
+------------+
| 2021-09-04 |
+------------+

SELECT TODAY()+1;
+---------------+
| (TODAY() + 1) |
+---------------+
| 2021-09-04    |
+---------------+
```
