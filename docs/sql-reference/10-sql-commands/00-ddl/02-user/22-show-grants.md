---
title: SHOW GRANTS
sidebar_position: 10
---

Lists all the privileges that have been explicitly granted to a user or a role.

See also:

- [GRANT](10-grant.md)
- [REVOKE](11-revoke.md)

## Syntax

```sql
-- Lists privileges granted to a user
SHOW GRANTS FOR <user_name>;

-- Lists privileges granted to a role
SHOW GRANTS FOR ROLE <role_name>;
```

## Examples

The following code returns all the privileges granted to the user `user1`: 

```sql
SHOW GRANTS FOR user1;

---
+-----------------------------------------+
| Grants                                  |
+-----------------------------------------+
| GRANT ALL ON 'default'.* TO 'user1'@'%' |
| GRANT ALL ON *.* TO 'user1'@'%'         |
+-----------------------------------------+
```

The following code returns all the privileges granted to the role `role1`: 

```sql
SHOW GRANTS FOR ROLE role1;

---
+-------------------------------------+
| Grants                              |
+-------------------------------------+
| GRANT SELECT ON 'mydb'.* TO 'role1' |
+-------------------------------------+
```