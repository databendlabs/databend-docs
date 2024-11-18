---
title: TRIM_TRAILING
---

从字符串的末尾（右侧）移除特定字符。

另请参阅: 

- [RTRIM](rtrim.md)
- [TRIM_LEADING](trim-leading.md)

## 语法

```sql
TRIM_TRAILING(<string>, <trim_character>)
```

## 示例

```sql
SELECT TRIM_TRAILING('databendxx', 'xx');

┌───────────────────────────────────┐
│ trim_trailing('databendxx', 'xx') │
├───────────────────────────────────┤
│ databend                          │
└───────────────────────────────────┘
```