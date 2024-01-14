---
title: 密码策略
---

Databend 包含一个密码策略，以加强系统安全性并使用户账户管理更加顺畅。此策略为创建或更改密码设定了规则，涵盖长度、字符类型、年龄限制、重试限制、锁定时长和密码历史等方面。创建密码策略时，您可以自定义特定规则以满足您的需求。有关密码策略因素的详细列表，请参见[密码策略属性](/sql/sql-commands/ddl/password-policy/create-password-policy#password-policy-attributes)。

## 密码策略的工作原理

在 Databend 中，SQL 用户最初没有预定义的密码策略。这意味着，在为用户设置或更改密码之前，没有特定的规则需要遵循，直到为他们分配了密码策略。要分配密码策略，您可以使用 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 命令创建一个带有密码策略的新用户，或者使用 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令将现有用户链接到密码策略。请注意，密码策略不适用于通过 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件配置的管理员用户。

当您为具有密码策略的用户设置或更改密码时，Databend 会进行彻底检查，以确保所选密码遵循密码策略定义的规则。以下方面将被验证：

:::note
通常，用户不能更改自己的密码，除非他们被分配了内置角色 `account-admin`。`account-admin` 用户可以为所有用户设置或更改密码。要更改用户的密码，请使用 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令。
:::

- **复杂性要求**：
    - **最小和最大长度**：验证密码长度是否在定义的边界内。
    - **大写、小写、数字和特殊字符**：确认是否遵守特定字符类型要求。

- **密码更改期间的额外检查**：
    - **最小年龄要求**：确保密码不会频繁更改。
    - **历史检查**：验证新密码是否复制了最近的密码。

当用户尝试使用密码策略登录时，Databend 执行必要的检查以增强安全性并规范用户访问。以下验证将进行：

- **连续密码输入错误尝试**：
    - 确保连续密码输入错误尝试的次数没有超过限制。
    - 超过限制将导致用户登录被临时锁定。

- **最大年龄要求**：
    - 检查是否超过了密码更改的最大间隔时间。
    - 如果超过了间隔时间，用户将被限制登录，直到密码被更改。

## 管理密码策略

Databend 提供了一系列命令来管理密码策略。更多详情，请参见[密码策略](/sql/sql-commands/ddl/password-policy/)。

## 使用示例

此示例建立了两个密码策略：'DBA' 用于管理员用户，'ReadOnlyUser' 用于只拥有 SELECT 权限的普通用户。

```sql
-- 创建 'DBA' 密码策略，自定义长度和重试设置。其他设置将使用默认值。
CREATE PASSWORD POLICY DBA
    PASSWORD_MIN_LENGTH = 10
    PASSWORD_MAX_LENGTH = 16
    PASSWORD_MAX_RETRIES = 3;

-- 创建 'ReadOnlyUser' 密码策略，所有设置均使用默认值。
CREATE PASSWORD POLICY ReadOnlyUser;

SHOW PASSWORD POLICIES;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     name     │ comment │                                                                                                 options                                                                                                 │
├──────────────┼─────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DBA          │         │ MIN_LENGTH=10, MAX_LENGTH=16, MIN_UPPER_CASE_CHARS=1, MIN_LOWER_CASE_CHARS=1, MIN_NUMERIC_CHARS=1, MIN_SPECIAL_CHARS=0, MIN_AGE_DAYS=0, MAX_AGE_DAYS=90, MAX_RETRIES=3, LOCKOUT_TIME_MINS=15, HISTORY=0 │
│ ReadOnlyUser │         │ MIN_LENGTH=8, MAX_LENGTH=256, MIN_UPPER_CASE_CHARS=1, MIN_LOWER_CASE_CHARS=1, MIN_NUMERIC_CHARS=1, MIN_SPECIAL_CHARS=0, MIN_AGE_DAYS=0, MAX_AGE_DAYS=90, MAX_RETRIES=5, LOCKOUT_TIME_MINS=15, HISTORY=0 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

假设您已经有一个名为 'eric' 的 DBA 用户，并使用 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令将 DBA 密码策略应用于该用户：

```sql
-- 将 'DBA' 密码策略应用于用户 'eric'
ALTER USER eric WITH SET PASSWORD POLICY = 'DBA';
```

现在，让我们创建一个名为 'frank' 的新用户，并使用 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 命令应用 'ReadOnlyUser' 密码策略：

```sql
-- 注意：为用户 'frank' 设置的密码必须遵守与之关联的 'ReadOnlyUser' 密码策略定义的约束。
CREATE USER frank IDENTIFIED BY 'Abc12345'
    WITH SET PASSWORD POLICY = 'ReadOnlyUser';
```