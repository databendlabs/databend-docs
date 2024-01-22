```markdown
---
title: ARRAY_FILTER
---

构造一个数组，该数组由输入数组中使 lambda 函数返回 true 的那些元素组成。

## 语法 {/*syntax*/}

```sql
ARRAY_FILTER( <array>, <lambda> )
```

## 示例 {/*examples*/}

```sql
SELECT ARRAY_FILTER([1, 2, 3], x -> x > 1);

┌───────────────────────────────────────┐
│ array_filter([1, 2, 3], x -> (x > 1)) │
├───────────────────────────────────────┤
│ [2,3]                                 │
└───────────────────────────────────────┘
```
```