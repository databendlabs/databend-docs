---
title: ST_SRID
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.458"/>

返回 GEOMETRY 或 GEOGRAPHY 对象的 SRID（空间参考系统标识符）。

## 语法

```sql
ST_SRID(<geometry_or_geography>)
```

## 参数

| 参数 | 描述 |
|--------------|------------------------------------------------------|
| `<geometry_or_geography>` | 参数必须是 GEOMETRY 或 GEOGRAPHY 类型的表达式。 |

## 返回类型

INT32。

:::note
- 如果 Geometry 不包含 SRID，将返回默认值 0。
- Geography 的 SRID 固定为 4326。
:::

## 示例

### GEOMETRY 示例

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
│             0 │
└───────────────┘
```

### GEOGRAPHY 示例

```sql
SELECT
  ST_SRID(
    ST_GEOGFROMWKT(
      'POINT(1 2)'
    )
  ) AS pipeline_srid;

┌───────────────┐
│ pipeline_srid │
├───────────────┤
│          4326 │
└───────────────┘
```
