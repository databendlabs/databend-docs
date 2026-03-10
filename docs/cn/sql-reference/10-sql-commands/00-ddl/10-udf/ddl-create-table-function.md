---
title: CREATE TABLE FUNCTION
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.799"/>

允许创建表值 SQL UDF (UDTF)，将 SQL 查询封装为表函数。此类函数完全由 SQL 编写，无需依赖外部编程语言。

### 支持语言

- 仅支持 SQL 查询（无需外部运行时环境）

## 语法

```sql
CREATE [ OR REPLACE ] FUNCTION [ IF NOT EXISTS ] <function_name> 
    ( [<parameter_list>] ) 
    RETURNS TABLE ( <column_definition_list> ) 
    AS $$ <sql_statement> $$
```

其中：
- `<parameter_list>`：可选的逗号分隔输入参数及其类型列表（例如 `x INT, name VARCHAR`）
- `<column_definition_list>`：函数返回的列名及其类型的逗号分隔列表
- `<sql_statement>`：定义函数逻辑的 SQL 查询

## 统一函数语法

Databend 对标量函数和表函数使用统一的 `$$` 语法：

| 函数类型 | 返回 | 用法 |
|---------------|---------|-------|
| **标量函数** | 单个值 | `RETURNS <type>` + `AS $$ <expression> $$` |
| **表函数** | 结果集 | `RETURNS TABLE(...)` + `AS $$ <query> $$` |

这种一致性使得语法易于理解，也方便用户在不同类型的函数之间进行切换。

## 示例

### 基础表函数

```sql
-- 创建示例表
CREATE OR REPLACE TABLE employees (
    id INT, 
    name VARCHAR(100), 
    department VARCHAR(100),
    salary DECIMAL(10,2)
);

INSERT INTO employees VALUES 
    (1, 'John', 'Engineering', 75000), 
    (2, 'Jane', 'Marketing', 65000),
    (3, 'Bob', 'Engineering', 80000),
    (4, 'Alice', 'Marketing', 70000);

-- 创建一个简单的表函数来获取所有员工信息
CREATE OR REPLACE FUNCTION get_all_employees() 
RETURNS TABLE (id INT, name VARCHAR(100), department VARCHAR(100), salary DECIMAL(10,2))
AS $$ SELECT id, name, department, salary FROM employees $$;

-- 测试函数
SELECT * FROM get_all_employees();
```

### 参数化表函数

```sql
-- 创建一个按部门筛选员工的表函数
CREATE OR REPLACE FUNCTION get_employees_by_dept(dept_name VARCHAR)
RETURNS TABLE (id INT, name VARCHAR(100), department VARCHAR(100), salary DECIMAL(10,2))
AS $$ SELECT id, name, department, salary FROM employees WHERE department = dept_name $$;

-- 使用参数化表函数
SELECT * FROM get_employees_by_dept('Engineering');
```

### 复杂表函数

```sql
-- 创建一个用于聚合数据的表函数
CREATE OR REPLACE FUNCTION get_department_stats()
RETURNS TABLE (department VARCHAR(100), employee_count INT, avg_salary DECIMAL(10,2))
AS $$ SELECT department, COUNT(*) as employee_count, AVG(salary) as avg_salary FROM employees GROUP BY department $$;

-- 使用复杂表函数
SELECT * FROM get_department_stats();
```
