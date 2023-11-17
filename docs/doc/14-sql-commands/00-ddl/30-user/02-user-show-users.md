---
title: SHOW USERS
sidebar_position: 3
---

Lists all the users in the system.

## Syntax

```sql
SHOW USERS;
```

## Examples

```sql
SHOW USERS;

---
| name                      | hostname | auth_type            | is_configured |
|---------------------------|----------|----------------------|---------------|
| sqluser_johnappleseed     | %        | double_sha1_password | NO            |
| johnappleseed@example.com | %        | jwt                  | NO            |
```