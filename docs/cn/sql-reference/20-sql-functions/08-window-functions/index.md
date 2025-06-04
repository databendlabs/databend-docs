---
title: '窗口函数（Window Functions）'
---

## 概述

窗口函数对一组相关行（"窗口"）进行操作。对于每个输入行，窗口函数返回一个输出行，该输出行取决于传递给函数的特定行以及窗口中其他行的值。

有两种主要类型的顺序敏感窗口函数：

* **排名相关函数**：基于行的"排名"列出信息。例如，按年利润降序排列商店，利润最高的商店将排名第1，利润第二高的商店将排名第2，依此类推。

* **窗口框架函数**：支持对窗口中行的子集执行滚动操作，例如计算运行总计或移动平均值。

## 窗口函数类别

Databend 支持两大类窗口函数：

### 1. 专用窗口函数

这些函数专为窗口操作设计，提供排名、导航和值分析功能。

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [RANK](rank.md) | 返回带间隙的排名 | `RANK() OVER (ORDER BY salary DESC)` → `1, 2, 2, 4, ...` |
| [DENSE_RANK](dense-rank.md) | 返回无间隙的排名 | `DENSE_RANK() OVER (ORDER BY salary DESC)` → `1, 2, 2, 3, ...` |
| [ROW_NUMBER](row-number.md) | 返回连续行号 | `ROW_NUMBER() OVER (ORDER BY hire_date)` → `1, 2, 3, 4, ...` |
| [CUME_DIST](cume-dist.md) | 返回累积分布 | `CUME_DIST() OVER (ORDER BY score)` → `0.2, 0.4, 0.8, 1.0, ...` |
| [PERCENT_RANK](percent_rank.md) | 返回相对排名 (0-1) | `PERCENT_RANK() OVER (ORDER BY score)` → `0.0, 0.25, 0.75, ...` |
| [NTILE](ntile.md) | 将行划分为 N 组 | `NTILE(4) OVER (ORDER BY score)` → `1, 1, 2, 2, 3, 3, 4, 4, ...` |
| [FIRST_VALUE](first-value.md) | 返回窗口中的第一个值 | `FIRST_VALUE(product) OVER (PARTITION BY category ORDER BY sales)` |
| [LAST_VALUE](last-value.md) | 返回窗口中的最后一个值 | `LAST_VALUE(product) OVER (PARTITION BY category ORDER BY sales)` |
| [NTH_VALUE](nth-value.md) | 返回窗口中的第 N 个值 | `NTH_VALUE(product, 2) OVER (PARTITION BY category ORDER BY sales)` |
| [LEAD](lead.md) | 访问后续行的值 | `LEAD(price, 1) OVER (ORDER BY date)` → 下一天的价格 |
| [LAG](lag.md) | 访问前一行的值 | `LAG(price, 1) OVER (ORDER BY date)` → 前一天的价格 |
| [FIRST](first.md) | 返回第一个值（别名） | `FIRST(product) OVER (PARTITION BY category ORDER BY sales)` |
| [LAST](last.md) | 返回最后一个值（别名） | `LAST(product) OVER (PARTITION BY category ORDER BY sales)` |

### 2. 用作窗口函数的聚合函数

这些标准聚合函数可与 OVER 子句结合使用，执行窗口操作。

| 函数 | 描述 | 窗口框架支持 | 示例 |
|----------|-------------|---------------------|---------|  
| [SUM](../07-aggregate-functions/aggregate-sum.md) | 计算窗口总和 | ✓ | `SUM(sales) OVER (PARTITION BY region ORDER BY date)` |
| [AVG](../07-aggregate-functions/aggregate-avg.md) | 计算窗口平均值 | ✓ | `AVG(score) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)` |
| [COUNT](../07-aggregate-functions/aggregate-count.md) | 统计窗口行数 | ✓ | `COUNT(*) OVER (PARTITION BY department)` |
| [MIN](../07-aggregate-functions/aggregate-min.md) | 返回窗口最小值 | ✓ | `MIN(price) OVER (PARTITION BY category)` |
| [MAX](../07-aggregate-functions/aggregate-max.md) | 返回窗口最大值 | ✓ | `MAX(price) OVER (PARTITION BY category)` |
| [ARRAY_AGG](../07-aggregate-functions/aggregate-array-agg.md) | 将值收集到数组 | | `ARRAY_AGG(product) OVER (PARTITION BY category)` |
| [STDDEV_POP](../07-aggregate-functions/aggregate-stddev-pop.md) | 总体标准差 | ✓ | `STDDEV_POP(value) OVER (PARTITION BY group)` |
| [STDDEV_SAMP](../07-aggregate-functions/aggregate-stddev-samp.md) | 样本标准差 | ✓ | `STDDEV_SAMP(value) OVER (PARTITION BY group)` |
| [MEDIAN](../07-aggregate-functions/aggregate-median.md) | 中位数值 | ✓ | `MEDIAN(response_time) OVER (PARTITION BY server)` |

