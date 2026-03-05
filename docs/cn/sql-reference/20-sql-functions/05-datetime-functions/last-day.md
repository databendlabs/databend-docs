---
title: LAST_DAY
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.655"/>

根据提供的日期或时间戳，返回指定间隔 (周、月、季度或年) 的最后一天。

## 语法

```sql
LAST_DAY(<date_expression>, <date_part>)
```

| 参数                | 描述                                                                                                   |
|---------------------|-------------------------------------------------------------------------------------------------------|
| `<date_expression>` | 用于计算指定间隔最后一天的 DATE 或 TIMESTAMP 值。                                |
| `<date_part>`       | 要查找最后一天的日期部分。接受的值为 `week`、`month`、`quarter` 和 `year`。     |

## 返回类型

Date。

## 示例

假设您想要确定账单日期，该日期始终是月份的最后一天，基于交易的任意日期 (例如，2024-11-13)：

```sql
SELECT LAST_DAY(to_date('2024-11-13'), month) AS billing_date;

┌──────────────┐
│ billing_date │
├──────────────┤
│ 2024-11-30   │
└──────────────┘
```