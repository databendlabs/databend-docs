---
title: CREATE FUNCTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.339"/>

创建用户自定义函数。

## 语法

```sql
CREATE [ OR REPLACE ] FUNCTION [ IF NOT EXISTS ] <function_name> 
    AS ( <input_param_names> ) -> <lambda_expression> 
    [ DESC='<description>' ]
```

## 示例

请参阅 [使用示例](/guides/query/udf#usage-examples)。