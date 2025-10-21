---
title: ST_STARTPOINT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.458"/>

返回 LineString（线串）中的第一个 Point（点）。

## 语法

```sql
ST_STARTPOINT(<geometry>)
```

## 参数

| 参数         | 描述                                                              |
|--------------|-------------------------------------------------------------------|
| `<geometry>` | 参数必须是 GEOMETRY（几何类型）表达式，且该表达式表示一个 LineString（线串）。 |

## 返回类型

GEOMETRY（几何类型）。

## 示例

```sql
SELECT
  ST_STARTPOINT(
    ST_GEOMETRYFROMWKT(
      'LINESTRING(1 1, 2 2, 3 3, 4 4)'
    )
  ) AS pipeline_endpoint;

┌───────────────────┐
│ pipeline_endpoint │
├───────────────────┤
│ POINT(1 1)        │
└───────────────────┘
```