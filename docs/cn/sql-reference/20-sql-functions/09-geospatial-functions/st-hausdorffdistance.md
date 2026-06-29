---
title: ST_HAUSDORFFDISTANCE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.911"/>

返回两个 GEOMETRY 对象之间的离散 Hausdorff 距离。该距离衡量两个几何体的差异程度，取一个对象中任意顶点到另一个对象中最近顶点的最大距离。

## 语法

```sql
ST_HAUSDORFFDISTANCE(<geometry1>, <geometry2>)
```

## 参数

| 参数          | 描述              |
|---------------|-------------------|
| `<geometry1>` | GEOMETRY 表达式。 |
| `<geometry2>` | GEOMETRY 表达式。 |

## 返回类型

Double。

## 示例

```sql
SELECT ST_HAUSDORFFDISTANCE(
  TO_GEOMETRY('POINT(0 0)'),
  TO_GEOMETRY('POINT(0 1)')
);

┌────────┐
│ result │
├────────┤
│ 1.0    │
└────────┘

SELECT ST_HAUSDORFFDISTANCE(
  TO_GEOMETRY('LINESTRING(0 0, 1 0)'),
  TO_GEOMETRY('LINESTRING(0 1, 1 1)')
);

┌────────┐
│ result │
├────────┤
│ 1.0    │
└────────┘

SELECT ST_HAUSDORFFDISTANCE(
  TO_GEOMETRY('POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))'),
  TO_GEOMETRY('POLYGON((2 0, 3 0, 3 1, 2 1, 2 0))')
);

┌────────┐
│ result │
├────────┤
│ 2.0    │
└────────┘
```
