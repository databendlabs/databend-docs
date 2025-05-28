---
title: CREATE USER
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.703"/>

创建 SQL 用户。

另请参阅:

 - [CREATE PASSWORD POLICY](../12-password-policy/create-password-policy.md)
 - [CREATE NETWORK POLICY](../12-network-policy/ddl-create-policy.md)
 - [GRANT](10-grant.md)

## 语法

```sql
CREATE [ OR REPLACE ] USER <name> IDENTIFIED [ WITH <auth_type> ] BY '<password>' 
[ WITH MUST_CHANGE_PASSWORD = true | false ]
[ WITH SET PASSWORD POLICY = '<policy_name>' ] -- 设置密码策略
[ WITH SET NETWORK POLICY = '<policy_name>' ] -- 设置网络策略
[ WITH SET WORKLOAD GROUP = '<workload_group_name>' ] -- 设置工作负载组
[ WITH DEFAULT_ROLE = '<role_name>' ] -- 设置默认角色
[ WITH DISABLED = true | false ] -- 用户创建时处于禁用状态
```

- `<name>` 不能包含以下非法字符:
    - 单引号 (')
    - 双引号 (")
    - 退格符 (\b)
    - 换页符 (\f)
- *auth_type* 可以是 `double_sha1_password` (默认)、`sha256_password` 或 `no_password`。
- 当 `MUST_CHANGE_PASSWORD` 设置为 `true` 时，新用户必须在首次登录时更改密码。用户可以使用 [ALTER USER](03-user-alter-user.md) 命令更改自己的密码。
- 当您使用 CREATE USER 或 [ALTER USER](03-user-alter-user.md) 为用户设置默认角色时，Databend 不会验证角色是否存在，也不会自动将角色授予用户。您必须显式地将角色授予用户，角色才能生效。
- 当 `DISABLED` 设置为 `true` 时，新用户将以禁用状态创建。处于此状态的用户无法登录 Databend，直到被启用。要启用或禁用已创建的用户，请使用 [ALTER USER](03-user-alter-user.md) 命令。

## 示例

### 示例 1: 使用默认 auth_type 创建用户

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';

SHOW USERS;
+-----------+----------+----------------------+---------------+
| name      | hostname | auth_type            | is_configured |
+-----------+----------+----------------------+---------------+
| user1     | %        | double_sha1_password | NO            |
+-----------+----------+----------------------+---------------+
```

### 示例 2: 使用 sha256_password auth_type 创建用户

```sql
CREATE USER user1 IDENTIFIED WITH sha256_password BY 'abc123';

SHOW USERS;
+-----------+----------+----------------------+---------------+
| name      | hostname | auth_type            | is_configured |
+-----------+----------+----------------------+---------------+
| user1     | %        | sha256_password      | NO            |
+-----------+----------+----------------------+---------------+
```

### 示例 3: 创建带有网络策略的用户

```sql
CREATE USER user1 IDENTIFIED BY 'abc123' WITH SET NETWORK POLICY='test_policy';

SHOW USERS;
+-----------+----------+----------------------+---------------+
| name      | hostname | auth_type            | is_configured |
+-----------+----------+----------------------+---------------+
| user1     | %        | double_sha1_password | NO            |
+-----------+----------+----------------------+---------------+
```

### 示例 4: 创建带有默认角色的用户

1. 创建名为 'user1' 的用户，默认角色设置为 'manager':

```sql title='以用户 "root" 身份连接:'
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

2. 使用 [SHOW ROLES](04-user-show-roles.md) 命令验证用户 "user1" 的默认角色:

```sql title='以用户 "user1" 身份连接:'
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

### 示例 5: 创建处于禁用状态的用户

此示例创建名为 'u1' 的用户，该用户处于禁用状态，无法登录。使用 [ALTER USER](03-user-alter-user.md) 命令启用用户后，登录访问权限将恢复。

1. 创建处于禁用状态的用户 'u1':

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

2. 尝试使用 BendSQL 以用户 'u1' 连接到 Databend，结果出现身份验证错误：

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

4. 重新尝试以用户 'u1' 连接到 Databend，确认登录访问成功：

```shell
➜  ~ bendsql --user u1 --password 123
Welcome to BendSQL 0.16.0-homebrew.
Connecting to localhost:8000 as user u1.
Connected to Databend Query v1.2.424-nightly-d3a89f708d(rust-1.77.0-nightly-2024-04-17T22:11:59.304509266Z)
```

### 示例 6：创建带有 MUST_CHANGE_PASSWORD 的用户

在此示例中，我们将创建一个带有 `MUST_CHANGE_PASSWORD` 选项的用户。然后，我们将使用 BendSQL 以新用户身份连接到 Databend 并更改密码。

1. 创建一个名为 'eric' 的新用户，并将 `MUST_CHANGE_PASSWORD` 选项设置为 `TRUE`。

```sql
CREATE USER eric IDENTIFIED BY 'abc123' WITH MUST_CHANGE_PASSWORD = TRUE;
```

2. 启动 BendSQL 并以新用户身份连接到 Databend。连接后，您将看到一条消息，指示需要更改密码。

```bash
MacBook-Air:~ eric$ bendsql -ueric -pabc123
```

3. 使用 [ALTER USER](03-user-alter-user.md) 命令更改密码。

```bash
eric@localhost:8000/default> ALTER USER USER() IDENTIFIED BY 'abc456';
```

4. 退出 BendSQL，然后使用新密码重新连接。

```bash
MacBook-Air:~ eric$ bendsql -ueric -pabc456
Welcome to BendSQL 0.19.2-1e338e1(2024-07-17T09:02:28.323121000Z).
Connecting to localhost:8000 as user eric.
Connected to Databend Query v1.2.567-nightly-78d41aedc7(rust-1.78.0-nightly-2024-07-14T22:10:13.777450105Z)

eric@localhost:8000/default>
```