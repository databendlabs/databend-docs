---
title: SHOW DICTIONARIES
sidebar_position: 1
---

Lists dictionaries in the current or specified database.

## Syntax

```sql
SHOW DICTIONARIES [ FROM <database_name> | IN <database_name> ]
    [ LIMIT <limit> ]
    [ LIKE '<pattern>' | WHERE <expr> ]
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `FROM <database_name>` / `IN <database_name>` | Optional. Lists dictionaries from the specified database. |
| `LIMIT <limit>` | Optional. Limits the number of returned rows. |
| `LIKE '<pattern>'` | Optional. Filters dictionary names by pattern. |
| `WHERE <expr>` | Optional. Filters the result set with an expression. |

## Examples

```sql
SHOW DICTIONARIES;
```

```sql
SHOW DICTIONARIES FROM default LIKE 'user%';
```
