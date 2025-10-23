---
title: 存储过程（Stored Procedure）
---

本页面提供了 Databend 中存储过程（Stable Stored Procedure）的全面概述，按功能组织以便于参考。

## 过程管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE PROCEDURE](create-procedure.md) | 创建新的存储过程（Stored Procedure） |
| [DROP PROCEDURE](drop-procedure（Stored Procedure）) | 删除存储过程（Stored Procedure） |
| [CALL](call-procedure（Stored Procedure）) | 执行存储过程（Stored Procedure） |

## 过程信息

| 命令 |  | 描述 |
|---------|---------|-------------|
| [DESCRIBE PROCEDURE](desc-procedure（Stored Procedure）) | 显示特定存储过程（Stored Procedure）的详细信息 |
| [SHOW PROCEDURES](show-procedures（Stored Procedures）) | 显示当前数据库中的所有存储过程（Stored Procedure） |

:::note
Databend 中的存储过程（Stored Procedure）允许您将一系列 SQL 语句封装到可重用的单元中，该单元可以作为单个命令执行，从而提高代码组织性和可维护性。
:::

## 延伸阅读

探索[存储过程与 SQL 脚本（Stored Procedure & SQL Scripting）](/sql/stored-procedure-scripting/)以获取完整的语言参考，包括变量处理、控制流、游标（Cursor）和动态 SQL 使用。