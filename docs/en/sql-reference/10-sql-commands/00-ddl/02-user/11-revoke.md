---
title: REVOKE
sidebar_position: 11
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.275"/>

Revokes privileges, roles, and ownership of a specific database object. This involves:

- Revoking privileges from a user or a role.
- Revoking a role from a user or a role.

See also:

- [GRANT](10-grant.md)
- [SHOW GRANTS](22-show-grants.md)

## Syntax

### Revoking Privileges

```sql
REVOKE { 
        schemaObjectPrivileges | ALL [ PRIVILEGES ] ON <privileges_level>
       }
FROM [ ROLE <role_name> ] [ <user> ]
```

Where:

```sql
schemaObjectPrivileges ::=
-- For TABLE
  { SELECT | INSERT }
  
-- For SCHEMA
  { CREATE | DROP | ALTER }
  
-- For USER
  { CREATE USER }
  
-- For ROLE
  { CREATE ROLE}

-- For STAGE
  { READ, WRITE }

-- For UDF
  { USAGE }
```

```sql
privileges_level ::=
    *.*
  | db_name.*
  | db_name.tbl_name
  | STAGE <stage_name>
  | UDF <udf_name>
```

### Revoking Role

```sql
-- Revoke a role from a user
REVOKE ROLE <role_name> FROM <user_name>

-- Revoke a role from a role
REVOKE ROLE <role_name> FROM ROLE <role_name>
```

## Examples

### Example 1: Revoking Privileges from a User


Create a user:
```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
```

Grant the `SELECT,INSERT` privilege on all existing tables in the `default` database to the user `user1`:
 
```sql
GRANT SELECT,INSERT ON default.* TO user1;
```
```sql
SHOW GRANTS FOR user1;
+---------------------------------------------------+
| Grants                                            |
+---------------------------------------------------+
| GRANT SELECT,INSERT ON 'default'.* TO 'user1'@'%' |
+---------------------------------------------------+
```

Revoke `INSERT` privilege from user `user1`:
```sql
REVOKE INSERT ON default.* FROM user1;
```

```sql
SHOW GRANTS FOR user1;
+--------------------------------------------+
| Grants                                     |
+--------------------------------------------+
| GRANT SELECT ON 'default'.* TO 'user1'@'%' |
+--------------------------------------------+
```

### Example 2: Revoking Privileges from a Role

Grant the `SELECT,INSERT` privilege on all existing tables in the `mydb` database to the role `role1`:

Create role:
```sql
CREATE ROLE role1;
```

Grant privileges to the role:
```sql
GRANT SELECT,INSERT ON mydb.* TO ROLE role1;
```

Show the grants for the role:
```sql
SHOW GRANTS FOR ROLE role1;
+--------------------------------------------+
| Grants                                     |
+--------------------------------------------+
| GRANT SELECT,INSERT ON 'mydb'.* TO 'role1' |
+--------------------------------------------+
```

Revoke `INSERT` privilege from role `role1`:
```sql
REVOKE INSERT ON mydb.* FROM ROLE role1;
```

```sql
SHOW GRANTS FOR ROLE role1;
+-------------------------------------+
| Grants                              |
+-------------------------------------+
| GRANT SELECT ON 'mydb'.* TO 'role1' |
+-------------------------------------+
```

### Example 3: Revoking a Role from a User

```sql
REVOKE ROLE role1 FROM USER user1;
```

```sql
SHOW GRANTS FOR user1;
+-----------------------------------------+
| Grants                                  |
+-----------------------------------------+
| GRANT ALL ON 'default'.* TO 'user1'@'%' |
| GRANT ALL ON *.* TO 'user1'@'%'         |
+-----------------------------------------+
```