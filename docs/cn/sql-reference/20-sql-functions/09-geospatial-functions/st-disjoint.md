---
title: ST_DISJOINT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.564"/>

当两个 GEOMETRY 对象不相交时返回 TRUE。

## 语法

```sql
ST_DISJOINT(<geometry1>, <geometry2>)
```

## 参数

| 参数 | 描述 |
|---------------|-------------------------------------------------------|
| `<geometry1>` | 参数必须是 GEOMETRY 类型的表达式。 |
| `<geometry2>` | 参数必须是 GEOMETRY 类型的表达式。 |

:::note
- 如果两个输入的 GEOMETRY 对象具有不同的 SRID，则函数会报告错误。
:::

## 返回类型

Boolean。

## 示例

```sql
SELECT ST_DISJOINT(
  TO_GEOMETRY('POINT(3 3)'),
  TO_GEOMETRY('POLYGON((0 0, 2 0, 2 2, 0 2, 0 0))')
) AS disjoint;

╭──────────╮
│ disjoint │
├──────────┤
│ true     │
╰──────────╯

SELECT ST_DISJOINT(
  TO_GEOMETRY('LINESTRING(0 0, 2 2)'),
  TO_GEOMETRY('LINESTRING(0 2, 2 0)')
) AS disjoint;

╭──────────╮
│ disjoint │
├──────────┤
│ false    │
╰──────────╯
```
