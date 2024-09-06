---
title: REVOKE
sidebar_position: 11
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.275"/>

撤销特定数据库对象的权限、角色和所有权。这包括：

- 从用户或角色撤销权限。
- 从用户或其他角色移除角色。

另请参阅：

- [GRANT](10-grant.md)
- [SHOW GRANTS](22-show-grants.md)

## 语法

### 撤销权限

```sql
REVOKE { 
        schemaObjectPrivileges | ALL [ PRIVILEGES ] ON <privileges_level>
       }
FROM [ ROLE <role_name> ] [ <user> ]
```

其中：

```sql
schemaObjectPrivileges ::=
-- 对于 TABLE
  { SELECT | INSERT }
  
-- 对于 SCHEMA
  { CREATE | DROP | ALTER }
  
-- 对于 USER
  { CREATE USER }
  
-- 对于 ROLE
  { CREATE ROLE}

-- 对于 STAGE
  { READ, WRITE }

-- 对于 UDF
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

### 撤销角色

```sql
-- 从用户撤销角色
REVOKE ROLE <role_name> FROM <user_name>

-- 从角色撤销角色
REVOKE ROLE <role_name> FROM ROLE <role_name>
```

## 示例

### 示例 1：从用户撤销权限

创建用户：
```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
```

授予用户 `user1` 在 `default` 数据库中所有现有表的 `SELECT,INSERT` 权限：
 
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

从用户 `user1` 撤销 `INSERT` 权限：
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

### 示例 2：从角色撤销权限

授予角色 `role1` 在 `mydb` 数据库中所有现有表的 `SELECT,INSERT` 权限：

创建角色：
```sql
CREATE ROLE role1;
```

授予权限给角色：
```sql
GRANT SELECT,INSERT ON mydb.* TO ROLE role1;
```

显示角色的授权：
```sql
SHOW GRANTS FOR ROLE role1;
+--------------------------------------------+
| Grants                                     |
+--------------------------------------------+
| GRANT SELECT,INSERT ON 'mydb'.* TO 'role1' |
+--------------------------------------------+
```

从角色 `role1` 撤销 `INSERT` 权限：
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

### 示例 3：从用户撤销角色

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