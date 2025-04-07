---
title: H3_GET_ORIGIN_INDEX_FROM_UNIDIRECTIONAL_EDGE
---

从单向边 H3Index 返回起始六边形索引。

## 语法

```sql
H3_GET_ORIGIN_INDEX_FROM_UNIDIRECTIONAL_EDGE(h3)
```

## 示例

```sql
SELECT H3_GET_ORIGIN_INDEX_FROM_UNIDIRECTIONAL_EDGE(1248204388774707199);

┌───────────────────────────────────────────────────────────────────┐
│ h3_get_origin_index_from_unidirectional_edge(1248204388774707199) │
├───────────────────────────────────────────────────────────────────┤
│                                                599686042433355775 │
└───────────────────────────────────────────────────────────────────┘
```