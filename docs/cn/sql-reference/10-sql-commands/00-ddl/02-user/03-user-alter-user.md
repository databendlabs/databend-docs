---
title: 修改用户
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.30"/>

修改用户账户，包括：

- 更改用户的密码和认证类型。
- 设置或取消设置[网络策略](../12-network-policy/index.md)。
- 设置或修改默认角色。如果没有明确设置，默认情况下 Databend 会使用内置角色 `public` 作为默认角色。

## 语法

```sql
-- 修改密码 / 认证类型
ALTER USER <name> IDENTIFIED [WITH auth_type ] BY '<password>'

-- 设置网络策略
ALTER USER <name> WITH SET NETWORK POLICY='<network_policy>'

-- 取消设置网络策略
ALTER USER <name> WITH UNSET NETWORK POLICY

-- 设置默认角色
ALTER USER <name> WITH DEFAULT_ROLE = '<role_name>'
```

- *auth_type* 可以是 `double_sha1_password`（默认）、`sha256_password` 或 `no_password`。
- 当您使用 [CREATE USER](01-user-create-user.md) 或 ALTER USER 为用户设置默认角色时，Databend 不会验证角色的存在或自动授予用户该角色。您必须明确授予用户该角色，角色才能生效。


## 示例

### 示例 1：更改密码和认证类型

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

### 示例 2：设置和取消设置网络策略

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

### 示例 3：设置默认角色

1. 创建一个名为 "user1" 的用户，并将默认角色设置为 "writer"：

```sql title='以用户 "root" 连接：'

root@localhost:8000/default> CREATE USER user1 IDENTIFIED BY 'abc123';

CREATE USER user1 IDENTIFIED BY 'abc123'

0 行在 0.074 秒内写入。处理了 0 行，0 B（0 行/秒，0 B/秒）

root@localhost:8000/default> GRANT ROLE developer TO user1;

GRANT ROLE developer TO user1

0 行在 0.018 秒内读取。处理了 0 行，0 B（0 行/秒，0 B/秒）

root@localhost:8000/default> GRANT ROLE writer TO user1;

GRANT ROLE writer TO user1

0 行在 0.013 秒内读取。处理了 0 行，0 B（0 行/秒，0 B/秒）

root@localhost:8000/default> ALTER USER user1 WITH DEFAULT_ROLE = 'writer';

ALTER user user1 WITH DEFAULT_ROLE = 'writer'

0 行在 0.019 秒内写入。处理了 0 行，0 B（0 行/秒，0 B/秒）
```

2. 使用 [SHOW ROLES](04-user-show-roles.md) 命令验证用户 "user1" 的默认角色：

```sql title='以用户 "user1" 连接：'
eric@Erics-iMac ~ % bendsql --user user1 --password abc123
欢迎使用 BendSQL 0.9.3-db6b232(2023-10-26T12:36:55.578667000Z)。
正在连接到 localhost:8000 作为用户 user1。
已连接到 DatabendQuery v1.2.271-nightly-0598a77b9c(rust-1.75.0-nightly-2023-12-26T11:29:04.266265000Z)

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
3 行在 0.010 秒内读取。处理了 0 行，0 B（0 行/秒，0 B/秒）
```