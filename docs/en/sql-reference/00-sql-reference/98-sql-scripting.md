---
title: SQL Scripting
---

This page outlines the SQL scripting options available in Databend. You can use SQL scripting with either of the following query methods:

- [Stored Procedure](/sql/sql-commands/ddl/procedure/create-procedure)
- [EXECUTE IMMEDIATE](/sql/sql-commands/administration-cmds/execute-immediate)

:::note
To use procedures, you need to enable the experimental feature:
```sql
SET global enable_experimental_procedure=1;
```
:::

## Variable Declaration

Variables can be declared using the `LET` keyword, followed by the variable name, an optional type, and the initial value.

```sql title='Basic Variable Declaration:'
LET x := 100;
LET name := 'Alice';
```

## Result Set Variables

SQL queries can be executed within the script, and results can be stored in variables or result sets.

```sql title='Result Set Examples:'
-- Store query result in a RESULTSET variable
LET employees RESULTSET := SELECT * FROM employee_table;

-- Iterate over result set
FOR emp IN employees DO
    -- Process each row
    LET salary := emp.salary * 1.1;
END FOR;
```

## Cursors

Declare a cursor from SQL query
```sql
 LET c1 CURSOR FOR SELECT price FROM invoices;
```

Declare a cursor from result set
```sql
 LET r1 RESULTSET := SELECT price FROM invoices;
 LET c1 CURSOR for r1;
```

Open cursor and fetch into variable
```sql
LET c1 CURSOR FOR SELECT number from numbers(10);
OPEN c1;
LET price := 0;
FETCH c1 INTO price;
CLOSE c1;
```

Iterate over cursor
```sql
LET c1 CURSOR FOR SELECT number from numbers(10);

for price in c1 do
    -- Process each number
    select :price;
END FOR;
```

## Control Flow Constructs

### FOR Loop

Iterates over a range, result set, or cursor.

```sql title='FOR Loop Examples:'
-- Range-based FOR loop
FOR i IN 1 TO 10 DO
    -- Process each number
    INSERT INTO temp_table VALUES (:i, :i * 2);
END FOR;

-- Result set iteration
LET data RESULTSET := SELECT number FROM numbers(5);
FOR r IN data DO
    -- Access r.number
    LET squared := r.number * r.number;
END FOR;
```

### WHILE Loop

Executes a block of code as long as a specified condition is true.

```sql title='WHILE Loop Example:'
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

### REPEAT Loop

Executes a block of code until a condition is met.

```sql title='REPEAT Loop Example:'
LET counter := 0;
LET sum := 0;

REPEAT
    counter := counter + 1;
    sum := sum + counter;
UNTIL counter >= 5 END REPEAT;
```

### LOOP with BREAK

Executes a block of code indefinitely until a `BREAK` statement is encountered.

```sql title='LOOP Example:'
LET i := 0;
LOOP
    i := i + 1;
    IF i > 10 THEN
        BREAK;
    END IF;
    -- Process logic here
END LOOP;
```

### IF Statement

Executes a block of code based on a condition.

```sql title='IF Statement Examples:'
-- Simple IF-ELSE
IF x > 100 THEN
    LET result := 'High';
ELSEIF x > 50 THEN
    LET result := 'Medium';
ELSE
    LET result := 'Low';
END IF;

### CASE Statement

Allows conditional execution of code blocks based on different conditions.

```sql title='CASE Statement Example:'
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


## Procedure Examples

### Basic Mathematical Computation

```sql title='Convert Units Procedure:'
CREATE PROCEDURE convert_kg_to_lb(kg INT)
RETURNS INT
LANGUAGE SQL
COMMENT = 'Converts kilograms to pounds'
AS $$
BEGIN
    RETURN kg * 2.20462;
END;
$$;

-- Usage
CALL PROCEDURE convert_kg_to_lb(70::Int);
```


### Batch Processing with Loops

```sql title='Batch Data Processing:'
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
        -- Update product statistics
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

    -- Clean up daily sales
    DELETE FROM daily_sales WHERE sale_date = today();

    RETURN 'Processed ' || processed_count || ' products';
END;
$$;
```

## EXECUTE IMMEDIATE

`EXECUTE IMMEDIATE` allows you to run SQL scripting blocks without creating stored procedures.

```sql title='Basic EXECUTE IMMEDIATE:'
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

