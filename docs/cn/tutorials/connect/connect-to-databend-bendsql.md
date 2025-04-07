---
title: "使用 BendSQL 连接到私有化部署 Databend"
sidebar_label: "连接到私有化部署 Databend (BendSQL)"
slug: /
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将指导您使用 BendSQL 以用户 `root` 身份连接到私有化部署的 Databend 实例。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 确保您的机器上已安装 BendSQL。有关如何使用各种包管理器安装 BendSQL 的说明，请参阅 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。
- 确保您的 Databend 实例已成功启动。
- 在本教程中，您将使用 `root` 帐户连接到 Databend。在部署期间，取消注释 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中的以下行以选择此帐户：

  ```sql title="databend-query.toml"
  [[query.users]]
  name = "root"
  auth_type = "no_password"
  ```

</StepContent>
<StepContent number="2">

### 启动 BendSQL

要启动 BendSQL，请直接在终端或命令提示符中输入 `bendsql`。

:::note
命令 `bendsql` 启动 BendSQL 并将其连接到本地 Databend（位于 127.0.0.1），使用 `root` 用户而无需密码。如果您希望使用其他用户（例如密码为 'abc123' 的 'eric'）连接到本地 Databend，请使用命令 `bendsql --user eric --password abc123`。要查看所有可用的参数及其默认值，请键入 `bendsql --help`。
:::

![Alt text](/img/connect/bendsql-1.gif)

</StepContent>
<StepContent number="3">

### 执行查询

连接后，您可以在 BendSQL shell 中执行 SQL 查询。例如，键入 `SELECT NOW();` 以返回当前时间：

![Alt text](/img/connect/bendsql-2.gif)

</StepContent>
<StepContent number="4">

### 退出 BendSQL

要退出 BendSQL，请键入 `quit`。

![Alt text](/img/connect/bendsql-3.gif)

</StepContent>
</StepsWrap>