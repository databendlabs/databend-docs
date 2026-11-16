---
title: DESC CONNECTION
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.965"/>

描述特定连接的详细信息，提供有关其类型和配置的信息。

## 语法

```sql
DESC CONNECTION <connection_name>
```

## 掩码规则

该命令会对 `storage_params` 中的凭证进行掩码处理。[SHOW CONNECTIONS](show-connections.md) 和 [SHOW CREATE CONNECTION](show-create-connection.md) 使用相同的规则：

| 选项 | 显示方式 |
|------|----------|
| `region`、`role_arn`、`aws_role_arn`、`enable_virtual_host_style`、`disable_list_batch`、`https`、`user_name`、`repo_type`、`revision` | 明文显示。 |
| `endpoint_url`、`name_node` | 明文显示。如果 URL 中包含用户名和密码或查询参数，该命令会对这些部分进行掩码处理。例如，`https://user:pass@s3.example.com/` 显示为 `https://***:***@s3.example.com/`。 |
| 其他所有选项，如 `access_key_id`、`secret_access_key`、`session_token` 和 `account_key` | 掩码显示。例如，`minioadmin` 显示为 `mi***in`。 |

## 示例

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
