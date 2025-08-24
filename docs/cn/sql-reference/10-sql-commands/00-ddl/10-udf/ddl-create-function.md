---
title: CREATE SCALAR FUNCTION
sidebar_position: 0
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.799"/>

使用 Databend 的统一函数语法创建标量 SQL UDF（User-Defined Function）。

## 语法

```sql
CREATE [ OR REPLACE ] FUNCTION [ IF NOT EXISTS ] <function_name> 
    ( [<parameter_list>] ) 
    RETURNS <return_type>
    AS $$ <expression> $$
    [ DESC='<description>' ]
```

其中：
- `<parameter_list>`：可选的逗号分隔参数列表及其类型（例如 `x INT, y FLOAT`）
- `<return_type>`：函数返回值的数据类型
- `<expression>`：定义函数逻辑的 SQL 表达式

## 访问控制要求

| 权限 | 对象类型   | 描述    |
|:----------|:--------------|:---------------|
| SUPER     | Global, Table | 操作 UDF |

要创建用户定义函数，执行操作的用户或 [current_role](/guides/security/access-control/roles) 必须拥有 SUPER [privilege](/guides/security/access-control/privileges)。

## 示例

```sql
-- 创建计算圆面积的函数
CREATE FUNCTION area_of_circle(radius FLOAT)
RETURNS FLOAT
AS $$
  pi() * radius * radius
$$;

-- 创建计算年龄（年）的函数
CREATE FUNCTION calculate_age(birth_date DATE)
RETURNS INT
AS $$
  date_diff('year', birth_date, now())
$$;

-- 创建带多个参数的函数
CREATE FUNCTION calculate_bmi(weight_kg FLOAT, height_m FLOAT)
RETURNS FLOAT
AS $$
  weight_kg / (height_m * height_m)
$$;

-- 使用函数
SELECT area_of_circle(5.0) AS circle_area;
SELECT calculate_age('1990-05-15') AS age;
SELECT calculate_bmi(70.0, 1.75) AS bmi;
```