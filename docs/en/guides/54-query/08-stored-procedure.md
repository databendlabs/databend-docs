---
title: Stored Procedure
---

A stored procedure is a set of executable commands or logic blocks stored within the database, written in SQL or other programming languages, designed to be reusable for efficiently performing specific tasks or operations.

## Supported Languages

**Databend currently supports [SQL Scripting](#sql-scripting) only**. Using SQL scripting, users can define procedures with control flow constructs like loops (FOR, WHILE, REPEAT) and conditionals (IF, CASE), enabling complex logic and effective multi-step operations.

### SQL Scripting

In Databend, stored procedures support a rich set of features to allow users to define complex operations through SQL scripting. Here are the supported capabilities:

- **Variable Declaration**: Variables can be declared using the `LET` keyword, followed by the variable name, an optional type, and the initial value.

    ```sql title='Examples:'
    LET x := 100;
    ```

- **Query Execution**: SQL queries can be executed within the script, and results can be stored in variables or result sets.

    ```sql title='Examples:'
    LET result RESULTSET := SELECT * FROM t1;
    ```

- **Control Flow Constructs**
  - **FOR Loop**: Iterates over a range or a result set.

    ```sql title='Examples:'
    FOR i IN 1..10 DO ... END FOR;
    ```

  - **WHILE Loop**: Executes a block of code as long as a specified condition is true.

    ```sql title='Examples:'
    WHILE condition DO ... END WHILE;
    ```

  - **REPEAT Loop**: Executes a block of code until a condition is met.

    ```sql title='Examples:'
    REPEAT ... UNTIL condition END REPEAT;
    ```

  - **LOOP**: Executes a block of code indefinitely until a `BREAK` statement is encountered.

    ```sql title='Examples:'
    LOOP ... END LOOP;
    ```

  - **CASE Statement**: Allows conditional execution of code blocks based on different conditions.

    ```sql title='Examples:'
    CASE [operand]
    WHEN condition1 THEN ...
    WHEN condition2 THEN ...
    ELSE ...
    END;
    ```

  - **IF Statement**: Executes a block of code based on a condition.

    ```sql title='Examples:'
    IF condition THEN ...
    ELSEIF condition THEN ...
    ELSE ...
    END IF;
    ```

- **RETURN**: Returns from the script with an optional value.

    ```sql title='Examples:'
    RETURN [expr];
    ```

- **RETURN TABLE**: Returns from the script with a table result.

    ```sql title='Examples:'
    RETURN TABLE(result_set_name | SELECT ...);
    ```

- **Comments**
  - **Single-line comments**: `-- comment`
  - **Multi-line comments**: `/* comment */`

## Limitations

The following limitations apply when working with stored procedures:

- Stored procedures are an experimental feature. Before working with them, set `enable_experimental_procedure` to 1;

    ```sql
    SET enable_experimental_procedure = 1;
    ```

- Stored procedures return results as strings, regardless of the specified return type, without enforcing the declared type on the returned value.

## Managing Stored Procedures

Databend offers a range of commands for managing stored procedures. For more details, see [Stored Procedure](/sql/sql-commands/ddl/procedure/).

## Usage Example

Suppose we want to calculate the sum of all even numbers within a given range. This stored procedure accepts a starting value start_val and an ending value end_val and calculates the sum of all even numbers within this range.

```sql
SET enable_experimental_procedure = 1;

CREATE PROCEDURE sum_even_numbers(start_val UInt8, end_val UInt8) 
RETURNS UInt8 NOT NULL 
LANGUAGE SQL 
COMMENT='Calculate the sum of all even numbers' 
AS $$
BEGIN
    LET sum := 0;
    FOR i IN start_val TO end_val DO
        IF i % 2 = 0 THEN
            sum := sum + i;
        END IF;
    END FOR;
    
    RETURN sum;
END;
$$;
```

If we want to calculate the sum of all even numbers from 1 to 10, we can call the procedure as follows:

```sql
CALL PROCEDURE sum_even_numbers(1, 10);

-- Result: 2 + 4 + 6 + 8 + 10 = 30
┌────────┐
│ Result │
├────────┤
│ 30     │
└────────┘
```

