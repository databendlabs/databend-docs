---
title: '转换函数（Conversion Functions）'
---

本页面全面概述了 Databend 中的转换函数（Conversion Functions），按功能组织以便参考。

## 类型转换函数（Type Conversion Functions）

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [CAST](cast.md) | 将值转换为指定的数据类型 | `CAST('123' AS INT)` → `123` |
| [TRY_CAST](try-cast.md) | 安全地将值转换为指定数据类型，失败时返回 NULL | `TRY_CAST('abc' AS INT)` → `NULL` |
| [TO_BOOLEAN](to-boolean.md) | 将值转换为 BOOLEAN 类型 | `TO_BOOLEAN('true')` → `true` |
| [TO_STRING](to-string.md) | 将值转换为 STRING 类型 | `TO_STRING(123)` → `'123'` |
| [TO_VARCHAR](to-varchar.md) | 将值转换为 VARCHAR 类型 | `TO_VARCHAR(123)` → `'123'` |
| [TO_TEXT](to-text.md) | 将值转换为 TEXT 类型 | `TO_TEXT(123)` → `'123'` |

## 数值转换函数（Numeric Conversion Functions）

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [TO_INT8](to-int8.md) | 将值转换为 INT8 类型 | `TO_INT8('123')` → `123` |
| [TO_INT16](to-int16.md) | 将值转换为 INT16 类型 | `TO_INT16('123')` → `123` |
| [TO_INT32](to-int32.md) | 将值转换为 INT32 类型 | `TO_INT32('123')` → `123` |
| [TO_INT64](to-int64.md) | 将值转换为 INT64 类型 | `TO_INT64('123')` → `123` |
| [TO_UINT8](to-uint8.md) | 将值转换为 UINT8 类型 | `TO_UINT8('123')` → `123` |
| [TO_UINT16](to-uint16.md) | 将值转换为 UINT16 类型 | `TO_UINT16('123')` → `123` |
| [TO_UINT32](to-uint32.md) | 将值转换为 UINT32 类型 | `TO_UINT32('123')` → `123` |
| [TO_UINT64](to-uint64.md) | 将值转换为 UINT64 类型 | `TO_UINT64('123')` → `123` |
| [TO_FLOAT32](to-float32.md) | 将值转换为 FLOAT32 类型 | `TO_FLOAT32('123.45')` → `123.45` |
| [TO_FLOAT64](to-float64.md) | 将值转换为 FLOAT64 类型 | `TO_FLOAT64('123.45')` → `123.45` |

## 二进制和专用转换函数（Binary and Specialized Conversion Functions）

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [TO_BINARY](to-binary.md) | 将值转换为 BINARY 类型 | `TO_BINARY('abc')` → `binary value` |
| [TRY_TO_BINARY](try-to-binary.md) | 安全地将值转换为 BINARY 类型，失败时返回 NULL | `TRY_TO_BINARY('abc')` → `binary value` |
| [TO_HEX](to-hex.md) | 将值转换为十六进制字符串 | `TO_HEX(255)` → `'FF'` |
| [TO_VARIANT](to-variant.md) | 将值转换为 VARIANT 类型 | `TO_VARIANT('{"a": 1}')` → `{"a": 1}` |
| [BUILD_BITMAP](build-bitmap.md) | 从整数数组构建位图 | `BUILD_BITMAP([1,2,3])` → `bitmap value` |
| [TO_BITMAP](to-bitmap.md) | 将值转换为 BITMAP 类型 | `TO_BITMAP([1,2,3])` → `bitmap value` |

在将值从一种类型转换为另一种类型时，请注意以下事项：

- 当从浮点数、十进制数或字符串转换为整数或带小数部分的十进制数时，Databend 会将值四舍五入到最接近的整数。该行为由 `numeric_cast_option` 设置控制（默认为 'rounding'），它决定了数值转换操作的方式。当 `numeric_cast_option` 设置为 'truncating' 时，Databend 会截断小数部分，丢弃任何小数值。

    ```sql title='示例：'
    SELECT CAST('0.6' AS DECIMAL(10, 0)), CAST(0.6 AS DECIMAL(10, 0)), CAST(1.5 AS INT);

    ┌──────────────────────────────────────────────────────────────────────────────────┐
    │ cast('0.6' as decimal(10, 0)) │ cast(0.6 as decimal(10, 0)) │ cast(1.5 as int32) │
    ├───────────────────────────────┼─────────────────────────────┼────────────────────┤
    │                             1 │                           1 │                  2 │
    └──────────────────────────────────────────────────────────────────────────────────┘

    SET numeric_cast_option = 'truncating';

    SELECT CAST('0.6' AS DECIMAL(10, 0)), CAST(0.6 AS DECIMAL(10, 0)), CAST(1.5 AS INT);

    ┌──────────────────────────────────────────────────────────────────────────────────┐
    │ cast('0.6' as decimal(10, 0)) │ cast(0.6 as decimal(10, 0)) │ cast(1.5 as int32) │
    ├───────────────────────────────┼─────────────────────────────┼────────────────────┤
    │                             0 │                           0 │                  1 │
    └──────────────────────────────────────────────────────────────────────────────────┘
    ```

    下表总结了数值转换操作，突出显示了不同源数据类型和目标数值数据类型之间的转换可能性。请注意，字符串到整数转换要求源字符串必须包含整数值。

    | 源类型        | 目标类型 |
    |----------------|-------------|
    | String         | Decimal     |
    | Float          | Decimal     |
    | Decimal        | Decimal     |
    | Float          | Int         |
    | Decimal        | Int         |
    | String (Int)   | Int         |


- Databend 还提供多种函数，用于将表达式转换为不同的日期和时间格式。更多信息，请参阅[日期时间函数（Date & Time Functions）](../05-datetime-functions/index.md)。