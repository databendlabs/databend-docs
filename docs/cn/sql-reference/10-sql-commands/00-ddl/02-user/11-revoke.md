---
title: REVOKE
sidebar_position: 11
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.845"/>

撤销特定数据库对象的权限、角色和所有权。 这包括：

- 撤销用户或角色的权限。
- 从用户或其他角色中删除角色。

参见：

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

-- For MASKING POLICY
  { CREATE MASKING POLICY | APPLY MASKING POLICY }
```

```sql
privileges_level ::=
    *.*
  | db_name.*
  | db_name.tbl_name
  | STAGE <stage_name>
  | UDF <udf_name>
  | MASKING POLICY <policy_name>
```

### 撤销脱敏策略权限

```sql
REVOKE APPLY ON MASKING POLICY <policy_name> FROM [ ROLE ] <grantee>
REVOKE ALL [ PRIVILEGES ] ON MASKING POLICY <policy_name> FROM [ ROLE ] <grantee>
REVOKE OWNERSHIP ON MASKING POLICY <policy_name> FROM ROLE '<role_name>'
```

以上语句用于撤销针对特定脱敏策略的 APPLY 或 OWNERSHIP 权限。若需撤销全局 `CREATE MASKING POLICY` 或 `APPLY MASKING POLICY`，可结合 `ON *.*` 使用标准语法。

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

撤销用户 `user1` 的 `INSERT` 权限：
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

授予角色权限：
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

撤销角色 `role1` 的 `INSERT` 权限：
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

### 示例 4：撤销脱敏策略权限

```sql
-- 撤销针对单个脱敏策略的 APPLY 权限
REVOKE APPLY ON MASKING POLICY email_mask FROM ROLE pii_readers;

-- 撤销角色在整个账号范围创建脱敏策略的权限
REVOKE CREATE MASKING POLICY ON *.* FROM ROLE security_admin;
```
