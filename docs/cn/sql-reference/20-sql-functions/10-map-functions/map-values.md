---
title: MAP_VALUES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.429"/>

返回 map 中的值。

## 语法

```sql
MAP_VALUES( <map> )
```

## 参数

| 参数 | 描述 |
|-----------|----------------|
| `<map>`   | 输入 map。 |

## 返回类型

Array.

## 示例

```sql
SELECT MAP_VALUES({'a':1,'b':2,'c':3});

┌─────────────────────────────────┐
│ map_values({'a':1,'b':2,'c':3}) │
├─────────────────────────────────┤
│ [1,2,3]                         │
└─────────────────────────────────┘
```