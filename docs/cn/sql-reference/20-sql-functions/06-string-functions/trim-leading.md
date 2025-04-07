---
title: TRIM_LEADING
---

从字符串的开头删除所有出现的指定修剪字符串。

参见：

- [LTRIM](ltrim.md)
- [TRIM_TRAILING](trim-trailing.md)

## 语法

```sql
TRIM_LEADING(<string>, <trim_string>)
```

## 示例

```sql
SELECT TRIM_LEADING('xxdatabend', 'xxx'), TRIM_LEADING('xxdatabend', 'xx'), TRIM_LEADING('xxdatabend', 'x');

┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ trim_leading('xxdatabend', 'xxx') │ trim_leading('xxdatabend', 'xx') │ trim_leading('xxdatabend', 'x') │
├───────────────────────────────────┼──────────────────────────────────┼─────────────────────────────────┤
│ xxdatabend                        │ databend                         │ databend                        │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```