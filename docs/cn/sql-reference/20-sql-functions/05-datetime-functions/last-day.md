---
title: LAST_DAY
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.655"/>

根据提供的日期或时间戳，返回指定间隔（周、月、季度或年）的最后一天。

## 语法

```sql
LAST_DAY(<date_expression>, <interval>)
```

| 参数                | 描述                                                                                                   |
|---------------------|---------------------------------------------------------------------------------------------------------------|
| `<date_expression>` | 用于计算指定间隔最后一天的 DATE 或 TIMESTAMP 值。                                |
| `<interval>`        | 要查找最后一天的间隔类型。接受的值为 `week`、`month`、`quarter` 和 `year`。 |

## 返回类型

Date。

## 示例

假设您想根据交易的一个任意日期（例如，2024-11-13）确定账单日期，该日期始终是该月的最后一天：

```sql
SELECT LAST_DAY(to_date('2024-11-13'), month) AS billing_date;

┌──────────────┐
│ billing_date │
├──────────────┤
│ 2024-11-30   │
└──────────────┘
```