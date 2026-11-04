---
title: TO_DECIMAL
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.959"/>

Converts a value to DECIMAL data type.

## Syntax

```sql
TO_DECIMAL
( <expr> [, '<format>' ] [, <precision> [, <scale> ] ] )
```

## Arguments

| Arguments | Description                                                                                                                                                                             |
|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| expr      | An expression of a boolean, number, string, or variant type.                                                                                                                            |
| format    | Optional. A format string specifying the desired precision and scale for the decimal result. It may define the total number of digits and the number of digits after the decimal point. |
| precision | Optional. Total number of significant digits in the result, the default is 38.                                                                                                          |
| scale     | Optional. Number of digits after the decimal point. Must not exceed precision, the default is 0.                                                                                        |

### Format Specifiers

| Format Specifier   | Description                                                                     | Example Input |
|--------------------|---------------------------------------------------------------------------------|---------------|
| '9'                | Optional digit (accepts digit or nothing, but this implementation requires one) | "123"         |
| '0'                | Required digit (same as 9 in current implementation)                            | "123"         |
| 'D'                | Decimal point (accepts '.' or ',', always normalized to '.')                    | "12.34"       |
| 'G'                | Group (thousands) separator (expects ',' in input)                              | "1,234"       |
| 'S'                | Sign ('+' or '-', applied as prefix to result)                                  | "-123"        |
| Literal character	 | Any literal character must appear in the input exactly                          | "NT$123"      |

## Numeric Conversion

`numeric_cast_option` controls rounding when a numeric conversion discards fractional digits:

- `rounding` is the default. It rounds to the nearest value, with halfway values rounded away from zero.
- `truncating` discards fractional digits toward zero.

FLOAT and DOUBLE inputs use the exact stored binary floating-point value. Conversion scales that value and rounds or truncates once to the target scale. It does not first replace the value with its shortest decimal display. A floating-point value can therefore produce different digits from the decimal string that was used to create it.

For example, DOUBLE `1.1` is not exactly the decimal number `1.1`. Use a decimal literal or string to preserve decimal text. Casting an existing FLOAT or DOUBLE to DECIMAL cannot recover digits lost before the conversion.

```sql
SET numeric_cast_option = 'rounding';
SELECT
    TO_DECIMAL(1.1::DOUBLE, 38, 18) AS from_float,
    TO_DECIMAL('1.1', 38, 18) AS from_text,
    TO_DECIMAL((-0.125)::DOUBLE, 18, 2) AS rounded;
-- Expected values: 1.100000000000000089, 1.100000000000000000, -0.13

SET numeric_cast_option = 'truncating';
SELECT TO_DECIMAL((-0.125)::DOUBLE, 18, 2) AS truncated;
-- Expected value: -0.12
UNSET numeric_cast_option;
```

A result outside the target precision raises an error, including overflow caused by rounding. NaN and positive or negative infinity cannot be converted to DECIMAL. `TRY_CAST` and `TRY_TO_DECIMAL` return NULL for failed conversions. A floating-point number stored inside VARIANT uses the same binary-value conversion rule.

For arithmetic and explicit ROUND behavior, see [Decimal Rules](/sql/sql-reference/data-types/decimal#decimal-rules). The cast setting does not change those rounding rules. The examples below use the default `rounding` setting.

## Examples

```sql
SELECT TO_DECIMAL('1234.56');

╭───────────────────────╮
│ to_decimal('1234.56') │
├───────────────────────┤
│                  1235 │
╰───────────────────────╯

SELECT TO_DECIMAL('1234.56', '9999D99');

╭──────────────────────────────────╮
│ to_decimal('1234.56', '9999D99') │
├──────────────────────────────────┤
│                             1235 │
╰──────────────────────────────────╯

SELECT TO_DECIMAL('1234.56', 38, 1);

╭──────────────────────────────╮
│ to_decimal('1234.56', 38, 1) │
├──────────────────────────────┤
│                       1234.6 │
╰──────────────────────────────╯

SELECT TO_DECIMAL('NT$1234.56', 'NT$9999D99', 38, 1);

╭───────────────────────────────────────────────╮
│ to_decimal('NT$1234.56', 'NT$9999D99', 38, 1) │
├───────────────────────────────────────────────┤
│                                        1234.6 │
╰───────────────────────────────────────────────╯

```