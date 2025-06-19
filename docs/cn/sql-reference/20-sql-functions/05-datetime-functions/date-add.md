---
title: DATE_ADD
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.641"/>

为日期（DATE）或时间戳（TIMESTAMP）值添加指定的时间间隔。

## 语法

```sql
DATE_ADD(<unit>, <interval>,  <date_or_time_expr>)
```

| 参数                  | 说明                                                                                               |
|-----------------------|----------------------------------------------------------------------------------------------------|
| `<unit>`              | 指定时间单位：`YEAR`、`QUARTER`、`MONTH`、`WEEK`、`DAY`、`HOUR`、`MINUTE` 和 `SECOND`。             |
| `<interval>`          | 要添加的时间间隔，例如单位是 `DAY` 时，2 表示 2 天。                                               |
| `<date_or_time_expr>` | `日期（DATE）` 或 `时间戳（TIMESTAMP）` 类型的值。                                                 |

## 返回类型

日期（DATE）或时间戳（TIMESTAMP）（取决于 `<date_or_time_expr>` 的类型）。

## 示例

此示例将不同时间间隔（年、季度、月、周、日）添加到当前日期：

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

此示例将不同时间间隔（小时、分钟、秒）添加到当前时间戳：

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
- 当单位为 MONTH 时，若日期是当月最后一天，或结果月份天数少于日期中的天数部分，
- 则返回结果月份的最后一天；否则保留原日期中的天数部分。

当添加月份会导致无效日期时（如 1月31日 → 2月31日），函数返回结果月份的最后有效日：

```sql
SELECT DATE_ADD(month, 1, '2023-01-31'::DATE) ;
╭────────────────────────────────────────╮
│ DATE_ADD(MONTH, 1, '2023-01-31'::DATE) │
│                  日期                  │
├────────────────────────────────────────┤
│ 2023-02-28                             │
╰────────────────────────────────────────╯

```

当添加月份后结果月份天数充足时，执行标准月份运算：

```sql
SELECT DATE_ADD(month, 1, '2023-02-28'::DATE);
╭────────────────────────────────────────╮
│ DATE_ADD(MONTH, 1, '2023-02-28'::DATE) │
│                  日期                  │
├────────────────────────────────────────┤
│ 2023-03-28                             │
╰────────────────────────────────────────╯

```