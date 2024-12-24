---
title: Interval
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.673"/>

The INTERVAL data type represents a duration of time, allowing precise manipulation and storage of time intervals across various units.

- Accepts natural language formats (e.g., '1 year 2 months ago') or numeric values interpreted as microseconds.

    - Supports time units including `Millennium`, `Century`, `Decade`, `Year`, `Quarter`, `Month`, `Week`, `Day`, `Hour`, `Minute`, `Second`, `Millisecond`, and `Microsecond`.

    ```sql title='Examples:'
    -- Create a table with one INTERVAL column
    CREATE OR REPLACE TABLE intervals (duration INTERVAL);

    -- Insert different types of INTERVAL data
    INSERT INTO intervals VALUES 
        ('1 year 2 months ago'),     -- Natural language format with 'ago' (negative interval)
        ('1 year 2 months'),         -- Natural language format without 'ago' (positive interval)
        ('1000000'),                 -- Positive numeric value interpreted as microseconds
        ('-1000000');                -- Negative numeric value interpreted as microseconds

    -- Query the table to see the results
    SELECT * FROM intervals;

    ┌──────────────────────────┐
    │         duration         │
    ├──────────────────────────┤
    │ -1 year -2 months        │
    │ 1 year 2 months          │
    │ 0:00:01                  │
    │ -1 month -1 day -0:00:01 │
    └──────────────────────────┘
    ```

    - When given a numeric value, Databend only recognizes the integer part of the value. For example, both `TO_INTERVAL('1 seconds')` and `TO_INTERVAL('1.6 seconds')` represent an interval of 1 second. The fractional part after the decimal point is ignored.

    ```sql title='Examples:'
    SELECT TO_INTERVAL('1 seconds'), TO_INTERVAL('1.6 seconds');

    ┌───────────────────────────────────────────────────────┐
    │ to_interval('1 seconds') │ to_interval('1.6 seconds') │
    ├──────────────────────────┼────────────────────────────┤
    │ 0:00:01                  │ 0:00:01                    │
    └───────────────────────────────────────────────────────┘
    ```
- Handles both positive and negative intervals with precision down to microseconds.
- INTERVAL columns are *not* supported in the ORDER BY clause.
- It is *not* recommended to use the MySQL client to query INTERVAL columns in Databend, as the MySQL protocol does not fully support the INTERVAL type. This may result in errors or unexpected behavior.