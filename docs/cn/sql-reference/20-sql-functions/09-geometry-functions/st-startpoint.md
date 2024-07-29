---
title: ST_STARTPOINT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.458"/>

返回 LineString 中的第一个点。

## 语法

```sql
ST_STARTPOINT(<geometry>)
```

## 参数

| 参数         | 描述                                                                             |
|--------------|----------------------------------------------------------------------------------|
| `<geometry>` | 参数必须是一个表示 LineString 的几何类型的 GEOMETRY 表达式。                     |

## 返回类型

Geometry。

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