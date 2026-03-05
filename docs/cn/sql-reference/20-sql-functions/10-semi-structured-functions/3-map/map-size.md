---
title: MAP_SIZE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.459"/>

返回一个 MAP（映射）的大小。

## 语法

```sql
MAP_SIZE( <map> )
```

## 参数

| 参数 | 描述 |
| :--- | :--- |
| `<map>` | 输入的 MAP（映射）。 |

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