---
title: ST_COVERS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.911"/>

如果第二个 GEOMETRY 对象中没有任何点位于第一个 GEOMETRY 对象之外，则返回 TRUE。

另请参阅：[ST_COVEREDBY](st-coveredby.md)

## 语法

```sql
ST_COVERS(<geometry1>, <geometry2>)
```

## 参数

| 参数          | 描述                              |
|---------------|-----------------------------------|
| `<geometry1>` | GEOMETRY 表达式（覆盖对象）。     |
| `<geometry2>` | GEOMETRY 表达式（被测试对象）。   |

## 返回类型

Boolean。

## 示例

```sql
-- 多边形覆盖其内部的较小多边形
SELECT ST_COVERS(
  TO_GEOMETRY('POLYGON((-2 0, 0 2, 2 0, -2 0))'),
  TO_GEOMETRY('POLYGON((-1 0, 0 1, 1 0, -1 0))')
);

┌────────┐
│ result │
├────────┤
│ true   │
└────────┘

-- 多边形覆盖其边界上的线段
SELECT ST_COVERS(
  TO_GEOMETRY('POLYGON((-2 0, 0 2, 2 0, -2 0))'),
  TO_GEOMETRY('LINESTRING(-1 1, 0 2, 1 1)')
);

┌────────┐
│ result │
├────────┤
│ true   │
└────────┘

-- 多边形外部的点不被覆盖
SELECT ST_COVERS(
  TO_GEOMETRY('POLYGON((0 0, 3 0, 3 3, 0 3, 0 0))'),
  TO_GEOMETRY('POINT(5 5)')
);

┌────────┐
│ result │
├────────┤
│ false  │
└────────┘
```
