---
title: ST_UNION_AGG
---

对多个 GEOMETRY 值逐步执行 `ST_UNION`，并返回合并后的 GEOMETRY 结果。

该函数仅支持 GEOMETRY 类型。

## 语法

```sql
ST_UNION_AGG(<geometry>)
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
    SELECT TO_GEOMETRY('POINT(0 0)') AS g
    UNION ALL
    SELECT TO_GEOMETRY('POINT(1 1)')
)
SELECT ST_ASWKT(ST_UNION_AGG(g)) FROM data;

╭───────────────────────────╮
│ st_aswkt(st_union_agg(g)) │
├───────────────────────────┤
│ MULTIPOINT(0 0,1 1)       │
╰───────────────────────────╯
```
