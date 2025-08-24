---
title: Subqueries
---

A subquery is a query inside another query. Use subqueries to filter, compare, or compute values that depend on data from the main query.

## Quick Start

```sql
-- Find employees earning above department average
SELECT name, salary, department
FROM employees
WHERE salary > (
    SELECT AVG(salary) 
    FROM employees AS e2 
    WHERE e2.department = employees.department
);
```

**Result**: Employees who earn more than their department's average salary.

## Types of Subqueries

### 1. Scalar Subqueries (Single Value)
```sql
-- Compare to overall average
SELECT name, salary,
       (SELECT AVG(salary) FROM employees) AS company_avg
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

**Returns**: Single value (one row, one column).

### 2. Table Subqueries (Multiple Rows)
```sql
-- Filter by department conditions
SELECT name, department
FROM employees
WHERE department IN (
    SELECT name 
    FROM departments 
    WHERE budget > 500000
);
```

**Returns**: Multiple rows, used with IN, EXISTS, ANY, ALL.

## Subquery Placement

### WHERE Clause - Filtering
```sql
-- Employees in high-budget departments
SELECT name, salary
FROM employees
WHERE department IN (
    SELECT name FROM departments WHERE budget > 500000
);
```

### FROM Clause - Data Source
```sql
-- Analyze high earners by department
SELECT department, AVG(salary) as avg_salary
FROM (
    SELECT * FROM employees WHERE salary > 70000
) AS high_earners
GROUP BY department;
```

### SELECT Clause - Computed Columns
```sql
-- Show salary vs department average
SELECT name, salary,
       (SELECT AVG(salary) 
        FROM employees e2 
        WHERE e2.department = e1.department) as dept_avg
FROM employees e1;
```

## Correlated vs Uncorrelated

### Uncorrelated - Independent
```sql
-- Same subquery runs once
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

**Performance**: Subquery executes once, result reused.

### Correlated - Dependent  
```sql
-- Subquery runs for each main row
SELECT name, salary, department
FROM employees e1
WHERE salary > (
    SELECT AVG(salary) 
    FROM employees e2 
    WHERE e2.department = e1.department
);
```

**Performance**: Subquery executes for each outer row.

## Common Patterns

### EXISTS - Check for Related Data
```sql
-- Employees who have projects
SELECT name, department
FROM employees e
WHERE EXISTS (
    SELECT 1 FROM projects p WHERE p.employee_id = e.id
);
```

### NOT EXISTS - Check for Missing Data
```sql
-- Employees without projects
SELECT name, department
FROM employees e
WHERE NOT EXISTS (
    SELECT 1 FROM projects p WHERE p.employee_id = e.id
);
```

### ANY/ALL - Multiple Comparisons
```sql
-- Employees earning more than ANY marketing employee
SELECT name, salary
FROM employees
WHERE salary > ANY (
    SELECT salary FROM employees WHERE department = 'Marketing'
);

-- Employees earning more than ALL marketing employees
SELECT name, salary
FROM employees
WHERE salary > ALL (
    SELECT salary FROM employees WHERE department = 'Marketing'
);
```

## When to Use Subqueries vs JOINs

**✅ Use Subqueries when:**
- Filtering based on aggregate conditions
- Checking existence/non-existence
- Need computed values in SELECT
- Logic is clearer as nested steps

**✅ Use JOINs when:**
- Need columns from multiple tables
- Better performance for large datasets
- Combining data rather than filtering

