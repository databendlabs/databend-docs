---
title: ST_MAKEGEOMPOINT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.347"/>

构造一个 GEOMETRY 对象，表示具有指定经度（longitude）和纬度（latitude）的点（Point）。

## 语法

```sql
ST_MAKEGEOMPOINT(<longitude>, <latitude>)
```

## 别名

- [ST_GEOM_POINT](st-geom-point.md)

## 参数

| 参数          | 描述                               |
|---------------|------------------------------------|
| `<longitude>` | 表示经度的 Double 值。 |
| `<latitude>`  | 表示纬度的 Double 值。  |

## 返回类型

Geometry。

## 示例

```sql
SELECT
  ST_MAKEGEOMPOINT(
    7.0, 8.0
  ) AS pipeline_point;

┌────────────────┐
│ pipeline_point │
├────────────────┤
│ POINT(7 8)     │
└────────────────┘

SELECT
  ST_MAKEGEOMPOINT(
    -122.3061, 37.554162
  ) AS pipeline_point;

┌────────────────────────────┐
│       pipeline_point       │
├────────────────────────────┤
│ POINT(-122.3061 37.554162) │
└────────────────────────────┘
```