---
title: TRIM
---

返回不包含指定移除字符串的前导或尾随出现的字符串。如果未指定移除字符串，则移除空格。

## 语法

```sql
TRIM([{BOTH | LEADING | TRAILING} [remstr] FROM ] str)
```

## 示例

请注意，本节中的所有示例都将返回字符串 'databend'。

以下示例从字符串 'xxxdatabendxxx' 中移除前导和尾随的字符串 'xxx'：

```sql
SELECT TRIM(BOTH 'xxx' FROM 'xxxdatabendxxx');
```

以下示例从字符串 'xxxdatabend' 中移除前导的字符串 'xxx'：

```sql
SELECT TRIM(LEADING 'xxx' FROM 'xxxdatabend' );
```
以下示例从字符串 'databendxxx' 中移除尾随的字符串 'xxx'：

```sql
SELECT TRIM(TRAILING 'xxx' FROM 'databendxxx' );
```

如果未指定移除字符串，该函数将移除所有前导和尾随空格。以下示例移除前导和/或尾随空格：

```sql
SELECT TRIM('   databend   ');
SELECT TRIM('   databend');
SELECT TRIM('databend   ');
```