---
title: 创建密码策略
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.339"/>

在Databend中创建一个新的密码策略。

## 语法

```sql
CREATE [ OR REPLACE ] PASSWORD POLICY [ IF NOT EXISTS ] <policy_name>
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
```

### 密码策略属性

此表总结了密码策略的基本参数，涵盖长度、字符要求、年龄限制、重试限制、锁定持续时间和密码历史等方面：

| 属性                             | 最小值 | 最大值 | 默认值 | 描述                                                                                |
|---------------------------------|-------|-------|-------|------------------------------------------------------------------------------------|
| PASSWORD_MIN_LENGTH             | 8     | 256   | 8     | 密码的最小长度                                                                      |
| PASSWORD_MAX_LENGTH             | 8     | 256   | 256   | 密码的最大长度                                                                      |
| PASSWORD_MIN_UPPER_CASE_CHARS   | 0     | 256   | 1     | 密码中大写字符的最小数量                                                            |
| PASSWORD_MIN_LOWER_CASE_CHARS   | 0     | 256   | 1     | 密码中小写字符的最小数量                                                            |
| PASSWORD_MIN_NUMERIC_CHARS      | 0     | 256   | 1     | 密码中数字字符的最小数量                                                            |
| PASSWORD_MIN_SPECIAL_CHARS      | 0     | 256   | 0     | 密码中特殊字符的最小数量                                                            |
| PASSWORD_MIN_AGE_DAYS           | 0     | 999   | 0     | 密码可修改前的最小天数（0表示无限制）                                               |
| PASSWORD_MAX_AGE_DAYS           | 0     | 999   | 90    | 密码必须修改前的最大天数（0表示无限制）                                             |
| PASSWORD_MAX_RETRIES            | 1     | 10    | 5     | 超过重试次数前的最大密码重试次数                                                    |
| PASSWORD_LOCKOUT_TIME_MINS      | 1     | 999   | 15    | 超过重试次数后的锁定持续时间（分钟）                                                |
| PASSWORD_HISTORY                | 0     | 24    | 0     | 检查重复的最近密码数量（0表示无限制）                                               |

## 示例

此示例创建一个名为'SecureLogin'的密码策略，将最小密码长度要求设置为10个字符：

```sql
CREATE PASSWORD POLICY SecureLogin
    PASSWORD_MIN_LENGTH = 10;
```