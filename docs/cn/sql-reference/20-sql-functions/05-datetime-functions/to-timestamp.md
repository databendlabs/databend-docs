---
title: TO_TIMESTAMP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.664"/>

将表达式转换为带时间的日期。

另请参阅: [TO_DATE](to-date)

## 语法

该函数支持多种重载，涵盖以下用例：

```sql
-- 将字符串或整数转换为时间戳
TO_TIMESTAMP(<expr>)
```

如果给定的是 [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) 日期格式字符串，函数会从字符串中提取日期；如果给定的是整数，函数会将整数解释为 Unix 纪元（1970 年 1 月 1 日午夜）之前（对于负数）或之后（对于正数）的秒数、毫秒数或微秒数，具体取决于 `x` 的绝对值：

| 范围                                       | 单位                 |
|---------------------------------------------|----------------------|
| \|x\| < 31,536,000,000                      | 秒                   |
| 31,536,000,000 ≤ \|x\| < 31,536,000,000,000 | 毫秒                 |
| \|x\| ≥ 31,536,000,000,000                  | 微秒                 |

```sql
-- 使用给定的模式将字符串转换为时间戳
TO_TIMESTAMP(<expr>, <pattern>)
```

该函数根据第二个字符串中指定的模式将第一个字符串转换为时间戳。要指定模式，请使用格式说明符。格式说明符允许您定义日期和时间值的所需格式。有关支持的格式说明符的完整列表，请参阅 [日期和时间格式化](../../00-sql-reference/10-data-types/datetime.md#formatting-date-and-time)。

```sql
-- 根据指定的比例将整数转换为时间戳
TO_TIMESTAMP(<int>, <scale>)
```

该函数将整数值转换为时间戳，将整数解释为自 Unix 纪元（1970 年 1 月 1 日午夜）以来的秒数（或根据指定比例的分数秒）。比例定义了分数秒的精度，支持 0 到 6 的值。例如：

- `scale = 0`：将整数解释为秒。
- `scale = 1`：将整数解释为十分之一秒。
- `scale = 6`：将整数解释为微秒。

## 返回类型

返回格式为 `YYYY-MM-DD hh:mm:ss.ffffff` 的时间戳：

- 返回的时间戳始终反映您的 Databend 时区。
    - 当给定的字符串中存在时区信息时，它会将时间戳转换为 Databend 中配置的时区对应的时间。换句话说，它会调整时间戳以反映 Databend 中设置的时区。

    ```sql
    -- 设置时区为 'America/Toronto' (UTC-5:00, 东部标准时间)
    SET timezone = 'America/Toronto';

    SELECT TO_TIMESTAMP('2022-01-02T01:12:00-07:00'), TO_TIMESTAMP('2022/01/02T01:12:00-07:00', '%Y/%m/%dT%H:%M:%S%::z');

    ┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
    │ to_timestamp('2022-01-02t01:12:00-07:00') │ to_timestamp('2022/01/02t01:12:00-07:00', '%y/%m/%dt%h:%m:%s%::z') │
    ├───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┤
    │ 2022-01-02 03:12:00                       │ 2022-01-02 03:12:00                                                │
    └────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
    ```

    - 如果给定的字符串中没有时区信息，它会将时间戳视为属于当前会话中配置的时区。

    ```sql
    -- 设置时区为 'America/Toronto' (UTC-5:00, 东部标准时间)
    SET timezone = 'America/Toronto';
    
    SELECT TO_TIMESTAMP('2022-01-02T01:12:00'), TO_TIMESTAMP('2022/01/02T01:12:00', '%Y/%m/%dT%H:%M:%S');

    ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
    │ to_timestamp('2022-01-02t01:12:00') │ to_timestamp('2022/01/02t01:12:00', '%y/%m/%dt%h:%m:%s') │
    ├─────────────────────────────────────┼──────────────────────────────────────────────────────────┤
    │ 2022-01-02 01:12:00                 │ 2022-01-02 01:12:00                                      │
    └────────────────────────────────────────────────────────────────────────────────────────────────┘
    ```

- 如果给定的字符串匹配此格式但没有时间部分，它会自动扩展为此模式。填充值为 0。
- 如果转换失败，将返回错误。为了避免此类错误，您可以使用 [TRY_TO_TIMESTAMP](try-to-timestamp.md) 函数。

    ```sql
    root@localhost:8000/default> SELECT TO_TIMESTAMP('20220102');
    error: APIError: ResponseError with 1006: cannot parse to type `TIMESTAMP` while evaluating function `to_timestamp('20220102')`

    root@localhost:8000/default> SELECT TRY_TO_TIMESTAMP('20220102');

    SELECT
    try_to_timestamp('20220102')

    ┌──────────────────────────────┐
    │ try_to_timestamp('20220102') │
    ├──────────────────────────────┤
    │ NULL                         │
    └──────────────────────────────┘
    ```

## 别名

- [TO_DATETIME](to-datetime.md)
- [STR_TO_TIMESTAMP](str-to-timestamp.md)

## 示例

### 示例-1: 将字符串转换为时间戳

```sql
SELECT TO_TIMESTAMP('2022-01-02 02:00:11');

┌─────────────────────────────────────┐
│ to_timestamp('2022-01-02 02:00:11') │
├─────────────────────────────────────┤
│ 2022-01-02 02:00:11                 │
└─────────────────────────────────────┘

SELECT TO_TIMESTAMP('2022-01-02T01');

┌───────────────────────────────┐
│ to_timestamp('2022-01-02t01') │
├───────────────────────────────┤
│ 2022-01-02 01:00:00           │
└───────────────────────────────┘

-- 设置时区为 'America/Toronto' (UTC-5:00, 东部标准时间)
SET timezone = 'America/Toronto';
-- 将提供的字符串转换为当前时区 ('America/Toronto')
SELECT TO_TIMESTAMP('2022-01-02T01:12:00-07:00');

┌───────────────────────────────────────────┐
│ to_timestamp('2022-01-02t01:12:00-07:00') │
├───────────────────────────────────────────┤
│ 2022-01-02 03:12:00                       │
└───────────────────────────────────────────┘
```

### 示例-2: 将整数转换为时间戳

```sql
SELECT TO_TIMESTAMP(1), TO_TIMESTAMP(-1);

┌───────────────────────────────────────────┐
│   to_timestamp(1)   │  to_timestamp(- 1)  │
├─────────────────────┼─────────────────────┤
│ 1969-12-31 19:00:01 │ 1969-12-31 18:59:59 │
└───────────────────────────────────────────┘
```

您还可以将整数字符串转换为时间戳：

```sql
SELECT TO_TIMESTAMP(TO_INT64('994518299'));

┌─────────────────────────────────────┐
│ to_timestamp(to_int64('994518299')) │
├─────────────────────────────────────┤
│ 2001-07-07 15:04:59                 │
└─────────────────────────────────────┘
```

:::note
- 您也可以使用 `SELECT TO_TIMESTAMP('994518299', '%s')` 进行转换，但不推荐。对于此类转换，Databend 建议使用上述示例中的方法以获得更好的性能。

- 时间戳值的范围从 1000-01-01 00:00:00.000000 到 9999-12-31 23:59:59.999999。如果您运行以下语句，Databend 将返回错误：

```bash
root@localhost:8000/default> SELECT TO_TIMESTAMP(9999999999999999999);
error: APIError: ResponseError with 1006: number overflowed while evaluating function `to_int64(9999999999999999999)`
```
:::

### 示例-3: 使用模式将字符串转换

```sql
-- 设置时区为 'America/Toronto' (UTC-5:00, 东部标准时间)
SET timezone = 'America/Toronto';

-- 将提供的字符串转换为当前时区 ('America/Toronto')
SELECT TO_TIMESTAMP('2022/01/02T01:12:00-07:00', '%Y/%m/%dT%H:%M:%S%::z');

┌────────────────────────────────────────────────────────────────────┐
│ to_timestamp('2022/01/02t01:12:00-07:00', '%y/%m/%dt%h:%m:%s%::z') │
├────────────────────────────────────────────────────────────────────┤
│ 2022-01-02 03:12:00                                                │
└────────────────────────────────────────────────────────────────────┘

-- 如果未指定时区，则应用会话的时区。
SELECT TO_TIMESTAMP('2022/01/02T01:12:00', '%Y/%m/%dT%H:%M:%S');

┌──────────────────────────────────────────────────────────┐
│ to_timestamp('2022/01/02t01:12:00', '%y/%m/%dt%h:%m:%s') │
├──────────────────────────────────────────────────────────┤
│ 2022-01-02 01:12:00                                      │
└──────────────────────────────────────────────────────────┘
```

### 示例-4: 使用比例将整数转换

```sql
-- 以秒精度解释整数 (scale = 0)
SELECT TO_TIMESTAMP(1638473645, 0), TO_TIMESTAMP(-1638473645, 0);

┌─────────────────────────────────────────────────────────────┐
│ to_timestamp(1638473645, 0) │ to_timestamp(- 1638473645, 0) │
├─────────────────────────────┼───────────────────────────────┤
│ 2021-12-02 19:34:05         │ 1918-01-30 04:25:55           │
└─────────────────────────────────────────────────────────────┘

-- 以毫秒精度解释整数 (scale = 3)
SELECT TO_TIMESTAMP(1638473645123, 3);

┌────────────────────────────────┐
│ to_timestamp(1638473645123, 3) │
├────────────────────────────────┤
│ 2021-12-02 19:34:05.123        │
└────────────────────────────────┘
```