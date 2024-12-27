---
title: GENERATE_SERIES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

生成一个从指定起点开始，到指定终点结束，并可选择递增的数据集。GENERATE_SERIES 函数支持以下数据类型：

- 整数
- 日期
- 时间戳

## 语法

```sql
GENERATE_SERIES(<start>, <stop>[, <step_interval>])
```

## 参数

| 参数          | 描述                                                                                                                                                                                                 |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| start         | 起始值，表示序列中的第一个数字、日期或时间戳。                                                                                                                                                             |
| stop          | 结束值，表示序列中的最后一个数字、日期或时间戳。                                                                                                                                                            |
| step_interval | 步长间隔，决定序列中相邻值之间的差异。对于整数序列，默认值为 1。对于日期序列，默认步长间隔为 1 天。对于时间戳序列，默认步长间隔为 1 微秒。 	|


:::note
在处理 GENERATE_SERIES 和 RANGE 等函数时，一个关键区别在于它们的边界特性。GENERATE_SERIES 是左右边界都包含的，而 RANGE 仅包含左边界。例如，使用 RANGE(1, 11) 相当于 GENERATE_SERIES(1, 10)。
:::

## 返回类型

返回一个包含从 *start* 到 *stop* 的连续数字、日期或时间戳序列的列表。

## 示例

### 示例 1：生成数字、日期和时间戳数据

```sql
SELECT * FROM GENERATE_SERIES(1, 10, 2);

generate_series|
---------------+
              1|
              3|
              5|
              7|
              9|

SELECT * FROM GENERATE_SERIES('2023-03-20'::date, '2023-03-27'::date);

generate_series|
---------------+
     2023-03-20|
     2023-03-21|
     2023-03-22|
     2023-03-23|
     2023-03-24|
     2023-03-25|
     2023-03-26|
     2023-03-27|

SELECT * FROM GENERATE_SERIES('2023-03-26 00:00'::timestamp, '2023-03-27 12:00'::timestamp, 86400000000);

generate_series    |
-------------------+
2023-03-26 00:00:00|
2023-03-27 00:00:00|
```

### 示例 2：填补查询结果中的空缺

此示例使用 GENERATE_SERIES 函数和左连接操作符来处理由于特定范围内信息缺失而导致的查询结果中的空缺。

```sql
CREATE TABLE t_metrics (
  date Date,
  value INT
);

INSERT INTO t_metrics VALUES
  ('2020-01-01', 200),
  ('2020-01-01', 300),
  ('2020-01-04', 300),
  ('2020-01-04', 300),
  ('2020-01-05', 400),
  ('2020-01-10', 700);

SELECT date, SUM(value), COUNT() FROM t_metrics GROUP BY date ORDER BY date;

date      |sum(value)|count()|
----------+----------+-------+
2020-01-01|       500|      2|
2020-01-04|       600|      2|
2020-01-05|       400|      1|
2020-01-10|       700|      1|
```

为了填补 2020 年 1 月 1 日至 1 月 10 日之间的空缺，使用以下查询：

```sql
SELECT t.date, COALESCE(SUM(t_metrics.value), 0), COUNT(t_metrics.value)
FROM generate_series(
  '2020-01-01'::Date,
  '2020-01-10'::Date
) AS t(date)
LEFT JOIN t_metrics ON t_metrics.date = t.date
GROUP BY t.date ORDER BY t.date;

date      |coalesce(sum(t_metrics.value), 0)|count(t_metrics.value)|
----------+---------------------------------+----------------------+
2020-01-01|                              500|                     2|
2020-01-02|                                0|                     0|
2020-01-03|                                0|                     0|
2020-01-04|                              600|                     2|
2020-01-05|                              400|                     1|
2020-01-06|                                0|                     0|
2020-01-07|                                0|                     0|
2020-01-08|                                0|                     0|
2020-01-09|                                0|                     0|
2020-01-10|                              700|                     1|
```