---
title: 公用表表达式（CTE）
---

CTE 通过 `WITH` 将复杂查询拆解为简单、易读的步骤。

## 快速入门

```sql
-- 替代复杂嵌套查询
WITH high_earners AS (
    SELECT * FROM employees WHERE salary > 70000
)
SELECT department, COUNT(*) 
FROM high_earners 
GROUP BY department;
```

**结果**：代码清晰易读，调试方便。

## 何时使用 CTE

**✅ 使用 CTE：**
- 查询包含多个步骤
- 同一子查询需使用两次
- 查询难以阅读

**❌ 跳过 CTE：**
- 简单单步查询
- 性能至关重要

## 三种核心模式

### 1. 筛选 → 分析
```sql
WITH filtered_data AS (
    SELECT * FROM sales WHERE date >= '2023-01-01'
)
SELECT product, SUM(amount) 
FROM filtered_data 
GROUP BY product;
```

### 2. 多步处理
```sql
WITH step1 AS (
    SELECT department, AVG(salary) as avg_sal FROM employees GROUP BY department
),
step2 AS (
    SELECT * FROM step1 WHERE avg_sal > 70000
)
SELECT * FROM step2;
```

### 3. 复用同一份数据
```sql
WITH dept_stats AS (
    SELECT department, AVG(salary) as avg_sal FROM employees GROUP BY department
)
SELECT d1.department, d1.avg_sal
FROM dept_stats d1
JOIN dept_stats d2 ON d1.avg_sal > d2.avg_sal;
```

## 进阶：递归 CTE

递归 CTE 解决需要反复应用同一逻辑的问题。想象爬楼梯：从第 1 级开始，每次向上 1 级。

```sql
-- 生成序列（用于报表、测试或填补空缺）
WITH RECURSIVE countdown AS (
    -- 基例：起点
    SELECT 10 as num, 'Starting countdown' as message
    
    UNION ALL
    
    -- 递归：重复动作
    SELECT num - 1, CONCAT('Count: ', CAST(num - 1 AS VARCHAR))
    FROM countdown 
    WHERE num > 1  -- 终止条件
)
SELECT num, message FROM countdown;
```

**结果**：数字从 10 倒数到 1，并附带消息。

**真实场景**：为销售报表补全缺失月份  
- 起点：2024-01  
- 重复：加一个月  
- 终点：2024-12  

**核心思想**：递归 = 起点 + 重复动作 + 终止条件。

**到此为止。** 从简单 CTE 开始，仅在需要时增加复杂度。