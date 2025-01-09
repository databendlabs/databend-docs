---
title: DESC CONNECTION
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.208"/>

描述特定连接的详细信息，提供其类型和配置的相关信息。

## 语法

```sql
DESC CONNECTION <connection_name>
```

## 示例

```sql
DESC CONNECTION toronto;

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   name  │ storage_type │                                         storage_params                            │
├─────────┼──────────────┼───────────────────────────────────────────────────────────────────────────────────┤
│ toronto │ s3           │ access_key_id=<your-secret-access-key> secret_access_key=<your-secret-access-key> │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```