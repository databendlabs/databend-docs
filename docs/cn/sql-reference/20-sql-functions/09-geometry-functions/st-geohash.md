---
title: ST_GEOHASH
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.436"/>

返回一个GEOMETRY对象的[geohash](https://en.wikipedia.org/wiki/Geohash)。Geohash是一个简短的base32字符串，用于标识包含世界中某个位置的测地矩形。可选的精度参数指定返回的geohash的`精度`。例如，传递5作为`精度`将返回一个较短的geohash（5个字符长），精度较低。

## 语法

```sql
ST_GEOHASH(<geometry> [, <precision>])
```

## 参数

| 参数            | 描述                                                                 |
|-----------------|----------------------------------------------------------------------|
| `geometry`    | 参数必须是GEOMETRY类型的表达式。                                     |
| `[precision]` | 可选。指定返回的geohash的精度，默认值为12。                           |

## 返回类型

字符串。

## 示例

```sql
SELECT
  ST_GEOHASH(
    ST_GEOMETRYFROMWKT(
      'POINT(-122.306100 37.554162)'
    )
  ) AS pipeline_geohash;

┌──────────────────┐
│ pipeline_geohash │
├──────────────────┤
│ 9q9j8ue2v71y     │
└──────────────────┘

SELECT
  ST_GEOHASH(
    ST_GEOMETRYFROMWKT(
      'SRID=4326;POINT(-122.35 37.55)'
    ),
    5
  ) AS pipeline_geohash;

┌──────────────────┐
│ pipeline_geohash │
├──────────────────┤
│ 9q8vx            │
└──────────────────┘
```