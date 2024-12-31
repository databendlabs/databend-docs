---
title: TO_MILLISECONDS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.677"/>

将指定的毫秒数转换为 Interval 类型。

- 接受正整数、零和负整数作为输入。

## 语法

```sql
TO_MILLISECONDS(<毫秒数>)
```

## 返回类型

Interval（格式为 `hh:mm:ss.sss`）。

## 示例

```sql
SELECT TO_MILLISECONDS(2), TO_MILLISECONDS(0), TO_MILLISECONDS((- 2));

┌────────────────────────────────────────────────────────────────┐
│ to_milliseconds(2) │ to_milliseconds(0) │ to_milliseconds(- 2) │
├────────────────────┼────────────────────┼──────────────────────┤
│ 0:00:00.002        │ 00:00:00           │ -0:00:00.002         │
└────────────────────────────────────────────────────────────────┘
```