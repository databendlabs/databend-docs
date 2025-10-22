---
title: SQL 脚本
---

本页概述了 Databend 中可用的 SQL 脚本选项。您可以通过以下任一查询方法使用 SQL 脚本：

- [存储过程（Stored Procedure）](/sql/sql-commands/ddl/procedure/create-procedure)
- [EXECUTE IMMEDIATE](/sql/sql-commands/administration-cmds/execute-immediate)

:::note
要使用存储过程，您需要启用实验性功能：
```sql
SET global enable_experimental_procedure=1;
```
:::

## 变量声明

可以使用 `LET` 关键字声明变量，后跟变量名、可选的类型和初始值。

```sql title='基本变量声明：'
LET x := 100;
LET name := 'Alice';
```

## 结果集变量

SQL 查询可以在脚本中执行，结果可以存储在变量或结果集（Result Set）中。

```sql title='结果集示例：'
-- 将查询结果存储在 RESULTSET 变量中
LET employees RESULTSET := SELECT * FROM employee_table;

-- 遍历结果集
FOR emp IN employees DO
    -- 处理每一行
    LET salary := emp.salary * 1.1;
END FOR;
```

## 游标（Cursor）

从 SQL 查询声明游标（Cursor）
```sql
 LET c1 CURSOR FOR SELECT price FROM invoices;
```

从结果集声明游标（Cursor）
```sql
 LET r1 RESULTSET := SELECT price FROM invoices;
 LET c1 CURSOR for r1;
```

打开游标（Cursor）并将数据提取到变量中
```sql
LET c1 CURSOR FOR SELECT number from numbers(10);
OPEN c1;
LET price := 0;
FETCH c1 INTO price;
CLOSE c1;
```

遍历游标（Cursor）
```sql
LET c1 CURSOR FOR SELECT number from numbers(10);

for price in c1 do
    -- 处理每个数字
    select :price;
END FOR;
```

## 控制流结构

### FOR 循环

遍历一个范围、结果集或游标。

```sql title='FOR 循环示例：'
-- 基于范围的 FOR 循环
FOR i IN 1 TO 10 DO
    -- 处理每个数字
    INSERT INTO temp_table VALUES (:i, :i * 2);
END FOR;

-- 结果集迭代
LET data RESULTSET := SELECT number FROM numbers(5);
FOR r IN data DO
    -- 访问 r.number
    LET squared := r.number * r.number;
END FOR;
```

### WHILE 循环

只要指定条件为真，就执行一个代码块。

```sql title='WHILE 循环示例：'
CREATE PROCEDURE fibonacci_sum(n INT)
RETURNS INT
LANGUAGE SQL
AS $$
BEGIN
    LET a := 0;
    LET b := 1;
    LET sum := 0;
    LET i := 0;

    WHILE i < n DO
        sum := sum + a;
        LET temp := a + b;
        a := b;
        b := temp;
        i := i + 1;
    END WHILE;

    RETURN sum;
END;
$$;
```

### REPEAT 循环

执行一个代码块，直到满足某个条件。

```sql title='REPEAT 循环示例：'
LET counter := 0;
LET sum := 0;

REPEAT
    counter := counter + 1;
    sum := sum + counter;
UNTIL counter >= 5 END REPEAT;
```

### LOOP 与 BREAK

无限期地执行一个代码块，直到遇到 `BREAK` 语句。

```sql title='LOOP 示例：'
LET i := 0;
LOOP
    i := i + 1;
    IF i > 10 THEN
        BREAK;
    END IF;
    -- 在此处处理逻辑
END LOOP;
```

### IF 语句

根据条件执行一个代码块。

```sql title='IF 语句示例：'
-- 简单的 IF-ELSE
IF x > 100 THEN
    LET result := 'High';
ELSEIF x > 50 THEN
    LET result := 'Medium';
ELSE
    LET result := 'Low';
END IF;

### CASE 语句

允许根据不同条件有条件地执行代码块。

```sql title='CASE 语句示例：'
CREATE PROCEDURE process_grade(score INT)
RETURNS STRING
LANGUAGE SQL
AS $$
BEGIN
    LET grade:= '';

    CASE
        WHEN score >= 90 THEN grade := 'A';
        WHEN score >= 80 THEN grade := 'B';
        WHEN score >= 70 THEN grade := 'C';
        WHEN score >= 60 THEN grade := 'D';
        ELSE grade := 'F';
    END CASE;

    RETURN grade;
END;
$$;
```


## 存储过程示例

### 基本数学计算

```sql title='单位转换存储过程：'
CREATE PROCEDURE convert_kg_to_lb(kg INT)
RETURNS INT
LANGUAGE SQL
COMMENT = '将千克转换为磅'
AS $$
BEGIN
    RETURN kg * 2.20462;
END;
$$;

-- 用法
CALL PROCEDURE convert_kg_to_lb(70::Int);
```


### 使用循环进行批处理

```sql title='批量数据处理：'
CREATE OR REPLACE PROCEDURE process_daily_sales()
RETURNS STRING NOT NULL
LANGUAGE SQL
AS $$
BEGIN
    LET sales_data RESULTSET :=
        SELECT product_id, SUM(quantity) as total_quantity, SUM(amount) as total_amount
        FROM daily_sales
        WHERE sale_date = today()
        GROUP BY product_id;

    LET processed_count := 0;

    FOR sale IN sales_data DO
        -- 更新产品统计信息
        LET total_quantity := sale.total_quantity;
        LET total_amount := sale.total_amount;
        LET product_id := sale.product_id;
        UPDATE product_stats
        SET
            total_sold = total_sold + :total_quantity,
            total_revenue = total_revenue + :total_amount,
            last_updated = NOW()
        WHERE product_id = :product_id;

        processed_count := processed_count + 1;
    END FOR;

    -- 清理每日销售数据
    DELETE FROM daily_sales WHERE sale_date = today();

    RETURN 'Processed ' || processed_count || ' products';
