---
title: TRIM_BOTH
---

从字符串的两端移除特定字符。

另请参阅：[TRIM](trim.md)

## 语法

```sql
TRIM_BOTH(<string>, <trim_character>)
```

## 示例

```sql
SELECT TRIM_BOTH('xxdatabendxx', 'xx');

┌─────────────────────────────────┐
│ trim_both('xxdatabendxx', 'xx') │
├─────────────────────────────────┤
│ databend                        │
└─────────────────────────────────┘
```