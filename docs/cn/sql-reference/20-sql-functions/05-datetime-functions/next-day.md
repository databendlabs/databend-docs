---
title: NEXT_DAY
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.655"/>

返回给定日期或时间戳之后，下一个指定星期几的日期。

## 句法

```sql
NEXT_DAY(<date_expression>, <target_day>)
```

| 参数                | 描述                                                                                                                                                              |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<date_expression>` | 用于计算指定日期下一次出现时间的 `DATE` 或 `TIMESTAMP` 值。                                                                                 |
| `<target_day>`      | 要查找的下一个星期几。接受的值包括 `monday`、`tuesday`、`wednesday`、`thursday`、`friday`、`saturday` 和 `sunday`。 |

## 返回类型

Date。

## 示例

查找特定日期（例如 2024-11-13）之后的下一个星期一：

```sql
SELECT NEXT_DAY(to_date('2024-11-13'), monday) AS next_monday;

┌─────────────┐
│ next_monday │
├─────────────┤
│ 2024-11-18  │
└─────────────┘
```