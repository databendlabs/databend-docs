---
title: ST_DWITHIN
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.895"/>

如果两个 GEOMETRY 对象之间的欧氏距离不超过指定距离，则返回 TRUE。

该函数仅支持 GEOMETRY 类型。

## 语法

```sql
ST_DWITHIN(<geometry1>, <geometry2>, <distance>)
```

## 参数

| 参数 | 说明 |
|------|------|
| `<geometry1>` | 必须是 GEOMETRY 类型的表达式。 |
| `<geometry2>` | 必须是 GEOMETRY 类型的表达式。 |
| `<distance>` | 最大欧氏距离，必须是可转换为 Float64 的数值。 |

:::note
- 如果两个输入 GEOMETRY 对象的 SRID 不同，函数会报错。
:::

## 返回类型

布尔值（Boolean）。

## 示例

```sql
SELECT ST_DWITHIN(TO_GEOMETRY('POINT(0 0)'), TO_GEOMETRY('POINT(1 1)'), 1.5);

╭───────────────────────────────────────────────────────────────────────╮
│ st_dwithin(to_geometry('POINT(0 0)'), to_geometry('POINT(1 1)'), 1.5) │
├───────────────────────────────────────────────────────────────────────┤
│ true                                                                  │
╰───────────────────────────────────────────────────────────────────────╯
```

```sql
SELECT ST_DWITHIN(TO_GEOMETRY('POINT(0 0)'), TO_GEOMETRY('LINESTRING(2 0, 2 2)'), 1.9);

╭─────────────────────────────────────────────────────────────────────────────────╮
│ st_dwithin(to_geometry('POINT(0 0)'), to_geometry('LINESTRING(2 0, 2 2)'), 1.9) │
├─────────────────────────────────────────────────────────────────────────────────┤
│ false                                                                           │
╰─────────────────────────────────────────────────────────────────────────────────╯
```
