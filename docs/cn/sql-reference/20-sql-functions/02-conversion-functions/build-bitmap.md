```markdown
---
title: BUILD_BITMAP
---

将一组正整数转换为 BITMAP 值。

## 语法 {/*syntax*/}

```sql
BUILD_BITMAP( <expr> )
```

## 示例 {/*examples*/}

```sql
SELECT BUILD_BITMAP([1,4,5])::String;

┌─────────────────────────────────┐
│ build_bitmap([1, 4, 5])::string │
├─────────────────────────────────┤
│ 1,4,5                           │
└─────────────────────────────────┘
```
```