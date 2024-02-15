---
title: 创建函数
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.339"/>

创建用户定义的函数。

## 语法

```sql
CREATE [ OR REPLACE] FUNCTION [ IF NOT EXISTS ] <function_name> 
    AS ( <input_param_names> ) -> <lambda_expression> 
    [ DESC='<description>' ]
```

## 示例
参见[使用示例](/guides/query/udf#usage-examples)。