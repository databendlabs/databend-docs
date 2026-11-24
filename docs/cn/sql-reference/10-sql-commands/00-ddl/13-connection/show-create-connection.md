---
title: SHOW CREATE CONNECTION
sidebar_position: 4
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.965"/>

显示连接的 `CREATE CONNECTION` 语句。

## 语法

```sql
SHOW CREATE CONNECTION <connection_name>
```

## 输出

该命令返回一行，包含以下列：

| 列                | 描述                                  |
|-------------------|---------------------------------------|
| Connection        | 连接的名称。                          |
| Create Connection | 该连接的 `CREATE CONNECTION` 语句。   |

该命令会对 `access_key_id`、`secret_access_key` 和 `session_token` 等凭证进行掩码处理。如果连接包含凭证，则无法直接使用输出的语句重新创建相同的连接。请先将掩码值替换为真实凭证。明文显示的选项列表请参阅[掩码规则](desc-connection.md#掩码规则)。

## 访问控制

您必须拥有该连接的 ACCESS CONNECTION 权限，或者是该连接的所有者。更多信息请参阅[访问控制权限](/guides/security/access-control/privileges)。

## 示例

以下示例创建一个连接到 S3 兼容存储服务的连接，并显示其 `CREATE CONNECTION` 语句：

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
