---
title: SQL Variables
sidebar_label: SQL Variables
---

SQL variables allow you to store and manage temporary data within a session.

## Variable DDL Commands

Databend provides the following DDL commands for using SQL variables:

- [SET VARIABLE](../10-sql-commands/00-ddl/15-variable/set-variable.md)
- [SHOW VARIABLES](../10-sql-commands/00-ddl/15-variable/show-variables.md)
- [UNSET VARIABLE](../10-sql-commands/00-ddl/15-variable/unset-variable.md)

The SHOW VARIABLES command has a corresponding table function, [SHOW_VARIABLES](../20-sql-functions/17-table-functions/show-variables.md), which provides the same information in a table format, allowing for more complex filtering and querying within SQL statements.

## Querying with Variables

This section explains how to effectively use variables in your queries, leveraging both `$` for value substitution and `IDENTIFIER` for accessing database objects like tables.

### Accessing Variables with `$` and `getvariable()`

You can reference the value of a variable within a SQL statement using either the `$` symbol or the `getvariable()` function. Both methods allow dynamic substitution, where the variable's value is directly embedded into the query at runtime.

```sql title='Example:'
-- Set a variable to use as a filter value
SET VARIABLE threshold = 100;

-- Use the variable in a query with $
SELECT * FROM sales WHERE amount > $threshold;

-- Alternatively, use the getvariable() function
SELECT * FROM sales WHERE amount > getvariable('threshold');
```

### Accessing Objects with `IDENTIFIER`

The `IDENTIFIER` keyword allows you to dynamically reference database objects whose names are stored in variables. Please note that accessing objects with `IDENTIFIER` is *not* supported by BendSQL yet.

```sql title='Example:'
-- Create a table with sales data
CREATE TABLE sales_data (region TEXT, sales_amount INT, month TEXT) AS 
SELECT 'North', 5000, 'January' UNION ALL
SELECT 'South', 3000, 'January';

select * from sales_data;

-- Set variables for the table name and column name
SET VARIABLE table_name = 'sales_data';
SET VARIABLE column_name = 'sales_amount';

-- Use IDENTIFIER to dynamically reference the table and column in the query
SELECT region, IDENTIFIER($column_name) 
FROM IDENTIFIER($table_name) 
WHERE IDENTIFIER($column_name) > 4000;
```