---
title: ALTER DATABASE
sidebar_position: 4
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

Changes the name of a database, or sets default storage options for a database.

## Syntax

```sql
-- Rename a database
ALTER DATABASE [ IF EXISTS ] <name> RENAME TO <new_db_name>

-- Set default storage options
ALTER DATABASE [ IF EXISTS ] <name> SET OPTIONS (
    <database_option> = '<value>' [, ...]
)
```

## Parameters

| Parameter                    | Description                                                                                                                                      |
|:-----------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| `DEFAULT_STORAGE_CONNECTION` | The name of an existing connection (created via `CREATE CONNECTION`) to use as the default storage connection for tables in this database.        |
| `DEFAULT_STORAGE_PATH`       | The default storage path URI (e.g., `s3://bucket/path/`) for tables in this database. Must end with `/` and match the connection's storage type. |
| `DEFAULT_S3_STORAGE_CLASS`   | The default S3 storage class for new non-temporary external Fuse tables. Accepts `standard` or `intelligent_tiering` (case-insensitive). |

:::note
- `SET OPTIONS` only affects tables created after the statement is executed. Existing tables are not changed.
- You can update the connection or path separately if the other option already exists on the database.
- `DEFAULT_S3_STORAGE_CLASS` can be set independently. It applies only to new non-temporary external Fuse tables without an explicit `S3_STORAGE_CLASS`. To change an existing table, use `ALTER TABLE ... SET OPTIONS`. See [External Tables](/guides/data-management/external-tables#s3-storage-class) for examples.
:::

## Examples

### Rename a database

```sql
CREATE DATABASE DATABEND;
```

```sql
SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| DATABEND           |
| information_schema |
| default            |
| system             |
+--------------------+
```

```sql
ALTER DATABASE `DATABEND` RENAME TO `NEW_DATABEND`;
```

```sql
SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| NEW_DATABEND       |
| default            |
| system             |
+--------------------+
```

### Set default storage options

```sql
ALTER DATABASE analytics SET OPTIONS (
    DEFAULT_STORAGE_CONNECTION = 'my_s3',
    DEFAULT_STORAGE_PATH = 's3://mybucket/analytics_v2/'
);
```

### Set the default S3 storage class

```sql
ALTER DATABASE external_analytics SET OPTIONS (
    DEFAULT_S3_STORAGE_CLASS = 'standard'
);
```

## Tag Operations

Assigns or removes tags on a database. Tags must be created with [CREATE TAG](../08-tag/01-ddl-create-tag.md) first. For full details, see [SET TAG / UNSET TAG](../08-tag/04-ddl-set-tag.md).

### Syntax

```sql
ALTER DATABASE [ IF EXISTS ] <name> SET TAG <tag_name> = '<value>' [, <tag_name> = '<value>' ...]

ALTER DATABASE [ IF EXISTS ] <name> UNSET TAG <tag_name> [, <tag_name> ...]
```

### Examples

```sql
ALTER DATABASE mydb SET TAG env = 'prod', owner = 'team_a';
ALTER DATABASE mydb UNSET TAG env, owner;
```
