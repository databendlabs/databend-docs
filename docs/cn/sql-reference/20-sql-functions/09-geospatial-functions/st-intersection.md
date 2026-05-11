---
title: ST_INTERSECTION
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.895"/>

返回两个 GEOMETRY 对象的重叠部分。

该函数仅支持 GEOMETRY 类型。

## 语法

```sql
ST_INTERSECTION(<geometry1>, <geometry2>)
```

## 参数

| 参数 | 说明 |
|------|------|
| `<geometry1>` | 必须是 GEOMETRY 类型的表达式。 |
| `<geometry2>` | 必须是 GEOMETRY 类型的表达式。 |

:::note
- 如果两个输入 GEOMETRY 对象的 SRID 不同，函数会报错。
:::

## 返回类型

GEOMETRY。

## 示例

```sql
SELECT ST_ASWKT(ST_INTERSECTION(TO_GEOMETRY('LINESTRING(0 0, 1 1)'), TO_GEOMETRY('LINESTRING(0 0, 1 1)')));

╭─────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ st_aswkt(st_intersection(to_geometry('LINESTRING(0 0, 1 1)'), to_geometry('LINESTRING(0 0, 1 1)'))) │
│                                                String                                               │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ LINESTRING(0 0,1 1)                                                                                 │
╰─────────────────────────────────────────────────────────────────────────────────────────────────────╯
```
