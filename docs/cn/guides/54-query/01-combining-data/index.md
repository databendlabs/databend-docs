---
title: 合并数据
---

学习如何使用 JOIN、公用表表达式（CTE）和高级查询结构来合并多个数据源的数据。

## 核心概念

### [JOIN](./joins.md)
连接多个表的数据
```sql
-- 内连接（Inner Join）（最常用）
SELECT e.name, d.department_name
FROM employees e
JOIN departments d ON e.dept_id = d.id;
```
**涵盖**：Inner、Left、Right、Full Outer、Semi、Anti 和 AsOf 连接

### [公用表表达式（Common Table Expressions, CTE）](./cte.md)  
使用 WITH 子句构建复杂查询
```sql
-- 将复杂逻辑拆分为多个步骤
WITH high_performers AS (
    SELECT * FROM employees WHERE rating > 4.0
)
SELECT department, COUNT(*) 
FROM high_performers 
GROUP BY department;
```
**涵盖**：基本 CTE、递归 CTE、物化 CTE

## 高级组合

### 子查询
```sql
-- 相关子查询
SELECT name, salary,
    (SELECT AVG(salary) FROM employees e2 
     WHERE e2.department = e1.department) as dept_avg
FROM employees e1;

-- EXISTS 子句
SELECT * FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.customer_id = c.id
);
```

### 集合操作
```sql
-- 合并多个查询的结果
SELECT name FROM employees WHERE department = 'Sales'
UNION
SELECT name FROM contractors WHERE active = true;

-- 其他集合操作
INTERSECT  -- 仅共同行
EXCEPT     -- 第一个查询有而第二个查询没有的行
```

## 实践模式

### 数据增强
```sql
-- 向主表添加查找数据
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

### 层级数据
```sql
-- 用于组织结构的递归 CTE
WITH RECURSIVE org_chart AS (
    -- 基本情况：顶级管理者
    SELECT id, name, manager_id, 1 as level
    FROM employees WHERE manager_id IS NULL
    
    UNION ALL
    
    -- 递归情况：添加直接下属
    SELECT e.id, e.name, e.manager_id, o.level + 1
    FROM employees e
    JOIN org_chart o ON e.manager_id = o.id
)
SELECT * FROM org_chart ORDER BY level, name;
```