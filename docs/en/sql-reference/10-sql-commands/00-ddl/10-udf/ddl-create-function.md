---
title: CREATE FUNCTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.116"/>

Creates a user-defined function.

## Syntax

```sql
CREATE FUNCTION [ IF NOT EXISTS ] <function_name> 
    AS ( <input_param_names> ) -> <lambda_expression> 
    [ DESC='<description>' ]
```

## Examples

See [Usage Examples](/guides/query/udf#usage-examples).