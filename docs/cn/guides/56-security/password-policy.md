---
title: 密码策略
---

Databend 包含一个密码策略，以加强系统安全性并使用户账户管理更加顺畅。该策略为创建或更改密码设定了规则，涵盖长度、字符类型、年龄限制、重试次数、锁定时长及密码历史等方面。在制定密码策略时，您可以根据需要自定义具体规则。关于密码策略因素的详细列表，请参阅 [密码策略属性](/sql/sql-commands/ddl/password-policy/create-password-policy#密码策略属性)。

## 密码策略的工作原理

在 Databend 中，SQL 用户最初没有预设的密码策略。这意味着在为用户分配密码策略之前，设置或更改用户密码时无需遵循特定规则。要分配密码策略，您可以使用 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 命令创建带有密码策略的新用户，或使用 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令将现有用户与密码策略关联。请注意，通过 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件配置的管理员用户不适用于密码策略。

当您为具有密码策略的用户设置或更改密码时，Databend 会进行全面检查，确保所选密码遵循密码策略定义的规则。以下方面将得到验证：

:::note
通常，用户无法更改自己的密码，除非他们被分配了内置角色 `account-admin`。一个 `account-admin` 用户可以为所有用户设置或更改密码。要更改用户密码，请使用 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令。
:::

- **复杂性要求**：
    - **最小和最大长度**：验证密码长度是否在定义的范围内。
    - **大写、小写、数字和特殊字符**：确认是否符合特定字符类型要求。

- **更改密码时的额外检查**：
    - **最小年龄要求**：确保密码不会过于频繁地更改。
    - **历史检查**：验证新密码是否未重复近期使用的密码。

当用户尝试使用密码策略登录时，Databend 会执行必要的检查以增强安全性并规范用户访问。以下验证将进行：

- **连续错误密码尝试次数**：
    - 确保未超过连续错误密码尝试的限制。
    - 超出限制将导致用户登录暂时锁定。

- **最大年龄要求**：
    - 检查是否超过了密码更改的最大间隔。
    - 如果间隔已过，用户将被限制登录，直到密码更改。

## 管理密码策略

Databend 提供了一系列用于管理密码策略的命令。更多详情，请参阅 [密码策略](/sql/sql-commands/ddl/password-policy/)。

## 使用示例

本示例建立了以下密码策略，并将其应用于用户：

- `DBA` 针对管理员用户：严格自定义每个密码策略属性。
- `ReadOnlyUser` 针对普通用户：使用默认属性值。

```sql
-- 创建具有自定义属性值的 'DBA' 密码策略
CREATE PASSWORD POLICY DBA
    PASSWORD_MIN_LENGTH = 12
    PASSWORD_MAX_LENGTH = 18
    PASSWORD_MIN_UPPER_CASE_CHARS = 2
    PASSWORD_MIN_LOWER_CASE_CHARS = 2
    PASSWORD_MIN_NUMERIC_CHARS = 2
    PASSWORD_MIN_SPECIAL_CHARS = 1
    PASSWORD_MIN_AGE_DAYS = 1
    PASSWORD_MAX_AGE_DAYS = 30
    PASSWORD_MAX_RETRIES = 3
    PASSWORD_LOCKOUT_TIME_MINS = 30
    PASSWORD_HISTORY = 5;

-- 创建具有所有属性默认值的 'ReadOnlyUser' 密码策略
CREATE PASSWORD POLICY ReadOnlyUser;

SHOW PASSWORD POLICIES;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     name     │ comment │                                                                                                 options                                                                                                 │
├──────────────┼─────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DBA          │         │ MIN_LENGTH=12, MAX_LENGTH=18, MIN_UPPER_CASE_CHARS=2, MIN_LOWER_CASE_CHARS=2, MIN_NUMERIC_CHARS=2, MIN_SPECIAL_CHARS=1, MIN_AGE_DAYS=1, MAX_AGE_DAYS=30, MAX_RETRIES=3, LOCKOUT_TIME_MINS=30, HISTORY=5 │
│ ReadOnlyUser │         │ MIN_LENGTH=8, MAX_LENGTH=256, MIN_UPPER_CASE_CHARS=1, MIN_LOWER_CASE_CHARS=1, MIN_NUMERIC_CHARS=1, MIN_SPECIAL_CHARS=0, MIN_AGE_DAYS=0, MAX_AGE_DAYS=90, MAX_RETRIES=5, LOCKOUT_TIME_MINS=15, HISTORY=0 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

假设您已有一个名为 'eric' 的 DBA 用户，并使用 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令将 DBA 密码策略应用于该用户：

```sql
-- 将 'DBA' 密码策略应用于用户 'eric'
ALTER USER eric WITH SET PASSWORD POLICY = 'DBA';
```

现在，让我们创建一个名为 'frank' 的新用户，并使用 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 命令应用 'ReadOnlyUser' 密码策略：

```sql
-- 注意：为 'frank' 用户设置的密码必须遵守关联的 'ReadOnlyUser' 密码策略定义的约束。
CREATE USER frank IDENTIFIED BY 'Abc12345'
    WITH SET PASSWORD POLICY = 'ReadOnlyUser';
```