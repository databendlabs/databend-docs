---
title: Combining Data
---

Learn to combine data from multiple sources using JOINs, CTEs, and advanced query structures.

## Core Concepts

### [JOINs](./joins.md)
Connect data from multiple tables
```sql
-- Inner join (most common)
SELECT e.name, d.department_name
FROM employees e
JOIN departments d ON e.dept_id = d.id;
```
**Covers**: Inner, Left, Right, Full Outer, Semi, Anti, and AsOf joins

### [Common Table Expressions (CTEs)](./cte.md)  
Structure complex queries with WITH clauses
```sql
-- Break complex logic into steps
WITH high_performers AS (
    SELECT * FROM employees WHERE rating > 4.0
)
SELECT department, COUNT(*) 
FROM high_performers 
GROUP BY department;
```
**Covers**: Basic CTEs, Recursive CTEs, Materialized CTEs

## Advanced Combinations

### Subqueries
```sql
-- Correlated subquery
SELECT name, salary,
    (SELECT AVG(salary) FROM employees e2 
     WHERE e2.department = e1.department) as dept_avg
FROM employees e1;

-- EXISTS clause
SELECT * FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.customer_id = c.id
);
```

### Set Operations
```sql
-- Combine results from multiple queries
SELECT name FROM employees WHERE department = 'Sales'
UNION
SELECT name FROM contractors WHERE active = true;

-- Other set operations
INTERSECT  -- Common rows only
EXCEPT     -- Rows in first query but not second
```

## Practical Patterns

### Data Enrichment
```sql
-- Add lookup data to main table
WITH region_lookup AS (
    SELECT zip_code, region_name 
    FROM zip_regions
)
SELECT 
    c.customer_name,
    c.zip_code,
    r.region_name,
    SUM(o.amount) as total_sales
FROM customers c
LEFT JOIN region_lookup r ON c.zip_code = r.zip_code
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.customer_name, c.zip_code, r.region_name;
```

### Hierarchical Data
```sql
-- Recursive CTE for organizational structure  
WITH RECURSIVE org_chart AS (
    -- Base case: top-level managers
    SELECT id, name, manager_id, 1 as level
    FROM employees WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive case: add direct reports
    SELECT e.id, e.name, e.manager_id, o.level + 1
    FROM employees e
    JOIN org_chart o ON e.manager_id = o.id
)
SELECT * FROM org_chart ORDER BY level, name;
```

