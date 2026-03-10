---
title: ST_X
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.458"/>

返回由 GEOMETRY 对象表示的 Point 的经度（X 坐标）。

## 语法

```sql
ST_X(<geometry>)
```

## 参数

| 参数         | 描述                                                              |
|--------------|-------------------------------------------------------------------|
| `<geometry>` | 参数必须是 GEOMETRY 类型的表达式，并且必须包含一个 Point。 |

## 返回类型

Double。

## 示例

```sql
SELECT
  ST_X(
    ST_MAKEGEOMPOINT(
      37.5, 45.5
    )
  ) AS pipeline_x;

┌────────────┐
│ pipeline_x │
├────────────┤
│       37.5 │
└────────────┘
```