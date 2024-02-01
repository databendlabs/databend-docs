---
title: 管理设置
sidebar_label: 管理设置
description: 管理 Databend 设置
---

Databend 提供了多种系统设置，使您能够控制 Databend 的工作方式。例如，您可以设置 Databend 工作的时区和您偏好的 SQL 方言。

在 Databend 中，系统设置分为两个级别：**会话** 和 **全局**。会话级设置仅适用于当前会话，而全局级设置影响租户的所有集群。可以将会话级设置转换为全局级设置，反之亦然。然而，重要的是要注意，当会话级和全局级设置不一致时，会话级设置优先，并覆盖全局设置。

所有设置都带有开箱即用的默认值。要显示可用的系统设置及其默认值，请参见 [SHOW SETTINGS](../10-sql-commands/50-administration-cmds/show-settings.md)。要更新设置，请使用 [SET](../10-sql-commands/50-administration-cmds/set-global.md) 或 [UNSET](../10-sql-commands/50-administration-cmds/unset.md) 命令。

部署 Databend 后，最好检查所有系统设置，并在使用 Databend 之前调整级别和值，以便 Databend 能更好地为您服务。

请注意，某些 Databend 行为不能通过系统设置更改；在使用 Databend 时，您必须考虑到这些行为。例如，

- Databend 将字符串编码为 UTF-8 字符集。
- Databend 对数组使用基于 1 的编号约定。
