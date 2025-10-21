---
title: ST_Y
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.458"/>

返回由 GEOMETRY 对象表示的点（Point）的纬度（Y 坐标）。

## 语法

```sql
ST_Y(<geometry>)
```

## 参数

| 参数         | 说明                                                              |
|--------------|-------------------------------------------------------------------|
| `<geometry>` | 参数必须是 GEOMETRY 类型的表达式，并且必须包含一个点（Point）。 |

## 返回类型

Double。

## 示例

```sql
SELECT
  ST_Y(
    ST_MAKEGEOMPOINT(
      37.5, 45.5
    )
  ) AS pipeline_y;

┌────────────┐
│ pipeline_y │
├────────────┤
│       45.5 │
└────────────┘
```