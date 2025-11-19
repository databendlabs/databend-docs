---
title: 密码策略
---

密码策略用于定义 Databend 密码的强度要求（如长度、字符组合、历史记录、重试限制等）以及密码的更换频率。它为每一次创建用户 (`CREATE USER`) 和修改密码的操作提供了可预期的安全保障。有关属性的完整列表，请参阅 [密码策略属性](/sql/sql-commands/ddl/password-policy/create-password-policy#password-policy-attributes)。

## 工作方式

- SQL 用户默认不关联任何密码策略。您可以在创建用户时 (`CREATE USER ... WITH SET PASSWORD POLICY`) 指定策略，也可以稍后通过 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 进行关联。请注意，通过 [`databend-query.toml`](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 声明的管理员账号不受此策略约束。
- 当受策略管理的用户设置或修改密码时，Databend 会验证密码是否符合复杂度规则（长度和字符组合）。对于修改密码的操作，还会强制检查密码的最短使用期限和历史记录。
- 在登录时，Databend 会根据 `PASSWORD_MAX_RETRIES` 和 `PASSWORD_LOCKOUT_TIME_MINS` 跟踪失败尝试次数并锁定账号；同时，如果密码超过 `PASSWORD_MAX_AGE_DAYS`，系统会将其标记为过期。过期用户登录后只能进行修改密码操作。

:::note
普通用户通常无法自行修改密码，除非他们拥有内置的 `account-admin` 角色。`account-admin` 可以运行 `ALTER USER ... IDENTIFIED BY ...` 来为任何用户轮换密码。
:::

## 操作示例

本示例将演示如何为管理员和分析师创建专用策略，将其绑定到用户，以及后续如何修改或移除这些策略。

### 1. 创建并查看策略

```sql
CREATE PASSWORD POLICY dba_policy
    PASSWORD_MIN_LENGTH = 12
    PASSWORD_MAX_LENGTH = 18
    PASSWORD_MIN_UPPER_CASE_CHARS = 2
    PASSWORD_MIN_LOWER_CASE_CHARS = 2
    PASSWORD_MIN_NUMERIC_CHARS = 2
    PASSWORD_MIN_SPECIAL_CHARS = 1
    PASSWORD_MIN_AGE_DAYS = 1
    PASSWORD_MAX_AGE_DAYS = 45
    PASSWORD_MAX_RETRIES = 3
    PASSWORD_LOCKOUT_TIME_MINS = 30
    PASSWORD_HISTORY = 5
    COMMENT='Strict controls for DBAs';

CREATE PASSWORD POLICY analyst_policy
    COMMENT='Defaults for analysts';

SHOW PASSWORD POLICIES;

┌─────────────────┬───────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ name            │ comment                       │ options                                                                                                                             │
├─────────────────┼───────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ analyst_policy  │ Defaults for analysts         │ MIN_LENGTH=8, MAX_LENGTH=256, MIN_UPPER_CASE_CHARS=1, MIN_LOWER_CASE_CHARS=1, MIN_NUMERIC_CHARS=1, MIN_SPECIAL_CHARS=0, ... HISTORY=0        │
│ dba_policy      │ Strict controls for DBAs      │ MIN_LENGTH=12, MAX_LENGTH=18, MIN_UPPER_CASE_CHARS=2, MIN_LOWER_CASE_CHARS=2, MIN_NUMERIC_CHARS=2, MIN_SPECIAL_CHARS=1, ... HISTORY=5       │
└─────────────────┴───────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2. 绑定策略到用户

```sql
CREATE USER dba_jane IDENTIFIED BY 'Str0ngPass123!' WITH SET PASSWORD POLICY='dba_policy';

CREATE USER analyst_mike IDENTIFIED BY 'Abc12345'
    WITH SET PASSWORD POLICY='analyst_policy';

CREATE USER analyst_zoe IDENTIFIED BY 'Byt3Crush!';
ALTER USER analyst_zoe WITH SET PASSWORD POLICY='analyst_policy';
```

### 3. 验证绑定结果

```sql
DESC USER dba_jane;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  name   │ hostname │       auth_type      │ default_role │ roles │ disabled │ network_policy │ password_policy │ must_change_password │
├─────────┼──────────┼──────────────────────┼──────────────┼───────┼──────────┼────────────────┼─────────────────┼──────────────────────┤
│ dba_jane│ %        │ double_sha1_password │              │       │ false    │                │ dba_policy      │ NULL                 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

DESC PASSWORD POLICY dba_policy;

Name       |Comment                     |Options
-----------+----------------------------+---------------------------------------------------------------------------------------------------------------------------------+
dba_policy |Strict controls for DBAs    |MIN_LENGTH=12,MAX_LENGTH=18,MIN_UPPER_CASE_CHARS=2,MIN_LOWER_CASE_CHARS=2,MIN_NUMERIC_CHARS=2,MIN_SPECIAL_CHARS=1,...,HISTORY=5   |
```

### 4. 集中更新策略

使用 [ALTER PASSWORD POLICY](/sql/sql-commands/ddl/password-policy/alter-password-policy) 可以收紧规则，而无需逐个修改用户：

```sql
ALTER PASSWORD POLICY analyst_policy SET
    PASSWORD_MIN_SPECIAL_CHARS = 1
    PASSWORD_MAX_AGE_DAYS = 60
    COMMENT='Analysts need specials now';

DESC PASSWORD POLICY analyst_policy;

Name           |Comment                      |Options
---------------+-----------------------------+------------------------------------------------------------------------------------------------------------------------+
analyst_policy |Analysts need specials now   |MIN_LENGTH=8,MAX_LENGTH=256,MIN_UPPER_CASE_CHARS=1,MIN_LOWER_CASE_CHARS=1,MIN_NUMERIC_CHARS=1,MIN_SPECIAL_CHARS=1,...    |
```

所有引用 `analyst_policy` 的用户现在都会自动继承更严格的密码组合规则和过期时间设置。

### 5. 解绑并清理

```sql
ALTER USER analyst_zoe WITH UNSET PASSWORD POLICY;
DROP PASSWORD POLICY analyst_policy;
```

Databend 禁止删除正在使用中的策略；在执行 `DROP PASSWORD POLICY` 之前，请先解除该策略与所有用户的关联。

---

有关完整语法，请参阅 [密码策略 SQL 参考](/sql/sql-commands/ddl/password-policy/)，其中涵盖了 `CREATE`、`ALTER`、`SHOW`、`DESC` 和 `DROP`。
