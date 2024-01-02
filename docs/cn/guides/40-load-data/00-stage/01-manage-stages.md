---
title: 管理 Stage 
---

本主题仅涵盖用于管理 Stage 的可用工具、API和命令。它不提供详细的语法或示例。如果您需要更多信息，请参考本主题中链接的相关页面。

在Databend中，有多种命令可帮助您管理 Stage ：

- [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage): 创建一个 Stage 。
- [DROP STAGE](/sql/sql-commands/ddl/stage/ddl-drop-stage): 移除一个 Stage 。
- [DESC STAGE](/sql/sql-commands/ddl/stage/ddl-desc-stage): 显示 Stage 的属性。
- [SHOW STAGES](/sql/sql-commands/ddl/stage/ddl-show-stages): 返回已创建 Stage 的列表。

此外，这些命令可以帮助您管理 Stage 中的暂存文件，例如列出或移除它们。关于如何将文件上传到 Stage ，请参见[Stage 文件](02-stage-files.md)。

- [LIST FILES](/sql/sql-commands/ddl/stage/ddl-list-stage): 返回 Stage 中暂存文件的列表。
- [REMOVE FILES](/sql/sql-commands/ddl/stage/ddl-remove-stage): 从 Stage 中移除暂存文件。

请注意，上述某些命令不适用于用户 Stage 。详情请见下表：

|  Stage           | CREATE STAGE | DROP STAGE | DESC STAGE | LIST FILES | REMOVE FILES | SHOW STAGES |
|----------------|--------------|------------|------------|------------|--------------|-------------|
| 用户 Stage        | 否           | 否         | 是         | 是         | 是           | 否          |
| 内部 Stage        | 是           | 是         | 是         | 是         | 是           | 是          |
| 外部 Stage        | 是           | 是         | 是         | 是         | 是           | 是          |