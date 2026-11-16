---
title: DESC CONNECTION
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.965"/>

Describes the details of a specific connection, providing information about its type and configuration.

## Syntax

```sql
DESC CONNECTION <connection_name>
```

## Masked Values

The command masks credentials in `storage_params`. [SHOW CONNECTIONS](show-connections.md) and [SHOW CREATE CONNECTION](show-create-connection.md) use the same rules:

| Option | How the value shows |
|--------|---------------------|
| `region`, `role_arn`, `aws_role_arn`, `enable_virtual_host_style`, `disable_list_batch`, `https`, `user_name`, `repo_type`, `revision` | Plain text. |
| `endpoint_url`, `name_node` | Plain text. If the URL has a user name and password, or query parameters, the command masks these parts. For example, `https://user:pass@s3.example.com/` shows as `https://***:***@s3.example.com/`. |
| All other options, such as `access_key_id`, `secret_access_key`, `session_token`, and `account_key` | Masked. For example, `minioadmin` shows as `mi***in`. |

## Examples

```sql
CREATE CONNECTION my_s3_conn
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = 'minioadmin'
    SECRET_ACCESS_KEY = 'minioadmin'
    ENDPOINT_URL = 'http://127.0.0.1:9900/'
    REGION = 'us-east-1';

DESC CONNECTION my_s3_conn;

┌────────────┬──────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ name       │ storage_type │ storage_params                                                                                       │
├────────────┼──────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ my_s3_conn │ s3           │ access_key_id=mi***in endpoint_url=http://127.0.0.1:9900/ region=us-east-1 secret_access_key=mi***in │
└────────────┴──────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
