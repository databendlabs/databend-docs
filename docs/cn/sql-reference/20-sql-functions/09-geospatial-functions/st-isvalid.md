---
title: ST_ISVALID
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.911"/>

如果 GEOMETRY 对象按照 OGC 规范是几何有效的，则返回 TRUE。

## 语法

```sql
ST_ISVALID(<geometry>)
```

## 参数

| 参数         | 描述              |
|--------------|-------------------|
| `<geometry>` | GEOMETRY 表达式。 |

## 返回类型

Boolean。

## 示例

```sql
SELECT ST_ISVALID(TO_GEOMETRY('POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))'));

┌──────────────────────────────────────────────────────────┐
│ st_isvalid(to_geometry('polygon((0 0, 1 0, 1 1, 0 1, 0 0))')) │
├──────────────────────────────────────────────────────────┤
│ true                                                          │
└──────────────────────────────────────────────────────────┘

-- 自相交多边形（蝴蝶结形状）无效
SELECT ST_ISVALID(TO_GEOMETRY('POLYGON((0 0, 2 2, 2 0, 0 2, 0 0))'));

┌──────────────────────────────────────────────────────────────┐
│ st_isvalid(to_geometry('polygon((0 0, 2 2, 2 0, 0 2, 0 0))')) │
├──────────────────────────────────────────────────────────────┤
│ false                                                             │
└──────────────────────────────────────────────────────────────┘
```
