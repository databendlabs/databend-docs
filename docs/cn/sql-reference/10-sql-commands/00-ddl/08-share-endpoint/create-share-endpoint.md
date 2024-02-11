---
title: 创建共享端点
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.339"/>

创建一个共享端点。

## 语法

```sql
CREATE [ OR REPLACE ] SHARE ENDPOINT [ IF NOT EXISTS ] <share_endpoint_name>
    URL = '<share_endpoint_url>'
    TENANT = <shared_tenant_name>
    [COMMENT = <comment_string>]
```

## 示例

以下示例创建了一个名为 "to_share" 的共享端点，该端点定义了访问共享的 Databend 租户 "toronto" 的 URL：

```sql
CREATE SHARE ENDPOINT to_share URL = 'http://127.0.0.1:23003' TENANT = toronto;
```