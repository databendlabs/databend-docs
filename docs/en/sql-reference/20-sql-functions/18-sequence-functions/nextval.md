---
title: NEXTVAL
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.453"/>

Retrieves the next value from a sequence.

## Syntax

```sql
NEXTVAL(<sequence_name>)
```

## Return Type

Integer.

## Examples

This example demonstrates how the NEXTVAL function works with a sequence:

```sql
CREATE SEQUENCE my_seq;

SELECT
  NEXTVAL(my_seq),
  NEXTVAL(my_seq),
  NEXTVAL(my_seq);

┌─────────────────────────────────────────────────────┐
│ nextval(my_seq) │ nextval(my_seq) │ nextval(my_seq) │
├─────────────────┼─────────────────┼─────────────────┤
│               1 │               2 │               3 │
└─────────────────────────────────────────────────────┘
```

This example showcases how sequences and the NEXTVAL function are employed to automatically generate and assign unique identifiers to rows in a table.

```sql
-- Create a new sequence named staff_id_seq
CREATE SEQUENCE staff_id_seq;

-- Create a new table named staff with columns for staff_id, name, and department
CREATE TABLE staff (
    staff_id INT,
    name VARCHAR(50),
    department VARCHAR(50)
);

-- Insert a new row into the staff table, using the next value from the staff_id_seq sequence for the staff_id column
INSERT INTO staff (staff_id, name, department)
VALUES (NEXTVAL(staff_id_seq), 'John Doe', 'HR');

-- Insert another row into the staff table, using the next value from the staff_id_seq sequence for the staff_id column
INSERT INTO staff (staff_id, name, department)
VALUES (NEXTVAL(staff_id_seq), 'Jane Smith', 'Finance');

SELECT * FROM staff;

┌───────────────────────────────────────────────────────┐
│     staff_id    │       name       │    department    │
├─────────────────┼──────────────────┼──────────────────┤
│               2 │ Jane Smith       │ Finance          │
│               1 │ John Doe         │ HR               │
└───────────────────────────────────────────────────────┘
```