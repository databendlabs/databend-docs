---
title: CURRENT_TIMESTAMP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.225"/>

Returns the current date and time.

## Syntax

```sql
CURRENT_TIMESTAMP()
```

## Return Type

TIMESTAMP

## Aliases

- [NOW](now.md)

## Examples

This example returns the current date and time:

```sql
SELECT CURRENT_TIMESTAMP(), NOW();

┌─────────────────────────────────────────────────────────┐
│     current_timestamp()    │            now()           │
├────────────────────────────┼────────────────────────────┤
│ 2024-01-29 04:38:12.584359 │ 2024-01-29 04:38:12.584417 │
└─────────────────────────────────────────────────────────┘
```

This example uses the function to generate the default value for a TIMESTAMP column:

```sql
-- The timestamp column defaults to the current timestamp
CREATE TABLE employees (
    id INT8,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Current timestamps will be inserted if no specific timestamp is provided
INSERT INTO employees (id) VALUES (1);
INSERT INTO employees (id) VALUES (2);
INSERT INTO employees (id, created) 
    VALUES (3, '2024-01-01 09:00:00');

SELECT * FROM employees;

┌─────────────────────────────────────────────┐
│       id       │           created          │
├────────────────┼────────────────────────────┤
│              1 │ 2023-11-27 16:11:56.772168 │
│              2 │ 2023-11-27 16:12:01.857803 │
│              3 │ 2024-01-01 09:00:00        │
└─────────────────────────────────────────────┘
```