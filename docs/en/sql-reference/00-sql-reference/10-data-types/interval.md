---
title: Interval
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.673"/>

The INTERVAL data type represents a duration of time, allowing precise manipulation and storage of time intervals across various units.

- Supports units including `Millennium`, `Century`, `Decade`, `Year`, `Quarter`, `Month`, `Week`, `Day`, `Hour`, `Minute`, `Second`, `Millisecond`, and `Microsecond`.
- Accepts natural language formats (e.g., '1 year 2 months ago') or numeric values interpreted as microseconds.
- Handles both positive and negative intervals with precision down to microseconds.
- INTERVAL columns are *not* supported in the ORDER BY clause.
- It is *not* recommended to use the MySQL client to query INTERVAL columns in Databend, as the MySQL protocol does not fully support the INTERVAL type. This may result in errors or unexpected behavior.

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

duration                |
------------------------+
-1 year -2 months       |
1 year 2 months         |
0:00:01                 |
-1 month -1 day -0:00:01|
```