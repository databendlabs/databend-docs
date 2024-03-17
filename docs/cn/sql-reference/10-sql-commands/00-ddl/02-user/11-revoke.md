---
title: 撤销授权 REVOKE
sidebar_position: 11
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.275"/>

撤销特定数据库对象的权限、角色和所有权。这涉及到：

- 从用户或角色中撤销权限。
- 从用户或角色中撤销角色。

另请参见：

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
-- 从用户中撤销角色
REVOKE ROLE <role_name> FROM <user_name>

-- 从角色中撤销角色
REVOKE ROLE <role_name> FROM ROLE <role_name>
```

## 示例

### 示例 1：从用户中撤销权限

创建用户：

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
```

将 `SELECT,INSERT` 权限授予用户 `user1` 在 `default` 数据库中的所有现有表：

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

从用户 `user1` 中撤销 `INSERT` 权限：

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

### 示例 2：从角色中撤销权限

将 `SELECT,INSERT` 权限授予角色 `role1` 在 `mydb` 数据库中的所有现有表：

创建角色：

```sql
CREATE ROLE role1;
```

向角色授予权限：

```sql
GRANT SELECT,INSERT ON mydb.* TO ROLE role1;
```

显示角色的授权情况：

```sql
SHOW GRANTS FOR ROLE role1;
+--------------------------------------------+
| Grants                                     |
+--------------------------------------------+
| GRANT SELECT,INSERT ON 'mydb'.* TO 'role1' |
+--------------------------------------------+
```

从角色 `role1` 中撤销 `INSERT` 权限：

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

### 示例 3：从用户中撤销角色

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
