---
title: CURRENT_TENANT_ID
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

Returns the tenant ID of the current session as a `VARCHAR` value.

Use this function to get the tenant IDs for [Data Sharing](/guides/data-management/data-sharing). A tenant ID is not a user name. To get the user name, use `CURRENT_USER()`.

## Syntax

```sql
CURRENT_TENANT_ID()
```

## Examples

```sql
SELECT CURRENT_TENANT_ID();
```

In a session of the tenant `provider_acct`, the result is `provider_acct`.

If the ID contains uppercase letters or special characters, put the ID in backticks when you use it in a Share statement:

```sql
ALTER SHARE sales_share ADD ACCOUNTS = `consumer-tenant`;
```
