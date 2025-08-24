---
title: Common Table Expressions (CTE)
---

CTEs break complex queries into simple, readable steps using `WITH`.

## Quick Start

```sql
-- Instead of complex nested queries
WITH high_earners AS (
    SELECT * FROM employees WHERE salary > 70000
)
SELECT department, COUNT(*) 
FROM high_earners 
GROUP BY department;
```

**Result**: Clean, readable code that's easy to debug.

## When to Use CTE

**✅ Use CTE when:**
- Query has multiple steps
- You need the same subquery twice
- Query is hard to read

**❌ Skip CTE when:**
- Simple one-step query
- Performance is critical

## Three Essential Patterns

### 1. Filter → Analyze
```sql
WITH filtered_data AS (
    SELECT * FROM sales WHERE date >= '2023-01-01'
)
SELECT product, SUM(amount) 
FROM filtered_data 
GROUP BY product;
```

### 2. Multiple Steps
```sql
WITH step1 AS (
    SELECT department, AVG(salary) as avg_sal FROM employees GROUP BY department
),
step2 AS (
    SELECT * FROM step1 WHERE avg_sal > 70000
)
SELECT * FROM step2;
```

### 3. Use Same Data Twice
```sql
WITH dept_stats AS (
    SELECT department, AVG(salary) as avg_sal FROM employees GROUP BY department
)
SELECT d1.department, d1.avg_sal
FROM dept_stats d1
JOIN dept_stats d2 ON d1.avg_sal > d2.avg_sal;
```

## Advanced: Recursive CTE

Recursive CTEs solve problems where you need to repeatedly apply the same logic. Think of it like climbing stairs - you start at step 1, then keep going up one step at a time.

```sql
-- Generate a sequence (useful for reports, testing, or filling gaps)
WITH RECURSIVE countdown AS (
    -- Base case: where we start
    SELECT 10 as num, 'Starting countdown' as message
    
    UNION ALL
    
    -- Recursive case: what we do repeatedly
    SELECT num - 1, CONCAT('Count: ', CAST(num - 1 AS VARCHAR))
    FROM countdown 
    WHERE num > 1  -- Stop condition: when to stop
)
SELECT num, message FROM countdown;
```

**Result**: Numbers from 10 down to 1 with messages.

**Real-world example**: Generate missing months for a sales report
- Start: January 2024
- Repeat: Add next month  
- Stop: When we reach December 2024

**Key insight**: Recursion = Start somewhere + Repeat an action + Know when to stop.

**That's it.** Start with simple CTEs, add complexity only when needed.