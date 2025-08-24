---
title: Basic Queries
---

Master the fundamentals of querying data in Databend. Start here if you're new to SQL or need a refresher on core concepts.

## What You'll Learn

- Select and filter data effectively
- Sort and limit query results  
- Group data and calculate aggregates
- Use advanced grouping techniques

## Query Essentials

### [Filtering & Selection](./filtering-selection.md)
Learn the basics: SELECT, WHERE, ORDER BY, and LIMIT
```sql
SELECT name, salary FROM employees 
WHERE department = 'Engineering' 
ORDER BY salary DESC;
```

### [Aggregating Data](./aggregating-data.md)  
Summarize data with GROUP BY and aggregate functions
```sql
SELECT department, AVG(salary) as avg_salary
FROM employees 
GROUP BY department;
```

### [Advanced Grouping](./groupby/index.md)
Multi-dimensional analysis with CUBE, ROLLUP, and GROUPING SETS
```sql
-- Generate all possible grouping combinations
SELECT department, job_level, COUNT(*)
FROM employees 
GROUP BY CUBE(department, job_level);
```

## Quick Reference

### Most Common Patterns
```sql
-- Top N query
SELECT * FROM table ORDER BY column DESC LIMIT 10;

-- Count by category  
SELECT category, COUNT(*) FROM table GROUP BY category;

-- Filter and aggregate
SELECT region, AVG(sales) 
FROM orders 
WHERE order_date >= '2023-01-01'
GROUP BY region
HAVING AVG(sales) > 1000;
```

## Next Steps

Once you're comfortable with basic queries:
- [Combining Data](../01-combining-data/index.md) - JOIN tables and use CTEs
- [Advanced Features](../02-advanced/index.md) - Custom functions and procedures