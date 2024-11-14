---
title: NEXT_DAY
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.655"/>

返回给定日期或时间戳之后即将到来的指定星期几的日期。

## 语法

```sql
NEXT_DAY(<date_expression>, <target_day>)
```

| 参数                | 描述                                                                                                                                                              |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<date_expression>` | 用于计算指定星期几的下一个日期的 `DATE` 或 `TIMESTAMP` 值。                                                                                 |
| `<target_day>`      | 要查找下一个日期的目标星期几。接受的值包括 `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, 和 `sunday`。 |

## 返回类型

日期。

## 示例

要查找特定日期（如 2024-11-13）之后的下一个星期一：

```sql
SELECT NEXT_DAY(to_date('2024-11-13'), monday) AS next_monday;

┌─────────────┐
│ next_monday │
├─────────────┤
│ 2024-11-18  │
└─────────────┘
```