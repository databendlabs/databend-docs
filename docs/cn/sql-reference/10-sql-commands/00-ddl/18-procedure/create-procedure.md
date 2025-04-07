---
title: CREATE PROCEDURE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.637"/>

定义一个存储过程，用于执行 SQL 操作并返回结果。

## 语法

```sql
CREATE PROCEDURE <procedure_name>(<parameter_name> <data_type>, ...) 
RETURNS <return_data_type> [NOT NULL]
LANGUAGE <language> 
[ COMMENT '<comment>' ] 
AS $$
BEGIN
    <procedure_body>
    RETURN <return_value>;             -- Use to return a single value
    -- OR
    RETURN TABLE(<select_query>);      -- Use to return a table
END;
$$;
```

| Parameter                               | Description                                                                                                               |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| `<procedure_name>`                      | 过程的名称。                                                                                                              |
| `<parameter_name> <data_type>`          | 输入参数（可选），每个参数都有指定的数据类型。可以定义多个参数，并用逗号分隔。                                                                  |
| `RETURNS <return_data_type> [NOT NULL]` | 指定返回值的数类型。`NOT NULL` 确保返回的值不能为 NULL。                                                                       |
| `LANGUAGE`                              | 指定编写过程体的语言。目前，仅支持 `SQL`。有关详细信息，请参见 [SQL Scripting](/guides/query/stored-procedure#sql-scripting)。                                  |
| `COMMENT`                               | 描述过程的可选文本。                                                                                                          |
| `AS ...`                                | 包含过程体，其中包含 SQL 语句、变量声明、循环和 RETURN 语句。                                                                         |

## 示例

此示例定义了一个存储过程，用于将重量从千克 (kg) 转换为磅 (lb)：

```sql
CREATE PROCEDURE convert_kg_to_lb(kg DECIMAL(4, 2)) 
RETURNS DECIMAL(10, 2) 
LANGUAGE SQL 
COMMENT = 'Converts kilograms to pounds'
AS $$
BEGIN
    RETURN kg * 2.20462;
END;
$$;
```