---
title: ROW_NUMBER
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.262"/>

Assigns a temporary sequential number to each row within a partition of a result set, starting at 1 for the first row in each partition. 

## Syntax

```sql
ROW_NUMBER() 
  OVER ( [ PARTITION BY <expr1> [, <expr2> ... ] ]
  ORDER BY <expr3> [ , <expr4> ... ] [ { ASC | DESC } ])
...
FROM ...
[ QUALIFY <condition> ]
```

| Parameter    | Required? | Description                                                                                                |
|--------------|-----------|------------------------------------------------------------------------------------------------------------|
| PARTITION BY | No        | Divides the result set into partitions, allowing window functions to operate separately on each partition. |
| ORDER BY     | Yes       | Specifies the order of rows within each partition.                                                         |
| ASC / DESC   | No        | Specifies the sorting order within each partition. ASC (ascending) is the default.                         |
| QUALIFY      | No        | Filters rows based on conditions.                                                                          |

## Examples

This example demonstrates the use of ROW_NUMBER() to assign sequential numbers to employees within their departments, ordered by descending salary. Leveraging the QUALIFY clause, we filter the results to display only the top earner in each department.

```sql
-- Prepare the data
CREATE TABLE employees (
  employee_id INT,
  first_name VARCHAR,
  last_name VARCHAR,
  department VARCHAR,
  salary INT
);

INSERT INTO employees (employee_id, first_name, last_name, department, salary) VALUES
  (1, 'John', 'Doe', 'IT', 90000),
  (2, 'Jane', 'Smith', 'HR', 85000),
  (3, 'Mike', 'Johnson', 'IT', 82000),
  (4, 'Sara', 'Williams', 'Sales', 77000),
  (5, 'Tom', 'Brown', 'HR', 75000);

-- Select employee details along with the row number partitioned by department and ordered by salary in descending order.
SELECT
    employee_id,
    first_name,
    last_name,
    department,
    salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS row_num
FROM
    employees;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   employee_id   │    first_name    │     last_name    │    department    │      salary     │ row_num │
├─────────────────┼──────────────────┼──────────────────┼──────────────────┼─────────────────┼─────────┤
│               2 │ Jane             │ Smith            │ HR               │           85000 │       1 │
│               5 │ Tom              │ Brown            │ HR               │           75000 │       2 │
│               1 │ John             │ Doe              │ IT               │           90000 │       1 │
│               3 │ Mike             │ Johnson          │ IT               │           82000 │       2 │
│               4 │ Sara             │ Williams         │ Sales            │           77000 │       1 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────┘


-- Select employee details along with the row number partitioned by department and ordered by salary in descending order.
-- Add a filter to only include rows where the row number is 1, selecting the employee with the highest salary in each department.
SELECT
    employee_id,
    first_name,
    last_name,
    department,
    salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS row_num
FROM
    employees
QUALIFY row_num = 1;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   employee_id   │    first_name    │     last_name    │    department    │      salary     │ row_num │
├─────────────────┼──────────────────┼──────────────────┼──────────────────┼─────────────────┼─────────┤
│               2 │ Jane             │ Smith            │ HR               │           85000 │       1 │
│               1 │ John             │ Doe              │ IT               │           90000 │       1 │
│               4 │ Sara             │ Williams         │ Sales            │           77000 │       1 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────┘
```