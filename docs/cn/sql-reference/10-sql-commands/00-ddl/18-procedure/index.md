---
title: 存储过程（Stored Procedure）
---

本页面全面概述了 Databend 中的存储过程（Stored Procedure）操作，并按功能组织，方便查阅。

## 过程管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE PROCEDURE](create-procedure.md) | 创建一个新的存储过程（Stored Procedure） |
| [DROP PROCEDURE](drop-procedure.md) | 移除一个存储过程（Stored Procedure） |
| [CALL](call-procedure.md) | 执行一个存储过程（Stored Procedure） |

## 过程信息

| 命令 | 描述 |
|---------|-------------|
| [DESCRIBE PROCEDURE](desc-procedure.md) | 显示特定存储过程（Stored Procedure）的详细信息 |
| [SHOW PROCEDURES](show-procedures.md) | 列出当前数据库中的所有存储过程（Stored Procedure） |

:::note
Databend 中的存储过程（Stored Procedure）允许您将一系列 SQL 语句封装成可重用的单元，可作为单个命令执行，从而提升代码的组织性与可维护性。
:::

## 延伸阅读

探索 [存储过程（Stored Procedure）与 SQL 脚本](/sql/stored-procedure-scripting/) 获取完整语言参考，包括变量处理、控制流、游标及在过程（Procedure）中使用动态 SQL。