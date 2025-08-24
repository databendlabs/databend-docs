---
title: SQL 脚本
---

本页面概述了 Databend 中可用的 SQL 脚本选项。你可以通过以下任一查询方法使用 SQL 脚本：

- [存储过程 (Stored Procedure)](/sql/sql-commands/ddl/procedure/create-procedure)
- [EXECUTE IMMEDIATE](/sql/sql-commands/administration-cmds/execute-immediate)

### 变量声明

可以使用 `LET` 关键字声明变量，后跟变量名、可选的类型和初始值。

```sql title='示例：'
LET x := 100;
```

### 查询执行

SQL 查询可以在脚本中执行，结果可以存储在变量或结果集 (Result Set) 中。

```sql title='示例：'
LET result RESULTSET := SELECT * FROM t1;
```

### 控制流结构

- **FOR 循环**：遍历一个范围或结果集。

    ```sql title='示例：'
    FOR i IN 1..10 DO ... END FOR;
    ```

- **WHILE 循环**：在指定条件为真时执行代码块。

    ```sql title='示例：'
    WHILE condition DO ... END WHILE;
    ```

- **REPEAT 循环**：执行代码块直到满足条件。

    ```sql title='示例：'
    REPEAT ... UNTIL condition END REPEAT;
    ```

- **LOOP**：无限期执行代码块，直到遇到 `BREAK` 语句。

    ```sql title='示例：'
    LOOP ... END LOOP;
    ```

- **CASE 语句**：允许根据不同条件有条件地执行代码块。

    ```sql title='示例：'
    CASE [operand]
    WHEN condition1 THEN ...
    WHEN condition2 THEN ...
    ELSE ...
    END;
    ```

- **IF 语句**：根据条件执行代码块。

    ```sql title='示例：'
    IF condition THEN ...
    ELSEIF condition THEN ...
    ELSE ...
    END IF;
    ```

### RETURN

从脚本返回，并可选择性地附带一个值。

```sql title='示例：'
RETURN [expr];
```

### RETURN TABLE

从脚本返回，并将表结果作为字符串列返回。

```sql title='示例：'
EXECUTE IMMEDIATE $$
BEGIN
    CREATE OR REPLACE TABLE t1 (a INT, b FLOAT, c STRING);
    INSERT INTO t1 VALUES (1, 2.0, '3');
    RETURN TABLE(select * from t1);
END;
$$;

┌─────────────────────────────────────────────┐
│                    结果                     │
│                   String                    │
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

- **单行注释**：`-- comment`
- **多行注释**：`/* comment */`