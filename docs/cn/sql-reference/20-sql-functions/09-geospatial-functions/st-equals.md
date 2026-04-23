---
title: ST_EQUALS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.564"/>

当两个 GEOMETRY 对象在空间上相等时返回 TRUE。

## 语法

```sql
ST_EQUALS(<geometry1>, <geometry2>)
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
SELECT ST_EQUALS(
  TO_GEOMETRY('POINT(1 1)'),
  TO_GEOMETRY('POINT(1 1)')
) AS equals;

╭────────╮
│ equals │
├────────┤
│ true   │
╰────────╯

SELECT ST_EQUALS(
  TO_GEOMETRY('POINT(1 1)'),
  TO_GEOMETRY('POINT(1 2)')
) AS equals;

╭────────╮
│ equals │
├────────┤
│ false  │
╰────────╯
```
