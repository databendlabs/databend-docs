---
title: DATE_ADD
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.641"/>

将指定的时间间隔添加到 DATE 或 TIMESTAMP 值。

## 语法

```sql
DATE_ADD(<unit>, <interval>,  <date_or_time_expr>)
```

| 参数                  | 描述                                                                                             |
|-----------------------|--------------------------------------------------------------------------------------------------|
| `<unit>`              | 指定时间单位：`YEAR`, `QUARTER`, `MONTH`, `WEEK`, `DAY`, `HOUR`, `MINUTE` 和 `SECOND`。          |
| `<interval>`          | 要添加的间隔，例如，如果单位是 `DAY`，则为 2 表示 2 天。                                          |
| `<date_or_time_expr>` | `DATE` 或 `TIMESTAMP` 类型的值。                                                                 |

## 返回类型

DATE 或 TIMESTAMP（取决于 `<date_or_time_expr>` 的类型）。

## 示例

此示例将不同的时间间隔（年、季度、月、周和天）添加到当前日期：

```sql
SELECT
    TODAY(),
    DATE_ADD(YEAR, 1, TODAY()),
    DATE_ADD(QUARTER, 1, TODAY()),
    DATE_ADD(MONTH, 1, TODAY()),
    DATE_ADD(WEEK, 1, TODAY()),
    DATE_ADD(DAY, 1, TODAY());

-[ RECORD 1 ]-----------------------------------
                      today(): 2024-10-10
   DATE_ADD(YEAR, 1, today()): 2025-10-10
DATE_ADD(QUARTER, 1, today()): 2025-01-10
  DATE_ADD(MONTH, 1, today()): 2024-11-10
   DATE_ADD(WEEK, 1, today()): 2024-10-17
    DATE_ADD(DAY, 1, today()): 2024-10-11
```

此示例将不同的时间间隔（小时、分钟和秒）添加到当前时间戳：

```sql
SELECT
    NOW(),
    DATE_ADD(HOUR, 1, NOW()),
    DATE_ADD(MINUTE, 1, NOW()),
    DATE_ADD(SECOND, 1, NOW());

-[ RECORD 1 ]-----------------------------------
                     now(): 2024-10-10 01:35:33.601312
  DATE_ADD(HOUR, 1, now()): 2024-10-10 02:35:33.601312
DATE_ADD(MINUTE, 1, now()): 2024-10-10 01:36:33.601312
DATE_ADD(SECOND, 1, now()): 2024-10-10 01:35:34.601312
```