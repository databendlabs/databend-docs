```markdown
---
title: 密码策略
---

Databend 包含密码策略，以增强系统安全性并简化用户帐户管理。此策略为创建或更改密码设置了规则，涵盖长度、字符类型、年龄限制、重试次数限制、锁定持续时间和密码历史记录等方面。创建密码策略时，您可以自定义特定规则以满足您的需求。有关密码策略因素的详细列表，请参阅 [密码策略属性](/sql/sql-commands/ddl/password-policy/create-password-policy#password-policy-attributes)。

## 密码策略的工作原理

在 Databend 中，SQL 用户最初没有预定义的密码策略。这意味着在为用户设置或更改密码时，在将密码策略分配给他们之前，没有特定的规则需要遵循。要分配密码策略，您可以使用 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 命令创建一个具有密码策略的新用户，或者使用 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令将现有用户链接到密码策略。请注意，密码策略不适用于通过 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件配置的管理员用户。

当您为具有密码策略的用户设置或更改密码时，Databend 会进行彻底的检查，以确保所选密码符合密码策略定义的规则。将验证以下方面：

:::note
通常，除非用户被分配了内置角色 `account-admin`，否则用户无法更改自己的密码。`account-admin` 用户可以设置或更改所有用户的密码。要更改用户的密码，请使用 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令。
:::

- **复杂性要求**：

  - **最小和最大长度**：验证密码长度是否在定义的范围内。
  - **大写、小写、数字和特殊字符**：确认是否符合特定字符类型要求。

- **密码更改期间的附加检查**：
  - **最短年龄要求**：确保密码不会过于频繁地更改。
  - **历史记录检查**：验证新密码是否与最近的密码重复。

当用户尝试使用密码策略登录时，Databend 会执行必要的检查以增强安全性并规范用户访问。将进行以下验证：

- **连续不正确的密码尝试**：

  - 确保不超过连续不正确密码尝试的限制。
  - 超过限制会导致用户登录被临时锁定。

- **最长年龄要求**：
  - 检查是否超过了最长密码更改间隔。
  - 如果超过了间隔，用户可以在登录后更改密码，并且在更改密码之前无法执行任何其他操作。

## 管理密码策略

Databend 提供了一系列用于管理密码策略的命令。有关更多详细信息，请参阅 [密码策略](/sql/sql-commands/ddl/password-policy/)。

## 使用示例

此示例建立以下密码策略并为用户实施它们：

- `DBA` 用于管理员用户：严格自定义每个密码策略属性。
- `ReadOnlyUser` 用于普通用户：使用默认属性值。

```sql
-- 创建具有自定义属性值的“DBA”密码策略
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

-- 创建具有所有属性的默认值的“ReadOnlyUser”密码策略
CREATE PASSWORD POLICY ReadOnlyUser;

SHOW PASSWORD POLICIES;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     name     │ comment │                                                                                                 options                                                                                                 │
├──────────────┼─────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DBA          │         │ MIN_LENGTH=12, MAX_LENGTH=18, MIN_UPPER_CASE_CHARS=2, MIN_LOWER_CASE_CHARS=2, MIN_NUMERIC_CHARS=2, MIN_SPECIAL_CHARS=1, MIN_AGE_DAYS=1, MAX_AGE_DAYS=30, MAX_RETRIES=3, LOCKOUT_TIME_MINS=30, HISTORY=5 │
│ ReadOnlyUser │         │ MIN_LENGTH=8, MAX_LENGTH=256, MIN_UPPER_CASE_CHARS=1, MIN_LOWER_CASE_CHARS=1, MIN_NUMERIC_CHARS=1, MIN_SPECIAL_CHARS=0, MIN_AGE_DAYS=0, MAX_AGE_DAYS=90, MAX_RETRIES=5, LOCKOUT_TIME_MINS=15, HISTORY=0 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

假设您已经有一个名为“eric”的 DBA 用户，并使用 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令将 DBA 密码策略应用于该用户：

```sql
-- 将“DBA”密码策略应用于用户“eric”
ALTER USER eric WITH SET PASSWORD POLICY = 'DBA';
```

现在，让我们创建一个名为“frank”的新用户，并使用 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 命令应用“ReadOnlyUser”密码策略：

```sql
-- 注意：为用户“frank”设置的密码必须遵守
-- 由关联的“ReadOnlyUser”密码策略定义的约束。
CREATE USER frank IDENTIFIED BY 'Abc12345'
    WITH SET PASSWORD POLICY = 'ReadOnlyUser';
```
