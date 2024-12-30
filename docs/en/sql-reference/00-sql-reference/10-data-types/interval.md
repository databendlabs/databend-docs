---
title: Interval
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.677"/>

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
- An interval can be added to or subtracted from another interval.

    ```sql title='Examples:'
    SELECT TO_DAYS(3) + TO_DAYS(1), TO_DAYS(3) - TO_DAYS(1);

    ┌───────────────────────────────────────────────────┐
    │ to_days(3) + to_days(1) │ to_days(3) - to_days(1) │
    ├─────────────────────────┼─────────────────────────┤
    │ 4 days                  │ 2 days                  │
    └───────────────────────────────────────────────────┘
    ```
- Intervals can be added to or subtracted from DATE and TIMESTAMP values. 

    ```sql title='Examples:'
    SELECT DATE '2024-12-20' + TO_DAYS(2),  DATE '2024-12-20' - TO_DAYS(2);

    ┌───────────────────────────────────────────────────────────────────────────────────┐
    │ CAST('2024-12-20' AS DATE) + to_days(2) │ CAST('2024-12-20' AS DATE) - to_days(2) │
    ├─────────────────────────────────────────┼─────────────────────────────────────────┤
    │ 2024-12-22 00:00:00                     │ 2024-12-18 00:00:00                     │
    └───────────────────────────────────────────────────────────────────────────────────┘

    SELECT TIMESTAMP '2024-12-20 10:00:00' + TO_DAYS(2), TIMESTAMP '2024-12-20 10:00:00' - TO_DAYS(2);

    ┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
    │ CAST('2024-12-20 10:00:00' AS TIMESTAMP) + to_days(2) │ CAST('2024-12-20 10:00:00' AS TIMESTAMP) - to_days(2) │
    ├───────────────────────────────────────────────────────┼───────────────────────────────────────────────────────┤
    │ 2024-12-22 10:00:00                                   │ 2024-12-18 10:00:00                                   │
    └───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
    ```
- It is *not* recommended to use the MySQL client to query INTERVAL columns in Databend, as the MySQL protocol does not fully support the INTERVAL type. This may result in errors or unexpected behavior.