**条件变体**

| 函数 | 描述 | 窗口框架支持 | 示例 |
|----------|-------------|---------------------|---------|  
| [COUNT_IF](../07-aggregate-functions/aggregate-count-if.md) | 条件计数 | ✓ | `COUNT_IF(status = 'complete') OVER (PARTITION BY dept)` |
| [SUM_IF](../07-aggregate-functions/aggregate-sum-if.md) | 条件求和 | ✓ | `SUM_IF(amount, status = 'paid') OVER (PARTITION BY customer)` |
| [AVG_IF](../07-aggregate-functions/aggregate-avg-if.md) | 条件平均值 | ✓ | `AVG_IF(score, passed = true) OVER (PARTITION BY class)` |
| [MIN_IF](../07-aggregate-functions/aggregate-min-if.md) | 条件最小值 | ✓ | `MIN_IF(temp, location = 'outside') OVER (PARTITION BY day)` |
| [MAX_IF](../07-aggregate-functions/aggregate-max-if.md) | 条件最大值 | ✓ | `MAX_IF(speed, vehicle = 'car') OVER (PARTITION BY test)` |

## 窗口函数语法

```sql
<function> ( [ <arguments> ] ) OVER ( { named_window | inline_window } )
```

其中：

```sql
named_window ::= window_name

inline_window ::=
    [ PARTITION BY <expression_list> ]
    [ ORDER BY <expression_list> ]
    [ window_frame ]
```

### 关键组件

| 组件 | 描述 | 示例 |
|-----------|-------------|--------|
| `<function>` | 应用的窗口函数 | `SUM()`, `RANK()` 等 |
| `OVER` | 指示窗口函数用法 | 所有窗口函数必需 |
| `PARTITION BY` | 将行分组为分区 | `PARTITION BY department` |
| `ORDER BY` | 分区内行排序 | `ORDER BY salary DESC` |
| `window_frame` | 定义计算行范围 | `ROWS BETWEEN 1 PRECEDING AND CURRENT ROW` |
| `named_window` | 引用 WINDOW 子句定义的窗口 | `SELECT sum(x) OVER w FROM t WINDOW w AS (PARTITION BY y)` |

## 窗口框架语法

窗口框架定义每行函数计算包含的行范围，包含两种类型：

### 1. 框架类型

| 框架类型 | 描述 | 示例 |
|------------|-------------|--------|
| `ROWS` | 基于物理行的框架 | `ROWS BETWEEN 3 PRECEDING AND CURRENT ROW` |
| `RANGE` | 基于逻辑值的框架 | `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` |

### 2. 框架范围

| 框架范围模式 | 描述 | 示例 |
|----------------------|-------------|--------|
| **累积框架** | | |
| `BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` | 起始行到当前行 | 运行总计 |
| `BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING` | 当前行到结束行 | 当前位置的运行总计 |
| **滑动框架** | | |
| `BETWEEN N PRECEDING AND CURRENT ROW` | 当前行前 N 行 + 当前行 | 3 天移动平均 |
| `BETWEEN CURRENT ROW AND N FOLLOWING` | 当前行 + 后续 N 行 | 前瞻性计算 |
| `BETWEEN N PRECEDING AND N FOLLOWING` | 前 N 行 + 当前行 + 后 N 行 | 居中移动平均 |
| `BETWEEN UNBOUNDED PRECEDING AND N FOLLOWING` | 起始行到当前后 N 行 | 扩展累积计算 |
| `BETWEEN N PRECEDING AND UNBOUNDED FOLLOWING` | 当前前 N 行到结束行 | 扩展向后计算 |

