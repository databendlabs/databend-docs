---
title: '使用BendSQL连接到Databend Cloud'
sidebar_label: '连接到Databend Cloud (BendSQL)'
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将引导您通过BendSQL连接到Databend Cloud的步骤。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 确保您的机器上已安装BendSQL。请参阅[安装BendSQL](/guides/sql-clients/bendsql/#安装bendsql)了解如何通过各种包管理器安装BendSQL的说明。
- 确保您已拥有Databend Cloud账户并能成功登录。

</StepContent>

<StepContent number="2">

### 获取连接信息

1. 登录Databend Cloud，然后点击**连接**。

![Alt text](/img/connect/bendsql-4.gif)

2. 选择您想要连接的数据库，例如“默认”；然后选择一个仓库。如果您忘记了密码，可以重置它。

3. 在**示例**部分，您可以找到当前仓库的DSN详细信息以及通过BendSQL连接到Databend Cloud的连接字符串。对于这一步，只需复制**BendSQL**标签页中提供的内容。

![Alt text](/img/connect/bendsql-5.png)

</StepContent>
<StepContent number="3">

### 启动BendSQL

要启动BendSQL，请将您复制的文本粘贴到终端或命令提示符中。如果复制的密码显示为“******”，请将其替换为您的实际密码。

![Alt text](/img/connect/bendsql-6.png)

</StepContent>

<StepContent number="4">

### 执行查询

连接成功后，您可以在BendSQL shell中执行SQL查询。例如，输入`SELECT NOW();`以返回当前时间。

![Alt text](/img/connect/bendsql-7.png)

</StepContent>
<StepContent number="5">

### 退出BendSQL

要退出BendSQL，请输入`quit`。

</StepContent>
</StepsWrap>