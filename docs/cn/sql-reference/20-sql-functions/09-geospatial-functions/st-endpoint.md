---
title: ST_ENDPOINT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.458"/>

返回 LineString 中的最后一个 Point。

## 语法

```sql
ST_ENDPOINT(<geometry>)
```

## 参数

| 参数 | 描述 |
|--------------|-----------------------------------------------------------------------------------|
| `<geometry>` | 参数必须是 GEOMETRY 类型的表达式，表示一个 LineString。 |

## 返回类型

Geometry。

## 示例

```sql
SELECT
  ST_ENDPOINT(
    ST_GEOMETRYFROMWKT(
      'LINESTRING(1 1, 2 2, 3 3, 4 4)'
    )
  ) AS pipeline_endpoint;

┌───────────────────┐
│ pipeline_endpoint │
├───────────────────┤
│ POINT(4 4)        │
└───────────────────┘
```