---
title: SHOW CREATE DICTIONARY
sidebar_position: 1
---

Shows the SQL statement used to create a dictionary.

## Syntax

```sql
SHOW CREATE DICTIONARY [ <catalog_name>. ][ <database_name>. ]<dictionary_name>
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `<dictionary_name>` | The dictionary name. You can qualify it with catalog and database names. |

## Output

The result contains the dictionary name and the reconstructed `CREATE DICTIONARY` statement.

Sensitive source options such as `password` are masked in the returned SQL.

## Examples

```sql
SHOW CREATE DICTIONARY user_info;
```
