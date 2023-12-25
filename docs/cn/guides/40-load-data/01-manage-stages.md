---
title: 管理阶段
---

本主题仅涵盖用于管理阶段的可用工具、API和命令。它不提供详细的语法或示例。如果您需要更多信息，请参考本主题中链接的相关页面。

在Databend中，有多种命令可帮助您管理阶段：

- [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage): 创建一个阶段。
- [DROP STAGE](/sql/sql-commands/ddl/stage/ddl-drop-stage): 移除一个阶段。
- [DESC STAGE](/sql/sql-commands/ddl/stage/ddl-desc-stage): 显示阶段的属性。
- [SHOW STAGES](/sql/sql-commands/ddl/stage/ddl-show-stages): 返回已创建阶段的列表。

此外，这些命令可以帮助您管理阶段中的暂存文件，例如列出或移除它们。关于如何将文件上传到阶段，请参见[暂存文件](02-stage-files.md)。

- [LIST FILES](/sql/sql-commands/ddl/stage/ddl-list-stage): 返回阶段中暂存文件的列表。
- [REMOVE FILES](/sql/sql-commands/ddl/stage/ddl-remove-stage): 从阶段中移除暂存文件。

请注意，上述某些命令不适用于用户阶段。详情请见下表：

| 阶段          | CREATE STAGE | DROP STAGE | DESC STAGE | LIST FILES | REMOVE FILES | SHOW STAGES |
|----------------|--------------|------------|------------|------------|--------------|-------------|
| 用户阶段       | 否           | 否         | 是         | 是         | 是           | 否          |
| 内部阶段       | 是           | 是         | 是         | 是         | 是           | 是          |
| 外部阶段       | 是           | 是         | 是         | 是         | 是           | 是          |