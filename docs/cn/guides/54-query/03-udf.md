---
title: 用户自定义函数
---

# Databend 中的用户自定义函数（UDF）

用户自定义函数（UDF）允许你根据特定的数据处理需求创建自定义操作。为了保持一致性，Databend 在所有函数类型中都使用**统一的 `$$` 语法**。

## 快速入门指南

根据需要返回的内容选择函数类型：

| **需要返回** | **函数类型** | **文档** |
|-------------------|-------------------|-------------------|
| 单个值（数字、字符串等） | **标量 SQL** | [CREATE SCALAR FUNCTION](/sql/sql-commands/ddl/udf/ddl-create-function) |
| 多行/多列 | **表函数 SQL** | [CREATE TABLE FUNCTION](/sql/sql-commands/ddl/udf/ddl-create-table-function) |
| 使用 Python/JS/WASM 实现复杂逻辑 | **嵌入式** | [CREATE EMBEDDED FUNCTION](/sql/sql-commands/ddl/udf/ddl-create-function-embedded) |

所有函数类型都使用相同的统一语法模式：
```sql
CREATE FUNCTION name(params) RETURNS type AS $$ logic $$;
```

## 标量 SQL 函数

使用 SQL 表达式返回单个值。非常适合计算、格式化和简单转换。

```sql
-- 计算 BMI
CREATE FUNCTION calculate_bmi(weight FLOAT, height FLOAT)
RETURNS FLOAT
AS $$ weight / (height * height) $$;

-- 格式化全名
CREATE FUNCTION full_name(first VARCHAR, last VARCHAR)
RETURNS VARCHAR
AS $$ concat(first, ' ', last) $$;

-- 使用函数
SELECT 
    full_name('John', 'Doe') AS name,
    calculate_bmi(70.0, 1.75) AS bmi;
```


## 表函数（UDTF）

返回包含多行和多列的结果集。非常适合封装带参数的复杂查询。

```sql
-- 按部门获取员工
CREATE FUNCTION get_dept_employees(dept_name VARCHAR)
RETURNS TABLE (id INT, name VARCHAR, salary DECIMAL)
AS $$
    SELECT id, name, salary 
    FROM employees 
    WHERE department = dept_name
$$;

-- 部门统计  
CREATE FUNCTION dept_stats()
RETURNS TABLE (department VARCHAR, count INT, avg_salary DECIMAL)
AS $$
    SELECT department, COUNT(*), AVG(salary)
    FROM employees 
    GROUP BY department
$$;

-- 使用表函数
SELECT * FROM get_dept_employees('Engineering');
SELECT * FROM dept_stats();
```

## 嵌入式函数

对于无法用 SQL 轻松表达的复杂逻辑，可以使用 Python、JavaScript 或 WASM。

| 语言 | 需要企业版 | 包支持 |
|----------|-------------------|-----------------|
| Python | 是 | PyPI 包 |
| JavaScript | 否 | 否 |
| WASM | 否 | 否 |

### Python 示例
```sql
-- 带有类型安全的简单计算
CREATE FUNCTION py_calc(INT, INT)
RETURNS INT
LANGUAGE python HANDLER = 'calculate'
AS $$
def calculate(x, y):
    return x * y + 10
$$;

SELECT py_calc(5, 3); -- 返回：25
```

### JavaScript 示例  
```sql
-- 字符串处理
CREATE FUNCTION js_format(VARCHAR, INT)
RETURNS VARCHAR
LANGUAGE javascript HANDLER = 'formatPerson'
AS $$
export function formatPerson(name, age) {
    return `${name} is ${age} years old`;
}
$$;

SELECT js_format('Alice', 25); -- 返回："Alice is 25 years old"
```

## 函数管理

| 命令 | 文档 |
|---------|--------------|
| **CREATE** 函数 | [标量](/sql/sql-commands/ddl/udf/ddl-create-function)、[表](/sql/sql-commands/ddl/udf/ddl-create-table-function)、[嵌入式](/sql/sql-commands/ddl/udf/ddl-create-function-embedded) |
| **ALTER** 函数 | [ALTER FUNCTION](/sql/sql-commands/ddl/udf/ddl-alter-function) |
| **DROP** 函数 | [DROP FUNCTION](/sql/sql-commands/ddl/udf/ddl-drop-function) |
| **SHOW** 函数 | [SHOW USER FUNCTIONS](/sql/sql-commands/ddl/udf/ddl-show-user-functions) |

有关 UDF 的完整概述和比较，请参阅[用户自定义函数命令](/sql/sql-commands/ddl/udf/)。