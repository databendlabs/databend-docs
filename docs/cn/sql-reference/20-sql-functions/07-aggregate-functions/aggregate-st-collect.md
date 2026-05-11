---
title: ST_COLLECT
---

将多个 GEOMETRY 值收集为一个 GEOMETRY 结果。

该函数仅支持 GEOMETRY 类型。

## 语法

```sql
ST_COLLECT(<geometry>)
```

## 参数

| 参数 | 说明 |
|------|------|
| `<geometry>` | GEOMETRY 类型的表达式。 |

## 返回类型

GEOMETRY。根据输入类型不同，返回值可能是 `MULTIPOINT`、`MULTILINESTRING`、`MULTIPOLYGON` 或 `GEOMETRYCOLLECTION`。

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
    SELECT TO_GEOMETRY('LINESTRING(1 1,2 2)')
)
SELECT ST_ASWKT(ST_COLLECT(g)) FROM data;

╭────────────────────────────────────────────────────╮
│               st_aswkt(st_collect(g))              │
├────────────────────────────────────────────────────┤
│ GEOMETRYCOLLECTION(POINT(0 0),LINESTRING(1 1,2 2)) │
╰────────────────────────────────────────────────────╯
```
