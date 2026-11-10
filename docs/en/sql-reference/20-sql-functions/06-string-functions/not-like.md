---
title: NOT LIKE
---

Returns `true` if the string does not match the SQL pattern, `false` if it does, and `NULL` if either argument is `NULL`.

`<expr> NOT LIKE <pattern>` is the negation of `<expr> LIKE <pattern>`. See [LIKE](like.md) for wildcards, escaping, and the `ESCAPE` clause.

## Syntax

```sql
<expr> NOT LIKE <pattern> [ ESCAPE <escape> ]
```

## Examples

```sql
SELECT name, category FROM system.functions WHERE name LIKE 'tou%' AND name NOT LIKE '%64' ORDER BY name;
+----------+------------+
| name     | category   |
+----------+------------+
| touint16 | conversion |
| touint32 | conversion |
| touint8  | conversion |
+----------+------------+
```

`%` and `_` are wildcards. Escape them to match the characters literally:

```sql
SELECT '50% off' NOT LIKE '50\\%%', '500 items' NOT LIKE '50\\%%', '500 items' NOT LIKE '50#%%' ESCAPE '#';
-- false, true, true
```
