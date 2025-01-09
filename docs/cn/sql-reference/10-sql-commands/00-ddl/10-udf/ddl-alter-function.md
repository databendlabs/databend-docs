---
title: ALTER FUNCTION
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.116"/>

修改用户自定义函数。

## 语法

```sql
ALTER FUNCTION [ IF NOT EXISTS ] <function_name> 
    AS (<input_param_names>) -> <lambda_expression> 
    [ DESC='<description>' ]
```

## 示例

```sql
-- 创建一个 UDF
CREATE FUNCTION a_plus_3 AS (a) -> a+3+3;

-- 修改 UDF 的 lambda 表达式
ALTER FUNCTION a_plus_3 AS (a) -> a+3;
```