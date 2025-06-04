---
title: 存储过程（Stored Procedure）
---

本页面全面概述了 Databend 中存储过程（Stored Procedure）的操作，按功能分类组织，便于查阅。

## 过程管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE PROCEDURE](create-procedure.md) | 创建新的存储过程 |
| [DROP PROCEDURE](drop-procedure.md) | 删除存储过程 |
| [CALL](call-procedure.md) | 执行存储过程 |

## 过程信息

| 命令 | 描述 |
|---------|-------------|
| [DESCRIBE PROCEDURE](desc-procedure.md) | 显示特定存储过程的详细信息 |
| [SHOW PROCEDURES](show-procedures.md) | 列出当前数据库中的所有存储过程 |

:::note
Databend 的存储过程允许将系列 SQL 语句封装为可重用单元，通过单条命令执行，从而提升代码组织性和可维护性。
:::