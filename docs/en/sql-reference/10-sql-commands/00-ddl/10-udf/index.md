---
title: User-Defined Function
---

User-Defined Functions (UDFs) in Databend allow you to create custom operations tailored to your specific data processing needs. This page highlights the commands you will use most often and helps you choose the right function type for your use case.

:::tip Check the built-in functions first
Databend ships hundreds of built-in functions covering math, strings, dates, JSON, aggregation, and more. Before writing a UDF, browse the [SQL Function Reference](../../../20-sql-functions/index.md) to see if one already does what you need. Reach for a UDF when the built-ins can't express your logic.
:::

## Function Management Commands

| Command | Description |
|---------|-------------|
| [CREATE SCALAR FUNCTION](ddl-create-function.md) | Scalar UDF (SQL/Python/JavaScript) |
| [CREATE AGGREGATE FUNCTION](ddl-create-aggregate-function.md) | Script UDAF (JavaScript/Python runtimes) |
| [CREATE TABLE FUNCTION](ddl-create-table-function.md) | SQL-only table function returning result sets |
| [SHOW USER FUNCTIONS](ddl-show-user-functions.md) | Lists all user-defined functions |
| [ALTER FUNCTION](ddl-alter-function.md) | Modifies existing functions |
| [DROP FUNCTION](ddl-drop-function.md) | Removes functions |

## Function Type Comparison

| Feature | Scalar (SQL) | Scalar (Python/JavaScript) | Aggregate (Script) | Tabular SQL |
|---------|-------------|----------------------------|--------------------|------------|
| **Return Type** | Single value | Single value | Single value | Table/ResultSet |
| **Language** | SQL expressions | Python/JavaScript | JavaScript/Python runtimes | SQL queries |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Enterprise Required** | No | Python runtime only | Python runtime only | No |
| **Package Support** | No | Python: Yes (PACKAGES) | Python: Yes (PACKAGES) | No |
| **Best For** | Math calculations<br/>String operations<br/>Data formatting | Advanced algorithms<br/>External libraries<br/>Control flow logic | Custom aggregations that need scripting logic | Complex queries<br/>Multi-row results<br/>Data transformations |

## Unified Syntax

All local UDF types use consistent `$$` syntax:

```sql
-- Scalar Function
CREATE FUNCTION func_name(param TYPE) RETURNS TYPE AS $$ expression $$;

-- Tabular Function  
CREATE FUNCTION func_name(param TYPE) RETURNS TABLE(...) AS $$ query $$;

-- Scalar Function (Python/JavaScript)
CREATE FUNCTION func_name(param TYPE) RETURNS TYPE
LANGUAGE python
HANDLER = 'handler' AS $$ code $$;
```
