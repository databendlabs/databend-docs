---
title: 存储过程
---

本页面按功能组织，全面概述了 Databend 中的存储过程（Stored Procedure）操作，方便查阅。

## 过程管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE PROCEDURE](create-procedure.md) | 创建新的存储过程 |
| [DROP PROCEDURE](drop-procedure.md) | 删除存储过程 |
| [CALL](call-procedure.md) | 执行存储过程 |

## 过程信息

| 命令 | 描述 |
|---------|-------------|
| [DESCRIBE PROCEDURE](desc-procedure.md) | 显示指定存储过程的详细信息 |
| [SHOW PROCEDURES](show-procedures.md) | 列出当前数据库中的所有存储过程 |

:::note
Databend 中的存储过程（Stored Procedure）允许将一系列 SQL 语句封装为可重用的单元，并以单个命令执行，从而提升代码的组织性与可维护性。
:::

## 延伸阅读

探索 [存储过程与 SQL 脚本](/sql/stored-procedure-scripting/) 获取完整语言参考，包括变量处理、控制流、游标（Cursor）及过程中的动态 SQL 用法。