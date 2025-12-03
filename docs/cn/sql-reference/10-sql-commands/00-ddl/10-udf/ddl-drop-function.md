---
title: DROP FUNCTION
sidebar_position: 6
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.116"/>

删除一个用户定义函数（User-Defined Function）。适用于所有函数类型：标量 SQL（Scalar SQL）、表 SQL（Tabular SQL）和嵌入式（Embedded）函数。

## 语法

```sql
DROP FUNCTION [ IF EXISTS ] <function_name>
```

## 示例

### 删除标量 SQL 函数
```sql
-- 创建标量函数
CREATE FUNCTION calculate_bmi(weight FLOAT, height FLOAT)
RETURNS FLOAT
AS $$ weight / (height * height) $$;

-- 删除函数
DROP FUNCTION calculate_bmi;
```

### 删除表 SQL 函数
```sql
-- 创建表函数
CREATE FUNCTION get_employees_by_dept(dept_name VARCHAR)
RETURNS TABLE (id INT, name VARCHAR, department VARCHAR)
AS $$ SELECT id, name, department FROM employees WHERE department = dept_name $$;

-- 删除函数
DROP FUNCTION get_employees_by_dept;
```

### 删除嵌入式函数
```sql
-- 创建 Python 函数
CREATE FUNCTION custom_hash(input_str VARCHAR)
RETURNS VARCHAR
LANGUAGE python
HANDLER = 'hash_func'
AS $$
import hashlib
def hash_func(s):
    return hashlib.md5(s.encode()).hexdigest()
$$;

-- 删除函数
DROP FUNCTION custom_hash;
```

### 使用 IF EXISTS
```sql
-- 安全删除：即使函数不存在也不会报错
DROP FUNCTION IF EXISTS non_existent_function;

-- 即使函数不存在，该语句也会成功执行且不报错
```