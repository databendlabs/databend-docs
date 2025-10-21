---
title: ST_SRID
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.458"/>

返回 GEOMETRY 对象的 SRID（Spatial Reference System Identifier）。

## 语法

```sql
ST_SRID(<geometry>)
```

## 参数

| 参数         | 描述                                         |
|--------------|----------------------------------------------|
| `<geometry>` | 参数必须是 GEOMETRY 类型的表达式。 |

## 返回类型

INT32。

:::note
如果 Geometry 没有 SRID，将返回默认值 4326。
:::

## 示例

```sql
SELECT
  ST_SRID(
    TO_GEOMETRY(
      'POINT(-122.306100 37.554162)',
      1234
    )
  ) AS pipeline_srid;

┌───────────────┐
│ pipeline_srid │
├───────────────┤
│          1234 │
└───────────────┘

SELECT
  ST_SRID(
    ST_MAKEGEOMPOINT(
      37.5, 45.5
    )
  ) AS pipeline_srid;

┌───────────────┐
│ pipeline_srid │
├───────────────┤
│          4326 │
└───────────────┘
```