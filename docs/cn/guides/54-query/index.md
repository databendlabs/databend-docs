---
title: 在 Databend 中查询数据
---

Databend 支持标准 SQL，并带有 ANSI SQL:2003 分析扩展。本指南涵盖从基础到高级的核心查询技术，按学习路径组织，便于高效掌握。

## 学习路径

**📚 SQL 新手？** 从[基础查询](./00-basics/index.md)开始  
**🔗 需要连接数据？** 前往[组合数据](./01-combining-data/index.md)  
**⚡ 需要自定义逻辑？** 查看[高级功能](./02-advanced/index.md)  
**🚀 遇到性能问题？** 访问[查询优化（Query Optimization）](./03-optimization/index.md)

---

## 📚 [基础查询](./00-basics/index.md)

掌握数据选择与聚合的基本 SQL 操作。

### [筛选与选择](./00-basics/filtering-selection.md)
```sql
-- 选择与筛选数据
SELECT name, salary FROM employees 
WHERE department = 'Engineering' 
ORDER BY salary DESC;
```

### [聚合数据](./00-basics/aggregating-data.md)
```sql
-- 分组并汇总数据
SELECT department, 
       COUNT(*) as emp_count,
       AVG(salary) as avg_salary
FROM employees 
GROUP BY department;
```

### [高级分组](./00-basics/groupby/index.md)
使用 CUBE、ROLLUP 和 GROUPING SETS 进行多维分析

---

## 🔗 [组合数据](./01-combining-data/index.md)

通过 JOIN 和 CTE 连接多源数据。

### [JOIN](./01-combining-data/joins.md)
```sql
-- 关联相关表
SELECT e.name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.id;
```

### [公用表表达式（CTE）](./01-combining-data/cte.md)
```sql
-- 构建复杂查询
WITH high_earners AS (
  SELECT * FROM employees WHERE salary > 75000
)
SELECT department, COUNT(*) as count
FROM high_earners GROUP BY department;
```

---

## ⚡ [高级功能](./02-advanced/index.md)

通过自定义函数与外部集成扩展能力。

### [用户自定义函数（User-Defined Functions）](./02-advanced/udf.md)
```sql
-- 创建可复用函数
CREATE FUNCTION calculate_bonus(salary FLOAT, rating FLOAT)
RETURNS FLOAT AS $$ salary * rating * 0.1 $$;
```

### 更多高级功能
- [外部函数（External Functions）](./02-advanced/external-function.md) - 云端机器学习集成
- [存储过程（Stored Procedures）](./02-advanced/stored-procedure.md) - 多步操作
- [序列（Sequences）](./02-advanced/sequences.md) - 唯一 ID 生成

---

## 🚀 [查询优化（Query Optimization）](./03-optimization/index.md)

利用分析工具诊断并提升查询性能。

### [查询画像（Query Profile）](./03-optimization/query-profile.md)
可视化执行计划分析（Databend Cloud：监控 → SQL 历史）

### [性能分析](./03-optimization/query-hash.md)
```sql
-- 分析查询执行
EXPLAIN SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date >= '2023-01-01';
```

---

## 快速参考

### 最常用模式
```sql
-- Top N 查询
SELECT * FROM employees ORDER BY salary DESC LIMIT 10;

-- 筛选并聚合
SELECT department, AVG(salary) 
FROM employees 
WHERE hire_date >= '2023-01-01'
GROUP BY department
HAVING AVG(salary) > 70000;

-- 使用 CTE 进行连接
WITH recent_orders AS (
  SELECT * FROM orders WHERE order_date >= '2023-01-01'
)
SELECT c.name, COUNT(*) as order_count
FROM customers c
JOIN recent_orders o ON c.id = o.customer_id
GROUP BY c.name;
```