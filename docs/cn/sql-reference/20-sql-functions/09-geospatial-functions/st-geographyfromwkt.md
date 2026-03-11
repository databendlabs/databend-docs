---
title: ST_GEOGRAPHYFROMWKT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.347"/>

解析 [WKT（well-known-text）](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) 或 [EWKT（extended well-known-text）](https://postgis.net/docs/ST_GeomFromEWKT.html) 格式的输入，返回 GEOGRAPHY 类型的值。

## 语法

```sql
ST_GEOGRAPHYFROMWKT(<string>)
```

## 别名

- [ST_GEOGFROMWKT](st-geogfromwkt.md)
- [ST_GEOGRAPHYFROMEWKT](st-geographyfromewkt.md)
- [ST_GEOGRAPHYFROMTEXT](st-geographyfromtext.md)
- [ST_GEOGFROMTEXT](st-geogfromtext.md)

## 参数

| 参数        | 说明                                        |
|-------------|---------------------------------------------|
| `<string>`  | WKT 或 EWKT 格式的字符串表达式。 |

:::note
GEOGRAPHY 类型仅支持 SRID 4326。
:::

## 返回类型

Geography。

## 示例

```sql
SELECT
  ST_ASWKT(
    ST_GEOGRAPHYFROMWKT(
      'POINT(1 2)'
    )
  ) AS pipeline_geography;

┌────────────────────┐
│ pipeline_geography │
├────────────────────┤
│ POINT(1 2)         │
└────────────────────┘

SELECT
  ST_ASEWKT(
    ST_GEOGRAPHYFROMWKT(
      'SRID=4326;POINT(1 2)'
    )
  ) AS pipeline_geography;

┌──────────────────────┐
│ pipeline_geography   │
├──────────────────────┤
│ SRID=4326;POINT(1 2) │
└──────────────────────┘
```
