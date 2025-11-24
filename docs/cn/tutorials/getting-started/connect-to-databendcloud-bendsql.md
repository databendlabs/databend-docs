---
title: "使用 BendSQL 连接 Databend Cloud"
sidebar_label: "Databend Cloud + BendSQL"
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

本教程将指导你如何通过 BendSQL 连接 Databend Cloud。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 请先安装 BendSQL，参见 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。
- 请确认你已拥有 Databend Cloud 账号并可成功登录。

</StepContent>

<StepContent number="2">

### 获取连接信息

1. 登录 Databend Cloud，点击 **Connect**。

![Alt text](/img/connect/bendsql-4.gif)

2. 选择要连接的数据库（如 "default"），再选择 Warehouse。如忘记密码可以直接在此重置。

3. 在 **Examples** 区域可以看到当前 Warehouse 的 DSN 详情以及 BendSQL 连接示例。本教程只需复制 **BendSQL** 选项卡中的内容。

![Alt text](/img/connect/bendsql-5.png)

</StepContent>
<StepContent number="3">

### 启动 BendSQL

将刚复制的内容粘贴到终端中即可启动 BendSQL。如果复制出来的密码显示为 `***`，请记得替换为真实密码。

![Alt text](/img/connect/bendsql-6.png)

</StepContent>

<StepContent number="4">

### 执行查询

连接成功后即可在 BendSQL shell 中执行 SQL，例如输入 `SELECT NOW();` 查询当前时间。

![Alt text](/img/connect/bendsql-7.png)

</StepContent>
<StepContent number="5">

### 退出 BendSQL

输入 `quit` 即可退出 BendSQL。

</StepContent>
</StepsWrap>
