---
title: 存储过程
---

存储过程是一组存储在数据库中的可执行命令或逻辑块，使用 SQL 或其他编程语言编写，旨在可重复使用，以高效执行特定任务或操作。

## 支持的语言

**Databend 目前仅支持 [SQL 脚本](/sql/sql-reference/sql-scripting)**。使用 SQL 脚本，用户可以定义包含控制流结构（如循环 FOR、WHILE、REPEAT）和条件语句（如 IF、CASE）的过程，从而实现复杂逻辑和有效的多步操作。

## 限制

在使用存储过程时，存在以下限制：

- 存储过程是一个实验性功能。在使用之前，需要将 `enable_experimental_procedure` 设置为 1；

    ```sql
    SET enable_experimental_procedure = 1;
    ```

- 存储过程将结果以字符串形式返回，无论指定的返回类型是什么，都不会对返回值强制执行声明的类型。

## 管理存储过程

Databend 提供了一系列命令来管理存储过程。更多详细信息，请参阅 [存储过程](/sql/sql-commands/ddl/procedure/)。

## 使用示例

假设我们想要计算给定范围内所有偶数的和。这个存储过程接受一个起始值 start_val 和一个结束值 end_val，并计算该范围内所有偶数的和。

```sql
SET enable_experimental_procedure = 1;

CREATE PROCEDURE sum_even_numbers(start_val UInt8, end_val UInt8) 
RETURNS UInt8 NOT NULL 
LANGUAGE SQL 
COMMENT='计算所有偶数的和' 
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

如果我们想要计算从 1 到 10 的所有偶数的和，可以按如下方式调用该过程：

```sql
CALL PROCEDURE sum_even_numbers(1, 10);

-- 结果：2 + 4 + 6 + 8 + 10 = 30
┌────────┐
│ Result │
├────────┤
│ 30     │
└────────┘
```