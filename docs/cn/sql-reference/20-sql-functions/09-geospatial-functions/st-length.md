---
title: ST_LENGTH
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.555"/>

返回 GEOMETRY 或 GEOGRAPHY 对象中 LineString 的欧几里得长度。

## 语法

```sql
ST_LENGTH(<geometry_or_geography>)
```

## 参数

| 参数 | 描述 |
|--------------|-----------------------------------------------------------------------------|
| `<geometry_or_geography>` | 参数必须是 GEOMETRY 或 GEOGRAPHY 类型的表达式，且包含 LineString。 |

:::note
- 如果 `<geometry_or_geography>` 不是 `LineString`、`MultiLineString` 或包含 LineString 的 `GeometryCollection`，返回 0。
- 如果 `<geometry_or_geography>` 是 `GeometryCollection`，返回集合中所有 LineString 长度的总和。
:::

## 返回类型

Double。

## 示例

### GEOMETRY 示例

```sql
SELECT
  ST_LENGTH(TO_GEOMETRY('POINT(1 1)')) AS length

┌─────────┐
│  length │
├─────────┤
│       0 │
└─────────┘

SELECT
  ST_LENGTH(TO_GEOMETRY('LINESTRING(0 0, 1 1)')) AS length

┌─────────────┐
│    length   │
├─────────────┤
│ 1.414213562 │
└─────────────┘

SELECT
  ST_LENGTH(
    TO_GEOMETRY('POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))')
  ) AS length

┌─────────┐
│  length │
├─────────┤
│       0 │
└─────────┘
```

### GEOGRAPHY 示例

```sql
SELECT
  ST_LENGTH(
    ST_GEOGFROMWKT(
      'LINESTRING(0 0, 1 0)'
    )
  ) AS length

╭──────────────────╮
│      length      │
├──────────────────┤
│ 111319.490793274 │
╰──────────────────╯
```
