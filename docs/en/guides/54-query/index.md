---
title: Query Data in Databend
---

Databend supports standard SQL with ANSI SQL:2003 analytics extensions. This guide covers essential query techniques from basic to advanced, organized by learning path for optimal understanding.

## Learning Path

**📚 New to SQL?** Start with [Basic Queries](./00-basics/index.md)  
**🔗 Joining data?** Go to [Combining Data](./01-combining-data/index.md)  
**⚡ Need custom logic?** Check [Advanced Features](./02-advanced/index.md)  
**🚀 Performance issues?** Visit [Query Optimization](./03-optimization/index.md)

---

## 📚 [Basic Queries](./00-basics/index.md)

Master fundamental SQL operations for data selection and aggregation.

### [Filtering & Selection](./00-basics/filtering-selection.md)
```sql
-- Select and filter data
SELECT name, salary FROM employees 
WHERE department = 'Engineering' 
ORDER BY salary DESC;
```

### [Aggregating Data](./00-basics/aggregating-data.md)
```sql
-- Group and summarize data
SELECT department, 
       COUNT(*) as emp_count,
       AVG(salary) as avg_salary
FROM employees 
GROUP BY department;
```

### [Advanced Grouping](./00-basics/groupby/index.md)
Multi-dimensional analysis with CUBE, ROLLUP, and GROUPING SETS

---

## 🔗 [Combining Data](./01-combining-data/index.md)

Connect data from multiple sources using JOINs and CTEs.

### [JOINs](./01-combining-data/joins.md)
```sql
-- Combine related tables
SELECT e.name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.id;
```

### [Common Table Expressions (CTE)](./01-combining-data/cte.md)
```sql
-- Structure complex queries
WITH high_earners AS (
  SELECT * FROM employees WHERE salary > 75000
)
SELECT department, COUNT(*) as count
FROM high_earners GROUP BY department;
```

---

## ⚡ [Advanced Features](./02-advanced/index.md)

Extend capabilities with custom functions and external integrations.

### [User-Defined Functions](./02-advanced/udf.md)
```sql
-- Create reusable functions
CREATE FUNCTION calculate_bonus(salary FLOAT, rating FLOAT)
RETURNS FLOAT AS $$ salary * rating * 0.1 $$;
```

### More Advanced Features
- [External Functions](./02-advanced/external-function.md) - Cloud ML integration
- [Stored Procedures](./02-advanced/stored-procedure.md) - Multi-step operations
- [Sequences](./02-advanced/sequences.md) - Unique ID generation

---

## 🚀 [Query Optimization](./03-optimization/index.md)

Analyze and improve query performance with profiling tools.

### [Query Profile](./03-optimization/query-profile.md)
Visual execution plan analysis (Databend Cloud: Monitor → SQL History)

### [Performance Analysis](./03-optimization/query-hash.md)
```sql
-- Analyze query execution
EXPLAIN SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date >= '2023-01-01';
```

---

## Quick Reference

### Most Common Patterns
```sql
-- Top N query
SELECT * FROM employees ORDER BY salary DESC LIMIT 10;

-- Filter and aggregate  
SELECT department, AVG(salary) 
FROM employees 
WHERE hire_date >= '2023-01-01'
GROUP BY department
HAVING AVG(salary) > 70000;

-- Join with CTE
WITH recent_orders AS (
  SELECT * FROM orders WHERE order_date >= '2023-01-01'
)
SELECT c.name, COUNT(*) as order_count
FROM customers c
JOIN recent_orders o ON c.id = o.customer_id
GROUP BY c.name;
```
