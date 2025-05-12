---
title: GRANT
sidebar_position: 9
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.275"/>

为特定的数据库对象授予权限、角色和所有权。 这包括：

- 向用户或角色授予权限。
- 将角色分配给用户或其他角色。
- 将所有权转让给角色。

参见：

- [REVOKE](11-revoke.md)
- [SHOW GRANTS](22-show-grants.md)

## 语法

### 授予权限

要了解什么是权限以及它如何工作，请参见 [权限](/guides/security/access-control/privileges)。

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

### 授予角色

要了解什么是角色以及它如何工作，请参见 [角色](/guides/security/access-control/roles)。

```sql
-- Grant a role to a user
GRANT ROLE <role_name> TO <user_name>

-- Grant a role to a role
GRANT ROLE <role_name> TO ROLE <role_name>
```

### 授予所有权

要了解什么是所有权以及它如何工作，请参见 [所有权](/guides/security/access-control/ownership)。

```sql
-- Grant ownership of a specific table within a database to a role
GRANT OWNERSHIP ON <database_name>.<table_name> TO ROLE '<role_name>'

-- Grant ownership of a stage to a role
GRANT OWNERSHIP ON STAGE <stage_name> TO ROLE '<role_name>'

-- Grant ownership of a user-defined function (UDF) to a role
GRANT OWNERSHIP ON UDF <udf_name> TO ROLE '<role_name>'
```

## 示例

### 示例 1：向用户授予权限

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

将 `ALL` 权限授予所有数据库给用户 `user1`：

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


将 `ALL` 权限授予名为 `s1` 的 Stage 给用户 `user1`：

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

将 `ALL` 权限授予名为 `f1` 的 UDF 给用户 `user1`：

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

### 示例 2：向角色授予权限

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

### 示例 3：将角色授予用户

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

### 示例 4：将所有权授予角色

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