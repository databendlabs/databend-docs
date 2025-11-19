---
title: GRANT
sidebar_position: 9
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.845"/>

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

### 授予脱敏策略权限

要针对某个脱敏策略授予权限，可使用以下语句：

```sql
GRANT APPLY ON MASKING POLICY <policy_name> TO [ ROLE ] <grantee>
GRANT ALL [ PRIVILEGES ] ON MASKING POLICY <policy_name> TO [ ROLE ] <grantee>
GRANT OWNERSHIP ON MASKING POLICY <policy_name> TO ROLE '<role_name>'
```

- `CREATE MASKING POLICY` 允许创建策略。
- `APPLY MASKING POLICY`（全局）允许在任意表上设置/解除、描述或删除任何脱敏策略。
- `GRANT APPLY ON MASKING POLICY ...` 可针对单个策略授权，避免授予全局访问。
- OWNERSHIP 赋予对策略的完全控制权。创建脱敏策略后，Databend 会自动将 OWNERSHIP 授予当前角色，并在策略删除时回收。

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

### Example 5: Granting Masking Policy Privileges

```sql
-- 授权角色创建脱敏策略
GRANT CREATE MASKING POLICY ON *.* TO ROLE security_admin;

-- 在 security_admin 角色下创建策略
CREATE MASKING POLICY email_mask AS (val STRING) RETURNS STRING -> '***';

-- 仅允许 pii_readers 角色在表列上应用该策略
GRANT APPLY ON MASKING POLICY email_mask TO ROLE pii_readers;

-- 查看策略的授权情况
SHOW GRANTS ON MASKING POLICY email_mask;
```
