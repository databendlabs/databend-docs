---
title: MAP_INSERT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.654"/>

返回一个新 MAP，该 MAP 由输入 MAP 插入新的键值对（或用新值更新现有键）组成。

## 语法

```sql
MAP_INSERT( <map>, <key>, <value> [, <updateFlag> ] )
```

## 参数

| 参数 | 描述 |
|---|---|
| `<map>` | 输入的 MAP。 |
| `<key>` | 要插入到 MAP 中的新键。 |
| `<value>` | 要插入到 MAP 中的新值。 |
| `<updateFlag>` | 布尔标志，指示是否可以覆盖现有键。默认为 FALSE。 |

## 返回类型

Map。

## 示例

```sql
SELECT MAP_INSERT({'a':1,'b':2,'c':3}, 'd', 4);
┌─────────────────────────────────────────┐
│ map_insert({'a':1,'b':2,'c':3}, 'd', 4) │
├─────────────────────────────────────────┤
│ {'a':1,'b':2,'c':3,'d':4}               │
└─────────────────────────────────────────┘

SELECT MAP_INSERT({'a':1,'b':2,'c':3}, 'a', 5, true);
┌───────────────────────────────────────────────┐
│ map_insert({'a':1,'b':2,'c':3}, 'a', 5, TRUE) │
├───────────────────────────────────────────────┤
│ {'a':5,'b':2,'c':3}                           │
└───────────────────────────────────────────────┘
```