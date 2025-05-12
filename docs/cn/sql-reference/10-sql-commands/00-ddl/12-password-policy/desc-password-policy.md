---
title: DESC PASSWORD POLICY
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.283"/>

显示 Databend 中特定密码策略的详细信息。有关密码策略属性的详细说明，请参阅 [密码策略属性](create-password-policy.md#password-policy-attributes)。

## 语法

```sql
DESC PASSWORD POLICY <policy_name>
```

## 示例

```sql
CREATE PASSWORD POLICY SecureLogin
    PASSWORD_MIN_LENGTH = 10;

DESC PASSWORD POLICY SecureLogin;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│            Property           │    Value    │      Default     │                                                                 Description                                                                │
├───────────────────────────────┼─────────────┼──────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ NAME                          │ SecureLogin │ NULL             │ 密码策略的名称。                                                                                                                   │
│ COMMENT                       │             │ NULL             │ 密码策略的注释。                                                                                                                │
│ PASSWORD_MIN_LENGTH           │ 10          │ 8                │ 新密码的最小长度。                                                                                                            │
│ PASSWORD_MAX_LENGTH           │ 256         │ 256              │ 新密码的最大长度。                                                                                                            │
│ PASSWORD_MIN_UPPER_CASE_CHARS │ 1           │ 1                │ 新密码中大写字符的最小数量。                                                                                                                   │
│ PASSWORD_MIN_LOWER_CASE_CHARS │ 1           │ 1                │ 新密码中小写字符的最小数量。                                                                                                                   │
│ PASSWORD_MIN_NUMERIC_CHARS    │ 1           │ 1                │ 新密码中数字字符的最小数量。                                                                                                                     │
│ PASSWORD_MIN_SPECIAL_CHARS    │ 0           │ 0                │ 新密码中特殊字符的最小数量。                                                                                                                     │
│ PASSWORD_MIN_AGE_DAYS         │ 0           │ 0                │ 密码更改后的一段时间内，密码不能再次更改，以天为单位。                                               │
│ PASSWORD_MAX_AGE_DAYS         │ 90          │ 90               │ 密码必须更改的时间段，以天为单位。                                                                                      │
│ PASSWORD_MAX_RETRIES          │ 5           │ 5                │ 用户在帐户被锁定之前尝试输入正确密码的次数。                                                │
│ PASSWORD_LOCKOUT_TIME_MINS    │ 15          │ 15               │ 用户在多次错误输入密码后（由 MAX_RETRIES 指定）将被锁定的时间段，以分钟为单位。 │
│ PASSWORD_HISTORY              │ 0           │ 0                │ 用户不得重复使用的最近密码的数量。                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```