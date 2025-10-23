---
title: 存储过程与 SQL 脚本
slug: /stored-procedure-scripting/
---

Databend 中的存储过程（Stored Procedure）允许你将 SQL 逻辑打包并在服务器端运行，同时可使用控制流（Control Flow）、变量（Variable）、游标（Cursor）和动态语句（Dynamic Statement）。本页介绍如何创建存储过程并编写其内联脚本。

## 定义存储过程

```sql
CREATE [OR REPLACE] PROCEDURE <name>(<param_name> <data_type>, ...)
RETURNS <return_type> [NOT NULL]
LANGUAGE SQL
[COMMENT = '<text>']
AS $$
BEGIN
    -- 声明与语句
    RETURN <scalar_value>;
    -- 或返回查询结果
    -- RETURN TABLE(<select_query>);
END;
$$;
```

| 组件 | 描述 |
|-----------|-------------|
| `<name>` | 存储过程标识符，可省略模式限定。 |
| `<param_name> <data_type>` | 使用 Databend 标量类型定义的输入参数，按值传递。 |
| `RETURNS <return_type> [NOT NULL]` | 声明逻辑返回类型；`NOT NULL` 强制非空。 |
| `LANGUAGE SQL` | 当前仅支持 `SQL`。 |
| `RETURN` / `RETURN TABLE` | 结束执行并返回标量或表结果。 |

使用 [`CREATE PROCEDURE`](https://docs.databend.cn/sql/sql-commands/ddl/procedure/create-procedure/) 持久化定义，[`CALL`](https://docs.databend.cn/sql/sql-commands/ddl/procedure/call-procedure/) 运行，[`DROP PROCEDURE`](https://docs.databend.cn/sql/sql-commands/ddl/procedure/drop-procedure/) 删除。

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

## 存储过程内的语言基础

### 声明部分

存储过程可在可执行部分前使用可选的 `DECLARE` 块初始化变量。

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

`DECLARE` 部分支持 `LET` 的所有定义，包括 `RESULTSET` 和 `CURSOR` 声明；每项以分号结尾。

### 变量与赋值

使用 `LET` 声明变量或常量；重新赋值时省略 `LET`。

```sql
CREATE OR REPLACE PROCEDURE sp_demo_variables()
RETURNS FLOAT
LANGUAGE SQL
AS $$
BEGIN
    LET total := 100;
    LET rate := 0.07;

    total := total * rate; -- 乘以比率
    total := total + 5;    -- 重新赋值

    RETURN total;
END;
$$;

CALL PROCEDURE sp_demo_variables();
```

### 变量作用域

变量作用域限定于所在块；内部块可遮蔽外部绑定，退出后恢复外部值。

```sql
CREATE OR REPLACE PROCEDURE sp_demo_scope()
RETURNS STRING
LANGUAGE SQL
AS $$
BEGIN
    LET threshold := 10;
    LET summary := 'outer=' || threshold;

    IF threshold > 0 THEN
        LET threshold := 5; -- 遮蔽外部值
        summary := summary || ', inner=' || threshold;
    END IF;

    summary := summary || ', after=' || threshold;
    RETURN summary;
END;
$$;

CALL PROCEDURE sp_demo_scope();
```

### 注释

支持单行（`-- text`）与多行（`/* text */`）注释。

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
        多行注释便于记录复杂逻辑。
        下一行返回含税价格。
    */
    RETURN price * (1 + tax_rate);
END;
$$;

CALL PROCEDURE sp_demo_comments();
```

### Lambda 表达式

Lambda 表达式（Lambda Expression）定义可传递给数组函数或在查询中调用的内联逻辑，形式为 `<parameter> -> <expression>`；多参数时用括号包裹。表达式可含类型转换、条件逻辑，甚至引用过程变量。

- 在 SQL 语句中运行的 Lambda 内，用 `:variable_name` 引用过程变量。
- `ARRAY_TRANSFORM`、`ARRAY_FILTER` 等函数会对输入数组的每个元素求值 Lambda。

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

Lambda 也可出现在过程执行的查询中。

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

在 SQL 上下文中，通过在变量名前加 `:` 捕获过程变量。

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

也可在 Lambda 体内放置复杂表达式，如 `CASE` 逻辑。

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

使用 `IF ... ELSEIF ... ELSE ... END IF;` 在过程内分支。

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

`CASE` 表达式可替代嵌套 `IF`。

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

### Range `FOR`

基于范围的循环从下限迭代到上限（含上限）。可选 `REVERSE` 关键字反向遍历。

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

正向步进时下限须 ≤ 上限。

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

直接遍历查询结果；循环变量以字段形式暴露列。

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

`FOR` 也可遍历先前声明的 RESULTSET 变量或 CURSOR（见[使用查询结果](#working-with-query-results)）。

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

### Break 与 Continue

使用 `BREAK` 提前退出循环，使用 `CONTINUE` 跳过本次迭代。

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

使用 `BREAK <label>` 或 `CONTINUE <label>` 退出或跳到带标签循环的下一次迭代；标签在结束关键字后声明，如 `END LOOP main_loop;`。

## 使用查询结果

### 结果集变量

使用 `RESULTSET` 物化查询结果以供后续迭代。

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

需要按需取行时声明游标（Cursor）。

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

也可从 `RESULTSET` 派生游标。

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

### 遍历行

结果集（Result-Set）变量与游标（Cursor）均可通过 `FOR ... IN` 循环遍历。

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

使用 `RETURN TABLE(<query>)` 输出表结果。

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

返回已存储的结果集使用相同语法：

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

动态块将结果返回给 `EXECUTE IMMEDIATE` 调用者；在块内使用 `RETURN TABLE` 生成结果集。

也可运行单个 SQL 字符串并捕获输出：

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

- 存储过程（Stored Procedure）在单个事务（Transaction）内执行；任何错误将回滚过程内所有操作。
- 返回值在客户端以字符串形式呈现，即使声明为数值类型。
- 无 `TRY ... CATCH` 结构；需显式验证输入并预判错误。
- 在将标识符拼接到动态 SQL 前，请先验证，避免执行非预期语句。
- 脚本受 `script_max_steps` 限制（默认 10,000）。运行长循环前请提高该值：

  ```sql
  SET script_max_steps = 100000;
  ```

## 相关命令

- [`CREATE PROCEDURE`](https://docs.databend.cn/sql/sql-commands/ddl/procedure/create-procedure/)
- [`CALL`](https://docs.databend.cn/sql/sql-commands/ddl/procedure/call-procedure/)
- [`SHOW PROCEDURES`](https://docs.databend.cn/sql/sql-commands/ddl/procedure/show-procedures/)
- [`DESCRIBE PROCEDURE`](https://docs.databend.cn/sql/sql-commands/ddl/procedure/desc-procedure/)
- [`EXECUTE IMMEDIATE`](https://docs.databend.cn/sql/sql-commands/administration-cmds/execute-immediate/)
