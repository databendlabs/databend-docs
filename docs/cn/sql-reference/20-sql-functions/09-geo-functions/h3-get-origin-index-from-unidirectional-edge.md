---
title: H3_GET_ORIGIN_INDEX_FROM_UNIDIRECTIONAL_EDGE
---

返回单向边缘 H3Index 的起始六边形索引。

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