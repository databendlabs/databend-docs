---
title: SHOW USERS
sidebar_position: 3
---

Lists all SQL users in the system. If you're using Databend Cloud, this command also shows the user accounts (email addresses) within your organization that are used to log in to Databend Cloud.

## Syntax

```sql
SHOW USERS
```

## Examples

```sql
CREATE USER eric IDENTIFIED BY 'abc123';

SHOW USERS;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  name  │ hostname │       auth_type      │ is_configured │  default_role │     roles     │ disabled │
├────────┼──────────┼──────────────────────┼───────────────┼───────────────┼───────────────┼──────────┤
│ eric   │ %        │ double_sha1_password │ NO            │               │               │ false    │
│ root   │ %        │ no_password          │ YES           │ account_admin │ account_admin │ false    │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```