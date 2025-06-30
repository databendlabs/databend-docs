---
title: MAP_CAT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.459"/>

返回两个 MAP（映射）连接后的结果。

## 语法

```sql
MAP_CAT( <map1>, <map2> )
```

## 参数

| 参数 | 说明 |
|-----------|---------------------------------|
| `<map1>` | 源 MAP（映射）。 |
| `<map2>` | 要追加到 map1 的 MAP（映射）。 |

:::note
- 如果 map1 和 map2 包含相同的键（Key），则输出的 MAP（映射）中该键（Key）对应的值将来自 map2。
- 如果任一参数为 NULL，函数将返回 NULL，且不报告任何错误。
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