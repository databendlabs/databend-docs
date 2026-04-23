---
title: ST_INTERSECTION_AGG
---

对多个 GEOMETRY 值逐步执行 `ST_INTERSECTION`，并返回它们共同重叠的部分。

该函数仅支持 GEOMETRY 类型。

## 语法

```sql
ST_INTERSECTION_AGG(<geometry>)
```

## 参数

| 参数 | 说明 |
|------|------|
| `<geometry>` | GEOMETRY 类型的表达式。 |

## 返回类型

GEOMETRY。

:::note
- 会忽略 NULL 输入行。
- 如果所有输入行都是 NULL，则返回 NULL。
- 如果输入 GEOMETRY 的 SRID 不一致，函数会报错。
:::

## 示例

```sql
WITH data AS (
    SELECT TO_GEOMETRY('POLYGON((0 0,4 0,4 4,0 4,0 0))') AS g
    UNION ALL
    SELECT TO_GEOMETRY('POLYGON((1 1,3 1,3 3,1 3,1 1))')
)
SELECT ST_ASWKT(ST_INTERSECTION_AGG(g)) FROM data;

╭──────────────────────────────────╮
│ st_aswkt(st_intersection_agg(g)) │
├──────────────────────────────────┤
│ POLYGON((1 3,1 1,3 1,3 3,1 3))   │
╰──────────────────────────────────╯
```
