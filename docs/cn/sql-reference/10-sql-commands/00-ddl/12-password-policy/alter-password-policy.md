---
title: ALTER PASSWORD POLICY
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.283"/>

修改Databend中现有的密码策略。

## 语法

```sql
-- 修改现有密码策略属性
ALTER PASSWORD POLICY [ IF EXISTS ] <name> SET
    [ PASSWORD_MIN_LENGTH = <number> ]
    [ PASSWORD_MAX_LENGTH = <number> ]
    [ PASSWORD_MIN_UPPER_CASE_CHARS = <number> ]
    [ PASSWORD_MIN_LOWER_CASE_CHARS = <number> ]
    [ PASSWORD_MIN_NUMERIC_CHARS = <number> ]
    [ PASSWORD_MIN_SPECIAL_CHARS = <number> ]
    [ PASSWORD_MIN_AGE_DAYS = <number> ]
    [ PASSWORD_MAX_AGE_DAYS = <number> ]
    [ PASSWORD_MAX_RETRIES = <number> ]
    [ PASSWORD_LOCKOUT_TIME_MINS = <number> ]
    [ PASSWORD_HISTORY = <number> ]
    [ COMMENT = '<comment>' ]

-- 移除特定密码策略属性
ALTER PASSWORD POLICY [ IF EXISTS ] <name> UNSET
    [ PASSWORD_MIN_LENGTH ]
    [ PASSWORD_MAX_LENGTH ]
    [ PASSWORD_MIN_UPPER_CASE_CHARS ]
    [ PASSWORD_MIN_LOWER_CASE_CHARS ]
    [ PASSWORD_MIN_NUMERIC_CHARS ]
    [ PASSWORD_MIN_SPECIAL_CHARS ]
    [ PASSWORD_MIN_AGE_DAYS ]
    [ PASSWORD_MAX_AGE_DAYS ]
    [ PASSWORD_MAX_RETRIES ]
    [ PASSWORD_LOCKOUT_TIME_MINS ]
    [ PASSWORD_HISTORY ]
    [ COMMENT ]
```

有关密码策略属性的详细描述，请参阅[密码策略属性](create-password-policy.md#password-policy-attributes)。

## 示例

此示例创建了一个名为'SecureLogin'的密码策略，要求最小密码长度为10个字符，随后更新为允许密码长度在10到16个字符之间：

```sql
CREATE PASSWORD POLICY SecureLogin
    PASSWORD_MIN_LENGTH = 10;


ALTER PASSWORD POLICY SecureLogin SET
    PASSWORD_MIN_LENGTH = 10
    PASSWORD_MAX_LENGTH = 16;
```