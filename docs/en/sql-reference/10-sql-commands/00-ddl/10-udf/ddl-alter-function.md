---
title: ALTER FUNCTION
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.116"/>

Alters a user-defined function or Tabular SQL UDF (UDTF).

## Syntax

### For Lambda UDFs
```sql
ALTER FUNCTION [ IF NOT EXISTS ] <function_name> 
    AS (<input_param_names>) -> <lambda_expression> 
    [ DESC='<description>' ]
```

### For Tabular SQL UDFs (UDTFs)
```sql
ALTER FUNCTION [ IF NOT EXISTS ] <function_name> 
    ( [<parameter_list>] ) 
    RETURNS TABLE ( <column_definition_list> ) 
    AS $$ <sql_statement> $$
```

## Examples

### Altering Lambda UDF
```sql
-- Create a UDF
CREATE FUNCTION a_plus_3 AS (a) -> a+3+3;

-- Modify the lambda expression of the UDF
ALTER FUNCTION a_plus_3 AS (a) -> a+3;
```

### Altering Tabular SQL UDF
```sql
-- Create a UDTF
CREATE FUNCTION get_employees() 
RETURNS TABLE (id INT, name VARCHAR(100)) 
AS $$ SELECT id, name FROM employees $$;

-- Modify the UDTF to include department
ALTER FUNCTION get_employees() 
RETURNS TABLE (id INT, name VARCHAR(100), department VARCHAR(100)) 
AS $$ SELECT id, name, department FROM employees $$;
```