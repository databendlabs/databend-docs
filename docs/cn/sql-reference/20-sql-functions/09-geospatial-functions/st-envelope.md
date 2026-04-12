---
title: ST_ENVELOPE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.895"/>

返回 GEOMETRY 对象的最小外接矩形，并以多边形形式表示。

该函数仅支持 GEOMETRY 类型。

## 语法

```sql
ST_ENVELOPE(<geometry>)
```

## 参数

| 参数 | 说明 |
|------|------|
| `<geometry>` | 必须是 GEOMETRY 类型的表达式。 |

## 返回类型

GEOMETRY。

## 示例

```sql
SELECT ST_ASWKT(ST_ENVELOPE(TO_GEOMETRY('LINESTRING(0 0, 2 3)')));

╭────────────────────────────────────────────────────────────╮
│ st_aswkt(st_envelope(to_geometry('LINESTRING(0 0, 2 3)'))) │
│                           String                           │
├────────────────────────────────────────────────────────────┤
│ POLYGON((0 0,2 0,2 3,0 3,0 0))                             │
╰────────────────────────────────────────────────────────────╯
```
