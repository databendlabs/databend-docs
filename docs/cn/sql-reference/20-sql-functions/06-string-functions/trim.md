---
title: TRIM
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.659"/>

从字符串中移除特定的字符或空格，可以选择指定位置（BOTH、LEADING 或 TRAILING）。

另请参阅: [TRIM_BOTH](trim-both.md)

## 语法

```sql
-- 移除特定字符并指定位置
TRIM({ BOTH | LEADING | TRAILING } <trim_character> FROM <string>)

-- 从两边移除特定字符（默认 BOTH）
TRIM(<string>, <trim_character>)

-- 从两边移除空格
TRIM(<string>)
```

## 示例

以下示例从字符串 'xxxdatabendxxx' 中移除前导和尾随的 'xxx'：

```sql
SELECT TRIM(BOTH 'xxx' FROM 'xxxdatabendxxx'), TRIM('xxxdatabendxxx', 'xxx');

┌─────────────────────────────────────────────────────────────────────────────────┐
│ TRIM(BOTH 'xxx' FROM 'xxxdatabendxxx') │ TRIM(BOTH 'xxx' FROM 'xxxdatabendxxx') │
├────────────────────────────────────────┼────────────────────────────────────────┤
│ databend                               │ databend                               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

以下示例从字符串 'xxxdatabend' 中移除前导的 'xxx'：

```sql
SELECT TRIM(LEADING 'xxx' FROM 'xxxdatabend' );

┌────────────────────────────────────────┐
│ TRIM(LEADING 'xxx' FROM 'xxxdatabend') │
├────────────────────────────────────────┤
│ databend                               │
└────────────────────────────────────────┘
```

以下示例从字符串 'databendxxx' 中移除尾随的 'xxx'：

```sql
SELECT TRIM(TRAILING 'xxx' FROM 'databendxxx' );

┌─────────────────────────────────────────┐
│ TRIM(TRAILING 'xxx' FROM 'databendxxx') │
├─────────────────────────────────────────┤
│ databend                                │
└─────────────────────────────────────────┘
```

以下示例移除前导和/或尾随的空格：

```sql
SELECT TRIM('   databend   '), TRIM('   databend'), TRIM('databend   ');

┌────────────────────────────────────────────────────────────────────┐
│ TRIM('   databend   ') │ TRIM('   databend') │ TRIM('databend   ') │
│         String         │        String       │        String       │
├────────────────────────┼─────────────────────┼─────────────────────┤
│ databend               │ databend            │ databend            │
└────────────────────────────────────────────────────────────────────┘
```