---
title: DATE_TRUNC
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.697"/>

将日期或时间戳截断到指定的精度。例如，如果将 `2022-07-07` 截断到 `MONTH`，结果将是 `2022-07-01`；如果将 `2022-07-07 01:01:01.123456` 截断到 `SECOND`，结果将是 `2022-07-07 01:01:01.000000`。

## 语法

```sql
DATE_TRUNC(<precision>, <date_or_timestamp>)
```

| 参数                 | 描述                                                                                                |
|----------------------|----------------------------------------------------------------------------------------------------|
| `<precision>`        | 必须是以下值之一：`YEAR`、`QUARTER`、`MONTH`、`WEEK`、`DAY`、`HOUR`、`MINUTE` 和 `SECOND`。         |
| `<date_or_timestamp>`| 一个 `DATE` 或 `TIMESTAMP` 类型的值。                                                              |

## 返回类型

与 `<date_or_timestamp>` 相同。

## 示例

```sql
SELECT
    DATE_TRUNC(MONTH, to_date('2022-07-07')),
    DATE_TRUNC(WEEK, to_date('2022-07-07'));

┌────────────────────────────────────────────────────────────────────────────────────┐
│ DATE_TRUNC(MONTH, to_date('2022-07-07')) │ DATE_TRUNC(WEEK, to_date('2022-07-07')) │
├──────────────────────────────────────────┼─────────────────────────────────────────┤
│ 2022-07-01                               │ 2022-07-04                              │
└────────────────────────────────────────────────────────────────────────────────────┘
```