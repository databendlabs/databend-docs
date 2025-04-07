---
title: MONTHS_BETWEEN
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.307"/>

返回 *date1* 和 *date2* 之间的月数。

## 语法

```sql
MONTHS_BETWEEN( <date1>, <date2> )
```

## 参数

*date1* 和 *date2* 可以是 DATE 类型、TIMESTAMP 类型或两者的混合。

## 返回类型

该函数根据以下规则返回一个 FLOAT 值：

- 如果 *date1* 早于 *date2*，则该函数返回一个负值；否则，它返回一个正值。

    ```sql title='Example:'
    SELECT
        MONTHS_BETWEEN('2024-03-15'::DATE,
                    '2024-02-15'::DATE),
        MONTHS_BETWEEN('2024-02-15'::DATE,
                    '2024-03-15'::DATE);

    -[ RECORD 1 ]-----------------------------------
    months_between('2024-03-15'::date, '2024-02-15'::date): 1
    months_between('2024-02-15'::date, '2024-03-15'::date): -1
    ```

- 如果 *date1* 和 *date2* 落在各自月份的同一天，或者都是各自月份的最后一天，则结果为整数。否则，该函数将基于 31 天的月份计算结果的小数部分。

    ```sql title='Example:'
    SELECT
        MONTHS_BETWEEN('2024-02-29'::DATE,
                    '2024-01-29'::DATE),
        MONTHS_BETWEEN('2024-02-29'::DATE,
                    '2024-01-31'::DATE);

    -[ RECORD 1 ]-----------------------------------
    months_between('2024-02-29'::date, '2024-01-29'::date): 1
    months_between('2024-02-29'::date, '2024-01-31'::date): 1

    SELECT
        MONTHS_BETWEEN('2024-08-05'::DATE,
                    '2024-01-01'::DATE);

    -[ RECORD 1 ]-----------------------------------
    months_between('2024-08-05'::date, '2024-01-01'::date): 7.129032258064516
    ```

- 如果 *date1* 和 *date2* 是同一天，则该函数会忽略任何时间组成部分并返回 0。

    ```sql title='Example:'
    SELECT
        MONTHS_BETWEEN('2024-08-05'::DATE,
                    '2024-08-05'::DATE),
        MONTHS_BETWEEN('2024-08-05 02:00:00'::TIMESTAMP,
                    '2024-08-05 01:00:00'::TIMESTAMP);

    -[ RECORD 1 ]-----------------------------------
                                months_between('2024-08-05'::date, '2024-08-05'::date): 0
    months_between('2024-08-05 02:00:00'::timestamp, '2024-08-05 01:00:00'::timestamp): 0
    ```