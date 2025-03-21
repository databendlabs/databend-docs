---
title: 日期与时间
description: 基本的日期和时间数据类型。
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.705"/>

## 日期与时间数据类型

| 名称      | 别名      | 存储大小 | 分辨率      | 最小值                  | 最大值                      | 格式                                                                         |
|-----------|----------|--------------|-------------|----------------------------|--------------------------------|--------------------------------------------------------------------------------|
| DATE      |          | 4 字节      | 天         | 0001-01-01                 | 9999-12-31                     | `YYYY-MM-DD`                                                                   |
| TIMESTAMP | DATETIME | 8 字节      | 微秒        | 0001-01-01 00:00:00.000000 | 9999-12-31 23:59:59.999999 UTC | `YYYY-MM-DD hh:mm:ss[.fraction]`，支持最多 6 位微秒精度 |


## 示例

```sql
CREATE TABLE test_dt
  (
     date DATE,
     ts   TIMESTAMP
  );
```

```sql
DESC test_dt;
```

结果：

```
┌────────────────────────────────────────────────┐
│  字段  │    类型    │  可为空  │  默认值  │  额外  │
├────────┼───────────┼────────┼─────────┼────────┤
│ date   │ DATE      │ YES    │ NULL    │        │
│ ts     │ TIMESTAMP │ YES    │ NULL    │        │
└────────────────────────────────────────────────┘
```

TIMESTAMP 值可以选择性地包含最多 6 位微秒精度的尾随小数部分。

```sql
-- 向表中插入值
INSERT INTO test_dt
VALUES
  ('2022-04-07', '2022-04-07 01:01:01.123456'),
  ('2022-04-08', '2022-04-08 01:01:01');

SELECT *
FROM test_dt;
```

结果：

```
┌─────────────────────────────────────────────┐
│      date      │             ts             │
├────────────────┼────────────────────────────┤
│ 2022-04-07     │ 2022-04-07 01:01:01.123456 │
│ 2022-04-08     │ 2022-04-08 01:01:01        │
└─────────────────────────────────────────────┘
```

Databend 支持多种 TIMESTAMP 值格式。

```sql
-- 创建一个表来测试不同的时间戳格式
CREATE TABLE test_formats (
    id INT,
    a TIMESTAMP
);

-- 插入不同格式的时间戳值
INSERT INTO test_formats
VALUES
    (1, '2022-01-01 02:00:11'),
    (2, '2022-01-02T02:00:22'),
    (3, '2022-02-02T04:00:03+00:00'),
    (4, '2022-02-03');
```

```sql
SELECT *
FROM test_formats;

```

结果：

```
┌───────────────────────────────────────┐
│        id       │          a          │
├─────────────────┼─────────────────────┤
│               1 │ 2022-01-01 02:00:11 │
│               2 │ 2022-01-02 02:00:22 │
│               3 │ 2022-02-02 04:00:03 │
│               4 │ 2022-02-03 00:00:00 │
└───────────────────────────────────────┘
```

Databend 会根据当前时区自动调整并显示 TIMESTAMP 值。

```sql
-- 创建一个表来测试带时区调整的时间戳值
CREATE TABLE test_tz (
    id INT,
    t TIMESTAMP
);

-- 设置时区为 UTC
SET timezone = 'UTC';

-- 插入考虑不同时区的时间戳值
INSERT INTO test_tz
VALUES
    (1, '2022-02-03T03:00:00'),
    (2, '2022-02-03T03:00:00+08:00'),
    (3, '2022-02-03T03:00:00-08:00'),
    (4, '2022-02-03'),
    (5, '2022-02-03T03:00:00+09:00'),
    (6, '2022-02-03T03:00:00+06:00');
```

```
SELECT *
FROM test_tz;
```

结果：

