---
title: CURRENT_TENANT_ID
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.949"/>

以 `VARCHAR` 值返回当前会话的租户 ID。

使用此函数获取[数据共享](/guides/data-management/data-sharing)所需的租户 ID。租户 ID 不是用户名。获取用户名请使用 `CURRENT_USER()`。

## 语法

```sql
CURRENT_TENANT_ID()
```

## 示例

```sql
SELECT CURRENT_TENANT_ID();
```

在租户 `provider_acct` 的会话中，结果为 `provider_acct`。

如果 ID 包含大写字母或特殊字符，在 Share 语句中使用时将 ID 放在反引号中：

```sql
ALTER SHARE sales_share ADD ACCOUNTS = `consumer-tenant`;
```
