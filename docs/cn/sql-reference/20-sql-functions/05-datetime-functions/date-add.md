---
title: DATE_ADD
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.641"/>

将指定的时间间隔加到某个 DATE 或 TIMESTAMP 值上。

## 语法

```sql
DATE_ADD(<unit>, <interval>,  <date_or_time_expr>)
```

| 参数                  | 描述                                                                                               |
|-----------------------|----------------------------------------------------------------------------------------------------|
| `<unit>`              | 指定时间单位：`YEAR`、`QUARTER`、`MONTH`、`WEEK`、`DAY`、`HOUR`、`MINUTE` 和 `SECOND`。 |
| `<interval>`          | 要添加的时间间隔，例如单位是 `DAY` 时，2 表示 2 天。                                               |
| `<date_or_time_expr>` | `DATE` 或 `TIMESTAMP` 类型的值。                                                                   |

## 返回类型

DATE 或 TIMESTAMP（取决于 `<date_or_time_expr>` 的类型）。

## 示例

此示例将不同时间间隔（年、季度、月、周和日）添加到当前日期：

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

此示例将不同时间间隔（小时、分钟和秒）添加到当前时间戳：

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

:::note
- 当单位为 MONTH 时，若日期是该月最后一天或结果月份天数少于原日期的天数部分，则结果为该结果月份的最后一天
- 否则结果的天数部分与原日期相同

当向日期添加月份会导致无效日期时（如 1 月 31 日 → 2 月 31 日），该函数返回结果月份的最后一个有效日期：

```sql
SELECT DATE_ADD(month, 1, '2023-01-31'::DATE) ;
╭────────────────────────────────────────╮
│ DATE_ADD(MONTH, 1, '2023-01-31'::DATE) │
│                  日期                  │
├────────────────────────────────────────┤
│ 2023-02-28                             │
╰────────────────────────────────────────╯

```

当向日期添加月份且结果月份有足够天数时，执行简单月份运算：

```sql
SELECT DATE_ADD(month, 1, '2023-02-28'::DATE);
╭────────────────────────────────────────╮
│ DATE_ADD(MONTH, 1, '2023-02-28'::DATE) │
│                  日期                  │
├────────────────────────────────────────┤
│ 2023-03-28                             │
╰────────────────────────────────────────╯

```

## 另请参阅

- [ADD_MONTH](add-months.md)：添加月份的函数
- [DATE_SUB](date-sub.md)：减去时间间隔的函数