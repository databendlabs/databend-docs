---
title: 子查询（Subquery）
---

子查询（Subquery）是嵌套在另一条查询语句中的查询。利用子查询（Subquery）可以筛选、比较或计算依赖于主查询数据的值。

## 快速上手

```sql
-- 查找薪资高于部门平均值的员工
SELECT name, salary, department
FROM employees
WHERE salary > (
    SELECT AVG(salary)
    FROM employees AS e2
    WHERE e2.department = employees.department
);
```

**结果**：薪资高于其所在部门平均薪资的员工。

## 子查询（Subquery）的类型

### 1. 标量子查询（Scalar Subquery）（单值）
```sql
-- 与公司整体平均薪资比较
SELECT name, salary,
       (SELECT AVG(salary) FROM employees) AS company_avg
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

**返回**：单个值（一行一列）。

### 2. 表子查询（Table Subquery）（多行）
```sql
-- 按部门条件筛选
SELECT name, department
FROM employees
WHERE department IN (
    SELECT name
    FROM departments
    WHERE budget > 500000
);
```

**返回**：多行，可与 IN、EXISTS、ANY、ALL 等运算符配合使用。

## 子查询（Subquery）的位置

### WHERE 子句——用于筛选
```sql
-- 查询高预算部门的员工
SELECT name, salary
FROM employees
WHERE department IN (
    SELECT name FROM departments WHERE budget > 500000
);
```

### FROM 子句——作为数据源
```sql
-- 按部门分析高收入员工
SELECT department, AVG(salary) AS avg_salary
FROM (
    SELECT * FROM employees WHERE salary > 70000
) AS high_earners
GROUP BY department;
```

### SELECT 子句——作为计算列
```sql
-- 显示薪资与部门平均薪资的对比
SELECT name, salary,
       (SELECT AVG(salary)
        FROM employees e2
        WHERE e2.department = e1.department) AS dept_avg
FROM employees e1;
```

## 相关子查询（Correlated Subquery）与非相关子查询（Uncorrelated Subquery）

### 非相关子查询（Uncorrelated Subquery）——独立
```sql
-- 子查询仅执行一次
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

**性能**：子查询（Subquery）执行一次，结果复用。

### 相关子查询（Correlated Subquery）——依赖外部
```sql
-- 子查询对外部查询的每一行都执行一次
SELECT name, salary, department
FROM employees e1
WHERE salary > (
    SELECT AVG(salary)
    FROM employees e2
    WHERE e2.department = e1.department
);
```

**性能**：子查询（Subquery）对外部查询的每一行都执行一次。

## 常见模式

### EXISTS——检查相关数据
```sql
-- 查询有项目参与的员工
SELECT name, department
FROM employees e
WHERE EXISTS (
    SELECT 1 FROM projects p WHERE p.employee_id = e.id
);
```

### NOT EXISTS——检查缺失数据
```sql
-- 查询无项目参与的员工
SELECT name, department
FROM employees e
WHERE NOT EXISTS (
    SELECT 1 FROM projects p WHERE p.employee_id = e.id
);
```

### ANY/ALL——多重比较
```sql
-- 查询薪资高于市场部（Marketing）任意员工的员工
SELECT name, salary
FROM employees
WHERE salary > ANY (
    SELECT salary FROM employees WHERE department = 'Marketing'
);

-- 查询薪资高于市场部（Marketing）所有员工的员工
SELECT name, salary
FROM employees
WHERE salary > ALL (
    SELECT salary FROM employees WHERE department = 'Marketing'
);
```

## 何时使用子查询（Subquery）与 JOIN

**✅ 使用子查询（Subquery）的场景：**
- 基于聚合条件进行筛选
- 检查存在/不存在
- 需要在 SELECT 中计算值
- 逻辑以嵌套步骤呈现更清晰

**✅ 使用 JOIN 的场景：**
- 需要来自多个表的列
- 大数据集性能更佳
- 目的在于合并数据而非筛选