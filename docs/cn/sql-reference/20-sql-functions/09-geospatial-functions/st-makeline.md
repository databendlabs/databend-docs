---
title: ST_MAKELINE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.391"/>

构造一个 GEOMETRY 或 GEOGRAPHY 对象，表示连接两个输入 GEOMETRY 或 GEOGRAPHY 对象中点的线。

## 语法

```sql
ST_MAKELINE(<geometry_or_geography1>, <geometry_or_geography2>)
```

## 别名

- [ST_MAKE_LINE](st-make-line.md)

## 参数

| 参数 | 描述 |
|---------------|-------------------------------------------------------------------------------------------------------------|
| `<geometry_or_geography1>` | 包含要连接点的 GEOMETRY 或 GEOGRAPHY 对象，必须是 Point、MultiPoint 或 LineString。 |
| `<geometry_or_geography2>` | 包含要连接点的 GEOMETRY 或 GEOGRAPHY 对象，必须是 Point、MultiPoint 或 LineString。 |

## 返回类型

Geometry。

## 示例

### GEOMETRY 示例

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

### GEOGRAPHY 示例

```sql
SELECT
  ST_MAKELINE(
    ST_GEOGFROMWKT(
      'POINT(-122.306100 37.554162)'
    ),
    ST_GEOGFROMWKT(
      'POINT(-104.874173 56.714538)'
    )
  ) AS pipeline_line;

╭───────────────────────────────────────────────────────╮
│                     pipeline_line                     │
├───────────────────────────────────────────────────────┤
│ LINESTRING(-122.3061 37.554162,-104.874173 56.714538) │
╰───────────────────────────────────────────────────────╯
```
