---
title: SHOW CONNECTIONS
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.965"/>

显示所有可用连接的列表。

该命令会对 `storage_params` 中的凭证进行掩码处理。掩码规则请参阅[掩码规则](desc-connection.md#掩码规则)。

## 语法

```sql
SHOW CONNECTIONS
```

## 示例

```sql
SHOW CONNECTIONS;

┌────────────┬──────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ name       │ storage_type │ storage_params                                                                                       │
├────────────┼──────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ my_s3_conn │ s3           │ access_key_id=mi***in endpoint_url=http://127.0.0.1:9900/ region=us-east-1 secret_access_key=mi***in │
└────────────┴──────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
