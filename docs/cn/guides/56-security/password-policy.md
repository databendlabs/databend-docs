---
title: 密码策略
---

密码策略限定 Databend 密码的强度（长度、字符组合、历史、重试次数、锁定时间等）和修改节奏，让每一次 `CREATE USER` 或改密都更可控。完整参数请参阅 [密码策略属性](/sql/sql-commands/ddl/password-policy/create-password-policy#password-policy-attributes)。

## 工作方式

- SQL 用户默认不带密码策略。可以在 `CREATE USER ... WITH SET PASSWORD POLICY` 时绑定，也可稍后通过 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 补充。通过 [`databend-query.toml`](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 声明的管理员账号不受此策略约束。
- 对绑定策略的用户设置或修改密码时，Databend 会校验复杂度（长度+字符类型），并在改密时检查最短间隔以及最近密码历史。
- 登录阶段还会根据 `PASSWORD_MAX_RETRIES` 与 `PASSWORD_LOCKOUT_TIME_MINS` 统计失败次数并自动锁定账号，密码超过 `PASSWORD_MAX_AGE_DAYS` 则只允许先改密再继续操作。

:::note
除非授予内置角色 `account-admin`，普通用户无法自行改密；`account-admin` 可以使用 `ALTER USER ... IDENTIFIED BY ...` 为任意用户重置密码。
:::

## 操作示例

下列示例演示如何为管理员与分析师定义策略、绑定至用户，并在后续集中调整或清理。

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

### 2. 绑定到不同角色的用户

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

### 4. 集中更新并复用策略

借助 [ALTER PASSWORD POLICY](/sql/sql-commands/ddl/password-policy/alter-password-policy) 可以一次性提升所有关联用户的要求：

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

策略与用户解耦，修改策略即可让所有引用它的用户立即拿到新规则。

### 5. 解绑并清理

```sql
ALTER USER analyst_zoe WITH UNSET PASSWORD POLICY;
DROP PASSWORD POLICY analyst_policy;
```

删除策略前务必先解除所有用户的绑定，否则命令会被拒绝。

---

更多语法说明请参阅 [密码策略 SQL 参考](/sql/sql-commands/ddl/password-policy/)，涵盖 `CREATE`、`ALTER`、`SHOW`、`DESC` 和 `DROP`。
