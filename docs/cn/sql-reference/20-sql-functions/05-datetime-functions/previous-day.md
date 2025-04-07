---
title: PREVIOUS_DAY
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.655"/>

返回给定日期或时间戳之前最近一次出现的指定星期几的日期。

## 语法

```sql
PREVIOUS_DAY(<date_expression>, <target_day>)
```

| 参数              | 描述                                                                                                                                                              |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<date_expression>` | 用于计算指定日期之前最近一次出现的 `DATE` 或 `TIMESTAMP` 值。                                                                                 |
| `<target_day>`      | 要查找之前最近一次出现的星期几。可接受的值包括 `monday`、`tuesday`、`wednesday`、`thursday`、`friday`、`saturday` 和 `sunday`。 |

## 返回类型

Date.

## 示例

如果您需要查找给定日期（例如 2024-11-13）之前的上一个星期五：

```sql
SELECT PREVIOUS_DAY(to_date('2024-11-13'), friday) AS last_friday;

┌─────────────┐
│ last_friday │
├─────────────┤
│ 2024-11-08  │
└─────────────┘
```