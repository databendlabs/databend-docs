---
title: TRIM
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.694"/>

删除字符串开头、结尾或两侧的空格、特定字符或子字符串。

另请参阅：[TRIM_BOTH](trim-both.md)

## 语法

```sql
-- 从字符串的开头、结尾或两侧删除指定 trim 字符串的所有匹配项
TRIM({ BOTH | LEADING | TRAILING } <trim_string> FROM <string>)

-- 删除指定 trim 字符串中存在的任何字符的所有前导和尾随匹配项
TRIM(<string>, <trim_string>)

-- 删除两侧的空格
TRIM(<string>)
```

## 示例

此示例从字符串 'xxxdatabendxxx' 的开头和结尾删除所有出现的指定字符：

```sql
SELECT TRIM(BOTH 'xxx' FROM 'xxxdatabendxxx'), TRIM(BOTH 'xx' FROM 'xxxdatabendxxx'), TRIM(BOTH 'x' FROM 'xxxdatabendxxx');

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TRIM(BOTH 'xxx' FROM 'xxxdatabendxxx') │ TRIM(BOTH 'xx' FROM 'xxxdatabendxxx') │ TRIM(BOTH 'x' FROM 'xxxdatabendxxx') │
├────────────────────────────────────────┼───────────────────────────────────────┼──────────────────────────────────────┤
│ databend                               │ xdatabendx                            │ databend                             │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

此示例从输入字符串 'xxxdatabend' 的开头删除所有出现的指定字符：

```sql
SELECT TRIM(LEADING 'xxx' FROM 'xxxdatabend'), TRIM(LEADING 'xx' FROM 'xxxdatabend'), TRIM(LEADING 'x' FROM 'xxxdatabend');

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TRIM(LEADING 'xxx' FROM 'xxxdatabend') │ TRIM(LEADING 'xx' FROM 'xxxdatabend') │ TRIM(LEADING 'x' FROM 'xxxdatabend') │
├────────────────────────────────────────┼───────────────────────────────────────┼──────────────────────────────────────┤
│ databend                               │ xdatabend                             │ databend                             │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

此示例从输入字符串 'databendxxx' 的结尾删除所有出现的指定字符：

```sql
SELECT TRIM(TRAILING 'xxx' FROM 'databendxxx' ), TRIM(TRAILING 'xx' FROM 'databendxxx' ), TRIM(TRAILING 'x' FROM 'databendxxx' );

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TRIM(TRAILING 'xxx' FROM 'databendxxx') │ TRIM(TRAILING 'xx' FROM 'databendxxx') │ TRIM(TRAILING 'x' FROM 'databendxxx') │
├─────────────────────────────────────────┼────────────────────────────────────────┼───────────────────────────────────────┤
│ databend                                │ databendx                              │ databend                              │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

此示例分别处理 trim 字符串中的每个字符，并从输入字符串的开头和结尾删除任何匹配的字符：

```sql
SELECT TRIM('xxxdatabendxxx', 'xyz'), TRIM('xxxdatabendxxx', 'xy'), TRIM('xxxdatabendxxx', 'x');

┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ trim('xxxdatabendxxx', 'xyz') │ trim('xxxdatabendxxx', 'xy') │ trim('xxxdatabendxxx', 'x') │
├───────────────────────────────┼──────────────────────────────┼─────────────────────────────┤
│ databend                      │ databend                     │ databend                    │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

此示例删除前导和/或尾随空格：

```sql
SELECT TRIM('   databend   '), TRIM('   databend'), TRIM('databend   ');

┌────────────────────────────────────────────────────────────────────┐
│ TRIM('   databend   ') │ TRIM('   databend') │ TRIM('databend   ') │
├────────────────────────┼─────────────────────┼─────────────────────┤
│ databend               │ databend            │ databend            │
└────────────────────────────────────────────────────────────────────┘
```