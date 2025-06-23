---
title: ADD_MONTHS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="新增或更新于：v1.2.760"/>

`add_months()` 函数向给定日期或时间戳添加指定的月数。

若输入日期为月末日期，或超出结果月份的天数范围，则结果将调整为新月份的最后一天；否则，保留原日期中的天数。

## 语法

```sql
ADD_MONTHS(<date_or_timestamp>, <number_of_months>)
```

| 参数 | 描述 |
|---|---|
| `<date_or_timestamp>` | 作为基准的日期或时间戳，月份将添加至此 |
| `<number_of_months>` | 需添加的整数月份数（可为负数表示减去月份） |

## 返回类型

返回 `TIMESTAMP` 或 `DATE` 类型

## 示例

### 基本月份加法
```sql
SELECT ADD_MONTHS('2023-01-15'::DATE, 3);
├───────────────────────────────────┤
│ 2023-04-15                        │
╰───────────────────────────────────╯
```

### 月份减法
```sql
SELECT ADD_MONTHS('2023-06-20'::DATE, -4);
├─────────────────────────────────────┤
│ 2023-02-20                          │
╰─────────────────────────────────────╯
```

### 月末调整
```sql
SELECT ADD_MONTHS('2023-01-31'::DATE, 1);
├───────────────────────────────────┤
│ 2023-02-28                        │
╰───────────────────────────────────╯
```

### 保留时间戳
```sql
SELECT ADD_MONTHS('2023-03-15 14:30:00'::TIMESTAMP, 5);
├─────────────────────────────────────────────────┤
│ 2023-08-15 14:30:00.000000                      │
╰─────────────────────────────────────────────────╯
```

### 月末日期处理
```sql
CREATE TABLE contracts (
    id INT,
    sign_date DATE,
    duration_months INT
);

INSERT INTO contracts VALUES
    (1, '2023-01-15', 12),
    (2, '2024-02-28', 6),
    (3, '2023-11-30', 3);

SELECT 
    id,
    sign_date,
    ADD_MONTHS(sign_date, duration_months) AS end_date
FROM contracts;
├─────────────────┼────────────────┼────────────────┤
│               1 │ 2023-01-15     │ 2024-01-15     │
│               2 │ 2024-02-28     │ 2024-08-28     │
│               3 │ 2023-11-30     │ 2024-02-29     │
╰───────────────────────────────────────────────────╯

```

## 另请参阅

- [DATE_ADD](date-add.md)：添加特定时间间隔的替代函数
- [DATE_SUB](date-sub.md)：减去时间间隔的函数