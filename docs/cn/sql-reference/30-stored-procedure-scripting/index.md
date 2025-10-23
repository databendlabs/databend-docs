---
title: 存储过程与 SQL 脚本
slug: /stored-procedure-scripting/
---

Databend 中的存储过程（Stored Procedure）允许您将运行在服务器上的 SQL 逻辑打包，并可以访问控制流（Control Flow）、变量（Variables）、游标（Cursors）和动态语句（Dynamic Statements）。本页将解释如何创建存储过程以及编写为其提供支持的内联脚本。

## 定义存储过程

```sql
CREATE [OR REPLACE] PROCEDURE <name>(<param_name> <data_type>, ...)
RETURNS <return_type> [NOT NULL]
LANGUAGE SQL
[COMMENT = '<text>']
AS $$
BEGIN
    -- 声明和语句
    RETURN <scalar_value>;
    -- 或者返回一个查询结果
    -- RETURN TABLE(<select_query>);
END;
$$;
```

| 组件                       | 描述                                                              |
|----------------------------|-------------------------------------------------------------------|
| `<name>`                   | 存储过程的标识符。模式限定是可选的。                              |
| `<param_name> <data_type>` | 使用 Databend 标量类型定义的输入参数。参数按值传递。              |
| `RETURNS <return_type> [NOT NULL]` | 声明逻辑返回类型。`NOT NULL` 强制返回非空响应。                   |
| `LANGUAGE SQL`             | Databend 目前只接受 `SQL`。                                       |
| `RETURN` / `RETURN TABLE`  | 结束执行并提供标量或表格结果。                                    |

使用 [`CREATE PROCEDURE`](/sql/sql-commands/ddl/procedure/create-procedure) 持久化定义，使用 [`CALL`](/sql/sql-commands/ddl/procedure/call-procedure) 运行它，并使用 [`DROP PROCEDURE`](/sql/sql-commands/ddl/procedure/drop-procedure) 删除它。

### 最小示例

```sql
CREATE OR REPLACE PROCEDURE convert_kg_to_lb(kg DOUBLE)
RETURNS DOUBLE
LANGUAGE SQL
COMMENT = '将千克转换为磅'
AS $$
BEGIN
    RETURN kg * 2.20462;
END;
$$;

CALL PROCEDURE convert_kg_to_lb(10);
```

## 存储过程中的语言基础

### Declare 部分

存储过程可以以一个可选的 `DECLARE` 块开始，用于在可执行部分之前初始化变量。

```sql
CREATE OR REPLACE PROCEDURE sp_with_declare()
RETURNS INT
LANGUAGE SQL
AS $$
DECLARE
    counter := 0;
BEGIN
    counter := counter + 5;
    RETURN counter;
END;
$$;

CALL PROCEDURE sp_with_declare();
```

`DECLARE` 部分接受与 `LET` 相同的定义，包括 `RESULTSET` 和 `CURSOR` 声明。每个项目后请使用分号。

### 变量与赋值

使用 `LET` 声明变量或常量，省略 `LET` 可进行重新赋值。

```sql
CREATE OR REPLACE PROCEDURE sp_demo_variables()
RETURNS FLOAT
LANGUAGE SQL
AS $$
BEGIN
    LET total := 100;
    LET rate := 0.07;

    total := total * rate; -- 乘以利率
    total := total + 5;    -- 省略 LET 重新赋值

    RETURN total;
END;
$$;

CALL PROCEDURE sp_demo_variables();
```

### 变量作用域

变量的作用域限定在封闭的代码块内。内部代码块可以遮蔽外部的绑定，当代码块退出时，外部的值会恢复。

```sql
CREATE OR REPLACE PROCEDURE sp_demo_scope()
RETURNS STRING
LANGUAGE SQL
AS $$
BEGIN
    LET threshold := 10;
    LET summary := 'outer=' || threshold;

    IF threshold > 0 THEN
        LET threshold := 5; -- 遮蔽外部的值
        summary := summary || ', inner=' || threshold;
    END IF;

    summary := summary || ', after=' || threshold;
    RETURN summary;
END;
$$;

CALL PROCEDURE sp_demo_scope();
```

### 注释

存储过程支持单行（`-- text`）和多行（`/* text */`）注释。

