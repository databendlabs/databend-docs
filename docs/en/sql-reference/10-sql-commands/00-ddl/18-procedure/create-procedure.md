---
title: CREATE PROCEDURE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.637"/>

Defines a stored procedure that executes SQL operations and returns a result.

## Syntax

```sql
CREATE PROCEDURE <procedure_name>(<parameter_name> <data_type>, ...) 
RETURNS <return_data_type> [NOT NULL]
LANGUAGE <language> 
[ COMMENT '<comment>' ] 
AS $$
BEGIN
    <procedure_body>
    RETURN <return_value>;
END;
$$;
```

| Parameter                               | Description                                                                                                               |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| `<procedure_name>`                      | Name of the procedure.                                                                                                    |
| `<parameter_name> <data_type>`          | Input parameters (optional), each with a specified data type. Multiple parameters can be defined and separated by commas. |
| `RETURNS <return_data_type> [NOT NULL]` | Specifies the data type of the return value. `NOT NULL` ensures the returned value cannot be NULL.                        |
| `LANGUAGE`                              | Specifies the language in which the procedure body is written. Currently, only `SQL` is supported.                        |
| `COMMENT`                               | Optional text describing the procedure.                                                                                   |
| `AS ...`                                | Encloses the procedure body, which contains SQL statements, variable declarations, loops, and a  RETURN statement.        |

## Examples

This example defines a stored procedure that converts weight from kilograms (kg) to pounds (lb):

```sql
CREATE PROCEDURE convert_kg_to_lb(kg DECIMAL(4, 2)) 
RETURNS DECIMAL(10, 2) 
LANGUAGE SQL 
COMMENT = 'Converts kilograms to pounds'
AS $$
BEGIN
    RETURN kg * 2.20462;
END;
$$;
```