```
┌───────────────────────────────────────┐
│        id       │          t          │
├─────────────────┼─────────────────────┤
│               1 │ 2022-02-03 03:00:00 │
│               2 │ 2022-02-02 19:00:00 │
│               3 │ 2022-02-03 11:00:00 │
│               4 │ 2022-02-03 00:00:00 │
│               5 │ 2022-02-02 18:00:00 │
│               6 │ 2022-02-02 21:00:00 │
└───────────────────────────────────────┘
```

```sql
-- 将时区更改为 Asia/Shanghai
SET timezone = 'Asia/Shanghai';

-- 使用新的时区设置从表中选择数据
SELECT *
FROM test_tz;
```

结果：

```
┌───────────────────────────────────────┐
│        id       │          t          │
├─────────────────┼─────────────────────┤
│               1 │ 2022-02-03 11:00:00 │
│               2 │ 2022-02-03 03:00:00 │
│               3 │ 2022-02-03 19:00:00 │
│               4 │ 2022-02-03 08:00:00 │
│               5 │ 2022-02-03 02:00:00 │
│               6 │ 2022-02-03 05:00:00 │
└───────────────────────────────────────┘
```

## 函数

参见 [日期与时间函数](/sql/sql-functions/datetime-functions)。

## 处理夏令时调整

在某些地区，会实行夏令时。在夏令时开始的那一天，时钟会向前调整一小时。Databend 通过 `enable_dst_hour_fix` 设置来管理夏令时调整。当启用时，Databend 会自动将时间向前调整一小时（例如，2:10 AM 将被处理为 3:10 AM）。

