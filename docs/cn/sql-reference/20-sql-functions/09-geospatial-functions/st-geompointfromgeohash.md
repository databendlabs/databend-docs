---
title: ST_GEOMPOINTFROMGEOHASH
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.413"/>

返回一个 GEOMETRY 对象，该对象表示一个 [geohash](https://en.wikipedia.org/wiki/Geohash) 的中心点。

## 语法

```sql
ST_GEOMPOINTFROMGEOHASH(<geohash>)
```

## 参数

| 参数   | 描述                     |
|-------------|---------------------------------|
| `<geohash>` | 参数必须是一个 geohash。 |

## 返回类型

Geometry。

## 示例

```sql
SELECT
  ST_GEOMPOINTFROMGEOHASH(
    's02equ0'
  ) AS pipeline_geometry;

┌──────────────────────────────────────────────┐
│               pipeline_geometry              │
│                   Geometry                   │
├──────────────────────────────────────────────┤
│ POINT(1.0004425048828125 2.0001983642578125) │
└──────────────────────────────────────────────┘
```