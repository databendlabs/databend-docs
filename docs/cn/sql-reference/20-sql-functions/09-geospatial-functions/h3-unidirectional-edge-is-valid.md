---
title: H3_UNIDIRECTIONAL_EDGE_IS_VALID
---

判断提供的 H3Index 是否为有效的单向边索引（Unidirectional Edge Index）。如果是单向边，则返回 1，否则返回 0。

## 语法

```sql
H3_UNIDIRECTIONAL_EDGE_IS_VALID(h3)
```

## 示例

```sql
SELECT H3_UNIDIRECTIONAL_EDGE_IS_VALID(1248204388774707199);

┌──────────────────────────────────────────────────────┐
│ h3_unidirectional_edge_is_valid(1248204388774707199) │
├──────────────────────────────────────────────────────┤
│ true                                                 │
└──────────────────────────────────────────────────────┘
```