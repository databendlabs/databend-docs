---
title: User-Defined Function
---

User-Defined Functions (UDFs) in Databend allow you to create custom operations tailored to your specific data processing needs. This page helps you choose the right type of function for your use case.

## Function Type Comparison

| Feature | Scalar SQL | Tabular SQL | Embedded |
|---------|------------|-------------|----------|
| **Return Type** | Single value | Table/ResultSet | Single value |
| **Language** | SQL expressions | SQL queries | Python/JavaScript/WASM |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Enterprise Required** | No | No | Python: Yes |
| **Package Support** | No | No | Python: Yes |
| **Best For** | Math calculations<br/>String operations<br/>Data formatting | Complex queries<br/>Multi-row results<br/>Data transformations | Advanced algorithms<br/>External libraries<br/>Control flow logic |


## Function Management Commands

| Command | Description |
|---------|-------------|
| [CREATE SCALAR FUNCTION](ddl-create-function.md) | Creates a scalar SQL function using unified syntax |
| [CREATE TABLE FUNCTION](ddl-create-table-function.md) | Creates a table function that returns result sets |
| [CREATE EMBEDDED FUNCTION](ddl-create-function-embedded.md) | Creates embedded functions (Python/JavaScript/WASM) |
| [SHOW USER FUNCTIONS](ddl-show-user-functions.md) | Lists all user-defined functions |
| [ALTER FUNCTION](ddl-alter-function.md) | Modifies existing functions |
| [DROP FUNCTION](ddl-drop-function.md) | Removes functions |

## Unified Syntax

All local UDF types use consistent `$$` syntax:

```sql
-- Scalar Function
CREATE FUNCTION func_name(param TYPE) RETURNS TYPE AS $$ expression $$;

-- Tabular Function  
CREATE FUNCTION func_name(param TYPE) RETURNS TABLE(...) AS $$ query $$;

-- Embedded Function
CREATE FUNCTION func_name(param TYPE) RETURNS TYPE LANGUAGE python 
HANDLER = 'handler' AS $$ code $$;
```

