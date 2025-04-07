---
title: MAP_KEYS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.429"/>

返回 map 中的键。

## 语法

```sql
MAP_KEYS( <map> )
```

## 参数

| 参数      | 描述           |
|-----------|----------------|
| `<map>`   | 输入 map。     |

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