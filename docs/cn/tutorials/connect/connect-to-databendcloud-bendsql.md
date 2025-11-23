---
title: "连接 Databend Cloud (BendSQL)"
sidebar_label: "Cloud (BendSQL)"
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将指导您完成使用 BendSQL 连接到 Databend Cloud 的过程。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 确保您的机器上已安装 BendSQL。有关如何使用各种包管理器安装 BendSQL 的说明，请参阅 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。
- 确保您已经拥有 Databend Cloud 帐户并且可以成功登录。

</StepContent>

<StepContent number="2">

### 获取连接信息

1. 登录到 Databend Cloud，然后单击 **Connect**。

![Alt text](/img/connect/bendsql-4.gif)

2. 选择要连接的数据库，例如“default”；然后选择一个计算集群。如果您忘记了密码，请重置它。

3. 您可以在 **Examples** 部分找到当前计算集群的 DSN 详细信息以及用于通过 BendSQL 连接到 Databend Cloud 的连接字符串。对于此步骤，只需复制 **BendSQL** 选项卡中提供的内容。

![Alt text](/img/connect/bendsql-5.png)

</StepContent>
<StepContent number="3">

### 启动 BendSQL

要启动 BendSQL，请将复制的内容粘贴到您的终端或命令提示符中。如果您复制的密码显示为“**\*\***”，请将其替换为您的实际密码。

![Alt text](/img/connect/bendsql-6.png)

</StepContent>

<StepContent number="4">

### 执行查询

连接后，您可以在 BendSQL shell 中执行 SQL 查询。例如，键入 `SELECT NOW();` 以返回当前时间。

![Alt text](/img/connect/bendsql-7.png)

</StepContent>
<StepContent number="5">

### 退出 BendSQL

要退出 BendSQL，请键入 `quit`。

</StepContent>
</StepsWrap>