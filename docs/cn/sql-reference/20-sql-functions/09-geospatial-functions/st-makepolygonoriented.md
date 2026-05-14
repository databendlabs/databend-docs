---
title: ST_MAKEPOLYGONORIENTED
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.911"/>

从 LineString 输入创建 Polygon，保留给定的顶点顺序。与 [ST_MAKEPOLYGON](st-makepolygon.md) 不同，此函数不会重新排列顶点来强制特定的环绕方向。

## 语法

```sql
ST_MAKEPOLYGONORIENTED(<geometry>)
```

## 参数

| 参数         | 描述                                                                 |
|--------------|----------------------------------------------------------------------|
| `<geometry>` | LineString 类型的 GEOMETRY 表达式。必须至少有 4 个点，且首尾点相同。 |

:::note
- 仅接受 LineString 输入，其他类型会产生错误。
- LineString 必须形成有效的多边形（无自相交）。
:::

## 返回类型

Geometry。

## 示例

```sql
SELECT ST_ASWKT(
  ST_MAKEPOLYGONORIENTED(TO_GEOMETRY('LINESTRING(0 0, 1 0, 1 2, 0 2, 0 0)'))
);

┌──────────────────────────────────┐
│             result               │
├──────────────────────────────────┤
│ POLYGON((0 0,1 0,1 2,0 2,0 0))  │
└──────────────────────────────────┘

-- 反向环绕顺序被保留
SELECT ST_ASWKT(
  ST_MAKEPOLYGONORIENTED(TO_GEOMETRY('LINESTRING(0 0, 0 2, 1 2, 1 0, 0 0)'))
);

┌──────────────────────────────────┐
│             result               │
├──────────────────────────────────┤
│ POLYGON((0 0,0 2,1 2,1 0,0 0))  │
└──────────────────────────────────┘
```
