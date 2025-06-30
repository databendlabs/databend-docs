---
title: MAP_CONTAINS_KEY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.464"/>

判断指定的映射（MAP）是否包含指定的键（key）。

## 语法

```sql
MAP_CONTAINS_KEY( <map>, <key> )
```

## 参数

| 参数 | 描述 |
|-----------|-------------------------|
| `<map>` | 要搜索的 MAP。 |
| `<key>` | 要查找的键。 |

## 返回类型

布尔值（Boolean）。

## 示例

```sql
SELECT MAP_CONTAINS_KEY({'a':1,'b':2,'c':3}, 'c');
┌────────────────────────────────────────────┐
│ map_contains_key({'a':1,'b':2,'c':3}, 'c') │
├────────────────────────────────────────────┤
│ true                                       │
└────────────────────────────────────────────┘

SELECT MAP_CONTAINS_KEY({'a':1,'b':2,'c':3}, 'x');
┌────────────────────────────────────────────┐
│ map_contains_key({'a':1,'b':2,'c':3}, 'x') │
├────────────────────────────────────────────┤
│ false                                      │
└────────────────────────────────────────────┘
```