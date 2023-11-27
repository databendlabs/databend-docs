---
title: CURRENT_TIMESTAMP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.225"/>

Returns the current timestamp.

## Syntax

```sql
CURRENT_TIMESTAMP
```

## Return Type

TIMESTAMP.

## Examples

This example returns the current timestamp using the `SELECT CURRENT_TIMESTAMP` statement:

```sql
SELECT CURRENT_TIMESTAMP;

┌────────────────────────────┐
│      current_timestamp     │
├────────────────────────────┤
│ 2023-11-27 15:59:52.438152 │
└────────────────────────────┘
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