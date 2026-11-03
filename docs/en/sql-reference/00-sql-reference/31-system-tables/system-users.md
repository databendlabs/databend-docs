---
title: system.users
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

Contains metadata for SQL users visible to the current session. [SHOW USERS](/sql/sql-commands/ddl/user/user-show-users) reads this table.

## Visibility

Visibility follows these rules:

- A session with the global `GRANT` privilege sees all users in the tenant.
- Other sessions see only the account whose username and hostname both match the current user.
- Configured users have hostname `%` and follow the same filter.

The `GRANT` privilege can come from effective role privileges or a direct user grant. Filtering does not delete or disable hidden accounts.

## Example

```sql
SELECT name, hostname, auth_type, is_configured, default_role, roles
FROM system.users
ORDER BY name, hostname;
```

For the output fields and user-management examples, see [SHOW USERS](/sql/sql-commands/ddl/user/user-show-users).
