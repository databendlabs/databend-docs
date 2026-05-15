---
title: ST_PERIMETER
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.911"/>

返回 GEOMETRY 对象中多边形的周长，以坐标系的单位度量。

## 语法

```sql
ST_PERIMETER(<geometry>)
```

## 参数

| 参数         | 描述              |
|--------------|-------------------|
| `<geometry>` | GEOMETRY 表达式。 |

:::note
- 如果输入不是 Polygon 或 MultiPolygon，则返回 0。
:::

## 返回类型

Double。

## 示例

```sql
SELECT ST_PERIMETER(TO_GEOMETRY('POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))'));

┌─────────────────────────────────────────────────────────────────┐
│ st_perimeter(to_geometry('polygon((0 0, 0 1, 1 1, 1 0, 0 0))')) │
├─────────────────────────────────────────────────────────────────┤
│ 4.0                                                              │
└─────────────────────────────────────────────────────────────────┘

SELECT ST_PERIMETER(TO_GEOMETRY('POLYGON((0 0, 0 3, 4 3, 4 0, 0 0))'));

┌─────────────────────────────────────────────────────────────────┐
│ st_perimeter(to_geometry('polygon((0 0, 0 3, 4 3, 4 0, 0 0))')) │
├─────────────────────────────────────────────────────────────────┤
│ 14.0                                                             │
└─────────────────────────────────────────────────────────────────┘

-- 非多边形类型返回 0
SELECT ST_PERIMETER(TO_GEOMETRY('POINT(1 1)'));

┌──────────────────────────────────────┐
│ st_perimeter(to_geometry('point(1 1)')) │
├──────────────────────────────────────┤
│ 0.0                                     │
└──────────────────────────────────────┘
```
