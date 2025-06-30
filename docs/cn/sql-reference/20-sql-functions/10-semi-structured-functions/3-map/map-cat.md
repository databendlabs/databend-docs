---
title: MAP_CAT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.459"/>

返回两个 MAP（映射）的串联结果。

## 语法

```sql
MAP_CAT( <map1>, <map2> )
```

## 参数

| 参数 | 说明 |
|-----------|---------------------------------|
| `<map1>` | 源 MAP（映射）。 |
| `<map2>` | 要附加到 map1 的 MAP（映射）。 |

:::note
- 如果 map1 和 map2 都存在相同键的值，则输出 MAP（映射）将采用 map2 的值。
- 如果任一参数为 NULL，则函数返回 NULL 且不报告错误。
:::

## 返回类型

MAP（映射）。

## 示例

```sql
SELECT MAP_CAT({'a':1,'b':2,'c':3}, {'c':5,'d':6});
┌─────────────────────────────────────────────┐
│ map_cat({'a':1,'b':2,'c':3}, {'c':5,'d':6}) │
├─────────────────────────────────────────────┤
│ {'a':1,'b':2,'c':5,'d':6}                   │
└─────────────────────────────────────────────┘
```