```sql
CREATE OR REPLACE PROCEDURE sp_demo_comments()
RETURNS FLOAT
LANGUAGE SQL
AS $$
BEGIN
    -- 计算含税价格
    LET price := 15;
    LET tax_rate := 0.08;

    /*
        多行注释对于记录复杂逻辑很有用。
        下面这行返回含税价格。
    */
    RETURN price * (1 + tax_rate);
END;
$$;

CALL PROCEDURE sp_demo_comments();
```

### Lambda 表达式

Lambda 表达式定义了可以传递给数组函数或在查询中调用的内联逻辑。它们遵循 `<parameter> -> <expression>` 的形式（当提供多个参数时，用括号将参数括起来）。表达式可以包括类型转换、条件逻辑，甚至对存储过程变量的引用。

- 当 lambda 在 SQL 语句中运行时，使用 `:variable_name` 来引用 lambda 内部的存储过程变量。
- `ARRAY_TRANSFORM` 和 `ARRAY_FILTER` 等函数会对输入数组中的每个元素评估 lambda。

```sql
CREATE OR REPLACE PROCEDURE sp_demo_lambda_array()
RETURNS STRING
LANGUAGE SQL
AS $$
BEGIN
    RETURN TABLE(
        SELECT ARRAY_TRANSFORM([1, 2, 3, 4], item -> (item::Int + 1)) AS incremented
    );
END;
$$;

CALL PROCEDURE sp_demo_lambda_array();
```

Lambda 表达式也可以出现在由存储过程执行的查询中。

```sql
CREATE OR REPLACE PROCEDURE sp_demo_lambda_query()
RETURNS STRING
LANGUAGE SQL
AS $$
BEGIN
    RETURN TABLE(
        SELECT
            number,
            ARRAY_TRANSFORM([number, number + 1], val -> (val::Int + 1)) AS next_values
        FROM numbers(3)
    );
END;
$$;

CALL PROCEDURE sp_demo_lambda_query();
```

当 lambda 在 SQL 语句上下文中运行时，可以通过在存储过程变量前加上 `:` 来捕获它们。

```sql
CREATE OR REPLACE PROCEDURE sp_lambda_filter()
RETURNS STRING
LANGUAGE SQL
AS $$
BEGIN
    LET threshold := 2;
    RETURN TABLE(
        SELECT ARRAY_FILTER([1, 2, 3, 4], element -> (element::Int > :threshold)) AS filtered
    );
END;
$$;

CALL PROCEDURE sp_lambda_filter();
```

您还可以在 lambda 主体内部放置复杂的表达式，例如 `CASE` 逻辑。

```sql
CREATE OR REPLACE PROCEDURE sp_lambda_case()
RETURNS STRING
LANGUAGE SQL
AS $$
BEGIN
    RETURN TABLE(
        SELECT
            number,
            ARRAY_TRANSFORM(
                [number - 1, number, number + 1],
                val -> (CASE WHEN val % 2 = 0 THEN 'even' ELSE 'odd' END)
            ) AS parity_window
        FROM numbers(3)
    );
END;
$$;

CALL PROCEDURE sp_lambda_case();
```

## 控制流

### IF 语句

在存储过程内部使用 `IF ... ELSEIF ... ELSE ... END IF;` 进行分支。

```sql
CREATE OR REPLACE PROCEDURE sp_evaluate_score(score INT)
RETURNS STRING
LANGUAGE SQL
AS $$
BEGIN
    IF score >= 90 THEN
        RETURN 'Excellent';
    ELSEIF score >= 70 THEN
        RETURN 'Good';
    ELSE
        RETURN 'Review';
    END IF;
END;
$$;

CALL PROCEDURE sp_evaluate_score(82);
```

### CASE 表达式

`CASE` 表达式为嵌套的 `IF` 语句提供了另一种选择。

```sql
CREATE OR REPLACE PROCEDURE sp_membership_discount(level STRING)
RETURNS FLOAT
LANGUAGE SQL
AS $$
BEGIN
    RETURN CASE
        WHEN level = 'gold' THEN 0.2
        WHEN level = 'silver' THEN 0.1
        ELSE 0
    END;
END;
$$;

CALL PROCEDURE sp_membership_discount('silver');
```

### 范围 `FOR`

基于范围的循环从下限迭代到上限（包含上限）。使用可选的 `REVERSE` 关键字可以反向遍历范围。

```sql
CREATE OR REPLACE PROCEDURE sp_sum_range(start_val INT, end_val INT)
RETURNS INT
LANGUAGE SQL
AS $$
BEGIN
    LET total := 0;
    FOR i IN start_val TO end_val DO
        total := total + i;
    END FOR;
    RETURN total;
END;
$$;

CALL PROCEDURE sp_sum_range(1, 5);
```

