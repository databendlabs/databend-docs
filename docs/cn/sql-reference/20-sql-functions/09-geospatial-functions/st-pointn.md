---
title: ST_POINTN
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.458"/>

返回 LineString 中指定索引处的 Point。

## 语法

```sql
ST_POINTN(<geometry>, <index>)
```

## 参数

| 参数         | 描述                                                              |
|--------------|-------------------------------------------------------------------|
| `<geometry>` | 参数必须是表示 LineString 的 GEOMETRY 类型表达式。 |
| `<index>`    | 要返回的 Point 的索引。                                       |

:::note
索引从 1 开始，负数索引表示从 LineString 末尾开始的偏移量。如果索引超出范围，函数将返回错误。
:::

## 返回类型

Geometry。

## 示例

```sql
SELECT
  ST_POINTN(
    ST_GEOMETRYFROMWKT(
      'LINESTRING(1 1, 2 2, 3 3, 4 4)'
    ),
    1
  ) AS pipeline_pointn;

┌─────────────────┐
│ pipeline_pointn │
├─────────────────┤
│ POINT(1 1)      │
└─────────────────┘

SELECT
  ST_POINTN(
    ST_GEOMETRYFROMWKT(
      'LINESTRING(1 1, 2 2, 3 3, 4 4)'
    ),
    -2
  ) AS pipeline_pointn;

┌─────────────────┐
│ pipeline_pointn │
├─────────────────┤
│ POINT(3 3)      │
└─────────────────┘
```