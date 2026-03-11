---
title: ST_MAKEPOINT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.347"/>

根据指定的经度和纬度，构造表示该点的 GEOGRAPHY 对象。

## 语法

```sql
ST_MAKEPOINT(<longitude>, <latitude>)
```

## 别名

- [ST_POINT](st-point.md)

## 参数

| 参数          | 说明                        |
|---------------|-----------------------------|
| `<longitude>` | Double 类型，表示经度。 |
| `<latitude>`  | Double 类型，表示纬度。 |

## 返回类型

Geography。

## 示例

```sql
SELECT
  ST_ASWKT(
    ST_MAKEPOINT(
      7.0, 8.0
    )
  ) AS pipeline_point;

┌────────────────┐
│ pipeline_point │
├────────────────┤
│ POINT(7 8)     │
└────────────────┘

SELECT
  ST_ASWKT(
    ST_MAKEPOINT(
      -122.3061, 37.554162
    )
  ) AS pipeline_point;

╭────────────────────────────╮
│       pipeline_point       │
├────────────────────────────┤
│ POINT(-122.3061 37.554162) │
╰────────────────────────────╯
```
