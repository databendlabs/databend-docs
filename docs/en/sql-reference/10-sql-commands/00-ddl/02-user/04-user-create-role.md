---
title: CREATE ROLE
sidebar_position: 5
---

Create a new role.

After creating roles, you can grant object privileges to the role, enable access control security for objects in the system.

See also: [GRANT](10-grant.md)

## Syntax

```sql
CREATE ROLE [ IF NOT EXISTS ] <role_name> [ COMMENT = '<string_literal>' ]
```
## Examples

```sql
CREATE ROLE role1;
```