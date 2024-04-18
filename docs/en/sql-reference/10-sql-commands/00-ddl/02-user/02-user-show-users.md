---
title: SHOW USERS
sidebar_position: 3
---

Lists all the users in the system.

## Syntax

```sql
SHOW USERS
```

## Examples

```sql
SHOW USERS;

┌─────────────────────────────────────────────────────────────────────────────────────┐
│  name  │ hostname │       auth_type      │ is_configured │  default_role │ disabled │
├────────┼──────────┼──────────────────────┼───────────────┼───────────────┼──────────┤
│ root   │ %        │ no_password          │ YES           │ account_admin │ false    │
│ u1     │ %        │ double_sha1_password │ NO            │               │ true     │
│ u2     │ %        │ double_sha1_password │ NO            │               │ false    │
└─────────────────────────────────────────────────────────────────────────────────────┘
```