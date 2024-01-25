---
title: DATE_FORMAT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.1.39"/>

Converts a date value to a specific string format. To customize the format of date and time in Databend, you can utilize specifiers. These specifiers allow you to define the desired format for date and time values. For a comprehensive list of supported specifiers, see [Formatting Date and Time](../../00-sql-reference/10-data-types/20-data-type-time-date-types.md#formatting-date-and-time).

The function also accepts one argument, which is equivalent to [TO_STRING( expr )](../02-conversion-functions/index.md). Please note that when given one argument, the function does not check if the date value is valid and converts whatever is given to a string.

## Syntax

```sql
-- Convert a date value to a specific string format
DATE_FORMAT('<date>', '<format>')

-- Convert a date value to string. Equivalent to TO_STRING( expr )
DATE_FORMAT('<date>')
```

## Return Type

String.

## Examples

```sql
SELECT DATE_FORMAT('2022-12-25', '%m/%d/%Y'), DATE_FORMAT('2022-12-25');

┌───────────────────────────────────────────────────────────────────┐
│ date_format('2022-12-25', '%m/%d/%y') │ date_format('2022-12-25') │
├───────────────────────────────────────┼───────────────────────────┤
│ 12/25/2022                            │ 2022-12-25                │
└───────────────────────────────────────────────────────────────────┘

-- With one argument, the function converts input to a string without validating as a date.
SELECT DATE_FORMAT('20223-12-25'), TO_STRING('20223-12-25');

┌───────────────────────────────────────────────────────┐
│ date_format('20223-12-25') │ to_string('20223-12-25') │
├────────────────────────────┼──────────────────────────┤
│ 20223-12-25                │ 20223-12-25              │
└───────────────────────────────────────────────────────┘
```