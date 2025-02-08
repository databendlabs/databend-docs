---
title: "使用 BendSQL 连接 Databend Cloud"
sidebar_label: "连接 Databend Cloud（BendSQL）"
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

本教程将指导您使用 BendSQL 连接 Databend Cloud。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 确保已安装 BendSQL。使用不同包管理器安装 BendSQL 的方法请参考[安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。
- 确保您已拥有 Databend Cloud 账户并可成功登录。

</StepContent>

<StepContent number="2">

### 获取连接信息

1. 登录 Databend Cloud，点击 **Connect**。

![Alt text](/img/connect/bendsql-4.gif)

2. 选择需要连接的数据库（例如"default"）；然后选择计算集群。若忘记密码请重置。

3. 在 **Examples** 区域可查看当前计算集群的 DSN 详细信息，以及通过 BendSQL 连接 Databend Cloud 的字符串。此步骤只需复制 **BendSQL** 标签页中的内容。

![Alt text](/img/connect/bendsql-5.png)

</StepContent>
<StepContent number="3">

### 启动 BendSQL

将复制内容粘贴至终端或命令提示符窗口以启动 BendSQL。若复制的密码显示为"**\*\***"，请替换为真实密码。

![Alt text](/img/connect/bendsql-6.png)

</StepContent>

<StepContent number="4">

### 执行查询

连接成功后即可在 BendSQL shell 中执行 SQL 查询。例如输入 `SELECT NOW();` 可返回当前时间。

![Alt text](/img/connect/bendsql-7.png)

</StepContent>
<StepContent number="5">

### 退出 BendSQL

输入 `quit` 即可退出 BendSQL。

</StepContent>
</StepsWrap>
