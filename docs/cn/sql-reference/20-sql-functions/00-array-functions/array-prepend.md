```markdown
---
title: ARRAY_PREPEND
---

将一个元素添加到数组的开头。

## 语法 {/*syntax*/}

```sql
ARRAY_PREPEND( <element>, <array> )
```

## 示例 {/*examples*/}

```sql
SELECT ARRAY_PREPEND(1, [3, 4]);

┌──────────────────────────┐
│ array_prepend(1, [3, 4]) │
├──────────────────────────┤
│ [1,3,4]                  │
└──────────────────────────┘
```
```