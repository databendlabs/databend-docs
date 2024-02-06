---
title: '教程-2: 使用 BendSQL 连接到 Databend Cloud'
sidebar_label: '教程-2: 使用 BendSQL 连接到 Databend Cloud'
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将指导您使用 BendSQL 连接到 Databend Cloud 的过程。

<StepsWrap>
<StepContent number="0" title="开始之前">

- 确保您的机器上已安装 BendSQL。有关使用各种包管理器安装 BendSQL 的说明，请参见 [安装 BendSQL](index.md#installing-bendsql)。
- 确保您已有 Databend Cloud 账号并且可以成功登录。

</StepContent>

<StepContent number="1" title="获取连接信息">

1. 登录到 Databend Cloud，然后点击 **连接**。

![Alt text](/img/connect/bendsql-4.gif)

2. 选择您想要连接的数据库，例如 "default"；然后选择一个计算集群。如果忘记了密码，请重设密码。

3. 在 **示例** 部分，复制 **BendSQL** 标签页中的内容。

![Alt text](/img/connect/bendsql-5.gif)

</StepContent>
<StepContent number="2" title="启动 BendSQL">

要启动 BendSQL，将您复制的内容粘贴到终端或命令提示符中。如果您复制的密码显示为 "******"，请将其替换为您的实际密码。

![Alt text](/img/connect/bendsql-6.gif)

</StepContent>

<StepContent number="3" title="执行查询">

一旦连接，您就可以在 BendSQL shell 中执行 SQL 查询。例如，输入 `SELECT NOW();` 来返回当前时间：

![Alt text](/img/connect/bendsql-7.gif)

</StepContent>
<StepContent number="4" title="退出 BendSQL">

要退出 BendSQL，输入 `quit`。

![Alt text](/img/connect/bendsql-8.gif)

</StepContent>
</StepsWrap>