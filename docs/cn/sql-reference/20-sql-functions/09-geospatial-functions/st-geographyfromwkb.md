---
title: ST_GEOGRAPHYFROMWKB
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.395"/>

解析 [WKB（well-known-binary）](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry#Well-known_binary) 或 [EWKB（extended well-known-binary）](https://postgis.net/docs/ST_GeomFromEWKB.html) 格式的输入，返回 GEOGRAPHY 类型的值。

## 语法

```sql
ST_GEOGRAPHYFROMWKB(<string>)
ST_GEOGRAPHYFROMWKB(<binary>)
```

## 别名

- [ST_GEOGFROMWKB](st-geogfromwkb.md)
- [ST_GEOGETRYFROMWKB](st-geogetryfromwkb.md)
- [ST_GEOGFROMEWKB](st-geogfromewkb.md)

## 参数

| 参数        | 说明                                                        |
|-------------|-------------------------------------------------------------|
| `<string>`  | 十六进制格式的 WKB 或 EWKB 字符串表达式。 |
| `<binary>`  | WKB 或 EWKB 格式的二进制表达式。           |

:::note
GEOGRAPHY 类型仅支持 SRID 4326。
:::

## 返回类型

Geography。

## 示例

```sql
SELECT
  ST_ASWKT(
    ST_GEOGRAPHYFROMWKB(
      '0101000020E6100000000000000000F03F0000000000000040'
    )
  ) AS pipeline_geography;

┌────────────────────┐
│ pipeline_geography │
├────────────────────┤
│ POINT(1 2)         │
└────────────────────┘

SELECT
  ST_ASWKT(
    ST_GEOGRAPHYFROMWKB(
      FROM_HEX('0101000000000000000000F03F0000000000000040')
    )
  ) AS pipeline_geography;

┌────────────────────┐
│ pipeline_geography │
├────────────────────┤
│ POINT(1 2)         │
└────────────────────┘
```
