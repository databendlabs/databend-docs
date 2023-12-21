---
title: 管理设置
sidebar_label: 管理设置
description: 管理 Databend 设置
---

Databend 提供了各种系统设置，使您能够控制 Databend 的工作方式。例如，您可以设置 Databend 工作的时区和您喜欢的 SQL 方言。

在 Databend 中，系统设置分为两个层次：**会话**和**全局**。会话级设置仅适用于当前会话，而全局级设置影响租户的所有集群。可以将会话级设置转换为全局级设置，反之亦然。然而，值得注意的是，当会话级和全局级设置不一致时，会话级设置优先并覆盖全局设置。

所有的设置都有开箱即用的默认值。要查看可用的系统设置及其默认值，请参见 [SHOW SETTINGS](../14-sql-commands/90-administration-cmds/show-settings.md)。要更新设置，请使用 [SET](../14-sql-commands/90-administration-cmds/set-global.md) 或 [UNSET](../14-sql-commands/90-administration-cmds/unset.md) 命令。

在部署 Databend 之后，建议您浏览所有系统设置，并在使用 Databend 之前调整优先级和值，以便 Databend 可以更好地为您服务。

请注意，一些 Databend 的行为不能通过系统设置来改变；在使用 Databend 时，您必须考虑到这些行为。例如，

- Databend 将字符串编码为 SETF-8 字符集。
- Databend 中，数组元素编号从 1 开始。
