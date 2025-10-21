---
title: ST_SETSRID
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.566"/>

返回一个 GEOMETRY 对象，其 [SRID（Spatial Reference System Identifier，空间参考系统标识符）](https://en.wikipedia.org/wiki/Spatial_reference_system#Identifier) 被设置为指定值。该函数仅修改 SRID，而不改变对象本身的坐标。如需同时转换坐标以匹配新的 SRS（Spatial Reference System，空间参考系统），请改用 [ST_TRANSFORM](st-transform.md)。

## 语法

```sql
ST_SETSRID(<geometry>, <srid>)
```

## 参数

| 参数         | 说明                                                         |
|--------------|-------------------------------------------------------------|
| `<geometry>` | 参数必须是 GEOMETRY 对象类型的表达式。                      |
| `<srid>`     | 要在返回的 GEOMETRY 对象中设置的 SRID 整数值。              |

## 返回类型

Geometry。

## 示例

```sql
SET GEOMETRY_OUTPUT_FORMAT = 'EWKT'

SELECT ST_SETSRID(TO_GEOMETRY('POINT(13 51)'), 4326) AS geometry

┌────────────────────────┐
│        geometry        │
├────────────────────────┤
│ SRID=4326;POINT(13 51) │
└────────────────────────┘

```