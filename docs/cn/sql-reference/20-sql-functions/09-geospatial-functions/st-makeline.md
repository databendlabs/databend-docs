---
title: ST_MAKELINE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.391"/>

构造一个 GEOMETRY（几何对象），表示连接输入的两个 GEOMETRY（几何对象）中各点的线。

## 语法

```sql
ST_MAKELINE(<geometry1>, <geometry2>)
```

## 别名

- [ST_MAKE_LINE](st-make-line.md)

## 参数

| 参数          | 描述                                                                                             |
|---------------|--------------------------------------------------------------------------------------------------|
| `<geometry1>` | 一个包含要连接点的 GEOMETRY（几何对象）。该对象必须是 Point（点）、MultiPoint（多点）或 LineString（线串）。 |
| `<geometry2>` | 一个包含要连接点的 GEOMETRY（几何对象）。该对象必须是 Point（点）、MultiPoint（多点）或 LineString（线串）。 |

## 返回类型

Geometry（几何对象）。

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