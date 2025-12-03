---
title: CREATE FUNCTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.339"/>

创建外部函数（External Function），通过 Flight 协议调用远程处理程序（通常为 Python 或其他服务）。

### 支持语言

- 由远程服务器实现决定（常见为 Python，只要实现了 Flight 接口，可以使用任意语言）

## 语法

```sql
CREATE [ OR REPLACE ] FUNCTION [ IF NOT EXISTS ] <function_name> 
    AS ( <input_param_types> ) RETURNS <return_type> LANGUAGE <language_name> 
    HANDLER = '<handler_name>' ADDRESS = '<udf_server_address>' 
    [DESC='<description>']
```

| 参数 | 描述 |
|-----------------------|---------------------------------------------------------------------------------------------------|
| `<function_name>` | 函数名称。 |
| `<lambda_expression>` | 定义函数行为的 lambda 表达式或代码片段。 |
| `DESC='<description>'` | UDF 的描述。|
| `<<input_param_names>`| 输入参数名称列表，以逗号分隔。|
| `<<input_param_types>`| 输入参数类型列表，以逗号分隔。|
| `<return_type>` | 函数的返回类型。 |
| `LANGUAGE` | 指定编写函数所用的语言。可选值：`python`。 |
| `HANDLER = '<handler_name>'` | 指定函数的处理程序名称。 |
| `ADDRESS = '<udf_server_address>'` | 指定 UDF 服务器的地址。 |

## 示例

以下示例创建一个外部函数，用于计算两个整数的最大公约数（GCD）：

```sql
CREATE FUNCTION gcd AS (INT, INT) 
    RETURNS INT 
    LANGUAGE python 
    HANDLER = 'gcd' 
    ADDRESS = 'http://localhost:8815';
```
