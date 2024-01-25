---
title: 'Conversion Functions'
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

This section provides reference information for the conversion functions in Databend.

<IndexOverviewList />

Please note the following when converting a value from one type to another:

- When converting from floating-point, decimal numbers, or strings to integers or decimal numbers with fractional parts, Databend rounds the values to the nearest integer. This is determined by the setting `numeric_cast_option` (defaults to 'rounding') which controls the behavior of numeric casting operations. When `numeric_cast_option` is explicitly set to 'truncating', Databend will truncate the decimal part, discarding any fractional values.

    ```sql title='Example:'
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

    The table below presents a summary of numeric casting operations, highlighting the casting possibilities between different source and target numeric data types. Please note that, it specifies the requirement for String to Integer casting, where the source string must contain an integer value.

    | Source Type    | Target Type |
    |----------------|-------------|
    | String         | Decimal     |
    | Float          | Decimal     |
    | Decimal        | Decimal     |
    | Float          | Int         |
    | Decimal        | Int         |
    | String (Int)   | Int         |


- Databend also offers a variety of functions for converting expressions into different date and time formats. For more information, see [Date & Time Functions](../05-datetime-functions/index.md).