---
title: ST_LENGTH
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.555"/>

返回GEOMETRY对象中LineString的几何长度。

## 语法

```sql
ST_LENGTH(<geometry>)
```

## 参数

| 参数         | 描述                                                                 |
|--------------|---------------------------------------------------------------------|
| `<geometry>` | 参数必须是包含LineString的GEOMETRY类型的表达式。                   |

:::note
- 如果`<geometry>`不是`LineString`、`MultiLineString`或包含LineString的`GeometryCollection`，则返回0。
- 如果`<geometry>`是`GeometryCollection`，则返回集合中所有LineString长度的总和。
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