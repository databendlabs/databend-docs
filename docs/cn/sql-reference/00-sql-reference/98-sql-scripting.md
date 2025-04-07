---
title: SQL 脚本
---

本页概述了 Databend 中可用的 SQL 脚本选项。你可以将 SQL 脚本与以下任一查询方法结合使用：

- [存储过程](/guides/query/stored-procedure)
- [EXECUTE IMMEDIATE](/sql/sql-commands/administration-cmds/execute-immediate)

### 变量声明

可以使用 `LET` 关键字声明变量，后跟变量名、可选类型和初始值。

```sql title='Examples:'
LET x := 100;
```

### 查询执行

SQL 查询可以在脚本中执行，结果可以存储在变量或结果集中。

```sql title='Examples:'
LET result RESULTSET := SELECT * FROM t1;
```

### 控制流结构

- **FOR 循环**: 迭代一个范围或结果集。

    ```sql title='Examples:'
    FOR i IN 1..10 DO ... END FOR;
    ```

- **WHILE 循环**: 只要指定的条件为真，就执行一个代码块。

    ```sql title='Examples:'
    WHILE condition DO ... END WHILE;
    ```

- **REPEAT 循环**: 执行一个代码块，直到满足条件。

    ```sql title='Examples:'
    REPEAT ... UNTIL condition END REPEAT;
    ```

- **LOOP**: 无限期地执行一个代码块，直到遇到 `BREAK` 语句。

    ```sql title='Examples:'
    LOOP ... END LOOP;
    ```

- **CASE 语句**: 允许基于不同条件有条件地执行代码块。

    ```sql title='Examples:'
    CASE [operand]
    WHEN condition1 THEN ...
    WHEN condition2 THEN ...
    ELSE ...
    END;
    ```

- **IF 语句**: 基于条件执行一个代码块。

    ```sql title='Examples:'
    IF condition THEN ...
    ELSEIF condition THEN ...
    ELSE ...
    END IF;
    ```

### RETURN

从脚本返回，带有一个可选值。

```sql title='Examples:'
RETURN [expr];
```

### RETURN TABLE

从脚本返回，表结果作为一个 String 列。

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

### 注释

- **单行注释**: `-- comment`
- **多行注释**: `/* comment */`
