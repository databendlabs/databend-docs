---
title: ST_AZIMUTH
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.911"/>

返回从一个 Point 到另一个 Point 的线段方位角（弧度），从正 Y 轴（北）顺时针测量。如果两点相同则返回 NULL。

## 语法

```sql
ST_AZIMUTH(<point1>, <point2>)
```

## 参数

| 参数       | 描述                                  |
|------------|---------------------------------------|
| `<point1>` | Point 类型的 GEOMETRY 表达式（起点）。|
| `<point2>` | Point 类型的 GEOMETRY 表达式（终点）。|

:::note
- 两个参数都必须是 Point 类型，其他类型会产生错误。
:::

## 返回类型

Double（可为空）。

## 示例

```sql
-- 正北方向（沿正 Y 轴）：0 弧度
SELECT ST_AZIMUTH(TO_GEOMETRY('POINT(0 0)'), TO_GEOMETRY('POINT(0 1)'));

┌────────┐
│ result │
├────────┤
│ 0.0    │
└────────┘

-- 正东方向：π/2 弧度
SELECT ST_AZIMUTH(TO_GEOMETRY('POINT(0 0)'), TO_GEOMETRY('POINT(1 0)'));

┌─────────────┐
│    result   │
├─────────────┤
│ 1.570796327 │
└─────────────┘

-- 正南方向：π 弧度
SELECT ST_AZIMUTH(TO_GEOMETRY('POINT(0 1)'), TO_GEOMETRY('POINT(0 0)'));

┌─────────────┐
│    result   │
├─────────────┤
│ 3.141592654 │
└─────────────┘

-- 两点相同：NULL
SELECT ST_AZIMUTH(TO_GEOMETRY('POINT(0 0)'), TO_GEOMETRY('POINT(0 0)'));

┌────────┐
│ result │
├────────┤
│ NULL   │
└────────┘
```
