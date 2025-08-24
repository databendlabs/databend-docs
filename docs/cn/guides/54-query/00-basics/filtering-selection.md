---
title: 过滤与选择
---

学习在 Databend 中使用 SELECT、WHERE 和基本操作查询（Query）数据的基础知识。

## 基本 SELECT 查询

### 选择列
```sql
-- 选择特定列
SELECT name, salary FROM employees;

-- 选择所有列
SELECT * FROM employees;

-- 使用列别名进行选择
SELECT name AS employee_name, salary AS monthly_pay 
FROM employees;
```

### 使用 WHERE 进行过滤
```sql
-- 简单条件
SELECT * FROM employees WHERE department = 'Engineering';

-- 多重条件
SELECT * FROM employees 
WHERE salary > 70000 AND department = 'Engineering';

-- 使用 OR
SELECT * FROM employees 
WHERE department = 'Engineering' OR department = 'Marketing';

-- 范围条件
SELECT * FROM employees 
WHERE salary BETWEEN 60000 AND 80000;

-- 模式匹配
SELECT * FROM employees 
WHERE name LIKE 'A%';  -- 名字以 'A' 开头
```

## 排序结果

### ORDER BY 子句
```sql
-- 按单列排序
SELECT * FROM employees ORDER BY salary DESC;

-- 按多列排序
SELECT * FROM employees 
ORDER BY department ASC, salary DESC;

-- 按列位置排序
SELECT name, salary FROM employees ORDER BY 2 DESC;
```

## 限制结果

### LIMIT 和 OFFSET
```sql
-- 获取薪水最高的 5 名员工
SELECT * FROM employees 
ORDER BY salary DESC 
LIMIT 5;

-- 分页 - 跳过前 10 条，获取接下来的 5 条
SELECT * FROM employees 
ORDER BY salary DESC 
LIMIT 5 OFFSET 10;
```

## 常用运算符

### 比较运算符
- `=` 等于
- `!=` 或 `<>` 不等于
- `>` 大于
- `<` 小于
- `>=` 大于或等于
- `<=` 小于或等于

### 逻辑运算符
- `AND` 两个条件都必须为真
- `OR` 任一条件为真即可
- `NOT` 对条件取反

### NULL 处理
```sql
-- 检查 NULL 值
SELECT * FROM employees WHERE manager_id IS NULL;

-- 检查非 NULL 值
SELECT * FROM employees WHERE manager_id IS NOT NULL;
```

## 最佳实践

1. **明确指定列** - 在生产环境中避免使用 `SELECT *`
2. **使用索引（Index）** - 对索引列使用 WHERE 条件可以加快查询速度
3. **限制大量结果** - 在进行探索性查询时，始终使用 LIMIT
4. **尽早过滤** - 尽可能在进行连接（JOIN）之前应用 WHERE 条件