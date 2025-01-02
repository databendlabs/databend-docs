---
title: TO_CENTURIES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.677"/>

将指定的世纪数转换为 Interval 类型。

- 接受正整数、零和负整数作为输入。

## 语法

```sql
TO_CENTURIES(<centuries>)
```

## 返回类型

Interval（以年表示）。

## 示例

```sql
SELECT TO_CENTURIES(2), TO_CENTURIES(0), TO_CENTURIES(-2);

┌───────────────────────────────────────────────────────┐
│ to_centuries(2) │ to_centuries(0) │ to_centuries(- 2) │
├─────────────────┼─────────────────┼───────────────────┤
│ 200 years       │ 00:00:00        │ -200 years        │
└───────────────────────────────────────────────────────┘
```