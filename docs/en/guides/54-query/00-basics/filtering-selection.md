---
title: Filtering & Selection
---

Learn the fundamentals of querying data in Databend with SELECT, WHERE, and basic operations.

## Basic SELECT Queries

### Selecting Columns
```sql
-- Select specific columns
SELECT name, salary FROM employees;

-- Select all columns
SELECT * FROM employees;

-- Select with column aliases
SELECT name AS employee_name, salary AS monthly_pay 
FROM employees;
```

### Filtering with WHERE
```sql
-- Simple condition
SELECT * FROM employees WHERE department = 'Engineering';

-- Multiple conditions
SELECT * FROM employees 
WHERE salary > 70000 AND department = 'Engineering';

-- Using OR
SELECT * FROM employees 
WHERE department = 'Engineering' OR department = 'Marketing';

-- Range conditions
SELECT * FROM employees 
WHERE salary BETWEEN 60000 AND 80000;

-- Pattern matching
SELECT * FROM employees 
WHERE name LIKE 'A%';  -- Names starting with 'A'
```

## Sorting Results

### ORDER BY Clause
```sql
-- Sort by single column
SELECT * FROM employees ORDER BY salary DESC;

-- Sort by multiple columns
SELECT * FROM employees 
ORDER BY department ASC, salary DESC;

-- Sort by column position
SELECT name, salary FROM employees ORDER BY 2 DESC;
```

## Limiting Results

### LIMIT and OFFSET
```sql
-- Get top 5 highest paid employees
SELECT * FROM employees 
ORDER BY salary DESC 
LIMIT 5;

-- Pagination - skip first 10, get next 5
SELECT * FROM employees 
ORDER BY salary DESC 
LIMIT 5 OFFSET 10;
```

## Common Operators

### Comparison Operators
- `=` Equal to
- `!=` or `<>` Not equal to  
- `>` Greater than
- `<` Less than
- `>=` Greater than or equal
- `<=` Less than or equal

### Logical Operators
- `AND` Both conditions must be true
- `OR` Either condition can be true
- `NOT` Negates a condition

### NULL Handling
```sql
-- Check for NULL values
SELECT * FROM employees WHERE manager_id IS NULL;

-- Check for non-NULL values  
SELECT * FROM employees WHERE manager_id IS NOT NULL;
```

## Best Practices

1. **Be specific with columns** - Avoid `SELECT *` in production
2. **Use indexes** - WHERE conditions on indexed columns are faster
3. **Limit large results** - Always use LIMIT for exploratory queries
4. **Filter early** - Apply WHERE conditions before JOINs when possible