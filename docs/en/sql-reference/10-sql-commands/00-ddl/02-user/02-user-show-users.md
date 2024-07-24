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
SHOW USERS;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                name                               │  hostname │       auth_type      │ is_configured │  default_role │     roles     │ disabled │
│                               String                              │   String  │        String        │     String    │     String    │     String    │  Boolean │
├───────────────────────────────────────────────────────────────────┼───────────┼──────────────────────┼───────────────┼───────────────┼───────────────┼──────────┤
│ eric@my_organization.com                                          │ %         │ jwt                  │ NO            │               │ account_admin │ false    │
│ bill                                                              │ %         │ double_sha1_password │ NO            │               │               │ false    │
│ me.ssword@gmail.com                                               │ %         │ jwt                  │ NO            │               │ account_admin │ false    │
│ test-a                                                            │ localhost │ double_sha1_password │ NO            │               │               │ false    │
│ test-b                                                            │ localhost │ sha256_password      │ NO            │               │               │ false    │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```