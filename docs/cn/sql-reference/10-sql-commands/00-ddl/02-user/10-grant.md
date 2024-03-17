---
title: 授权 GRANT
sidebar_position: 9
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.275"/>

授予特定数据库对象的权限、角色和所有权。这包括：

- 授予用户或角色权限。
- 授予用户或角色角色。
- 授予角色所有权。

另请参阅：

- [REVOKE](11-revoke.md)
- [SHOW GRANTS](22-show-grants.md)

## 语法

### 授予权限

```sql
GRANT {
        schemaObjectPrivileges | ALL [ PRIVILEGES ] ON <privileges_level>
      }
TO [ ROLE <role_name> ] [ <user_name> ]
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

### 授予角色

```sql
-- 将角色授予用户
GRANT ROLE <role_name> TO <user_name>

-- 将角色授予角色
GRANT ROLE <role_name> TO ROLE <role_name>
```

### 授予所有权

```sql
-- 将特定数据库中的特定表的所有权授予角色
GRANT OWNERSHIP ON <database_name>.<table_name> TO ROLE '<role_name>'

-- 将 Stage 的所有权授予角色
GRANT OWNERSHIP ON STAGE <stage_name> TO ROLE '<role_name>'

-- 将用户定义的函数（UDF）的所有权授予角色
GRANT OWNERSHIP ON UDF <udf_name> TO ROLE '<role_name>'
```

## 示例

### 示例 1：授予权限给用户

创建用户：

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

将 `ALL` 权限授予用户 `user1` 对所有数据库：

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

将 `ALL` 权限授予名为 `s1` 的Stage给用户 `user1`：

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

### 示例 2：授予权限给角色

将 `SELECT` 权限授予 `mydb` 数据库中所有现有表给角色 `role1`：

创建角色：

```sql
CREATE ROLE role1;
```

授予权限给角色：

```sql
GRANT SELECT ON mydb.* TO ROLE role1;
```

显示角色的授权情况：

```sql
SHOW GRANTS FOR ROLE role1;
+-------------------------------------+
| Grants                              |
+-------------------------------------+
| GRANT SELECT ON 'mydb'.* TO 'role1' |
+-------------------------------------+
```

### 示例 3：将角色授予用户

用户 `user1` 的授权情况是：

```sql
SHOW GRANTS FOR user1;
+-----------------------------------------+
| Grants                                  |
+-----------------------------------------+
| GRANT ALL ON 'default'.* TO 'user1'@'%' |
| GRANT ALL ON *.* TO 'user1'@'%'         |
+-----------------------------------------+
```

角色 `role1` 的授权情况是：

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

现在，用户 `user1` 的授权情况是：

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
-- 将 'finance_data' 数据库中所有表的所有权授予角色 'data_owner'
GRANT OWNERSHIP ON finance_data.* TO ROLE 'data_owner';

-- 将 'finance_data' 模式中的表 'transactions' 的所有权授予角色 'data_owner'
GRANT OWNERSHIP ON finance_data.transactions TO ROLE 'data_owner';

-- 将 Stage 'ingestion_stage' 的所有权授予角色 'data_owner'
GRANT OWNERSHIP ON STAGE ingestion_stage TO ROLE 'data_owner';

-- 将用户定义的函数 'calculate_profit' 的所有权授予角色 'data_owner'
GRANT OWNERSHIP ON UDF calculate_profit TO ROLE 'data_owner';
```
