---
title: system.roles
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

Contains role metadata visible to the current session.

## Visibility

Since v1.2.957, a session with the global `GRANT` privilege can read all roles in the tenant. Other sessions see only roles available to the current user. Available roles include directly granted roles, inherited roles, and the implicit `public` role.

The global `GRANT` exception applies to `system.roles`. [SHOW ROLES](/sql/sql-commands/ddl/user/user-show-roles) still lists the current user's available roles, even for a session with global `GRANT`.

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Role name. |
| `inherited_roles` | UInt64 | Number of roles granted directly to this role. |
| `inherited_roles_name` | String | Names of those roles, sorted and separated by commas. |
| `created_on` | Timestamp | Role creation time. |
| `update_on` | Timestamp | Role update time. |

## Example

```sql
SELECT name, inherited_roles, inherited_roles_name
FROM system.roles
ORDER BY name;
```