范围循环要求在向前步进时，下限小于或等于上限。

```sql
CREATE OR REPLACE PROCEDURE sp_reverse_count(start_val INT, end_val INT)
RETURNS STRING
LANGUAGE SQL
AS $$
BEGIN
    LET output := '';
    FOR i IN REVERSE start_val TO end_val DO
        output := output || i || ' ';
    END FOR;
    RETURN TRIM(output);
END;
$$;

CALL PROCEDURE sp_reverse_count(1, 5);
```

#### `FOR ... IN` 查询

直接遍历查询的结果。循环变量将列作为字段暴露出来。

```sql
CREATE OR REPLACE PROCEDURE sp_sum_query(limit_rows INT)
RETURNS BIGINT
LANGUAGE SQL
AS $$
BEGIN
    LET total := 0;
    FOR rec IN SELECT number FROM numbers(:limit_rows) DO
        total := total + rec.number;
    END FOR;
    RETURN total;
END;
$$;

CALL PROCEDURE sp_sum_query(5);
```

`FOR` 也可以遍历先前声明的结果集变量或游标（请参阅[处理查询结果](#working-with-query-results)）。

### `WHILE`

```sql
CREATE OR REPLACE PROCEDURE sp_factorial(n INT)
RETURNS INT
LANGUAGE SQL
AS $$
BEGIN
    LET result := 1;
    WHILE n > 0 DO
        result := result * n;
        n := n - 1;
    END WHILE;
    RETURN result;
END;
$$;

CALL PROCEDURE sp_factorial(5);
```

### `REPEAT`

```sql
CREATE OR REPLACE PROCEDURE sp_repeat_sum(limit_val INT)
RETURNS INT
LANGUAGE SQL
AS $$
BEGIN
    LET counter := 0;
    LET total := 0;

    REPEAT
        counter := counter + 1;
        total := total + counter;
    UNTIL counter >= limit_val END REPEAT;

    RETURN total;
END;
$$;

CALL PROCEDURE sp_repeat_sum(3);
```

### `LOOP`

```sql
CREATE OR REPLACE PROCEDURE sp_retry_counter(max_attempts INT)
RETURNS INT
LANGUAGE SQL
AS $$
BEGIN
    LET retries := 0;
    LOOP
        retries := retries + 1;
        IF retries >= max_attempts THEN
            BREAK;
        END IF;
    END LOOP;

    RETURN retries;
END;
$$;

CALL PROCEDURE sp_retry_counter(5);
```

### Break 和 Continue

使用 `BREAK` 提前退出循环，使用 `CONTINUE` 跳到下一次迭代。

```sql
CREATE OR REPLACE PROCEDURE sp_break_example(limit_val INT)
RETURNS INT
LANGUAGE SQL
AS $$
BEGIN
    LET counter := 0;
    LET total := 0;

    WHILE TRUE DO
        counter := counter + 1;
        IF counter > limit_val THEN
            BREAK;
        END IF;
        IF counter % 2 = 0 THEN
            CONTINUE;
        END IF;
        total := total + counter;
    END WHILE;

    RETURN total;
END;
$$;

CALL PROCEDURE sp_break_example(5);
```

使用 `BREAK <label>` 或 `CONTINUE <label>` 退出或跳到带标签循环的下一次迭代。通过在结束关键字后附加标签来声明标签，例如 `END LOOP main_loop;`。

## 处理查询结果

### 结果集变量

使用 `RESULTSET` 将查询结果物化，以便后续迭代。

```sql
CREATE OR REPLACE PROCEDURE sp_total_active_salary()
RETURNS DECIMAL(18, 2)
LANGUAGE SQL
AS $$
BEGIN
    -- 假设存在表 hr_employees(id, salary, active)。
    LET employees RESULTSET := SELECT id, salary FROM hr_employees WHERE active = TRUE;
    LET total := 0;

    FOR emp IN employees DO
        total := total + emp.salary;
    END FOR;

    RETURN total;
END;
$$;

CALL PROCEDURE sp_total_active_salary();
```

### 游标

当需要按需获取行时，声明一个游标。

```sql
CREATE OR REPLACE PROCEDURE sp_fetch_two()
RETURNS INT
LANGUAGE SQL
AS $$
BEGIN
    -- 假设存在表 stocks(sku, quantity)。
    LET cur CURSOR FOR SELECT quantity FROM stocks ORDER BY quantity;
    OPEN cur;

    LET first := 0;
    LET second := 0;

    FETCH cur INTO first;
    FETCH cur INTO second;

    CLOSE cur;
    RETURN first + second;
END;
$$;

CALL PROCEDURE sp_fetch_two();
```

或者，从 `RESULTSET` 派生一个游标。

```sql
CREATE OR REPLACE PROCEDURE sp_first_number()
RETURNS INT
LANGUAGE SQL
AS $$
BEGIN
    LET recent RESULTSET := SELECT number FROM numbers(5);
    LET num_cursor CURSOR FOR recent;

    OPEN num_cursor;
    LET first_value := NULL;
    FETCH num_cursor INTO first_value;
    CLOSE num_cursor;

    RETURN first_value;
END;
$$;

CALL PROCEDURE sp_first_number();
```

### 迭代行

结果集变量和游标可以通过 `FOR ... IN` 循环进行遍历。

```sql
CREATE OR REPLACE PROCEDURE sp_low_stock_count()
RETURNS INT
LANGUAGE SQL
AS $$
BEGIN
    LET inventory RESULTSET := SELECT sku, quantity FROM stocks;
    LET low_stock := 0;

    FOR item IN inventory DO
        IF item.quantity < 5 THEN
            low_stock := low_stock + 1;
        END IF;
    END FOR;

    RETURN low_stock;
END;
$$;

CALL PROCEDURE sp_low_stock_count();
```

### 返回表

使用 `RETURN TABLE(<query>)` 输出表格结果。

```sql
CREATE OR REPLACE PROCEDURE sp_sales_summary()
RETURNS STRING
LANGUAGE SQL
AS $$
BEGIN
    RETURN TABLE(
        SELECT product_id, SUM(quantity) AS total_quantity
        FROM sales_detail
        WHERE sale_date = today()
        GROUP BY product_id
        ORDER BY product_id
    );
END;
$$;

CALL PROCEDURE sp_sales_summary();
```

返回存储的结果集使用相同的语法：

```sql
CREATE OR REPLACE PROCEDURE sp_return_cached()
RETURNS STRING
LANGUAGE SQL
AS $$
BEGIN
    LET latest RESULTSET := SELECT number FROM numbers(3);
    RETURN TABLE(latest);
END;
$$;

CALL PROCEDURE sp_return_cached();
```

## 动态 SQL

### 执行语句

### 带变量的动态块

动态块将其结果返回给 `EXECUTE IMMEDIATE` 的调用者。在块内部使用 `RETURN TABLE` 来生成结果集。

你也可以运行单个 SQL 字符串并捕获其输出：

```sql
EXECUTE IMMEDIATE $$
BEGIN
    LET recent RESULTSET := EXECUTE IMMEDIATE 'SELECT number FROM numbers(3)';
    RETURN TABLE(recent);
END;
$$;

CREATE OR REPLACE PROCEDURE sp_dynamic_resultset()
RETURNS STRING
LANGUAGE SQL
AS $$
BEGIN
    LET recent RESULTSET := EXECUTE IMMEDIATE 'SELECT number FROM numbers(3)';
    RETURN TABLE(recent);
END;
$$;

CALL PROCEDURE sp_dynamic_resultset();
```

## 注意事项与限制

- 存储过程在单个事务中执行；任何错误都会回滚在存储过程内部执行的工作。
- 即使声明了数字类型，返回的值在客户端也会显示为字符串。
- 没有 `TRY ... CATCH` 结构；需要显式验证输入并预测错误条件。
- 在将标识符连接到动态 SQL 文本之前，请对其进行验证，以避免执行意外的语句。
- 脚本受 `script_max_steps` 设置的限制（默认为 10,000）。在运行长循环之前，请增加此值：

  ```sql
  SET script_max_steps = 100000;
  ```

## 相关命令

- [`CREATE PROCEDURE`](/sql/sql-commands/ddl/procedure/create-procedure)
- [`CALL`](/sql/sql-commands/ddl/procedure/call-procedure)
- [`SHOW PROCEDURES`](/sql/sql-commands/ddl/procedure/show-procedures)
- [`DESCRIBE PROCEDURE`](/sql/sql-commands/ddl/procedure/desc-procedure)
- [`EXECUTE IMMEDIATE`](/sql/sql-commands/administration-cmds/execute-immediate)