END;
$$;
```

## EXECUTE IMMEDIATE

`EXECUTE IMMEDIATE` 允许您运行 SQL 脚本块，而无需创建存储过程。

```sql title='基本的 EXECUTE IMMEDIATE：'
EXECUTE IMMEDIATE $$
BEGIN
    LET sum := 0;
    FOR x IN SELECT number FROM numbers(10) DO
        sum := sum + x.number;
    END FOR;
    RETURN sum;
END;
$$;
```

如果脚本是单个语句，则结果与该语句的结果相同。
```sql
EXECUTE IMMEDIATE 'select 1';
```

## 返回语句

### RETURN

从脚本或存储过程中返回，可带一个可选值。如果未指定值，默认返回。

```sql title='RETURN 示例：'
-- 返回一个简单值
RETURN 42;

-- 返回一个计算值
RETURN x * 2 + 10;

-- 返回一个字符串
RETURN 'Processing completed successfully';


### RETURN TABLE

从脚本中返回一个表结果。这在 EXECUTE IMMEDIATE 块中特别有用。

```sql title='RETURN TABLE 示例：'
-- 基本的表返回
EXECUTE IMMEDIATE $$
BEGIN
    CREATE OR REPLACE TABLE t1 (a INT, b FLOAT, c STRING);
    INSERT INTO t1 VALUES (1, 2.0, '3'), (4, 5.0, '6');
    RETURN TABLE(SELECT * FROM t1);
END;
$$;

-- 动态创建并返回表
EXECUTE IMMEDIATE $$
BEGIN
    -- 创建摘要表
    CREATE OR REPLACE TABLE monthly_summary (
        month STRING,
        total_sales DECIMAL(15,2),
        order_count INT
    );

    -- 填充聚合数据
    INSERT INTO monthly_summary
    SELECT
        DATE_FORMAT(order_date, '%Y-%m') as month,
        SUM(total_amount) as total_sales,
        COUNT(*) as order_count
    FROM orders
    WHERE order_date >= '2024-01-01'
    GROUP BY DATE_FORMAT(order_date, '%Y-%m')
    ORDER BY month;

    RETURN TABLE(SELECT * FROM monthly_summary);
END;
$$;
```

结果将显示为格式化的表格：

```
╭────────────────────────────────────────────────────────╮
│        a        │         b         │         c        │
│ Nullable(Int32) │ Nullable(Float32) │ Nullable(String) │
├─────────────────┼───────────────────┼──────────────────┤
│               1 │                 2 │ 3                │
│               4 │                 5 │ 6                │
╰────────────────────────────────────────────────────────╯
```

## 注释

SQL 脚本支持单行和多行注释：

```sql title='注释示例：'
-- 单行注释
LET x := 10; -- 这也是一个单行注释

/*
多行注释
可以跨越多行
*/
LET y := /* 内联注释 */ 20;

/*
支持嵌套注释：
/* 这是一个嵌套注释 */
*/
```

## 高级功能

### 变量作用域

变量具有块级作用域，并且可以在嵌套块中被覆盖：

```sql title='变量作用域示例：'
CREATE PROCEDURE scope_demo()
RETURNS STRING
LANGUAGE SQL
AS $$
BEGIN
    LET x := 'outer';

    IF TRUE THEN
        LET x := 'inner'; -- 覆盖外部的 x
        -- 此处 x 是 'inner'
    END IF;

    -- 此处 x 再次是 'outer'
    RETURN x;
END;
$$;
```

### 事务行为

存储过程在事务（Transaction）中运行，并支持出错时自动回滚（Rollback）：

```sql title='事务示例：'
CREATE PROCEDURE transfer_with_log(from_id INT, to_id INT, amount DECIMAL(10,2))
RETURNS STRING
LANGUAGE SQL
AS $$
BEGIN
    -- 所有操作都在同一个事务中
    UPDATE accounts SET balance = balance - amount WHERE id = from_id;
    UPDATE accounts SET balance = balance + amount WHERE id = to_id;

    -- 记录事务
    INSERT INTO transaction_log (from_account, to_account, amount, timestamp)
    VALUES (from_id, to_id, amount, NOW());

    -- 如果任何操作失败，所有操作都会自动回滚
    RETURN 'Transfer completed';
END;
$$;
```

## 最佳实践

1. **使用有意义的变量名**：`LET total_amount := 0;` 而不是 `LET x := 0;`

2. **为复杂逻辑添加注释**：
   ```sql
   -- 计算每月复利的复利
   FOR month IN 1 TO months DO
       balance := balance * (1 + annual_rate / 12);
   END FOR;
   ```

3. **处理边界情况**：
   ```sql
   IF input_value IS NULL THEN
       RETURN 'Invalid input: NULL value not allowed';
   END IF;
   ```

4. **使用适当的返回类型**：
   ```sql
   CREATE PROCEDURE calculate_discount(amount DECIMAL(10,2))
   RETURNS DECIMAL(10,2) NOT NULL  -- 在适当时指定 NOT NULL
   ```

5. **用清晰的段落组织复杂的存储过程**：
   ```sql
   BEGIN
       -- 输入验证
       -- 业务逻辑
       -- 数据持久化
       -- 返回结果
   END;
   ```