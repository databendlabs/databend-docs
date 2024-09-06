---
title: ALTER USER
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.566"/>

修改用户账户，包括：

- 更改用户的密码和认证类型。
- 设置或取消密码策略。
- 设置或取消网络策略。
- 设置或修改默认角色。如果未明确设置，Databend 将默认使用内置角色 `public` 作为默认角色。

## 语法

```sql
-- 修改密码 / 认证类型
ALTER USER <name> IDENTIFIED [ WITH auth_type ] BY '<new_password>' [ WITH MUST_CHANGE_PASSWORD = true | false ]

-- 要求用户在下次登录时修改密码
ALTER USER <name> WITH MUST_CHANGE_PASSWORD = true

-- 修改当前登录用户的密码
ALTER USER USER() IDENTIFIED BY '<new_password>'

-- 设置密码策略
ALTER USER <name> WITH SET PASSWORD POLICY = '<policy_name>'

-- 取消密码策略
ALTER USER <name> WITH UNSET PASSWORD POLICY

-- 设置网络策略
ALTER USER <name> WITH SET NETWORK POLICY = '<policy_name>'

-- 取消网络策略
ALTER USER <name> WITH UNSET NETWORK POLICY

-- 设置默认角色
ALTER USER <name> WITH DEFAULT_ROLE = '<role_name>'

-- 启用或禁用用户
ALTER USER <name> WITH DISABLED = true | false
```

- *auth_type* 可以是 `double_sha1_password`（默认）、`sha256_password` 或 `no_password`。
- 当 `MUST_CHANGE_PASSWORD` 设置为 `true` 时，用户必须在下次登录时更改密码。请注意，这仅对自账户创建以来从未更改过密码的用户生效。如果用户曾经自行更改过密码，则无需再次更改。
- 当您使用 [CREATE USER](01-user-create-user.md) 或 ALTER USER 为用户设置默认角色时，Databend 不会验证角色的存在或自动将角色授予用户。您必须明确地将角色授予用户，角色才能生效。
- `DISABLED` 允许您启用或禁用用户。被禁用的用户无法登录 Databend，直到他们被启用。点击[此处](01-user-create-user.md#example-5-creating-user-in-disabled-state)查看示例。


## 示例

### 示例 1: 更改密码 & 认证类型

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';

SHOW USERS;
+-----------+----------+----------------------+---------------+
| name      | hostname | auth_type            | is_configured |
+-----------+----------+----------------------+---------------+
| user1     | %        | double_sha1_password | NO            |
+-----------+----------+----------------------+---------------+

ALTER USER user1 IDENTIFIED WITH sha256_password BY '123abc';

SHOW USERS;
+-------+----------+-----------------+---------------+
| name  | hostname | auth_type       | is_configured |
+-------+----------+-----------------+---------------+
| user1 | %        | sha256_password | NO            |
+-------+----------+-----------------+---------------+

ALTER USER 'user1' IDENTIFIED WITH no_password;

show users;
+-------+----------+-------------+---------------+
| name  | hostname | auth_type   | is_configured |
+-------+----------+-------------+---------------+
| user1 | %        | no_password | NO            |
+-------+----------+-------------+---------------+
```

### 示例 2: 设置 & 取消网络策略

```sql
SHOW NETWORK POLICIES;

Name        |Allowed Ip List          |Blocked Ip List|Comment    |
------------+-------------------------+---------------+-----------+
test_policy |192.168.10.0,192.168.20.0|               |new comment|
test_policy1|192.168.100.0/24         |               |           |

CREATE USER user1 IDENTIFIED BY 'abc123';

ALTER USER user1 WITH SET NETWORK POLICY='test_policy';

ALTER USER user1 WITH SET NETWORK POLICY='test_policy1';

ALTER USER user1 WITH UNSET NETWORK POLICY;
```

### 示例 3: 设置默认角色

1. 创建名为 "user1" 的用户，并将其默认角色设置为 "writer"：

```sql title='以 "root" 用户连接:'

root@localhost:8000/default> CREATE USER user1 IDENTIFIED BY 'abc123';

CREATE USER user1 IDENTIFIED BY 'abc123'

0 row written in 0.074 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@localhost:8000/default> GRANT ROLE developer TO user1;

GRANT ROLE developer TO user1

0 row read in 0.018 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@localhost:8000/default> GRANT ROLE writer TO user1;

GRANT ROLE writer TO user1

0 row read in 0.013 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@localhost:8000/default> ALTER USER user1 WITH DEFAULT_ROLE = 'writer';

ALTER user user1 WITH DEFAULT_ROLE = 'writer'

0 row written in 0.019 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)
```

2. 使用 [SHOW ROLES](04-user-show-roles.md) 命令验证 "user1" 用户的默认角色：

```sql title='以 "user1" 用户连接:'
eric@Erics-iMac ~ % bendsql --user user1 --password abc123
Welcome to BendSQL 0.9.3-db6b232(2023-10-26T12:36:55.578667000Z).
Connecting to localhost:8000 as user user1.
Connected to DatabendQuery v1.2.271-nightly-0598a77b9c(rust-1.75.0-nightly-2023-12-26T11:29:04.266265000Z)

user1@localhost:8000/default> show roles;

SHOW roles

┌───────────────────────────────────────────────────────┐
│    name   │ inherited_roles │ is_current │ is_default │
│   String  │      UInt64     │   Boolean  │   Boolean  │
├───────────┼─────────────────┼────────────┼────────────┤
│ developer │               0 │ false      │ false      │
│ public    │               0 │ false      │ false      │
│ writer    │               0 │ true       │ true       │
└───────────────────────────────────────────────────────┘
3 rows read in 0.010 sec. Processed 0 rows, 0 B (0 rows/s, 0 B/s)
```