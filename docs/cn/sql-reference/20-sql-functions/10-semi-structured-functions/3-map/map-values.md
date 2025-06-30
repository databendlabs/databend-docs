---
title: MAP_VALUES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.429"/>

返回 MAP（映射）中的所有值。

## 语法

```sql
MAP_VALUES( <map> )
```

## 参数

| 参数 | 说明 |
| :--- | :--- |
| `<map>` | 输入的 MAP（映射）。 |

## 返回类型

Array。

## 示例

```sql
SELECT MAP_VALUES({'a':1,'b':2,'c':3});

┌─────────────────────────────────┐
│ map_values({'a':1,'b':2,'c':3}) │
├─────────────────────────────────┤
│ [1,2,3]                         │
└─────────────────────────────────┘
```