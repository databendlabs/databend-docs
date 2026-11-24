---
title: SHOW CREATE CONNECTION
sidebar_position: 4
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.965"/>

Shows the `CREATE CONNECTION` statement for a connection.

## Syntax

```sql
SHOW CREATE CONNECTION <connection_name>
```

## Output

The command returns one row with these columns:

| Column            | Description                                       |
|-------------------|---------------------------------------------------|
| Connection        | The name of the connection.                       |
| Create Connection | The `CREATE CONNECTION` statement for the connection. |

The command masks credentials such as `access_key_id`, `secret_access_key`, and `session_token`. If the connection has credentials, you cannot use the output statement to create the same connection again. Replace the masked values with the real credentials first. For the list of options that show in plain text, see [Masked Values](desc-connection.md#masked-values).

## Access Control

You must have the ACCESS CONNECTION privilege on the connection, or own the connection. For more information, see [Access Control Privileges](/guides/security/access-control/privileges).

## Examples

This example creates a connection to an S3-compatible storage service and shows its `CREATE CONNECTION` statement:

```sql
CREATE CONNECTION my_s3_conn
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = 'minioadmin'
    SECRET_ACCESS_KEY = 'minioadmin'
    ENDPOINT_URL = 'http://127.0.0.1:9900/'
    REGION = 'us-east-1';

SHOW CREATE CONNECTION my_s3_conn;

┌────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Connection │ Create Connection                                                                                                                                                     │
├────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ my_s3_conn │ CREATE CONNECTION my_s3_conn STORAGE_TYPE = 's3' access_key_id = 'mi***in' endpoint_url = 'http://127.0.0.1:9900/' region = 'us-east-1' secret_access_key = 'mi***in' │
└────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
