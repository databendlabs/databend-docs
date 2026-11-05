---
title: SHOW USERS
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

列出当前会话可见的 SQL 用户。

## 可见性

`SHOW USERS` 和直接查询 `system.users` 使用相同的可见性规则：

- 具有全局 `GRANT` 权限的会话可以列出租户内的所有用户。
- 其他会话只能看到与当前用户的用户名和 hostname 均匹配的账户。用户名相同但 hostname 不同的其他账户不可见。
- 配置文件中的用户也遵循相同的身份过滤规则。这类用户的 hostname 为 `%`。

此过滤同样适用于 Databend Cloud 中的 SQL 会话。列表不完整不代表其他用户已被删除。

## 语法

```sql
SHOW USERS
```

## 示例

请使用具有全局 `GRANT` 权限的管理会话运行此示例，才能看到示例输出中的两个用户。

```sql
CREATE NETWORK POLICY my_network_policy ALLOWED_IP_LIST=('192.168.100.0/24');

CREATE PASSWORD POLICY my_password_policy
    PASSWORD_MIN_LENGTH = 12
    PASSWORD_MAX_LENGTH = 24
    PASSWORD_MIN_UPPER_CASE_CHARS = 2
    PASSWORD_MIN_LOWER_CASE_CHARS = 2
    PASSWORD_MIN_NUMERIC_CHARS = 2
    PASSWORD_MIN_SPECIAL_CHARS = 2
    PASSWORD_MIN_AGE_DAYS = 1
    PASSWORD_MAX_AGE_DAYS = 30
    PASSWORD_MAX_RETRIES = 3
    PASSWORD_LOCKOUT_TIME_MINS = 30
    PASSWORD_HISTORY = 5
    COMMENT = 'test comment';

CREATE USER eric IDENTIFIED BY '123ABCabc$$123' WITH SET PASSWORD POLICY='my_password_policy', SET NETWORK POLICY='my_network_policy';

SHOW USERS;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  name  │ hostname │       auth_type      │ is_configured │  default_role │     roles     │ disabled │   network_policy  │   password_policy  │ must_change_password │
├────────┼──────────┼──────────────────────┼───────────────┼───────────────┼───────────────┼──────────┼───────────────────┼────────────────────┼──────────────────────┤
│ eric   │ %        │ double_sha1_password │ NO            │               │               │ false    │ my_network_policy │ my_password_policy │ NULL                 │
│ root   │ %        │ no_password          │ YES           │ account_admin │ account_admin │ false    │ NULL              │ NULL               │ NULL                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```