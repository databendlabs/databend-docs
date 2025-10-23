---
title: 存储过程（Stored Procedure）
sidebar_position: 3
---

存储过程（Stored Procedure）是存储在数据库中的一组可执行命令或逻辑块，使用 SQL 或其他编程语言编写，旨在可重复使用以高效执行特定任务或操作。

## 支持的语言

**Databend 目前仅支持 [SQL 脚本](/sql/stored-procedure-scripting/)**。使用 SQL 脚本，用户可以定义带有控制流结构的过程，如循环（FOR、WHILE、REPEAT）和条件语句（IF、CASE），从而实现复杂逻辑和有效的多步骤操作。

## 限制

使用存储过程时存在以下限制：

- 存储过程是实验性功能。在使用之前，需要将 `enable_experimental_procedure` 设置为 1；

    ```sql
    SET enable_experimental_procedure = 1;
    ```

- 存储过程以字符串形式返回结果，无论指定的返回类型是什么，都不会对返回值强制执行声明的类型。

## 管理存储过程

Databend 提供了一系列用于管理存储过程的命令。有关更多详细信息，请参阅[存储过程](/sql/sql-commands/ddl/procedure/)。

## 使用示例

假设我们想要计算给定范围内所有偶数的总和。此存储过程接受起始值 start_val 和结束值 end_val，并计算此范围内所有偶数的总和。

```sql
SET enable_experimental_procedure = 1;

CREATE PROCEDURE sum_even_numbers(start_val UInt8, end_val UInt8) 
RETURNS UInt8 NOT NULL 
LANGUAGE SQL 
COMMENT='计算所有偶数的总和' 
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

如果我们想要计算从 1 到 10 的所有偶数的总和，可以按如下方式调用该过程：

```sql
CALL PROCEDURE sum_even_numbers(1, 10);

-- 结果：2 + 4 + 6 + 8 + 10 = 30
┌────────┐
│ Result │
├────────┤
│ 30     │
└────────┘
```