---
title: ST_GEOHASH
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.436"/>

返回 GEOMETRY 或 GEOGRAPHY 对象的 [geohash](https://en.wikipedia.org/wiki/Geohash)。Geohash 是一种短的 base32 字符串，用于标识包含某个位置的地理矩形。可选参数 `precision` 指定返回 geohash 的精度。例如，传入 5 会返回较短且更粗略的 geohash（长度为 5）。

## 语法

```sql
ST_GEOHASH(<geometry_or_geography> [, <precision>])
```

## 参数

| 参数 | 描述 |
|-----------------|---------------------------------------------------------------------------|
| `<geometry_or_geography>` | 参数必须是 GEOMETRY 或 GEOGRAPHY 类型的表达式。 |
| `[precision]` | 可选。指定返回 geohash 的精度，默认值为 12。 |

## 返回类型

String。

## 示例

### GEOMETRY 示例

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

### GEOGRAPHY 示例

```sql
SELECT
  ST_GEOHASH(
    ST_GEOGFROMWKT(
      'POINT(-122.306100 37.554162)'
    )
  ) AS pipeline_geohash;

┌──────────────────┐
│ pipeline_geohash │
├──────────────────┤
│ 9q9j8ue2v71y     │
└──────────────────┘
```
