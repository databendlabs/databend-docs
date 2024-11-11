---
title: CREATE FUNCTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.339"/>

创建一个外部函数。

## 语法

```sql
CREATE [ OR REPLACE ] FUNCTION [ IF NOT EXISTS ] <function_name> 
    AS ( <input_param_types> ) RETURNS <return_type> LANGUAGE <language_name> 
    HANDLER = '<handler_name>' ADDRESS = '<udf_server_address>' 
    [DESC='<description>']
```

| 参数                    | 描述                                                                                       |
|-----------------------|---------------------------------------------------------------------------------------------------|
| `<function_name>`     | 函数的名称。                                                                        |
| `<lambda_expression>` | 定义函数行为的lambda表达式或代码片段。                          |
| `DESC='<description>'`  | UDF的描述。|
| `<<input_param_names>`| 输入参数名称列表。用逗号分隔。|
| `<<input_param_types>`| 输入参数类型列表。用逗号分隔。|
| `<return_type>`       | 函数的返回类型。                                                                  |
| `LANGUAGE`            | 指定用于编写函数的语言。可用值: `python`。                    |
| `HANDLER = '<handler_name>'` | 指定函数处理程序的名称。                                               |
| `ADDRESS = '<udf_server_address>'` | 指定UDF服务器的地址。                                             |

## 示例

更多信息请参见[使用示例](/guides/query/external-function#usage-examples)。