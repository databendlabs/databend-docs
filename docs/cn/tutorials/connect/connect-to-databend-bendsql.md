---
title: "使用 BendSQL 连接私有化部署的 Databend"
sidebar_label: "连接私有化部署的 Databend（BendSQL）"
slug: /
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

本教程将指导您使用 BendSQL 以 `root` 用户身份连接到私有化部署的 Databend 实例。

<StepsWrap>
<StepContent number="1">

### 准备工作

- 确保 BendSQL 已安装在本地机器。关于使用不同包管理器安装 BendSQL 的说明，请参阅[安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。
- 确保您的 Databend 实例已成功启动。
- 在本教程中，您将使用 `root` 账户连接 Databend。部署时，请取消 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中以下行的注释以选择该账户：

  ```sql title="databend-query.toml"
  [[query.users]]
  name = "root"
  auth_type = "no_password"
  ```

</StepContent>
<StepContent number="2">

### 启动 BendSQL

在终端或命令提示符中直接输入 `bendsql` 即可启动 BendSQL。

:::note
命令 `bendsql` 会启动 BendSQL 并使用无需密码的 `root` 用户连接到本地 Databend（127.0.0.1）。若需以其他用户（例如密码为 'abc123' 的 'eric'）连接本地 Databend，请使用命令 `bendsql --user eric --password abc123`。要查看所有可用参数及其默认值，请输入 `bendsql --help`。
:::

![Alt text](/img/connect/bendsql-1.gif)

</StepContent>
<StepContent number="3">

### 执行查询

连接成功后，您可以在 BendSQL shell 中执行 SQL 查询。例如输入 `SELECT NOW();` 可返回当前时间：

![Alt text](/img/connect/bendsql-2.gif)

</StepContent>
<StepContent number="4">

### 退出 BendSQL

输入 `quit` 即可退出 BendSQL。

![Alt text](/img/connect/bendsql-3.gif)

</StepContent>
</StepsWrap>
