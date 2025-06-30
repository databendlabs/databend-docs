---
title: MAP_KEYS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.429"/>

返回一个 map（映射）中的所有键（key）。

## 语法

```sql
MAP_KEYS( <map> )
```

## 参数

| 参数     | 说明               |
|----------|--------------------|
| `<map>`  | 输入的 map（映射）。 |

## 返回类型

Array。

## 示例

```sql
SELECT MAP_KEYS({'a':1,'b':2,'c':3});

┌───────────────────────────────┐
│ map_keys({'a':1,'b':2,'c':3}) │
├───────────────────────────────┤
│ ['a','b','c']                 │
└───────────────────────────────┘
```