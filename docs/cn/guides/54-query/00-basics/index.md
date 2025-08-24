---
title: 基础查询
---

掌握在 Databend 中查询（Query）数据的基本方法。如果你是 SQL 新手或需要复习核心概念，可以从这里开始。

## 你将学到

- 高效地选择和筛选数据
- 对查询结果进行排序和限制
- 对数据进行分组和聚合计算
- 使用高级分组技巧

## 查询要点

### [筛选与选择](./filtering-selection.md)
学习基础知识：SELECT、WHERE、ORDER BY 和 LIMIT
```sql
SELECT name, salary FROM employees 
WHERE department = 'Engineering' 
ORDER BY salary DESC;
```

### [聚合数据](./aggregating-data.md)
使用 GROUP BY 和聚合函数（Aggregate Functions）汇总数据
```sql
SELECT department, AVG(salary) as avg_salary
FROM employees 
GROUP BY department;
```

### [高级分组](./groupby/index.md)
使用 CUBE、ROLLUP 和 GROUPING SETS 进行多维分析
```sql
-- 生成所有可能的分组组合
SELECT department, job_level, COUNT(*)
FROM employees 
GROUP BY CUBE(department, job_level);
```

## 快速参考

### 最常用模式
```sql
-- Top N 查询
SELECT * FROM table ORDER BY column DESC LIMIT 10;

-- 按类别计数
SELECT category, COUNT(*) FROM table GROUP BY category;

-- 筛选和聚合
SELECT region, AVG(sales) 
FROM orders 
WHERE order_date >= '2023-01-01'
GROUP BY region
HAVING AVG(sales) > 1000;
```

## 后续步骤

熟悉基础查询后，你可以继续学习：
- [组合数据](../01-combining-data/index.md) - 连接（JOIN）表和使用公共表表达式（CTE）
- [高级功能](../02-advanced/index.md) - 自定义函数和存储过程