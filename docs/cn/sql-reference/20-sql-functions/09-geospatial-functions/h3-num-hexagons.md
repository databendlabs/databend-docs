---
title: H3_NUM_HEXAGONS
---

返回给定分辨率（resolution）下的唯一 [H3](https://eng.uber.com/h3/) 索引数量。

## 语法

```sql
H3_NUM_HEXAGONS(res)
```

## 示例

```sql
SELECT H3_NUM_HEXAGONS(10);

┌─────────────────────┐
│ h3_num_hexagons(10) │
├─────────────────────┤
│         33897029882 │
└─────────────────────┘
```