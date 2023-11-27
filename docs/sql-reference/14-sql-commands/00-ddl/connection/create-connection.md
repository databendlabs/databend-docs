---
title: CREATE CONNECTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.208"/>

Creates a connection to external storage.

## Syntax

```sql
CREATE CONNECTION [IF NOT EXISTS] <connection_name> STORAGE_TYPE = '<type>' [<storage_params>]
```

| Parameter        | Description                                                                                                                                        |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| STORAGE_TYPE     | Type of storage service. Possible values include: `s3`, `azblob`, `gcs`, `oss`, `cos`, `hdfs`, and `webhdfs`.                                      |
| storage_params   | Vary based on storage type and authentication method. See [Connection Parameters](../../../13-sql-reference/51-connect-parameters.md) for details. |

## Examples

```sql
CREATE CONNECTION toronto STORAGE_TYPE = 's3' 
SECRET_ACCESS_KEY = '<your-secret-access-key>' ACCESS_KEY_ID = '<your-access-key-id>';
```