---
title: 存储过程
---

本页面按功能组织，全面概述了 Databend 中的存储过程（Stored Procedure）操作，方便您参考。

## 过程管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE PROCEDURE](create-procedure.md) | 创建一个新的存储过程 |
| [DROP PROCEDURE](drop-procedure.md) | 移除一个存储过程 |
| [CALL](call-procedure.md) | 执行一个存储过程 |

## 过程信息

| 命令 | 描述 |
|---------|-------------|
| [DESCRIBE PROCEDURE](desc-procedure.md) | 显示特定存储过程的详细信息 |
| [SHOW PROCEDURES](show-procedures.md) | 列出当前数据库中的所有存储过程 |

:::note
Databend 中的存储过程（Stored Procedure）允许您将一系列 SQL 语句封装到一个可重用的单元中，该单元可以作为单个命令执行，从而提高代码的组织性和可维护性。
:::

## 延伸阅读

探索 [存储过程与 SQL 脚本](/sql/stored-procedure-scripting/) 获取完整的语言参考，包括变量处理、控制流、游标（Cursor）以及在过程中的动态 SQL 使用。