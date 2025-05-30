---
title: CREATE PROCEDURE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.637"/>

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
    RETURN <return_value>;             -- 用于返回单个值
    -- 或者
    RETURN TABLE(<select_query>);      -- 用于返回表
END;
$$;
```

| 参数                                    | 描述                                                                                                                      |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| `<procedure_name>`                      | 存储过程的名称。                                                                                                          |
| `<parameter_name> <data_type>`          | 输入参数 (可选)，每个参数都有指定的数据类型。可以定义多个参数，用逗号分隔。                                               |
| `RETURNS <return_data_type> [NOT NULL]` | 指定返回值的数据类型。`NOT NULL` 确保返回值不能为 NULL。                                                                  |
| `LANGUAGE`                              | 指定编写存储过程主体的语言。目前仅支持 `SQL`。详情请参见 [SQL Scripting](/guides/query/stored-procedure#sql-scripting)。 |
| `COMMENT`                               | 描述存储过程的可选文本。                                                                                                  |
| `AS ...`                                | 包含存储过程主体，其中包含 SQL 语句、变量声明、循环和 RETURN 语句。                                                       |

## 示例

此示例定义了一个将重量从千克 (kg) 转换为磅 (lb) 的存储过程：

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

您还可以定义一个使用循环、条件和动态变量的存储过程。

```sql

CREATE OR REPLACE PROCEDURE loop_test()
RETURNS INT
LANGUAGE SQL
COMMENT = 'loop test'
AS $$
BEGIN
    LET x RESULTSET := select number n from numbers(10);
    LET sum := 0;
    FOR x IN x DO
        FOR batch in 0 TO x.n DO
            IF batch % 2 = 0 THEN
                sum := sum + batch;
            ELSE
                sum := sum - batch;
            END IF;
        END FOR;
    END FOR;
    RETURN sum;
END;
$$;
```

```sql
CALL PROCEDURE loop_test();

┌─Result─┐
│   -5   │
└────────┘
```