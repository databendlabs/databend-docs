---
title: GRANT
sidebar_position: 9
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.275"/>

授予特定数据库对象的权限、角色和所有权。这包括：

- 向用户或角色授予权限。
- 向用户或角色授予角色。
- 向角色授予所有权。

相关内容：

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
-- 对于表
  { SELECT | INSERT }
  
-- 对于模式
  { CREATE | DROP | ALTER }
  
-- 对于用户
  { CREATE USER }
  
-- 对于角色
  { CREATE ROLE}
  
-- 对于阶段
  { READ, WRITE }
           
-- 对于UDF
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
-- 向用户授予角色
GRANT ROLE <role_name> TO <user_name>

-- 向角色授予角色
GRANT ROLE <role_name> TO ROLE <role_name>
```

### 授予所有权

```sql
-- 将数据库中特定表的所有权授予角色
GRANT OWNERSHIP ON <database_name>.<table_name> TO ROLE '<role_name>'

-- 将阶段的所有权授予角色
GRANT OWNERSHIP ON STAGE <stage_name> TO ROLE '<role_name>'

-- 将用户定义函数(UDF)的所有权授予角色
GRANT OWNERSHIP ON UDF <udf_name> TO ROLE '<role_name>'
```

## 示例

### 示例1：向用户授予权限

创建用户：
```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
```

向用户`user1`授予`default`数据库中所有现有表的`ALL`权限：
 
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

向用户`user1`授予所有数据库的`ALL`权限：

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

向用户`user1`授予名为`s1`的阶段的`ALL`权限：

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

向用户`user1`授予名为`f1`的UDF的`ALL`权限：

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

### 示例2：向角色授予权限

向角色`role1`授予`mydb`数据库中所有现有表的`SELECT`权限：

创建角色：
```sql 
CREATE ROLE role1;
```

向角色授予权限：
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

### 示例3：向用户授予角色

用户`user1`的授权为：
```sql
SHOW GRANTS FOR user1;
+-----------------------------------------+
| Grants                                  |
+-----------------------------------------+
| GRANT ALL ON 'default'.* TO 'user1'@'%' |
| GRANT ALL ON *.* TO 'user1'@'%'         |
+-----------------------------------------+
```

角色`role1`的授权为：
```sql
SHOW GRANTS FOR ROLE role1;
+-------------------------------------+
| Grants                              |
+-------------------------------------+
| GRANT SELECT ON 'mydb'.* TO 'role1' |
+-------------------------------------+
```

向用户`user1`授予角色`role1`：
```sql
 GRANT ROLE role1 TO user1;
```

现在，用户`user1`的授权为：
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

### 示例4：向角色授予所有权

```sql
-- 将'finance_data'数据库中所有表的所有权授予角色'data_owner'
GRANT OWNERSHIP ON finance_data.* TO ROLE 'data_owner';

-- 将'finance_data'模式中'transactions'表的所有权授予角色'data_owner'
GRANT OWNERSHIP ON finance_data.transactions TO ROLE 'data_owner';

-- 将'ingestion_stage'阶段的所有权授予角色'data_owner'
GRANT OWNERSHIP ON STAGE ingestion_stage TO ROLE 'data_owner';

-- 将用户定义函数'calculate_profit'的所有权授予角色'data_owner'
GRANT OWNERSHIP ON UDF calculate_profit TO ROLE 'data_owner';
```