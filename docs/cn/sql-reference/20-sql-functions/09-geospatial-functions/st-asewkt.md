---
title: ST_ASEWKT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.436"/>

将 GEOMETRY 对象转换为 [EWKT（Extended Well-Known Text）](https://postgis.net/docs/ST_GeomFromEWKT.html) 格式的表示。

## 语法

```sql
ST_ASEWKT(<geometry>)
```

## 参数

| 参数         | 描述                               |
|--------------|------------------------------------|
| `<geometry>` | 参数必须是 GEOMETRY 类型的表达式。 |

## 返回类型

字符串。

## 示例

```sql
SELECT
  ST_ASEWKT(
    ST_GEOMETRYFROMWKT(
      'SRID=4326;LINESTRING(400000 6000000, 401000 6010000)'
    )
  ) AS pipeline_ewkt;

┌─────────────────────────────────────────────────────┐
│                    pipeline_ewkt                    │
├─────────────────────────────────────────────────────┤
│ SRID=4326;LINESTRING(400000 6000000,401000 6010000) │
└─────────────────────────────────────────────────────┘

SELECT
  ST_ASEWKT(
    ST_GEOMETRYFROMWKT(
      'SRID=4326;POINT(-122.35 37.55)'
    )
  ) AS pipeline_ewkt;

┌────────────────────────────────┐
│          pipeline_ewkt         │
├────────────────────────────────┤
│ SRID=4326;POINT(-122.35 37.55) │
└────────────────────────────────┘
```