例如，多伦多的夏令时于 2024 年 3 月 10 日凌晨 2:00 开始。因此，当天 2:00 AM 到 3:00 AM 之间的时间不存在。Databend 依赖 [Chrono](https://github.com/chronotope/chrono) 来确定每个时区的夏令时。如果提供了这个范围内的某个时间，Databend 将返回错误：

```sql
SET timezone = 'America/Toronto';

SELECT to_datetime('2024-03-10 02:01:00');
error: APIError: ResponseError with 1006: cannot parse to type `TIMESTAMP`. BadArguments. Code: 1006, Text = unexpected argument. while evaluating function `to_timestamp('2024-03-10 02:01:00')` in expr `to_timestamp('2024-03-10 02:01:00')`
```

要修复此类错误，可以启用 `enable_dst_hour_fix` 设置，将时间向前调整一小时：

```sql
SET enable_dst_hour_fix = 1;

SELECT to_datetime('2024-03-10 02:01:00');

┌────────────────────────────────────┐
│ to_datetime('2024-03-10 02:01:00') │
├────────────────────────────────────┤
│ 2024-03-10 03:01:00                │
└────────────────────────────────────┘
```

## 处理无效值

Databend 会自动将无效的日期或时间戳值转换为其最小有效值，即 `1000-01-01` 对于日期，`1000-01-01 00:00:00` 对于时间戳，确保在处理超出范围或格式错误的日期和时间戳时的一致性。

示例：

```sql
-- 尝试将最大日期加一天，超出有效范围。
-- 结果：返回 DateMIN (1000-01-01) 而不是错误。
SELECT ADD_DAYS(TO_DATE('9999-12-31'), 1);

┌────────────────────────────────────┐
│ add_days(to_date('9999-12-31'), 1) │
├────────────────────────────────────┤
│ 1000-01-01                         │
└────────────────────────────────────┘
```

```sql
-- 尝试将最小日期减一分钟，这将无效。
-- 结果：返回 DateMIN (1000-01-01 00:00:00)，确保结果的稳定性。
SELECT SUBTRACT_MINUTES(TO_DATE('1000-01-01'), 1);

┌────────────────────────────────────────────┐
│ subtract_minutes(to_date('1000-01-01'), 1) │
├────────────────────────────────────────────┤
│ 1000-01-01 00:00:00                        │
└────────────────────────────────────────────┘
```

## 格式化日期与时间

在 Databend 中，某些日期和时间函数如 [TO_DATE](../../20-sql-functions/05-datetime-functions/to-date.md) 和 [TO_TIMESTAMP](../../20-sql-functions/05-datetime-functions/to-timestamp.md) 需要您指定日期和时间值的期望格式。为了处理日期和时间的格式化，Databend 使用了 chrono::format::strftime 模块，这是 Rust 中 chrono 库提供的一个标准模块。该模块能够精确控制日期和时间的格式化。以下内容摘自 [https://docs.rs/chrono/latest/chrono/format/strftime/index.html](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)：

| 规格 | 示例                          | 描述                                                                                                                                                                                                                                                                                                                     |
| ----- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|       |                                  | 日期格式符：                                                                                                                                                                                                                                                                                                                |
| %Y    | 2001                             | 完整的格里高利年份，补零至4位。chrono支持从-262144到262143的年份。注意：公元前1年之前或公元9999年之后的年份，需要初始符号（+/-）。                                                                                                                                             |
| %C    | 20                               | 格里高利年份除以100，补零至2位。                                                                                                                                                                                                                                                           |
| %y    | 01                               | 格里高利年份模100，补零至2位。                                                                                                                                                                                                                                                               |
| %m    | 07                               | 月份数字（01–12），补零至2位。                                                                                                                                                                                                                                                                                  |
| %b    | Jul                              | 缩写的月份名称。始终为3个字母。                                                                                                                                                                                                                                                                                       |
| %B    | July                             | 完整的月份名称。在解析时也接受相应的缩写。                                                                                                                                                                                                                                                            |
| %h    | Jul                              | 同%b。                                                                                                                                                                                                                                                                                                                     |
| %d    | 08                               | 日期数字（01–31），补零至2位。                                                                                                                                                                                                                                                                                    |
| %e    | 8                                | 同%d，但用空格填充。同%\_d。                                                                                                                                                                                                                                                                                      |
| %a    | Sun                              | 缩写的星期名称。始终为3个字母。                                                                                                                                                                                                                                                                                     |
| %A    | Sunday                           | 完整的星期名称。在解析时也接受相应的缩写。                                                                                                                                                                                                                                                          |
| %w    | 0                                | 星期日 = 0，星期一 = 1，…，星期六 = 6。                                                                                                                                                                                                                                                                                        |
| %u    | 7                                | 星期一 = 1，星期二 = 2，…，星期日 = 7。（ISO 8601）                                                                                                                                                                                                                                                                              |
| %U    | 28                               | 从星期日开始的周数（00–53），补零至2位。                                                                                                                                                                                                                                                              |
| %W    | 27                               | 同%U，但第一周从该年的第一个星期一开始。                                                                                                                                                                                                                                                       |
| %G    | 2001                             | 同%Y，但使用ISO 8601周日期中的年份数字。                                                                                                                                                                                                                                                                      |
| %g    | 01                               | 同%y，但使用ISO 8601周日期中的年份数字。                                                                                                                                                                                                                                                                      |
| %V    | 27                               | 同%U，但使用ISO 8601周日期中的周数（01–53）。                                                                                                                                                                                                                                                              |
| %j    | 189                              | 一年中的第几天（001–366），补零至3位。                                                                                                                                                                                                                                                                             |
| %D    | 07/08/01                         | 月-日-年格式。同%m/%d/%y。                                                                                                                                                                                                                                                                                        |
| %x    | 07/08/01                         | 本地日期表示（例如，12/31/99）。                                                                                                                                                                                                                                                                                  |
| %F    | 2001-07-08                       | 年-月-日格式（ISO 8601）。同%Y-%m-%d。                                                                                                                                                                                                                                                                             |
| %v    | 8-Jul-2001                       | 日-月-年格式。同%e-%b-%Y。                                                                                                                                                                                                                                                                                        |
|       |                                  | 时间格式符：                                                                                                                                                                                                                                                                                                                |
| %H    | 00                               | 小时数字（00–23），补零至2位。                                                                                                                                                                                                                                                                                   |
| %k    | 0                                | 同%H，但用空格填充。同%\_H。                                                                                                                                                                                                                                                                                      |
| %I    | 12                               | 12小时制的小时数字（01–12），补零至2位。                                                                                                                                                                                                                                                                 |
| %l    | 12                               | 同%I，但用空格填充。同%\_I。                                                                                                                                                                                                                                                                                      |
| %P    | am                               | 12小时制的am或pm。                                                                                                                                                                                                                                                                                                     |
| %p    | AM                               | 12小时制的AM或PM。                                                                                                                                                                                                                                                                                                     |
| %M    | 34                               | 分钟数字（00–59），补零至2位。                                                                                                                                                                                                                                                                                 |
| %S    | 60                               | 秒数字（00–60），补零至2位。                                                                                                                                                                                                                                                                                 |
| %f    | 026490000                        | 自上一整秒以来的纳秒级小数秒。                                                                                                                                                                                                                                                                |
| %.f   | .026490                          | 类似于.%f，但左对齐。这些都会消耗前导点。                                                                                                                                                                                                                                                             |
| %.3f  | .026                             | 类似于.%f，但左对齐且固定长度为3。                                                                                                                                                                                                                                                                     |
| %.6f  | .026490                          | 类似于.%f，但左对齐且固定长度为6。                                                                                                                                                                                                                                                                     |
| %.9f  | .026490000                       | 类似于.%f，但左对齐且固定长度为9。                                                                                                                                                                                                                                                                     |
| %3f   | 026                              | 类似于%.3f，但没有前导点。                                                                                                                                                                                                                                                                                    |
| %6f   | 026490                           | 类似于%.6f，但没有前导点。                                                                                                                                                                                                                                                                                    |
| %9f   | 026490000                        | 类似于%.9f，但没有前导点。                                                                                                                                                                                                                                                                                    |
| %R    | 00:34                            | 小时-分钟格式。同%H:%M。                                                                                                                                                                                                                                                                                              |
| %T    | 00:34:60                         | 小时-分钟-秒格式。同%H:%M:%S。                                                                                                                                                                                                                                                                                    |
| %X    | 00:34:60                         | 本地时间表示（例如，23:13:48）。                                                                                                                                                                                                                                                                                  |
| %r    | 12:34:60 AM                      | 12小时制的小时-分钟-秒格式。同%I:%M:%S %p。                                                                                                                                                                                                                                                               |
|       |                                  | 时区格式符：                                                                                                                                                                                                                                                                                                           |
| %Z    | ACST                             | 本地时区名称。在解析时跳过所有非空白字符。                                                                                                                                                                                                                                                       |
| %z    | +0930                            | 本地时间与UTC的偏移量（UTC为+0000）。                                                                                                                                                                                                                                                                       |
| %:z   | +09:30                           | 同%z，但带冒号。                                                                                                                                                                                                                                                                                                    |
| %::z  | +09:30:00                        | 本地时间与UTC的偏移量，带秒。                                                                                                                                                                                                                                                                                 |
| %:::z | +09                              | 本地时间与UTC的偏移量，不带分钟。                                                                                                                                                                                                                                                                              |
| %#z   | +09                              | 仅解析：同%z，但允许分钟缺失或存在。                                                                                                                                                                                                                                                           |
|       |                                  | 日期和时间格式符：                                                                                                                                                                                                                                                                                                         |
| %c    | Sun Jul 8 00:34:60 2001          | 本地日期和时间（例如，Thu Mar 3 23:05:25 2005）。                                                                                                                                                                                                                                                                         |
| %+    | 2001-07-08T00:34:60.026490+09:30 | ISO 8601 / RFC 3339 日期和时间格式。                                                                                                                                                                                                                                                                                         |
| %s    | 994518299                        | UNIX时间戳，自1970-01-01 00:00 UTC以来的秒数。Databend建议先将整数字符串转换为整数，而不是使用此格式符。有关示例，请参见[将整数转换为时间戳](/sql/sql-functions/datetime-functions/to-timestamp#example-2-converting-integer-to-timestamp)。 |
|       |                                  | 特殊格式符：                                                                                                                                                                                                                                                                                                             |
| %t    |                                  | 字面制表符（\t）。                                                                                                                                                                                                                                                                                                               |
| %n    |                                  | 字面换行符（\n）。                                                                                                                                                                                                                                                                                                               |
| %%    |                                  | 字面百分号。                                                                                                                                                                                                                                                                                                           |

可以覆盖数字说明符 %? 的默认填充行为。其他说明符不允许这样做，否则会导致 BAD_FORMAT 错误。

| 修饰符   | 描述                                                                   |
| -------- | ----------------------------------------------------------------------------- |
| %-?      | 抑制任何填充，包括空格和零。（例如：%j = 012，%-j = 12） |
| %\_?     | 使用空格作为填充。（例如：%j = 012，%\_j = 12）                          |
| %0?      | 使用零作为填充。（例如：%e = 9，%0e = 09）                             |

- %C, %y: 这是向下取整的除法，因此公元前100年（年份编号为-99）将分别打印为-1和99。

- %U: 第1周从该年的第一个星期日开始。在第一个星期日之前的天数可能属于第0周。

- %G, %g, %V: 第1周是该年中至少有4天的第一周。第0周不存在，因此应与%G或%g一起使用。

- %S: 它考虑了闰秒，因此可能会出现60。

- %f, %.f, %.3f, %.6f, %.9f, %3f, %6f, %9f:
  默认的%f是右对齐的，并且总是用零填充到9位，以与glibc等兼容，因此它总是计算自上一整秒以来的纳秒数。例如，上一秒后的7毫秒将打印为007000000，解析7000000将产生相同的结果。

  变体%.f是左对齐的，并根据精度打印0、3、6或9位小数。例如，上一秒后的70毫秒在%.f下将打印为.070（注意：不是.07），解析.07、.070000等将产生相同的结果。请注意，如果小数部分为零或下一个字符不是.，它们可能不打印或读取任何内容。

  变体%.3f、%.6f和%.9f是左对齐的，并根据f前面的数字打印3、6或9位小数。例如，上一秒后的70毫秒在%.3f下将打印为.070（注意：不是.07），解析.07、.070000等将产生相同的结果。请注意，如果小数部分为零或下一个字符不是.，它们可能不读取任何内容，但会按指定长度打印。

  变体%3f、%6f和%9f是左对齐的，并根据f前面的数字打印3、6或9位小数，但没有前导点。例如，上一秒后的70毫秒在%3f下将打印为070（注意：不是07），解析07、070000等将产生相同的结果。请注意，如果小数部分为零，它们可能不读取任何内容。

- %Z: 偏移量不会从解析的数据中填充，也不会进行验证。时区被完全忽略。类似于glibc strptime对此格式代码的处理。

  无法可靠地从缩写转换为偏移量，例如CDT可以表示北美中部夏令时或中国夏令时。

- %+: 与%Y-%m-%dT%H:%M:%S%.f%:z相同，即秒的0、3、6或9位小数和时区偏移中的冒号。

  此格式还支持用Z或UTC代替%:z。它们等同于+00:00。

  请注意，所有T、Z和UTC都是不区分大小写解析的。

  典型的strftime实现对此说明符有不同的（且依赖于区域设置的）格式。虽然Chrono的%+格式要稳定得多，但如果您想控制确切的输出，最好避免使用此说明符。

- %s: 此说明符不填充，并且可以为负数。对于Chrono的目的，它只考虑非闰秒，因此与ISO C strftime行为略有不同。