---
title: AGE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.756"/>

`age()` 函数计算两个时间戳之间的差值，或一个时间戳与当前日期和时间之间的差值。

## 语法

```sql
AGE(<end_timestamp>, <start_timestamp>)
```

| 参数            | 描述                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| `<end_timestamp>`   | 结束时间戳                                       |
| `<start_timestamp>` | 开始时间戳                                |

## 返回类型

返回 INTERVAL 类型。

## 计算逻辑

该函数计算：
1. 完整的年份差（考虑闰年）
2. 剩余的月份差（考虑不同月份的天数）
3. 剩余的天数差（包括时间部分）

当 `<end_timestamp>` 早于 `<start_timestamp>` 时，返回负的时间间隔。

## 示例

### 基本年龄计算
```sql
SELECT AGE('2023-03-15'::TIMESTAMP, '2020-01-20'::TIMESTAMP);
├─────────────────────────┤
│ 3 年 1 个月 26 天         │
╰─────────────────────────╯
```

### 反向时间顺序
```sql
SELECT AGE('2018-12-25'::TIMESTAMP, '2022-05-10'::TIMESTAMP);
├─────────────────────────────┤
│ -3 年 -4 个月 -16 天          │
╰─────────────────────────────╯
```

### 带时间部分
```sql
SELECT AGE('2023-02-28 14:00:00'::TIMESTAMP, '2023-02-27 08:30:00'::TIMESTAMP);
├───────────────┤
│ 1 天 5:30:00  │
╰───────────────╯
```

### 表数据处理
```sql
CREATE TABLE projects (
    name String,
    start_date TIMESTAMP,
    end_date TIMESTAMP
);

INSERT INTO projects VALUES
    ('Alpha', '2020-06-01', '2023-09-30'),
    ('Beta', '2022-01-15', '2022-11-01');

SELECT 
    name,
    AGE(end_date, start_date) AS duration
FROM projects;
╭─────────────────────────────────────────────╮
│       name       │         duration         │
│ Nullable(String) │    Nullable(Interval)    │
├──────────────────┼──────────────────────────┤
│ Alpha            │ 3 年 3 个月 29 天        │
│ Beta             │ 9 个月 17 天             │
╰─────────────────────────────────────────────╯
```


## 另请参阅

- [DATE_DIFF](date-diff.md)：用于计算特定时间单位差异的替代函数