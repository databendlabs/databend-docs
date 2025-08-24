---
title: Aggregating Data
---

Learn to summarize and analyze data using GROUP BY, aggregate functions, and advanced grouping techniques.

## Basic Aggregation

### Common Aggregate Functions
```sql
-- Count rows
SELECT COUNT(*) FROM employees;

-- Statistical functions
SELECT 
    AVG(salary) as avg_salary,
    MIN(salary) as min_salary,
    MAX(salary) as max_salary,
    SUM(salary) as total_salary
FROM employees;
```

## GROUP BY Fundamentals

### Single Column Grouping
```sql
-- Count employees by department
SELECT department, COUNT(*) as emp_count
FROM employees 
GROUP BY department;

-- Average salary by department
SELECT department, AVG(salary) as avg_salary
FROM employees 
GROUP BY department
ORDER BY avg_salary DESC;
```

### Multiple Column Grouping
```sql
-- Group by department and hire year
SELECT 
    department,
    EXTRACT(YEAR FROM hire_date) as hire_year,
    COUNT(*) as count,
    AVG(salary) as avg_salary
FROM employees 
GROUP BY department, EXTRACT(YEAR FROM hire_date)
ORDER BY department, hire_year;
```

### GROUP BY with HAVING
```sql
-- Find departments with more than 5 employees
SELECT department, COUNT(*) as emp_count
FROM employees 
GROUP BY department
HAVING COUNT(*) > 5;

-- Departments with average salary > 70000
SELECT department, AVG(salary) as avg_salary
FROM employees 
GROUP BY department
HAVING AVG(salary) > 70000;
```

## Advanced Grouping

### GROUP BY ALL
```sql
-- Automatically group by all non-aggregate columns
SELECT department, job_title, COUNT(*) as count
FROM employees 
GROUP BY ALL;
```

## Advanced Grouping Extensions

Databend supports SQL:2003 standard grouping extensions:

- **[ROLLUP](./groupby/group-by-rollup.md)** - Hierarchical subtotals
- **[CUBE](./groupby/group-by-cube.md)** - All possible combinations  
- **[GROUPING SETS](./groupby/group-by-grouping-sets.md)** - Custom combinations

## Best Practices

1. **Use appropriate aggregates** - COUNT(*) vs COUNT(column)
2. **Filter before grouping** - Use WHERE before GROUP BY
3. **Use HAVING for aggregate conditions** - Filter groups after aggregation
4. **Consider indexes** - GROUP BY columns should be indexed