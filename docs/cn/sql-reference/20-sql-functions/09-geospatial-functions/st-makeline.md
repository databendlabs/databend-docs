---
title: ST_MAKELINE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.391"/>

构造一个 GEOMETRY 对象，表示连接输入的两个 GEOMETRY 对象中各点的线。

## 语法

```sql
ST_MAKELINE(<geometry1>, <geometry2>)
```

## 别名

- [ST_MAKE_LINE](st-make-line.md)

## 参数

| 参数     | 描述                                                                                                 |
|---------------|-------------------------------------------------------------------------------------------------------------|
| `<geometry1>` | 包含待连接点的 GEOMETRY 对象。该对象必须是 Point、MultiPoint 或 LineString。 |
| `<geometry2>` | 包含待连接点的 GEOMETRY 对象。该对象必须是 Point、MultiPoint 或 LineString。 |

## 返回类型

Geometry。

## 示例

```sql
SELECT
  ST_MAKELINE(
    ST_GEOMETRYFROMWKT(
      'POINT(-122.306100 37.554162)'
    ),
    ST_GEOMETRYFROMWKT(
      'POINT(-104.874173 56.714538)'
    )
  ) AS pipeline_line;

┌───────────────────────────────────────────────────────┐
│                     pipeline_line                     │
├───────────────────────────────────────────────────────┤
│ LINESTRING(-122.3061 37.554162,-104.874173 56.714538) │
└───────────────────────────────────────────────────────┘
```