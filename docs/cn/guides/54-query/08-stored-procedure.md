---
title: 存储过程（Stored Procedure）
---

存储过程是存储在数据库中的一组可执行命令或逻辑块，用 SQL 或其他编程语言编写，旨在可重复使用以高效执行特定任务或操作。

## 支持的语言

**Databend 目前仅支持 [SQL 脚本（SQL Scripting）](/sql/sql-reference/sql-scripting)**。使用 SQL 脚本，用户可以定义带有控制流结构的过程，如循环（FOR、WHILE、REPEAT）和条件语句（IF、CASE），从而实现复杂逻辑和有效的多步操作。

## 限制

使用存储过程时适用以下限制：

- 存储过程是实验性功能。使用前需将 `enable_experimental_procedure` 设为 1：

    ```sql
    SET enable_experimental_procedure = 1;
    ```

- 存储过程始终以字符串形式返回结果，无论声明的返回类型如何，且不强制校验返回值类型。

## 管理存储过程

Databend 提供了一系列管理存储过程的命令。详细信息请参阅[存储过程](/sql/sql-commands/ddl/procedure/)。

## 使用示例

以下存储过程计算给定范围内所有偶数的和，接受起始值 start_val 和结束值 end_val 作为参数：

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

计算 1 到 10 范围内偶数的和，调用过程如下：

```sql
CALL PROCEDURE sum_even_numbers(1, 10);

-- Result: 2 + 4 + 6 + 8 + 10 = 30
┌────────┐
│ Result │
├────────┤
│ 30     │
└────────┘
```