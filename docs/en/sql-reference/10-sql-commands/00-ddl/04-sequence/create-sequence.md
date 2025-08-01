---
title: CREATE SEQUENCE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.784"/>

Creates a new sequence in Databend.

Sequence is an object employed to generate unique numerical identifiers automatically, frequently utilized for assigning distinct identifiers to rows in tables, such as user ID columns. Typically, sequences start with a specified value and increment by a specified amount. 

:::note
A sequence in Databend currently starts with 1 and increments by 1. While sequences guarantee unique values, they **do not** ensure contiguity (i.e., without gaps).
:::

## Syntax

```sql
CREATE [ OR REPLACE ] SEQUENCE [IF NOT EXISTS] <sequence>
```

| Parameter    | Description                             |
|--------------|-----------------------------------------|
| `<sequence>` | The name of the sequence to be created. |

## Access control requirements

| Privilege       | Object Type | Description           |
|:----------------|:------------|:----------------------|
| CREATE SEQUENCE | Global      | Creates a sequence. |


To create a sequence, the user performing the operation or the [current_role](/guides/security/access-control/roles) must have the CREATE SEQUENCE [privilege](/guides/security/access-control/privileges).

:::note

The enable_experimental_sequence_rbac_check settings governs sequence-level access control. It is disabled by default.
sequence creation solely requires the user to possess superuser privileges, bypassing detailed RBAC checks.
When enabled, granular permission verification is enforced during sequence establishment.

This is an experimental feature and may be enabled by default in the future.

:::

## Examples

This example showcases how sequences and the [NEXTVAL](/sql/sql-functions/sequence-functions/nextval) function are employed to automatically generate and assign unique identifiers to rows in a table.

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