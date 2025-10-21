---
title: HAVERSINE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.555"/>

使用 [Haversine formula（半正矢公式）](https://en.wikipedia.org/wiki/Haversine_formula) 计算地球表面两点之间的大圆距离（单位：公里）。这两个点由它们的纬度和经度（以度为单位）指定。

## 语法

```sql
HAVERSINE(<lat1>, <lon1>, <lat2>, <lon2>)
```

## 参数

| 参数      | 描述               |
|-----------|--------------------|
| `<lat1>`  | 第一个点的纬度。   |
| `<lon1>`  | 第一个点的经度。   |
| `<lat2>`  | 第二个点的纬度。   |
| `<lon2>`  | 第二个点的经度。   |

## 返回类型

Double。

## 示例

```sql
SELECT
  HAVERSINE(40.7127, -74.0059, 34.0500, -118.2500) AS distance

┌────────────────┐
│    distance    │
├────────────────┤
│ 3936.390533556 │
└────────────────┘
```