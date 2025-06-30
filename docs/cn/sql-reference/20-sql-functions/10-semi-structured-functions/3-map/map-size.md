---
title: MAP_SIZE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.459"/>

返回 MAP 的大小。

## 语法

```sql
MAP_SIZE( <map> )
```

## 参数

| 参数   | 说明         |
| :----- | :----------- |
| `<map>` | 输入的 map。 |

## 返回类型

UInt64。

## 示例

```sql
SELECT MAP_SIZE({'a':1,'b':2,'c':3});

┌───────────────────────────────┐
│ map_size({'a':1,'b':2,'c':3}) │
├───────────────────────────────┤
│ 3                             │
└───────────────────────────────┘
```