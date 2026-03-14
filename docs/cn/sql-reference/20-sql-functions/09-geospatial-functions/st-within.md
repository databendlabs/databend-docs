---
title: ST_WITHIN
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.564"/>

当第一个 GEOMETRY 对象完全位于第二个 GEOMETRY 对象内部时返回 TRUE。

## 语法

```sql
ST_WITHIN(<geometry1>, <geometry2>)
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
SELECT ST_WITHIN(
  TO_GEOMETRY('POINT(1 1)'),
  TO_GEOMETRY('POLYGON((0 0, 2 0, 2 2, 0 2, 0 0))')
) AS within;

╭─────────╮
│  within │
├─────────┤
│ true    │
╰─────────╯
```
