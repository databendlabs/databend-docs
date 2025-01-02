---
title: TO_MILLENNIA
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.677"/>

将指定的千年数转换为 Interval 类型。

- 接受正整数、零和负整数作为输入。

## 语法

```sql
TO_MILLENNIA(<millennia>)
```

## 返回类型

Interval（以年表示）。

## 示例

```sql
SELECT TO_MILLENNIA(2), TO_MILLENNIA(0), TO_MILLENNIA((- 2));

┌───────────────────────────────────────────────────────┐
│ to_millennia(2) │ to_millennia(0) │ to_millennia(- 2) │
├─────────────────┼─────────────────┼───────────────────┤
│ 2000 年         │ 00:00:00        │ -2000 年          │
└───────────────────────────────────────────────────────┘
```