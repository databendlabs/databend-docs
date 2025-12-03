---
title: ALTER FUNCTION
sidebar_position: 5
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.116"/>

修改用户定义函数。支持所有函数类型：标量 SQL 函数（Scalar SQL）、表函数（Tabular SQL）和嵌入式函数（Embedded）。

## 语法

### 标量 SQL 函数
```sql
ALTER FUNCTION [ IF EXISTS ] <function_name> 
    ( [<parameter_list>] ) 
    RETURNS <return_type>
    AS $$ <expression> $$
    [ DESC='<description>' ]
```

### 表函数
```sql
ALTER FUNCTION [ IF EXISTS ] <function_name> 
    ( [<parameter_list>] ) 
    RETURNS TABLE ( <column_definition_list> ) 
    AS $$ <sql_statement> $$
    [ DESC='<description>' ]
```

### 嵌入式函数
```sql
ALTER FUNCTION [ IF EXISTS ] <function_name> 
    ( [<parameter_list>] ) 
    RETURNS <return_type>
    LANGUAGE <language>
    [IMPORTS = ('<import_path>', ...)]
    [PACKAGES = ('<package_path>', ...)]
    HANDLER = '<handler_name>'
    AS $$ <function_code> $$
    [ DESC='<description>' ]
```

## 示例

### 修改标量 SQL 函数
```sql
-- 创建标量函数
CREATE FUNCTION calculate_tax(income DECIMAL)
RETURNS DECIMAL
AS $$ income * 0.2 $$;

-- 修改函数以使用累进税率
ALTER FUNCTION calculate_tax(income DECIMAL)
RETURNS DECIMAL
AS $$ 
  CASE 
    WHEN income <= 50000 THEN income * 0.15
    ELSE income * 0.25
  END
$$;
```

### 修改表函数
```sql
-- 创建表函数
CREATE FUNCTION get_employees() 
RETURNS TABLE (id INT, name VARCHAR(100)) 
AS $$ SELECT id, name FROM employees $$;

-- 修改函数以包含部门和薪资
ALTER FUNCTION get_employees() 
RETURNS TABLE (id INT, name VARCHAR(100), department VARCHAR(100), salary DECIMAL)
AS $$ SELECT id, name, department, salary FROM employees $$;
```

### 修改嵌入式函数
```sql
-- 创建 Python 函数
CREATE FUNCTION simple_calc(x INT)
RETURNS INT
LANGUAGE python
HANDLER = 'calc'
AS $$
def calc(x):
    return x * 2
$$;

-- 修改函数以使用不同的计算方式
ALTER FUNCTION simple_calc(x INT)
RETURNS INT
LANGUAGE python
HANDLER = 'calc'
AS $$
def calc(x):
    return x * 3 + 1
$$;
```