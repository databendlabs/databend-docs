---
title: CREATE SCALAR FUNCTION
sidebar_position: 0
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.799"/>

Creates a scalar SQL UDF using Databend's unified function syntax. Logic is expressed purely in SQL; no external language support is required.

### Supported Languages

- SQL expressions only (no external runtimes)

## Syntax

```sql
CREATE [ OR REPLACE ] FUNCTION [ IF NOT EXISTS ] <function_name> 
    ( [<parameter_list>] ) 
    RETURNS <return_type>
    AS $$ <expression> $$
    [ DESC='<description>' ]
```

Where:
- `<parameter_list>`: Optional comma-separated list of parameters with their types (e.g., `x INT, y FLOAT`)
- `<return_type>`: The data type of the function's return value
- `<expression>`: SQL expression that defines the function logic

## Access control requirements

| Privilege | Object Type   | Description    |
|:----------|:--------------|:---------------|
| SUPER     | Global, Table | Operates a UDF |

To create a user-defined function, the user performing the operation or the [current_role](/guides/security/access-control/roles) must have the SUPER [privilege](/guides/security/access-control/privileges).

## Examples

```sql
-- Create a function to calculate area of a circle
CREATE FUNCTION area_of_circle(radius FLOAT)
RETURNS FLOAT
AS $$
  pi() * radius * radius
$$;

-- Create a function to calculate age in years
CREATE FUNCTION calculate_age(birth_date DATE)
RETURNS INT
AS $$
  date_diff('year', birth_date, now())
$$;

-- Create a function with multiple parameters
CREATE FUNCTION calculate_bmi(weight_kg FLOAT, height_m FLOAT)
RETURNS FLOAT
AS $$
  weight_kg / (height_m * height_m)
$$;

-- Use the functions
SELECT area_of_circle(5.0) AS circle_area;
SELECT calculate_age('1990-05-15') AS age;
SELECT calculate_bmi(70.0, 1.75) AS bmi;
```
