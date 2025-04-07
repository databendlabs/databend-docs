---
title: ST_LENGTH
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.555"/>

返回 GEOMETRY 对象中 LineString 的欧几里得长度。

## 语法

```sql
ST_LENGTH(<geometry>)
```

## 参数

| 参数         | 描述                                                                      |
|--------------|---------------------------------------------------------------------------|
| `<geometry>` | 该参数必须是包含 linestring 的 GEOMETRY 类型的表达式。                       |

:::note
- 如果 `<geometry>` 不是 `LineString`、`MultiLineString` 或包含 linestring 的 `GeometryCollection`，则返回 0。
- 如果 `<geometry>` 是 `GeometryCollection`，则返回集合中 linestring 的长度之和。
:::

## 返回类型

Double。

## 示例

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