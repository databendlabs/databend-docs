---
title: GRANT
sidebar_position: 9
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.275"/>

Grants privileges, roles, and ownership for a specific database object. This includes:

- Granting privileges to users or roles.
- Assigning roles to users or other roles.
- Transferring ownership to a role.

See also:

- [REVOKE](11-revoke.md)
- [SHOW GRANTS](22-show-grants.md)

## Syntax

### Granting Privileges

To understand what a privilege is and how it works, see [Privileges](/guides/security/access-control/privileges).

```sql
GRANT { 
        schemaObjectPrivileges | ALL [ PRIVILEGES ] ON <privileges_level>
      }
TO [ ROLE <role_name> ] [ <user_name> ]
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

### Granting Role

To understand what a role is and how it works, see [Roles](/guides/security/access-control/roles).

```sql
-- Grant a role to a user
GRANT ROLE <role_name> TO <user_name>

-- Grant a role to a role
GRANT ROLE <role_name> TO ROLE <role_name>
```

### Granting Ownership

To understand what ownership is and how it works, see [Ownership](/guides/security/access-control/ownership).

```sql
-- Grant ownership of a specific table within a database to a role
GRANT OWNERSHIP ON <database_name>.<table_name> TO ROLE '<role_name>'

-- Grant ownership of a stage to a role
GRANT OWNERSHIP ON STAGE <stage_name> TO ROLE '<role_name>'

-- Grant ownership of a user-defined function (UDF) to a role
GRANT OWNERSHIP ON UDF <udf_name> TO ROLE '<role_name>'
```

## Examples

### Example 1: Granting Privileges to a User

Create a user:
```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
```

Grant the `ALL` privilege on all existing tables in the `default` database to the user `user1`:
 
```sql
GRANT ALL ON default.* TO user1;
```

```sql
SHOW GRANTS FOR user1;
+-----------------------------------------+
| Grants                                  |
+-----------------------------------------+
| GRANT ALL ON 'default'.* TO 'user1'@'%' |
+-----------------------------------------+
```

Grant the `ALL` privilege to all the database to the user `user1`:

```sql
GRANT ALL ON *.* TO 'user1';
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


Grant the `ALL` privilege to the stage that named `s1` to the user `user1`:

```sql
GRANT ALL ON STAGE s1 TO 'user1';
```
```sql
SHOW GRANTS FOR user1;
+-----------------------------------------------------------------+
| Grants                                                          |
+-----------------------------------------------------------------+
| GRANT ALL ON STAGE s1 TO 'user1'@'%'                            |
| GRANT SELECT ON 'default'.'system'.'one' TO 'user1'@'%'         |
| GRANT SELECT ON 'default'.'information_schema'.* TO 'user1'@'%' |
+-----------------------------------------------------------------+
```

Grant the `ALL` privilege to the UDF that named `f1` to the user `user1`:

```sql
GRANT ALL ON UDF f1 TO 'user1';
```
```sql
SHOW GRANTS FOR user1;
+-----------------------------------------------------------------+
| Grants                                                          |
+-----------------------------------------------------------------+
| GRANT ALL ON UDF f1 TO 'user1'@'%'                              |
| GRANT SELECT ON 'default'.'system'.'one' TO 'user1'@'%'         |
| GRANT SELECT ON 'default'.'information_schema'.* TO 'user1'@'%' |
+-----------------------------------------------------------------+
```

### Example 2: Granting Privileges to a Role

Grant the `SELECT` privilege on all existing tables in the `mydb` database to the role `role1`:

Create role:
```sql 
CREATE ROLE role1;
```

Grant privileges to the role:
```sql
GRANT SELECT ON mydb.* TO ROLE role1;
```

Show the grants for the role:
```sql
SHOW GRANTS FOR ROLE role1;
+-------------------------------------+
| Grants                              |
+-------------------------------------+
| GRANT SELECT ON 'mydb'.* TO 'role1' |
+-------------------------------------+
```

### Example 3: Granting a Role to a User

User `user1` grants are:
```sql
SHOW GRANTS FOR user1;
+-----------------------------------------+
| Grants                                  |
+-----------------------------------------+
| GRANT ALL ON 'default'.* TO 'user1'@'%' |
| GRANT ALL ON *.* TO 'user1'@'%'         |
+-----------------------------------------+
```

Role `role1` grants are:
```sql
SHOW GRANTS FOR ROLE role1;
+-------------------------------------+
| Grants                              |
+-------------------------------------+
| GRANT SELECT ON 'mydb'.* TO 'role1' |
+-------------------------------------+
```

Grant role `role1` to user `user1`:
```sql
 GRANT ROLE role1 TO user1;
```

Now, user `user1` grants are:
```sql
SHOW GRANTS FOR user1;
+-----------------------------------------+
| Grants                                  |
+-----------------------------------------+
| GRANT ALL ON 'default'.* TO 'user1'@'%' |
| GRANT ALL ON *.* TO 'user1'@'%'         |
| GRANT SELECT ON 'mydb'.* TO 'role1'     |
+-----------------------------------------+
```

### Example 4: Granting Ownership to a Role

```sql
-- Grant ownership of all tables in the 'finance_data' database to the role 'data_owner'
GRANT OWNERSHIP ON finance_data.* TO ROLE 'data_owner';

-- Grant ownership of the table 'transactions' in the 'finance_data' schema to the role 'data_owner'
GRANT OWNERSHIP ON finance_data.transactions TO ROLE 'data_owner';

-- Grant ownership of the stage 'ingestion_stage' to the role 'data_owner'
GRANT OWNERSHIP ON STAGE ingestion_stage TO ROLE 'data_owner';

-- Grant ownership of the user-defined function 'calculate_profit' to the role 'data_owner'
GRANT OWNERSHIP ON UDF calculate_profit TO ROLE 'data_owner';
```