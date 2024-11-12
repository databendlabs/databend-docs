---
title: 存储过程
---

存储过程是一组存储在数据库中的可执行命令或逻辑块，使用SQL或其他编程语言编写，旨在通过可重用性高效地执行特定任务或操作。

## 支持的语言

**Databend目前仅支持[SQL脚本](/sql/sql-reference/sql-scripting)**。通过SQL脚本，用户可以使用控制流结构（如循环（FOR、WHILE、REPEAT）和条件语句（IF、CASE））定义过程，从而实现复杂的逻辑和有效的多步骤操作。

## 限制

在使用存储过程时，以下限制适用：

- 存储过程是一个实验性功能。在使用它们之前，请将`enable_experimental_procedure`设置为1；

    ```sql
    SET enable_experimental_procedure = 1;
    ```

- 存储过程以字符串形式返回结果，无论指定的返回类型如何，都不会对返回值强制执行声明的类型。

## 管理存储过程

Databend提供了一系列用于管理存储过程的命令。有关更多详细信息，请参阅[存储过程](/sql/sql-commands/ddl/procedure/)。

## 使用示例

假设我们想要计算给定范围内所有偶数的和。此存储过程接受起始值start_val和结束值end_val，并计算此范围内所有偶数的和。

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

如果我们想要计算从1到10的所有偶数的和，可以按如下方式调用该过程：

```sql
CALL PROCEDURE sum_even_numbers(1, 10);

-- 结果: 2 + 4 + 6 + 8 + 10 = 30
┌────────┐
│ Result │
├────────┤
│ 30     │
└────────┘
```