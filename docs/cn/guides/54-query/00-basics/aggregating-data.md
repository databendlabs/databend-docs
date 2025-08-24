---
title: 聚合数据
---

学习如何使用 GROUP BY、聚合函数（Aggregate Function）和高级分组技术来汇总和分析数据。

## 基本聚合

### 常用聚合函数
```sql
-- 计算行数
SELECT COUNT(*) FROM employees;

-- 统计函数
SELECT 
    AVG(salary) as avg_salary,
    MIN(salary) as min_salary,
    MAX(salary) as max_salary,
    SUM(salary) as total_salary
FROM employees;
```

## GROUP BY 基础

### 单列分组
```sql
-- 按部门统计员工人数
SELECT department, COUNT(*) as emp_count
FROM employees 
GROUP BY department;

-- 按部门计算平均薪资
SELECT department, AVG(salary) as avg_salary
FROM employees 
GROUP BY department
ORDER BY avg_salary DESC;
```

### 多列分组
```sql
-- 按部门和入职年份分组
SELECT 
    department,
    EXTRACT(YEAR FROM hire_date) as hire_year,
    COUNT(*) as count,
    AVG(salary) as avg_salary
FROM employees 
GROUP BY department, EXTRACT(YEAR FROM hire_date)
ORDER BY department, hire_year;
```

### GROUP BY 与 HAVING
```sql
-- 查找员工人数超过 5 人的部门
SELECT department, COUNT(*) as emp_count
FROM employees 
GROUP BY department
HAVING COUNT(*) > 5;

-- 平均薪资大于 70000 的部门
SELECT department, AVG(salary) as avg_salary
FROM employees 
GROUP BY department
HAVING AVG(salary) > 70000;
```

## 高级分组

### GROUP BY ALL
```sql
-- 自动按所有非聚合列进行分组
SELECT department, job_title, COUNT(*) as count
FROM employees 
GROUP BY ALL;
```

## 高级分组扩展

Databend 支持 SQL:2003 标准分组扩展：

- **[ROLLUP](./groupby/group-by-rollup.md)** - 分层小计
- **[CUBE](./groupby/group-by-cube.md)** - 所有可能的组合
- **[GROUPING SETS](./groupby/group-by-grouping-sets.md)** - 自定义组合

## 最佳实践

1. **使用适当的聚合函数** - COUNT(*) 与 COUNT(column)
2. **分组前过滤** - 在 GROUP BY 前使用 WHERE
3. **使用 HAVING 进行聚合条件过滤** - 在聚合后过滤分组
4. **考虑索引（Index）** - GROUP BY 的列应当被索引