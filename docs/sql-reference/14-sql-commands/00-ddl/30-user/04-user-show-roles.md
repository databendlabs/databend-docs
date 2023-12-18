---
title: SHOW ROLES
sidebar_position: 6
---

Lists all the roles in the system.

## Syntax

```sql
SHOW ROLES
```
## Examples

```sql
SHOW ROLES;

┌───────────────────────────────────────────────────────────┐
│      name     │ inherited_roles │ is_current │ is_default │
├───────────────┼─────────────────┼────────────┼────────────┤
│ account_admin │               0 │ true       │ true       │
│ manager       │               0 │ false      │ false      │
│ public        │               0 │ false      │ false      │
└───────────────────────────────────────────────────────────┘
```