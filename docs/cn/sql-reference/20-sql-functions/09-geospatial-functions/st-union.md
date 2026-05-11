---
title: ST_UNION
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.895"/>

返回由两个输入 GEOMETRY 对象合并得到的 GEOMETRY 结果。

该函数仅支持 GEOMETRY 类型。

## 语法

```sql
ST_UNION(<geometry1>, <geometry2>)
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
SELECT ST_ASWKT(ST_UNION(TO_GEOMETRY('POINT(0 0)'), TO_GEOMETRY('POINT(1 1)')));

╭──────────────────────────────────────────────────────────────────────────╮
│ st_aswkt(st_union(to_geometry('POINT(0 0)'), to_geometry('POINT(1 1)'))) │
├──────────────────────────────────────────────────────────────────────────┤
│ MULTIPOINT(0 0,1 1)                                                      │
╰──────────────────────────────────────────────────────────────────────────╯
```
