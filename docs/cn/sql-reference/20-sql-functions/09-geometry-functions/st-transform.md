---
title: ST_TRANSFORM
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.606"/>

将 GEOMETRY 对象从一个[空间参考系统 (SRS)](https://en.wikipedia.org/wiki/Spatial_reference_system)转换为另一个。如果只需要更改 SRID 而无需更改坐标（例如，如果 SRID 不正确），请改用 [ST_SETSRID](st-setsrid.md)。

## 语法

```sql
ST_TRANSFORM(<geometry> [, <from_srid>], <to_srid>)
```

## 参数

| 参数            | 描述                                                                                                                                                     |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<geometry>`  | 该参数必须是 GEOMETRY 类型的表达式。                                                                                                                         |
| `<from_srid>` | 可选参数，用于标识输入 GEOMETRY 对象当前的 SRS。如果省略此参数，则使用输入 GEOMETRY 对象中指定的 SRID。                                                                               |
| `<to_srid>`   | 用于标识要使用的 SRS 的 SRID，将输入 GEOMETRY 对象转换为使用此 SRS 的新对象。                                                                                             |

## 返回类型

Geometry.

## 示例

```sql
SET GEOMETRY_OUTPUT_FORMAT = 'EWKT'

SELECT ST_TRANSFORM(ST_GEOMFROMWKT('POINT(389866.35 5819003.03)', 32633), 3857) AS transformed_geom

┌───────────────────────────────────────────────┐
│                transformed_geom               │
├───────────────────────────────────────────────┤
│ SRID=3857;POINT(1489140.093766 6892872.19868) │
└───────────────────────────────────────────────┘

SELECT ST_TRANSFORM(ST_GEOMFROMWKT('POINT(4.500212 52.161170)'), 4326, 28992) AS transformed_geom

┌──────────────────────────────────────────────┐
│               transformed_geom               │
├──────────────────────────────────────────────┤
│ SRID=28992;POINT(94308.670475 464038.168827) │
└──────────────────────────────────────────────┘

```