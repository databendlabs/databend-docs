---
title: SQL Scripting
---

This page outlines the SQL scripting options available in Databend. You can use SQL scripting with either of the following query methods:

- [Stored Procedure](/sql/sql-commands/ddl/procedure/create-procedure)
- [EXECUTE IMMEDIATE](/sql/sql-commands/administration-cmds/execute-immediate)

### Variable Declaration

Variables can be declared using the `LET` keyword, followed by the variable name, an optional type, and the initial value.

```sql title='Examples:'
LET x := 100;
```

### Query Execution

SQL queries can be executed within the script, and results can be stored in variables or result sets.

```sql title='Examples:'
LET result RESULTSET := SELECT * FROM t1;
```

### Control Flow Constructs

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

### RETURN

Returns from the script with an optional value.

```sql title='Examples:'
RETURN [expr];
```

### RETURN TABLE

Returns from the script with a table result as a String column.

```sql title='Examples:'
EXECUTE IMMEDIATE $$
BEGIN
    CREATE OR REPLACE TABLE t1 (a INT, b FLOAT, c STRING);
    INSERT INTO t1 VALUES (1, 2.0, '3');
    RETURN TABLE(select * from t1);
END;
$$;

┌─────────────────────────────────────────────┐
│                    Result                   │
│                    String                   │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │      a     │       b      │      c      │ │
│ │ Int32 NULL │ Float32 NULL │ String NULL │ │
│ ├────────────┼──────────────┼─────────────┤ │
│ │ 1          │ 2            │ '3'         │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Comments

- **Single-line comments**: `-- comment`
- **Multi-line comments**: `/* comment */`