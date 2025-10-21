---
title: ST_POINTN
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.458"/>

返回 LineString（线串）中指定索引处的 Point（点）。

## 语法

```sql
ST_POINTN(<geometry>, <index>)
```

## 参数

| 参数 | 描述 |
|--------------|-----------------------------------------------------------------------------------|
| `<geometry>` | 参数必须是 GEOMETRY 类型的表达式，表示一个 LineString（线串）。 |
| `<index>` | 要返回的 Point（点）的索引。 |

:::note
索引从 1 开始，负索引表示从 LineString（线串）末尾开始的偏移量。如果索引越界，函数将返回错误。
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