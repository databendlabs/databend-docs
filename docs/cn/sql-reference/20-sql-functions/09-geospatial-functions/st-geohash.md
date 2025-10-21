---
title: ST_GEOHASH
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.436"/>

返回 GEOMETRY 对象的 [geohash](https://en.wikipedia.org/wiki/Geohash)。Geohash 是一个简短的 base32 字符串，用于标识地球上包含某个位置的测地矩形。可选的精度参数指定返回 geohash 的 `precision`（精度）。例如，将 `precision` 设为 5 会返回较短的 geohash（5 个字符），精度更低。

## 语法

```sql
ST_GEOHASH(<geometry> [, <precision>])
```

## 参数

| 参数 | 描述 |
|---|---|
| `geometry` | 参数必须是 GEOMETRY 类型的表达式。 |
| `[precision]` | 可选。指定返回 geohash 的精度，默认值为 12。 |

## 返回类型

String。

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