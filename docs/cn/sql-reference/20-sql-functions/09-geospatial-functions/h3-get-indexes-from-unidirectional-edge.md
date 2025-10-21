---
title: H3_GET_INDEXES_FROM_UNIDIRECTIONAL_EDGE
---

根据给定的单向边 H3Index，返回起点和终点六边形索引。

## 语法

```sql
H3_GET_INDEXES_FROM_UNIDIRECTIONAL_EDGE(h3)
```

## 示例

```sql
SELECT H3_GET_INDEXES_FROM_UNIDIRECTIONAL_EDGE(1248204388774707199);

┌──────────────────────────────────────────────────────────────┐
│ h3_get_indexes_from_unidirectional_edge(1248204388774707199) │
├──────────────────────────────────────────────────────────────┤
│ (599686042433355775,599686043507097599)                      │
└──────────────────────────────────────────────────────────────┘
```