---
title: ST_ENVELOPE_AGG
---

对多个 GEOMETRY 值做聚合，返回覆盖所有非 NULL 输入的最小外接矩形。

该函数仅支持 GEOMETRY 类型。

## 语法

```sql
ST_ENVELOPE_AGG(<geometry>)
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
    SELECT TO_GEOMETRY('POINT(1 1)') AS g
    UNION ALL
    SELECT TO_GEOMETRY('POINT(4 2)')
    UNION ALL
    SELECT TO_GEOMETRY('POINT(2 5)')
)
SELECT ST_ASWKT(ST_ENVELOPE_AGG(g)) FROM data;

╭────────────────────────────────╮
│  st_aswkt(st_envelope_agg(g))  │
├────────────────────────────────┤
│ POLYGON((1 1,4 1,4 5,1 5,1 1)) │
╰────────────────────────────────╯
```
