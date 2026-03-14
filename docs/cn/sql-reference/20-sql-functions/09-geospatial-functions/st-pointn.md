---
title: ST_POINTN
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.458"/>

返回 LineString 中指定索引处的 Point。

## 语法

```sql
ST_POINTN(<geometry_or_geography>, <index>)
```

## 参数

| 参数 | 描述 |
|--------------|-----------------------------------------------------------------------------------|
| `<geometry_or_geography>` | 参数必须是 GEOMETRY 或 GEOGRAPHY 类型的表达式，并且表示一个 LineString。 |
| `<index>`    | 要返回的 Point 索引。 |

:::note
索引从 1 开始，负索引用于从 LineString 末尾反向计数。如果索引越界，函数会报错。
:::

## 返回类型

Geometry。

## 示例

### GEOMETRY 示例

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

### GEOGRAPHY 示例

```sql
SELECT
  ST_POINTN(
    ST_GEOGFROMWKT(
      'LINESTRING(1 1, 2 2, 3 3, 4 4)'
    ),
    2
  ) AS pipeline_pointn;

┌─────────────────┐
│ pipeline_pointn │
├─────────────────┤
│ POINT(2 2)      │
└─────────────────┘
```
