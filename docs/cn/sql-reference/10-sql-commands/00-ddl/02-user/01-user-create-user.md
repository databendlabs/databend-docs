---
title: 创建用户
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.424"/>

创建一个SQL用户。

相关内容：

 - [创建密码策略](../12-password-policy/create-password-policy.md)
 - [创建网络策略](../12-network-policy/ddl-create-policy.md)
 - [授权](10-grant.md)

## 语法

```sql
CREATE [ OR REPLACE ] USER <name> IDENTIFIED [ WITH <auth_type> ] BY '<password>' 
[ WITH SET PASSWORD POLICY = '<policy_name>' ] -- 设置密码策略
[ WITH SET NETWORK POLICY = '<policy_name>' ] -- 设置网络策略
[ WITH DEFAULT_ROLE = '<role_name>' ] -- 设置默认角色
[ WITH DISABLED = true | false ] -- 用户创建时是否禁用
```

- *auth_type* 可以是 `double_sha1_password`（默认）、`sha256_password` 或 `no_password`。
- 当您使用 CREATE USER 或 [ALTER USER](03-user-alter-user.md) 为用户设置默认角色时，Databend 不会验证角色的存在或自动将角色授予用户。您必须明确地将角色授予用户，该角色才会生效。
- 当 `DISABLED` 设置为 `true` 时，新用户创建时处于禁用状态。处于此状态的用户无法登录 Databend，直到他们被启用。要启用或禁用已创建的用户，请使用 [ALTER USER](03-user-alter-user.md) 命令。

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

1. 创建一个名为 'user1' 的用户，其默认角色设置为 'manager'：

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
Welcome to BendSQL 0.9.3-db6b232(2023-10-26T12:36:55.578667000Z).
Connecting to localhost:8000 as user user1.
Connected to DatabendQuery v1.2.271-nightly-0598a77b9c(rust-1.75.0-nightly-2023-12-26T11:29:04.266265000Z)

user1@localhost:8000/default> SHOW ROLES;

SHOW ROLES

┌───────────────────────────────────────────────────────┐
│    name   │ inherited_roles │ is_current │ is_default │
│   String  │      UInt64     │   Boolean  │   Boolean  │
├───────────┼─────────────────┼────────────┼────────────┤
│ developer │               0 │ true       │ true       │
│ public    │               0 │ false      │ false      │
└───────────────────────────────────────────────────────┘
2 rows read in 0.015 sec. Processed 0 rows, 0 B (0 rows/s, 0 B/s)
```

### 示例 5：创建处于禁用状态的用户

本示例创建一个名为 'u1' 的用户，处于禁用状态，阻止登录访问。使用 [ALTER USER](03-user-alter-user.md) 命令启用用户后，登录访问恢复。

1. 创建一个名为 'u1' 的用户，处于禁用状态：

```sql
CREATE USER u1 IDENTIFIED BY '123' WITH DISABLED = TRUE;

SHOW USERS;

┌─────────────────────────────────────────────────────────────────────────────────────┐
│  name  │ hostname │       auth_type      │ is_configured │  default_role │ disabled │
├────────┼──────────┼──────────────────────┼───────────────┼───────────────┼──────────┤
│ root   │ %        │ no_password          │ YES           │ account_admin │ false    │
│ u1     │ %        │ double_sha1_password │ NO            │               │ true     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

2. 尝试以用户 'u1' 使用 BendSQL 连接 Databend，将导致认证错误：

```shell
➜  ~ bendsql --user u1 --password 123
Welcome to BendSQL 0.16.0-homebrew.
Connecting to localhost:8000 as user u1.
Error: APIError: RequestError: Start Query failed with status 401 Unauthorized: {"error":{"code":"401","message":"AuthenticateFailure: user u1 is disabled. Not allowed to login"}}
```

3. 使用 [ALTER USER](03-user-alter-user.md) 命令启用用户 'u1'：

```sql
ALTER USER u1 WITH DISABLED = FALSE;
```

4. 重新尝试以用户 'u1' 连接 Databend，确认登录访问成功：

```shell
➜  ~ bendsql --user u1 --password 123
Welcome to BendSQL 0.16.0-homebrew.
Connecting to localhost:8000 as user u1.
Connected to Databend Query v1.2.424-nightly-d3a89f708d(rust-1.77.0-nightly-2024-04-17T22:11:59.304509266Z)
```