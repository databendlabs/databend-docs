---
title: User-Defined Function
sidebar_position: 1
---

# User-Defined Functions (UDFs) in Databend

User-Defined Functions (UDFs) allow you to create custom operations tailored to your specific data processing needs. Databend uses a **unified `$$` syntax** across all function types for consistency.

## Quick Start Guide

Choose your function type based on what you need to return:

| **Need to Return** | **Function Type** | **Documentation** |
|-------------------|-------------------|-------------------|
| Single value (number, string, etc.) | **Scalar SQL** | [CREATE SCALAR FUNCTION](/sql/sql-commands/ddl/udf/ddl-create-function) |
| Multiple rows/columns | **Tabular SQL** | [CREATE TABLE FUNCTION](/sql/sql-commands/ddl/udf/ddl-create-table-function) |
| Complex logic with Python/JS/WASM | **Embedded** | [CREATE EMBEDDED FUNCTION](/sql/sql-commands/ddl/udf/ddl-create-function-embedded) |

All function types use the same unified syntax pattern:
```sql
CREATE FUNCTION name(params) RETURNS type AS $$ logic $$;
```

## Scalar SQL Functions

Return single values using SQL expressions. Perfect for calculations, formatting, and simple transformations.

```sql
-- Calculate BMI
CREATE FUNCTION calculate_bmi(weight FLOAT, height FLOAT)
RETURNS FLOAT
AS $$ weight / (height * height) $$;

-- Format full name
CREATE FUNCTION full_name(first VARCHAR, last VARCHAR)
RETURNS VARCHAR
AS $$ concat(first, ' ', last) $$;

-- Use the functions
SELECT 
    full_name('John', 'Doe') AS name,
    calculate_bmi(70.0, 1.75) AS bmi;
```


## Table Functions (UDTFs)

Return result sets with multiple rows and columns. Perfect for encapsulating complex queries with parameters.

```sql
-- Get employees by department
CREATE FUNCTION get_dept_employees(dept_name VARCHAR)
RETURNS TABLE (id INT, name VARCHAR, salary DECIMAL)
AS $$
    SELECT id, name, salary 
    FROM employees 
    WHERE department = dept_name
$$;

-- Department statistics  
CREATE FUNCTION dept_stats()
RETURNS TABLE (department VARCHAR, count INT, avg_salary DECIMAL)
AS $$
    SELECT department, COUNT(*), AVG(salary)
    FROM employees 
    GROUP BY department
$$;

-- Use table functions
SELECT * FROM get_dept_employees('Engineering');
SELECT * FROM dept_stats();
```

## Embedded Functions

Use Python, JavaScript, or WASM for complex logic that can't be easily expressed in SQL.

| Language | Enterprise Required | Package Support |
|----------|-------------------|-----------------|
| Python | Yes | PyPI packages |
| JavaScript | No | No |
| WASM | No | No |

### Python Example
```sql
-- Simple calculation with type safety
CREATE FUNCTION py_calc(INT, INT)
RETURNS INT
LANGUAGE python HANDLER = 'calculate'
AS $$
def calculate(x, y):
    return x * y + 10
$$;

SELECT py_calc(5, 3); -- Returns: 25
```

### JavaScript Example  
```sql
-- String processing
CREATE FUNCTION js_format(VARCHAR, INT)
RETURNS VARCHAR
LANGUAGE javascript HANDLER = 'formatPerson'
AS $$
export function formatPerson(name, age) {
    return `${name} is ${age} years old`;
}
$$;

SELECT js_format('Alice', 25); -- Returns: "Alice is 25 years old"
```

## Function Management

| Command | Documentation |
|---------|--------------|
| **CREATE** functions | [Scalar](/sql/sql-commands/ddl/udf/ddl-create-function), [Table](/sql/sql-commands/ddl/udf/ddl-create-table-function), [Embedded](/sql/sql-commands/ddl/udf/ddl-create-function-embedded) |
| **ALTER** functions | [ALTER FUNCTION](/sql/sql-commands/ddl/udf/ddl-alter-function) |
| **DROP** functions | [DROP FUNCTION](/sql/sql-commands/ddl/udf/ddl-drop-function) |
| **SHOW** functions | [SHOW USER FUNCTIONS](/sql/sql-commands/ddl/udf/ddl-show-user-functions) |

For complete UDF overview and comparison, see [User-Defined Function Commands](/sql/sql-commands/ddl/udf/).