If the script is single statement, the result is same as the statement.
```sql
EXECUTE IMMEDIATE 'select 1';
```

## Return Statements

### RETURN

Returns from the script or procedure with an optional value, by default it returns if no value is specified.

```sql title='RETURN Examples:'
-- Return a simple value
RETURN 42;

-- Return a calculated value
RETURN x * 2 + 10;

-- Return a string
RETURN 'Processing completed successfully';


### RETURN TABLE

Returns from the script with a table result. This is particularly useful in EXECUTE IMMEDIATE blocks.

```sql title='RETURN TABLE Examples:'
-- Basic table return
EXECUTE IMMEDIATE $$
BEGIN
    CREATE OR REPLACE TABLE t1 (a INT, b FLOAT, c STRING);
    INSERT INTO t1 VALUES (1, 2.0, '3'), (4, 5.0, '6');
    RETURN TABLE(SELECT * FROM t1);
END;
$$;

-- Dynamic table creation and return
EXECUTE IMMEDIATE $$
BEGIN
    -- Create summary table
    CREATE OR REPLACE TABLE monthly_summary (
        month STRING,
        total_sales DECIMAL(15,2),
        order_count INT
    );

    -- Populate with aggregated data
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

The result will be displayed as a formatted table:

```
╭────────────────────────────────────────────────────────╮
│        a        │         b         │         c        │
│ Nullable(Int32) │ Nullable(Float32) │ Nullable(String) │
├─────────────────┼───────────────────┼──────────────────┤
│               1 │                 2 │ 3                │
│               4 │                 5 │ 6                │
╰────────────────────────────────────────────────────────╯
```

## Comments

SQL scripting supports both single-line and multi-line comments:

```sql title='Comment Examples:'
-- Single-line comment
LET x := 10; -- This is also a single-line comment

/*
Multi-line comment
can span multiple lines
*/
LET y := /* inline comment */ 20;

/*
Nested comments are supported:
/* This is a nested comment */
*/
```

## Advanced Features

### Variable Scope

Variables have block scope and can be shadowed in nested blocks:

```sql title='Variable Scope Example:'
CREATE PROCEDURE scope_demo()
RETURNS STRING
LANGUAGE SQL
AS $$
BEGIN
    LET x := 'outer';

    IF TRUE THEN
        LET x := 'inner'; -- Shadows outer x
        -- x is 'inner' here
    END IF;

    -- x is 'outer' again here
    RETURN x;
END;
$$;
```

### Transaction Behavior

Procedures run within transactions and support automatic rollback on errors:

```sql title='Transaction Example:'
CREATE PROCEDURE transfer_with_log(from_id INT, to_id INT, amount DECIMAL(10,2))
RETURNS STRING
LANGUAGE SQL
AS $$
BEGIN
    -- All operations are within the same transaction
    UPDATE accounts SET balance = balance - amount WHERE id = from_id;
    UPDATE accounts SET balance = balance + amount WHERE id = to_id;

    -- Log the transaction
    INSERT INTO transaction_log (from_account, to_account, amount, timestamp)
    VALUES (from_id, to_id, amount, NOW());

    -- If any operation fails, everything is automatically rolled back
    RETURN 'Transfer completed';
END;
$$;
```

## Best Practices

1. **Use meaningful variable names**: `LET total_amount := 0;` instead of `LET x := 0;`

2. **Add comments for complex logic**:
   ```sql
   -- Calculate compound interest with monthly compounding
   FOR month IN 1 TO months DO
       balance := balance * (1 + annual_rate / 12);
   END FOR;
   ```

3. **Handle edge cases**:
   ```sql
   IF input_value IS NULL THEN
       RETURN 'Invalid input: NULL value not allowed';
   END IF;
   ```

4. **Use appropriate return types**:
   ```sql
   CREATE PROCEDURE calculate_discount(amount DECIMAL(10,2))
   RETURNS DECIMAL(10,2) NOT NULL  -- Specify NOT NULL when appropriate
   ```

5. **Organize complex procedures with clear sections**:
   ```sql
   BEGIN
       -- Input validation
       -- Business logic
       -- Data persistence
       -- Return result
   END;
   ```