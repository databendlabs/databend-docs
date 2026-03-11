---
title: ST_GEOGPOINTFROMGEOHASH
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.413"/>

返回表示 [geohash](https://en.wikipedia.org/wiki/Geohash) 中心点的 GEOGRAPHY 对象。

## 语法

```sql
ST_GEOGPOINTFROMGEOHASH(<geohash>)
```

## 参数

| 参数        | 说明                    |
|-------------|-------------------------|
| `<geohash>` | geohash 字符串。 |

## 返回类型

Geography。

## 示例

```sql
SELECT
  ST_ASWKT(
    ST_GEOGPOINTFROMGEOHASH(
      's02equ0'
    )
  ) AS pipeline_geography;

╭──────────────────────────────────────────────╮
│              pipeline_geography              │
│                    String                    │
├──────────────────────────────────────────────┤
│ POINT(1.0004425048828125 2.0001983642578125) │
╰──────────────────────────────────────────────╯
```
