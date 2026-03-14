---
title: ST_ASWKT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.436"/>

将 GEOMETRY 或 GEOGRAPHY 对象转换为 [WKT(well-known-text)](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) 表示形式。

## 语法

```sql
ST_ASWKT(<geometry_or_geography>)
```

## 别名

- [ST_ASTEXT](st-astext.md)

## 参数

| 参数 | 描述 |
|--------------|------------------------------------------------------|
| `<geometry_or_geography>` | 参数必须是 GEOMETRY 或 GEOGRAPHY 类型的表达式。 |

## 返回类型

String。

## 示例

### GEOMETRY 示例

```sql
SELECT
  ST_ASWKT(
    ST_GEOMETRYFROMWKT(
      'SRID=4326;LINESTRING(400000 6000000, 401000 6010000)'
    )
  ) AS pipeline_wkt;

┌───────────────────────────────────────────┐
│                pipeline_wkt               │
├───────────────────────────────────────────┤
│ LINESTRING(400000 6000000,401000 6010000) │
└───────────────────────────────────────────┘

SELECT
  ST_ASTEXT(
    ST_GEOMETRYFROMWKT(
      'SRID=4326;POINT(-122.35 37.55)'
    )
  ) AS pipeline_wkt;

┌──────────────────────┐
│     pipeline_wkt     │
├──────────────────────┤
│ POINT(-122.35 37.55) │
└──────────────────────┘
```

### GEOGRAPHY 示例

```sql
SELECT
  ST_ASWKT(
    ST_GEOGFROMWKT(
      'SRID=4326;POINT(-122.35 37.55)'
    )
  ) AS pipeline_wkt;

╭──────────────────────╮
│     pipeline_wkt     │
├──────────────────────┤
│ POINT(-122.35 37.55) │
╰──────────────────────╯
```
