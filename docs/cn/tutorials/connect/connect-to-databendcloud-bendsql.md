---
title: "使用 BendSQL 连接到 Databend Cloud"
sidebar_label: "连接到 Databend Cloud (BendSQL)"
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将指导您使用 BendSQL 连接到 Databend Cloud 的过程。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 确保 BendSQL 已安装在您的机器上。有关如何使用各种包管理器安装 BendSQL 的说明，请参阅 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。
- 确保您已经拥有 Databend Cloud 账户并且能够成功登录。

</StepContent>

<StepContent number="2">

### 获取连接信息

1. 登录到 Databend Cloud，然后点击 **连接**。

![Alt text](/img/connect/bendsql-4.gif)

2. 选择您要连接的数据库，例如 "default"；然后选择一个计算集群。如果您忘记了密码，请重置密码。

3. 您可以在 **示例** 部分找到当前计算集群的 DSN 详细信息和用于通过 BendSQL 连接到 Databend Cloud 的连接字符串。对于这一步，只需复制 **BendSQL** 标签中提供的内容。

![Alt text](/img/connect/bendsql-5.png)

</StepContent>
<StepContent number="3">

### 启动 BendSQL

要启动 BendSQL，请将您复制的内容粘贴到终端或命令提示符中。如果您复制的密码显示为 "**\*\***"，请将其替换为您的实际密码。

![Alt text](/img/connect/bendsql-6.png)

</StepContent>

<StepContent number="4">

### 执行查询

连接成功后，您可以在 BendSQL shell 中执行 SQL 查询。例如，输入 `SELECT NOW();` 以返回当前时间。

![Alt text](/img/connect/bendsql-7.png)

</StepContent>
<StepContent number="5">

### 退出 BendSQL

要退出 BendSQL，请输入 `quit`。

</StepContent>
</StepsWrap>
