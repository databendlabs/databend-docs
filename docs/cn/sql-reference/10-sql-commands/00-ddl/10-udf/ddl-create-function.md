---
title: CREATE FUNCTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.339"/>

创建一个用户自定义函数 (User-Defined Function)。

## 语法

```sql
CREATE [ OR REPLACE ] FUNCTION [ IF NOT EXISTS ] <function_name> 
    AS ( <input_param_names> ) -> <lambda_expression> 
    [ DESC='<description>' ]
```

## 访问控制要求

| 权限 | 对象类型   | 描述    |
|:----------|:--------------|:---------------|
| SUPER     | 全局, 表 | 操作 UDF |

要创建用户自定义函数，执行此操作的用户或 [current_role](/guides/security/access-control/roles) 必须拥有 SUPER [权限](/guides/security/access-control/privileges)。

## 示例

请参阅 [使用示例](/guides/query/udf#usage-examples)。