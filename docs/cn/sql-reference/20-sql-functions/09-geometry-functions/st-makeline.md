---
title: ST_MAKELINE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.391"/>

构造一个表示连接输入的两个GEOMETRY对象中点的线的GEOMETRY对象。

## 语法

```sql
ST_MAKELINE(<geometry1>, <geometry2>)
```

## 别名

- [ST_MAKE_LINE](st-make-line.md)

## 参数

| 参数          | 描述                                                                                                 |
|---------------|-------------------------------------------------------------------------------------------------------------|
| `<geometry1>` | 包含要连接点的GEOMETRY对象。该对象必须是Point、MultiPoint或LineString。 |
| `<geometry2>` | 包含要连接点的GEOMETRY对象。该对象必须是Point、MultiPoint或LineString。 |

## 返回类型

Geometry.

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