## 窗口函数示例

以下示例使用员工数据集演示常见窗口函数用例。

### 示例数据设置

```sql
-- 创建员工表
CREATE TABLE employees (
  employee_id INT,
  first_name VARCHAR,
  last_name VARCHAR,
  department VARCHAR,
  salary INT
);

-- 插入示例数据
INSERT INTO employees VALUES
  (1, 'John', 'Doe', 'IT', 75000),
  (2, 'Jane', 'Smith', 'HR', 85000),
  (3, 'Mike', 'Johnson', 'IT', 90000),
  (4, 'Sara', 'Williams', 'Sales', 60000),
  (5, 'Tom', 'Brown', 'HR', 82000),
  (6, 'Ava', 'Davis', 'Sales', 62000),
  (7, 'Olivia', 'Taylor', 'IT', 72000),
  (8, 'Emily', 'Anderson', 'HR', 77000),
  (9, 'Sophia', 'Lee', 'Sales', 58000),
  (10, 'Ella', 'Thomas', 'IT', 67000);
```

### 示例 1：排名函数

按薪资降序排列员工：

```sql
SELECT 
  employee_id, 
  first_name, 
  last_name, 
  department, 
  salary,
  RANK() OVER (ORDER BY salary DESC) AS rank,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num
FROM employees
ORDER BY salary DESC;
```

**结果：**

| employee_id | first_name | last_name | department | salary | rank | dense_rank | row_num |
|-------------|------------|-----------|------------|--------|------|------------|--------|
| 3           | Mike       | Johnson   | IT         | 90000  | 1    | 1          | 1      |
| 2           | Jane       | Smith     | HR         | 85000  | 2    | 2          | 2      |
| 5           | Tom        | Brown     | HR         | 82000  | 3    | 3          | 3      |
| 8           | Emily      | Anderson  | HR         | 77000  | 4    | 4          | 4      |
| 1           | John       | Doe       | IT         | 75000  | 5    | 5          | 5      |

### 示例 2：分区

计算部门统计信息：

```sql
SELECT DISTINCT
  department,
  COUNT(*) OVER (PARTITION BY department) AS employee_count,
  SUM(salary) OVER (PARTITION BY department) AS total_salary,
  AVG(salary) OVER (PARTITION BY department) AS avg_salary,
  MIN(salary) OVER (PARTITION BY department) AS min_salary,
  MAX(salary) OVER (PARTITION BY department) AS max_salary
FROM employees
ORDER BY department;
```

**结果：**

| department | employee_count | total_salary | avg_salary | min_salary | max_salary |
|------------|----------------|-------------|------------|------------|------------|
| HR         | 3              | 244000      | 81333.33   | 77000      | 85000      |
| IT         | 4              | 304000      | 76000.00   | 67000      | 90000      |
| Sales      | 3              | 180000      | 60000.00   | 58000      | 62000      |

### 示例 3：运行总计与移动平均

计算部门内运行总计与移动平均：

```sql
SELECT 
  employee_id, 
  first_name,
  department, 
  salary,
  -- 运行总计（累积求和）
  SUM(salary) OVER (
    PARTITION BY department 
    ORDER BY employee_id
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total,
  -- 当前行与前一行移动平均
  AVG(salary) OVER (
    PARTITION BY department 
    ORDER BY employee_id
    ROWS BETWEEN 1 PRECEDING AND CURRENT ROW
  ) AS moving_avg
FROM employees
ORDER BY department, employee_id;
```

**结果：**

| employee_id | first_name | department | salary | running_total | moving_avg |
|-------------|------------|------------|--------|---------------|------------|
| 2           | Jane       | HR         | 85000  | 85000         | 85000.00   |
| 5           | Tom        | HR         | 82000  | 167000        | 83500.00   |
| 8           | Emily      | HR         | 77000  | 244000        | 79500.00   |
| 1           | John       | IT         | 75000  | 75000         | 75000.00   |
| 3           | Mike       | IT         | 90000  | 165000        | 82500.00   |