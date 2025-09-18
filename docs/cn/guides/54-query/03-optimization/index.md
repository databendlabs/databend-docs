---
title: 查询优化
---

使用性能分析工具、执行计划和优化技术来分析和提升查询性能。

## 性能分析工具

### [查询分析](./query-profile.md)
Databend Cloud 中的可视化执行计划分析
- **访问路径**：监控 → SQL 历史 → 查询分析标签页
- **展示内容**：执行节点、耗时、资源使用情况
- **用途**：识别瓶颈、理解查询执行过程

### [查询哈希](./query-hash.md)
用于性能追踪的唯一查询指纹
```sql
-- 获取查询指纹
SELECT query_hash('SELECT * FROM table WHERE id = ?');
```

## 查询优化基础

### 执行计划分析
```sql
-- 查看查询执行计划
EXPLAIN SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date >= '2023-01-01';
```

**关注点：**
- **表扫描** vs **索引使用**
- **连接算法**（哈希、合并、嵌套循环）
- **过滤下推**效果
- **资源消耗**估算

### 索引策略
```sql
-- 为常见查询模式创建索引
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_customer ON orders(customer_id);
```

**索引指南：**
- 为 WHERE 子句中的列创建索引
- 为 JOIN 两侧的列创建索引
- 为多列过滤条件考虑复合索引
- 监控索引使用统计信息

## 性能优化技术

### 查询重写
```sql
-- ❌ 低效：对列使用函数导致无法使用索引
SELECT * FROM orders WHERE YEAR(order_date) = 2023;

-- ✅ 优化：范围条件可以使用索引
SELECT * FROM orders 
WHERE order_date >= '2023-01-01' 
  AND order_date < '2024-01-01';
```

### 过滤下推
```sql
-- ❌ 连接后过滤
SELECT * FROM (
    SELECT o.*, c.name 
    FROM orders o JOIN customers c ON o.customer_id = c.id
) WHERE order_date >= '2023-01-01';

-- ✅ 连接前过滤
SELECT o.*, c.name 
FROM orders o 
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date >= '2023-01-01';
```

### 聚合优化
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

-- ✅ 解决：始终限制探索性查询的结果集大小
SELECT * FROM events ORDER BY timestamp DESC LIMIT 1000;
```

### 问题 2：低效的连接
```sql
-- ❌ 问题：笛卡尔积
SELECT * FROM table1, table2 WHERE condition;

-- ✅ 解决：使用带有正确条件的显式连接
SELECT * FROM table1 t1
INNER JOIN table2 t2 ON t1.id = t2.foreign_id
WHERE condition;
```

### 问题 3：不必要的复杂性
```sql
-- ❌ 问题：嵌套子查询
SELECT * FROM (
    SELECT * FROM (
        SELECT col1, col2 FROM table WHERE condition1
    ) WHERE condition2
) WHERE condition3;

-- ✅ 解决：合并条件
SELECT col1, col2 FROM table 
WHERE condition1 AND condition2 AND condition3;
```

## 监控与指标

### 关键性能指标
- **查询执行时间**
- **扫描行数 vs 返回行数**
- **内存使用量**
- **CPU 使用率**
- **I/O 操作**

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
- [ ] 适当限制结果集

### 索引
- [ ] 为频繁过滤的列创建索引
- [ ] 为连接列创建索引
- [ ] 移除未使用的索引
- [ ] 监控索引的有效性

### 模式设计
- [ ] 选择合适的数据类型
- [ ] 适当进行规范化（避免过度规范化）
- [ ] 对大表考虑使用分区
- [ ] 使用聚簇键进行排序优化

## 高级优化

### 聚合索引
```sql
-- 使用 Databend 的聚合索引预计算昂贵的聚合操作
CREATE AGGREGATING INDEX daily_sales_agg AS
SELECT 
    DATE(order_time) as order_date,
    product_id,
    COUNT(*) as order_count,
    SUM(amount) as total_sales
FROM orders
GROUP BY DATE(order_time), product_id;
```

### 查询提示
```sql
-- 必要时强制使用特定的连接算法
SELECT /*+ USE_HASH_JOIN */ *
FROM large_table l
JOIN small_table s ON l.id = s.foreign_id;
```

## 最佳实践总结

1. **首先测量** - 使用查询分析识别瓶颈
2. **策略性地创建索引** - 覆盖你的查询模式
3. **尽早过滤** - 尽快应用 WHERE 条件
4. **适当限制** - 不要获取超出需要的数据
5. **持续监控** - 长期跟踪查询性能