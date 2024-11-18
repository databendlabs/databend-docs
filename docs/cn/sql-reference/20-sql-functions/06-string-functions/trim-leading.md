---
title: TRIM_LEADING
---

从字符串的开头（左侧）移除特定字符。

另请参阅: 

- [LTRIM](ltrim.md)
- [TRIM_TRAILING](trim-trailing.md)

## 语法

```sql
TRIM_LEADING(<string>, <trim_character>)
```

## 示例

```sql
SELECT TRIM_LEADING('xxdatabend', 'xx');

┌──────────────────────────────────┐
│ trim_leading('xxdatabend', 'xx') │
├──────────────────────────────────┤
│ databend                         │
└──────────────────────────────────┘
```