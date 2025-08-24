---
title: 查询优化 (Query Optimization)
---

通过性能分析工具、执行计划 (Execution Plan) 和优化技术来分析和提升查询性能。

## 性能分析工具

### [查询概况 (Query Profile)](./query-profile.md)
Databend Cloud 中的可视化执行计划分析
- **访问**：监控 → SQL 历史 → 查询概况 (Query Profile) 选项卡
- **展示**：执行节点、耗时、资源使用情况
- **用途**：识别瓶颈、理解查询执行过程

### [查询哈希 (Query Hash)](./query-hash.md)
用于性能追踪的唯一查询指纹
```sql
-- 获取查询指纹
SELECT query_hash('SELECT * FROM table WHERE id = ?');
```

## 查询优化基础

### 执行计划分析 (Execution Plan Analysis)
```sql
-- 查看查询执行计划
EXPLAIN SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date >= '2023-01-01';
```

**关注点：**
- **表扫描 (Table Scans)** vs **索引使用 (Index Usage)**
- **连接算法 (Join Algorithms)**（哈希、合并、嵌套循环）
- **过滤器下推 (Filter Pushdown)** 的有效性
- **资源消耗 (Resource Consumption)** 估算

### 索引策略 (Index Strategy)
```sql
-- 为常见查询模式创建索引
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_customer ON orders(customer_id);
```

**索引指南：**
- 为 WHERE 子句中的列创建索引
- 为连接 (JOIN) 两侧的列创建索引
- 考虑为多列过滤器创建复合索引 (Composite Index)
- 监控索引使用统计信息

## 性能优化技巧

### 查询重写 (Query Rewriting)
```sql
-- ❌ 低效：对列使用函数导致无法使用索引
SELECT * FROM orders WHERE YEAR(order_date) = 2023;

-- ✅ 优化：范围条件可以使用索引
SELECT * FROM orders 
WHERE order_date >= '2023-01-01' 
  AND order_date < '2024-01-01';
```

### 过滤器下推 (Filter Pushdown)
```sql
-- ❌ 在连接后过滤
SELECT * FROM (
    SELECT o.*, c.name 
    FROM orders o JOIN customers c ON o.customer_id = c.id
) WHERE order_date >= '2023-01-01';

-- ✅ 在连接前过滤
SELECT o.*, c.name 
FROM orders o 
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date >= '2023-01-01';
```

### 聚合优化 (Aggregation Optimization)
```sql
-- 使用合适的 GROUP BY 扩展
SELECT 
    region,
    product_category,
    COUNT(*) as sales_count,
    SUM(amount) as total_sales
FROM sales 
GROUP BY CUBE(region, product_category);
```

## 常见性能问题

### 问题 1：结果集过大
```sql
-- ❌ 问题：对大表查询未加限制
SELECT * FROM events ORDER BY timestamp DESC;

-- ✅ 解决方案：始终限制探索性查询的结果集大小
SELECT * FROM events ORDER BY timestamp DESC LIMIT 1000;
```

### 问题 2：低效的连接 (Join)
```sql
-- ❌ 问题：笛卡尔积
SELECT * FROM table1, table2 WHERE condition;

-- ✅ 解决方案：使用带有正确条件的显式连接
SELECT * FROM table1 t1
INNER JOIN table2 t2 ON t1.id = t2.foreign_id
WHERE condition;
```

### 问题 3：不必要的复杂性
```sql
-- ❌ 问题：嵌套子查询 (Subquery)
SELECT * FROM (
    SELECT * FROM (
        SELECT col1, col2 FROM table WHERE condition1
    ) WHERE condition2
) WHERE condition3;

-- ✅ 解决方案：合并条件
SELECT col1, col2 FROM table 
WHERE condition1 AND condition2 AND condition3;
```

## 监控与指标

### 关键性能指标 (Key Performance Indicators)
- **查询执行时间 (Query Execution Time)**
- **扫描行数 vs 返回行数**
- **内存使用量 (Memory Usage)**
- **CPU 使用率 (CPU Utilization)**
- **I/O 操作 (I/O Operations)**

### 性能监控查询
```sql
-- 从查询历史中查找慢查询
SELECT 
    query_text,
    query_duration_ms,
    scan_bytes,
    result_bytes,
    memory_usage
FROM system.query_log
WHERE query_duration_ms > 10000  -- 超过 10 秒的查询
ORDER BY query_duration_ms DESC
LIMIT 10;
```

## 优化清单

### 查询设计
- [ ] 使用合适的 WHERE 条件
- [ ] 通过选择列来最小化扫描的数据量
- [ ] 在连接前应用过滤器
- [ ] 使用正确的连接类型
- [ ] 适当地限制结果集

### 索引 (Indexing)
- [ ] 为频繁过滤的列创建索引
- [ ] 为连接列创建索引
- [ ] 移除未使用的索引
- [ ] 监控索引的有效性

### 模式设计 (Schema Design)
- [ ] 选择合适的数据类型
- [ ] 适度规范化（避免过度规范化）
- [ ] 考虑为大表进行分区 (Partitioning)
- [ ] 使用聚簇键 (Cluster Key) 进行排序优化

## 高级优化

### 物化视图 (Materialized Views)
```sql
-- 预计算开销大的聚合
CREATE MATERIALIZED VIEW daily_sales AS
SELECT 
    DATE(order_time) as order_date,
    product_id,
    COUNT(*) as order_count,
    SUM(amount) as total_sales
FROM orders
GROUP BY DATE(order_time), product_id;
```

### 查询提示 (Query Hints)
```sql
-- 在需要时强制使用特定的连接算法
SELECT /*+ USE_HASH_JOIN */ *
FROM large_table l
JOIN small_table s ON l.id = s.foreign_id;
```

## 最佳实践总结

1.  **首先测量** - 使用查询概况 (Query Profile) 识别瓶颈
2.  **策略性地创建索引** - 覆盖你的查询模式
3.  **尽早过滤** - 尽快应用 WHERE 条件
4.  **适当限制** - 不要获取超出需要的数据
5.  **持续监控** - 长期跟踪查询性能