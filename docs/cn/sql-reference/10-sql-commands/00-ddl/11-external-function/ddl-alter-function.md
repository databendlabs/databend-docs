---
title: ALTER FUNCTION
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.116"/>

修改一个外部函数。

## 语法

```sql
ALTER FUNCTION [ IF NOT EXISTS ] <function_name> 
    AS ( <input_param_types> ) RETURNS <return_type> LANGUAGE <language_name> 
    HANDLER = '<handler_name>' ADDRESS = '<udf_server_address>' 
    [DESC='<description>']
```

| 参数             | 描述                                                                                       |
|-----------------------|---------------------------------------------------------------------------------------------------|
| `<function_name>`     | 函数的名称。                                                                        |
| `<lambda_expression>` | 定义函数行为的 lambda 表达式或代码片段。                          |
| `DESC='<description>'`  | UDF 的描述。|
| `<<input_param_names>`| 输入参数名称的列表。用逗号分隔。|
| `<<input_param_types>`| 输入参数类型的列表。用逗号分隔。|
| `<return_type>`       | 函数的返回类型。                                                                  |
| `LANGUAGE`            | 指定编写函数所用的语言。可用值：`python`。                    |
| `HANDLER = '<handler_name>'` | 指定函数的处理程序名称。                                               |
| `ADDRESS = '<udf_server_address>'` | 指定 UDF 服务器的地址。                                             |

## 示例

```sql
-- 创建一个外部函数
CREATE FUNCTION gcd (INT, INT) RETURNS INT LANGUAGE python HANDLER = 'gcd' ADDRESS = 'http://0.0.0.0:8815';

-- 修改外部函数的处理程序
ALTER FUNCTION gcd (INT, INT) RETURNS INT LANGUAGE python HANDLER = 'gcd_new' ADDRESS = 'http://0.0.0.0:8815';
```