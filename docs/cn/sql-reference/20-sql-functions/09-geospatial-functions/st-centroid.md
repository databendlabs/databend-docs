---
title: ST_CENTROID
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.895"/>

返回 GEOMETRY 对象的质心。

该函数仅支持 GEOMETRY 类型。

## 语法

```sql
ST_CENTROID(<geometry>)
```

## 参数

| 参数 | 说明 |
|------|------|
| `<geometry>` | 必须是 GEOMETRY 类型的表达式。 |

## 返回类型

GEOMETRY。

## 示例

```sql
SELECT ST_ASWKT(ST_CENTROID(TO_GEOMETRY('POINT(1 2)')));

╭──────────────────────────────────────────────────╮
│ st_aswkt(st_centroid(to_geometry('POINT(1 2)'))) │
├──────────────────────────────────────────────────┤
│ POINT(1 2)                                       │
╰──────────────────────────────────────────────────╯
```

```sql
SELECT ST_ASWKT(ST_CENTROID(TO_GEOMETRY('LINESTRING(0 0, 2 0)')));

╭────────────────────────────────────────────────────────────╮
│ st_aswkt(st_centroid(to_geometry('LINESTRING(0 0, 2 0)'))) │
├────────────────────────────────────────────────────────────┤
│ POINT(1 0)                                                 │
╰────────────────────────────────────────────────────────────╯
```
