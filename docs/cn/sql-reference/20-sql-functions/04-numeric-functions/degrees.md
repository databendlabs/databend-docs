```markdown
---
title: DEGREES
---

将参数 `x` 从弧度转换为度，其中 `x` 是以弧度给出的。

## 语法

```sql
DEGREES( <x> )
```

## 示例

```sql
SELECT DEGREES(PI());

┌───────────────┐
│ degrees(pi()) │
├───────────────┤
│           180 │
└───────────────┘
```
```