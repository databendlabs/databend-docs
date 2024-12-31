---
title: TO_SECONDS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.677"/>

将指定的秒数转换为 Interval 类型。

- 接受正整数、零和负整数作为输入。

## 语法

```sql
TO_SECONDS(<seconds>)
```

## 别名

- [EPOCH](epoch.md)

## 返回类型

Interval（格式为 `hh:mm:ss`）。

## 示例

```sql
SELECT TO_SECONDS(2), TO_SECONDS(0), TO_SECONDS((- 2));

┌─────────────────────────────────────────────────┐
│ to_seconds(2) │ to_seconds(0) │ to_seconds(- 2) │
├───────────────┼───────────────┼─────────────────┤
│ 0:00:02       │ 00:00:00      │ -0:00:02        │
└─────────────────────────────────────────────────┘
```