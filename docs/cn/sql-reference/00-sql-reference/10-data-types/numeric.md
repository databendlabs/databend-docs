---
title: Numeric
description: 基本数值数据类型。
sidebar_position: 4
---

## 整数类型

| 名称     | 别名  | 大小    | 最小值               | 最大值              |
|----------|-------|---------|----------------------|---------------------|
| TINYINT  | INT8  | 1 byte  | -128                 | 127                 |
| SMALLINT | INT16 | 2 bytes | -32768               | 32767               |
| INT      | INT32 | 4 bytes | -2147483648          | 2147483647          |
| BIGINT   | INT64 | 8 bytes | -9223372036854775808 | 9223372036854775807 |

:::tip
如果需要无符号整数，请使用 `UNSIGNED` 约束（兼容 MySQL）。例如：

```sql
CREATE TABLE test_numeric(tiny TINYINT, tiny_unsigned TINYINT UNSIGNED)
```
:::

## 浮点类型

| 名称   | 大小    | 最小值                   | 最大值                  |
|--------|---------|--------------------------|-------------------------|
| FLOAT  | 4 bytes | -3.40282347e+38          | 3.40282347e+38          |
| DOUBLE | 8 bytes | -1.7976931348623157E+308 | 1.7976931348623157E+308 |

## 函数

请参阅 [Numeric Functions](/sql/sql-functions/numeric-functions)。

## 示例

```sql
CREATE TABLE test_numeric
(
    tiny              TINYINT,
    tiny_unsigned     TINYINT UNSIGNED,
    smallint          SMALLINT,
    smallint_unsigned SMALLINT UNSIGNED,
    int               INT,
    int_unsigned      INT UNSIGNED,
    bigint            BIGINT,
    bigint_unsigned   BIGINT UNSIGNED,
    float             FLOAT,
    double            DOUBLE
);
```

```sql
DESC test_numeric;
```

结果：
```
┌───────────────────────────────────────────────────────────────────┐
│       Field       │        Type       │  Null  │ Default │  Extra │
├───────────────────┼───────────────────┼────────┼─────────┼────────┤
│ tiny              │ TINYINT           │ YES    │ NULL    │        │
│ tiny_unsigned     │ TINYINT UNSIGNED  │ YES    │ NULL    │        │
│ smallint          │ SMALLINT          │ YES    │ NULL    │        │
│ smallint_unsigned │ SMALLINT UNSIGNED │ YES    │ NULL    │        │
│ int               │ INT               │ YES    │ NULL    │        │
│ int_unsigned      │ INT UNSIGNED      │ YES    │ NULL    │        │
│ bigint            │ BIGINT            │ YES    │ NULL    │        │
│ bigint_unsigned   │ BIGINT UNSIGNED   │ YES    │ NULL    │        │
│ float             │ FLOAT             │ YES    │ NULL    │        │
│ double            │ DOUBLE            │ YES    │ NULL    │        │
└───────────────────────────────────────────────────────────────────┘
```
