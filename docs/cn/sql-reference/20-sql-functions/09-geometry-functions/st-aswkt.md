---
title: ST_ASWKT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.436"/>

将一个 GEOMETRY 对象转换为 [WKT(well-known-text)](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) 格式的表示。

## 语法

```sql
ST_ASWKT(<geometry>)
```

## 别名

- [ST_ASTEXT](st-astext.md)

## 参数

| 参数         | 描述                                           |
|--------------|------------------------------------------------|
| `<geometry>` | 参数必须是一个 GEOMETRY 类型的表达式。         |

## 返回类型

字符串。

## 示例

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