---
title: CREATE DICTIONARY
sidebar_position: 1
---

Creates an external dictionary.

## Syntax

```sql
CREATE [ OR REPLACE ] DICTIONARY [ IF NOT EXISTS ] [ <catalog_name>. ][ <database_name>. ]<dictionary_name>
(
    <column_name> <data_type> [ , <column_name> <data_type> , ... ]
)
PRIMARY KEY <column_name> [ , <column_name> , ... ]
SOURCE(
    <source_name>(
        <source_option> = '<value>' [ <source_option> = '<value>' ... ]
    )
)
[ COMMENT '<comment>' ]
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `OR REPLACE` | Replaces an existing dictionary with the same name. |
| `IF NOT EXISTS` | Succeeds without changes if the dictionary already exists. |
| `<dictionary_name>` | The dictionary name. You can qualify it with catalog and database names. |
| `(<column_name> <data_type>, ...)` | Declares the dictionary schema. |
| `PRIMARY KEY` | Defines one or more key columns used for dictionary lookups. |
| `SOURCE(...)` | Defines the source connector name and its key-value options. |
| `COMMENT` | Optional dictionary comment. |

## Examples

```sql
CREATE DICTIONARY user_info
(
    user_id UInt64,
    user_name String,
    user_email String
)
PRIMARY KEY user_id
SOURCE(
    mysql(
        host = '127.0.0.1'
        port = '3306'
        username = 'root'
        password = 'root'
        db = 'app'
        table = 'users'
    )
)
COMMENT 'User dictionary from MySQL';
```
