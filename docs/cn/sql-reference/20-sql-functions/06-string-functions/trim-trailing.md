---
title: TRIM_TRAILING
---

从字符串末尾移除所有指定的修剪字符串。

另请参阅：

- [RTRIM](rtrim.md)
- [TRIM_LEADING](trim-leading.md)

## 语法

```sql
TRIM_TRAILING(<string>, <trim_string>)
```

## 示例

```sql
SELECT TRIM_TRAILING('databendxx', 'xxx'), TRIM_TRAILING('databendxx', 'xx'), TRIM_TRAILING('databendxx', 'x');

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ trim_trailing('databendxx', 'xxx') │ trim_trailing('databendxx', 'xx') │ trim_trailing('databendxx', 'x') │
├────────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────┤
│ databendxx                         │ databend                          │ databend                         │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```