---
title: User-Defined Function
---

User-Defined Functions (UDFs) in Databend allow you to create custom operations tailored to your specific data processing needs. This page highlights the commands you will use most often and helps you choose the right function type for your use case.

## Function Management Commands

| Command | Description |
|---------|-------------|
| [CREATE SCALAR FUNCTION](ddl-create-function.md) | SQL-only scalar function (no external language) |
| [CREATE AGGREGATE FUNCTION](ddl-create-aggregate-function.md) | Script UDAF (JavaScript/Python runtimes) |
| [CREATE TABLE FUNCTION](ddl-create-table-function.md) | SQL-only table function returning result sets |
| [CREATE EMBEDDED FUNCTION](ddl-create-function-embedded.md) | Embedded scalar functions (Python/JavaScript/WASM) |
| [SHOW USER FUNCTIONS](ddl-show-user-functions.md) | Lists all user-defined functions |
| [ALTER FUNCTION](ddl-alter-function.md) | Modifies existing functions |
| [DROP FUNCTION](ddl-drop-function.md) | Removes functions |

## Function Type Comparison

| Feature | Scalar SQL | Aggregate (Script) | Tabular SQL | Embedded |
|---------|------------|--------------------|-------------|----------|
| **Return Type** | Single value | Single value | Table/ResultSet | Single value |
| **Language** | SQL expressions | JavaScript/Python runtimes | SQL queries | Python/JavaScript/WASM |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Enterprise Required** | No | Python runtime only | No | Python runtime only |
| **Package Support** | No | Python: Yes (PACKAGES) | No | Python: Yes (PACKAGES) |
| **Best For** | Math calculations<br/>String operations<br/>Data formatting | Custom aggregations that need scripting logic | Complex queries<br/>Multi-row results<br/>Data transformations | Advanced algorithms<br/>External libraries<br/>Control flow logic |

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
