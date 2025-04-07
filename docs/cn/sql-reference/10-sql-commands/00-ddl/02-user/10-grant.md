---
title: GRANT
sidebar_position: 9
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.275"/>

为特定的数据库对象授予权限、角色和所有权。包括：

- 向用户或角色授予权限。
- 将角色分配给用户或其他角色。
- 将所有权转让给角色。

参见：

- [REVOKE](11-revoke.md)
- [SHOW GRANTS](22-show-grants.md)

## Syntax

### Granting Privileges

要了解什么是权限以及它是如何工作的，请参见 [Privileges](/guides/security/access-control/privileges)。

```sql
GRANT {
        schemaObjectPrivileges | ALL [ PRIVILEGES ] ON <privileges_level>
      }
TO [ ROLE <role_name> ] [ <user_name> ]
```

其中：

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

要了解什么是角色以及它是如何工作的，请参见 [Roles](/guides/security/access-control/roles)。

```sql
-- Grant a role to a user
GRANT ROLE <role_name> TO <user_name>

-- Grant a role to a role
GRANT ROLE <role_name> TO ROLE <role_name>
```

### Granting Ownership

要了解什么是所有权以及它是如何工作的，请参见 [Ownership](/guides/security/access-control/ownership)。

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

创建一个用户：

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
```

将 `default` 数据库中所有现有表的 `ALL` 权限授予用户 `user1`：

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

将所有数据库的 `ALL` 权限授予用户 `user1`：

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

将名为 `s1` 的 Stage 的 `ALL` 权限授予用户 `user1`：

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

将名为 `f1` 的 UDF 的 `ALL` 权限授予用户 `user1`：

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

将 `mydb` 数据库中所有现有表的 `SELECT` 权限授予角色 `role1`：

创建角色：

```sql
CREATE ROLE role1;
```

将权限授予角色：

```sql
GRANT SELECT ON mydb.* TO ROLE role1;
```

显示角色的授权：

```sql
SHOW GRANTS FOR ROLE role1;
+-------------------------------------+
| Grants                              |
+-------------------------------------+
| GRANT SELECT ON 'mydb'.* TO 'role1' |
+-------------------------------------+
```

### Example 3: Granting a Role to a User

用户 `user1` 的授权是：

```sql
SHOW GRANTS FOR user1;
+-----------------------------------------+
| Grants                                  |
+-----------------------------------------+
| GRANT ALL ON 'default'.* TO 'user1'@'%' |
| GRANT ALL ON *.* TO 'user1'@'%'         |
+-----------------------------------------+
```

角色 `role1` 的授权是：

```sql
SHOW GRANTS FOR ROLE role1;
+-------------------------------------+
| Grants                              |
+-------------------------------------+
| GRANT SELECT ON 'mydb'.* TO 'role1' |
+-------------------------------------+
```

将角色 `role1` 授予用户 `user1`：

```sql
 GRANT ROLE role1 TO user1;
```

现在，用户 `user1` 的授权是：

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
