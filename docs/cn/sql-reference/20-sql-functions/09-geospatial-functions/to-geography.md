---
title: TO_GEOGRAPHY
title_includes: TRY_TO_GEOGRAPHY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.431"/>

解析输入并返回 GEOGRAPHY 类型的值。

`TRY_TO_GEOGRAPHY` 在解析出错时返回 NULL，而不是报错。

## 语法

```sql
TO_GEOGRAPHY(<string>)
TO_GEOGRAPHY(<binary>)
TO_GEOGRAPHY(<variant>)
TRY_TO_GEOGRAPHY(<string>)
TRY_TO_GEOGRAPHY(<binary>)
TRY_TO_GEOGRAPHY(<variant>)
```

## 参数

| 参数        | 说明                                          |
|-------------|-----------------------------------------------|
| `<string>`  | WKT 或 EWKT 格式的字符串表达式。   |
| `<binary>`  | WKB 或 EWKB 格式的二进制表达式。   |
| `<variant>` | GeoJSON 格式的 JSON OBJECT 表达式。 |

:::note
GEOGRAPHY 类型仅支持 SRID 4326。
:::

## 返回类型

Geography。

## 示例

```sql
SELECT
  ST_ASWKT(
    TO_GEOGRAPHY(
      'POINT(1 2)'
    )
  ) AS pipeline_geography;

┌────────────────────┐
│ pipeline_geography │
├────────────────────┤
│ POINT(1 2)         │
└────────────────────┘

SELECT
  ST_ASWKT(
    TO_GEOGRAPHY(
      FROM_HEX('0101000000000000000000F03F0000000000000040')
    )
  ) AS pipeline_geography;

┌────────────────────┐
│ pipeline_geography │
├────────────────────┤
│ POINT(1 2)         │
└────────────────────┘

SELECT
  ST_ASWKT(
    TO_GEOGRAPHY(
      PARSE_JSON('{"type":"Point","coordinates":[1,2]}')
    )
  ) AS pipeline_geography;

┌────────────────────┐
│ pipeline_geography │
├────────────────────┤
│ POINT(1 2)         │
└────────────────────┘
```
