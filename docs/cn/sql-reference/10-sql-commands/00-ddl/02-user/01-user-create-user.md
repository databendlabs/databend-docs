---
title: 创建用户
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.339"/>

创建一个SQL用户，提供用户的名称、认证类型和密码等详细信息。可选地，您可以为用户设置密码策略、网络策略和默认角色。

另见：

 - [创建密码策略](../12-password-policy/create-password-policy.md)
 - [创建网络策略](../12-network-policy/ddl-create-policy.md)
 - [授权](10-grant.md)

## 语法

```sql
CREATE [ OR REPLACE ] USER <name> IDENTIFIED [ WITH <auth_type> ] BY '<password>' 
[ WITH SET PASSWORD POLICY = '<policy_name>' ] -- 设置密码策略
[ WITH SET NETWORK POLICY = '<policy_name>' ] -- 设置网络策略
[ WITH DEFAULT_ROLE = '<role_name>' ] -- 设置默认角色
```

- *auth_type* 可以是 `double_sha1_password`（默认）、`sha256_password` 或 `no_password`。
- 使用 CREATE USER 或 [ALTER USER](03-user-alter-user.md) 为用户设置默认角色时，Databend 不会验证角色的存在或自动将角色授予用户。您必须明确地将角色授予用户，角色才会生效。

## 示例

### 示例 1：使用默认 auth_type 创建用户

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';

SHOW USERS;
+-----------+----------+----------------------+---------------+
| name      | hostname | auth_type            | is_configured |
+-----------+----------+----------------------+---------------+
| user1     | %        | double_sha1_password | NO            |
+-----------+----------+----------------------+---------------+
```

### 示例 2：使用 sha256_password auth_type 创建用户

```sql
CREATE USER user1 IDENTIFIED WITH sha256_password BY 'abc123';

SHOW USERS;
+-----------+----------+----------------------+---------------+
| name      | hostname | auth_type            | is_configured |
+-----------+----------+----------------------+---------------+
| user1     | %        | sha256_password      | NO            |
+-----------+----------+----------------------+---------------+
```

### 示例 3：创建带有网络策略的用户

```sql
CREATE USER user1 IDENTIFIED BY 'abc123' WITH SET NETWORK POLICY='test_policy';

SHOW USERS;
+-----------+----------+----------------------+---------------+
| name      | hostname | auth_type            | is_configured |
+-----------+----------+----------------------+---------------+
| user1     | %        | double_sha1_password | NO            |
+-----------+----------+----------------------+---------------+
```

### 示例 4：创建带有默认角色的用户

1. 创建一个名为 'user1' 的用户，将默认角色设置为 'manager'：

```sql title='以用户 "root" 连接：'
SHOW ROLES;

┌───────────────────────────────────────────────────────────┐
│      name     │ inherited_roles │ is_current │ is_default │
│     String    │      UInt64     │   Boolean  │   Boolean  │
├───────────────┼─────────────────┼────────────┼────────────┤
│ account_admin │               0 │ true       │ true       │
│ developer     │               0 │ false      │ false      │
│ public        │               0 │ false      │ false      │
└───────────────────────────────────────────────────────────┘

CREATE USER user1 IDENTIFIED BY 'abc123' WITH DEFAULT_ROLE = 'manager';

GRANT ROLE developer TO user1;
```

2. 使用 [SHOW ROLES](04-user-show-roles.md) 命令验证用户 "user1" 的默认角色：

```sql title='以用户 "user1" 连接：'
eric@Erics-iMac ~ % bendsql --user user1 --password abc123
欢迎使用 BendSQL 0.9.3-db6b232(2023-10-26T12:36:55.578667000Z)。
正在连接到 localhost:8000 作为用户 user1。
已连接到 DatabendQuery v1.2.271-nightly-0598a77b9c(rust-1.75.0-nightly-2023-12-26T11:29:04.266265000Z)

user1@localhost:8000/default> SHOW ROLES;

SHOW ROLES

┌───────────────────────────────────────────────────────┐
│    name   │ inherited_roles │ is_current │ is_default │
│   String  │      UInt64     │   Boolean  │   Boolean  │
├───────────┼─────────────────┼────────────┼────────────┤
│ developer │               0 │ true       │ true       │
│ public    │               0 │ false      │ false      │
└───────────────────────────────────────────────────────┘
2 行在 0.015 秒内读取。处理了 0 行，0 B (0 行/秒，0 B/秒)
```