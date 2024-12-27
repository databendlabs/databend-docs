---
title: 数值类型
description: 基本数值数据类型。
---

## 整数数据类型

| 名称     | 别名  | 大小    | 最小值               | 最大值              |
|----------|-------|---------|----------------------|---------------------|
| TINYINT  | INT8  | 1 字节  | -128                 | 127                 |
| SMALLINT | INT16 | 2 字节  | -32768               | 32767               |
| INT      | INT32 | 4 字节  | -2147483648          | 2147483647          |
| BIGINT   | INT64 | 8 字节  | -9223372036854775808 | 9223372036854775807 |

:::tip
如果你想要无符号整数，请使用 `UNSIGNED` 约束，这与 MySQL 兼容，例如：

```sql
CREATE TABLE test_numeric(tiny TINYINT, tiny_unsigned TINYINT UNSIGNED)
```
:::

## 浮点数数据类型

| 名称   | 大小    | 最小值                | 最大值               |
|--------|---------|------------------------|----------------------|
| FLOAT  | 4 字节  | -3.40282347e+38        | 3.40282347e+38       |
| DOUBLE | 8 字节  | -1.7976931348623157E+308 | 1.7976931348623157E+308 |

## 函数

参见 [数值函数](/sql/sql-functions/numeric-functions)。

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
│       字段        │        类型        │  空值  │  默认值  │  额外  │
├───────────────────┼───────────────────┼────────┼─────────┼────────┤
│ tiny              │ TINYINT           │ 是     │ NULL    │        │
│ tiny_unsigned     │ TINYINT UNSIGNED  │ 是     │ NULL    │        │
│ smallint          │ SMALLINT          │ 是     │ NULL    │        │
│ smallint_unsigned │ SMALLINT UNSIGNED │ 是     │ NULL    │        │
│ int               │ INT               │ 是     │ NULL    │        │
│ int_unsigned      │ INT UNSIGNED      │ 是     │ NULL    │        │
│ bigint            │ BIGINT            │ 是     │ NULL    │        │
│ bigint_unsigned   │ BIGINT UNSIGNED   │ 是     │ NULL    │        │
│ float             │ FLOAT             │ 是     │ NULL    │        │
│ double            │ DOUBLE            │ 是     │ NULL    │        │
└───────────────────────────────────────────────────────────────────┘
```