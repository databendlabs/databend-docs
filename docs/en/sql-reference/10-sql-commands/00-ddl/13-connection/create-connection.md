---
title: CREATE CONNECTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.339"/>

Creates a connection to external storage.

## Syntax

```sql
CREATE [ OR REPLACE ] CONNECTION [ IF NOT EXISTS ] <connection_name> 
    STORAGE_TYPE = '<type>' 
    [ <storage_params> ]

```

| Parameter        | Description                                                                                                                                        |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| STORAGE_TYPE     | Type of storage service. Possible values include: `s3`, `azblob`, `gcs`, `oss`, and `cos`.                                                         |
| storage_params   | Vary based on storage type and authentication method. See [Connection Parameters](../../../00-sql-reference/51-connect-parameters.md) for details. |

## Examples

This example creates a connection to Amazon S3 named 'toronto' and establishes an external stage named 'my_s3_stage' linked to the 's3://databend-toronto' URL, using the 'toronto' connection. For more practical examples about connection, see [Usage Examples](index.md#usage-examples).  

```sql
CREATE CONNECTION toronto 
    STORAGE_TYPE = 's3' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>' 
    ACCESS_KEY_ID = '<your-access-key-id>';

CREATE STAGE my_s3_stage 
    URL = 's3://databend-toronto' 
    CONNECTION = (CONNECTION_NAME = 'toronto');
```