---
title: Query Optimization
---

Analyze and improve query performance with profiling tools, execution plans, and optimization techniques.

## Performance Analysis Tools

### [Query Profile](./query-profile.md)
Visual execution plan analysis in Databend Cloud
- **Access**: Monitor → SQL History → Query Profile tab
- **Shows**: Execution nodes, timing, resource usage
- **Use for**: Identifying bottlenecks, understanding query execution

### [Query Hash](./query-hash.md)
Unique query fingerprinting for performance tracking
```sql
-- Get query fingerprint
SELECT query_hash('SELECT * FROM table WHERE id = ?');
```

## Query Optimization Fundamentals

### Execution Plan Analysis
```sql
-- View query execution plan
EXPLAIN SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date >= '2023-01-01';
```

**Look for:**
- **Table scans** vs **index usage**
- **Join algorithms** (hash, merge, nested loop)
- **Filter pushdown** effectiveness
- **Resource consumption** estimates

### Index Strategy
```sql
-- Create indexes for common query patterns
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_customer ON orders(customer_id);
```

**Index Guidelines:**
- Index WHERE clause columns
- Index JOIN columns on both sides
- Consider composite indexes for multi-column filters
- Monitor index usage statistics

## Performance Optimization Techniques

### Query Rewriting
```sql
-- ❌ Inefficient: Function on column prevents index usage
SELECT * FROM orders WHERE YEAR(order_date) = 2023;

-- ✅ Optimized: Range condition can use index
SELECT * FROM orders 
WHERE order_date >= '2023-01-01' 
  AND order_date < '2024-01-01';
```

### Filter Pushdown
```sql
-- ❌ Filter after join
SELECT * FROM (
    SELECT o.*, c.name 
    FROM orders o JOIN customers c ON o.customer_id = c.id
) WHERE order_date >= '2023-01-01';

-- ✅ Filter before join
SELECT o.*, c.name 
FROM orders o 
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date >= '2023-01-01';
```

### Aggregation Optimization
```sql
-- Use appropriate GROUP BY extensions
SELECT 
    region,
    product_category,
    COUNT(*) as sales_count,
    SUM(amount) as total_sales
FROM sales 
GROUP BY CUBE(region, product_category);
```

## Common Performance Issues

### Issue 1: Large Result Sets
```sql
-- ❌ Problem: No limit on large table
SELECT * FROM events ORDER BY timestamp DESC;

-- ✅ Solution: Always limit exploratory queries
SELECT * FROM events ORDER BY timestamp DESC LIMIT 1000;
```

### Issue 2: Inefficient Joins
```sql
-- ❌ Problem: Cartesian product
SELECT * FROM table1, table2 WHERE condition;

-- ✅ Solution: Explicit join with proper conditions
SELECT * FROM table1 t1
INNER JOIN table2 t2 ON t1.id = t2.foreign_id
WHERE condition;
```

### Issue 3: Unnecessary Complexity
```sql
-- ❌ Problem: Nested subqueries
SELECT * FROM (
    SELECT * FROM (
        SELECT col1, col2 FROM table WHERE condition1
    ) WHERE condition2
) WHERE condition3;

-- ✅ Solution: Combine conditions
SELECT col1, col2 FROM table 
WHERE condition1 AND condition2 AND condition3;
```

## Monitoring and Metrics

### Key Performance Indicators
- **Query execution time**
- **Rows scanned vs rows returned** 
- **Memory usage**
- **CPU utilization**
- **I/O operations**

### Performance Monitoring Query
```sql
-- Find slow queries from query history
SELECT 
    query_text,
    query_duration_ms,
    scan_bytes,
    result_bytes,
    memory_usage
FROM system.query_log
WHERE query_duration_ms > 10000  -- Queries over 10 seconds
ORDER BY query_duration_ms DESC
LIMIT 10;
```

## Optimization Checklist

### Query Design
- [ ] Use appropriate WHERE conditions
- [ ] Minimize data scanned with column selection
- [ ] Apply filters before joins
- [ ] Use proper join types
- [ ] Limit result sets appropriately

### Indexing
- [ ] Index frequently filtered columns
- [ ] Index join columns
- [ ] Remove unused indexes
- [ ] Monitor index effectiveness

### Schema Design
- [ ] Choose appropriate data types
- [ ] Normalize appropriately (avoid over-normalization)
- [ ] Consider partitioning for large tables
- [ ] Use clustering keys for sort optimization

## Advanced Optimization

### Materialized Views
```sql
-- Pre-compute expensive aggregations
CREATE MATERIALIZED VIEW daily_sales AS
SELECT 
    DATE(order_time) as order_date,
    product_id,
    COUNT(*) as order_count,
    SUM(amount) as total_sales
FROM orders
GROUP BY DATE(order_time), product_id;
```

### Query Hints
```sql
-- Force specific join algorithm when needed
SELECT /*+ USE_HASH_JOIN */ *
FROM large_table l
JOIN small_table s ON l.id = s.foreign_id;
```

## Best Practices Summary

1. **Measure first** - Use Query Profile to identify bottlenecks
2. **Index strategically** - Cover your query patterns
3. **Filter early** - Apply WHERE conditions as soon as possible
4. **Limit appropriately** - Don't fetch more data than needed
5. **Monitor continuously** - Track query performance over time