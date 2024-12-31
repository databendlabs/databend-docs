---
title: TO_DECADES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.677"/>

将指定的十年数转换为 Interval 类型。

- 接受正整数、零和负整数作为输入。

## 语法

```sql
TO_DECADES(<decades>)
```

## 返回类型

Interval（以年表示）。

## 示例

```sql
SELECT TO_DECADES(2), TO_DECADES(0), TO_DECADES((- 2));

┌─────────────────────────────────────────────────┐
│ to_decades(2) │ to_decades(0) │ to_decades(- 2) │
├───────────────┼───────────────┼─────────────────┤
│ 20 years      │ 00:00:00      │ -20 years       │
└─────────────────────────────────────────────────┘
```{/*examples*/}