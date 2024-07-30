---
title: '使用 BendSQL 连接到自托管 Databend'
sidebar_label: '连接到自托管 Databend (BendSQL)'
slug: /
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将指导您使用 `root` 用户通过 BendSQL 连接到自托管的 Databend 实例。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 确保 BendSQL 已安装在您的机器上。有关如何使用各种包管理器安装 BendSQL 的说明，请参阅 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。
- 确保您的 Databend 实例已成功启动。
- 在本教程中，您将使用 `root` 账户连接到 Databend。在部署过程中，取消注释 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中的以下行以选择此账户：

    ```sql title="databend-query.toml"
    [[query.users]]
    name = "root"
    auth_type = "no_password"
    ```

</StepContent>
<StepContent number="2">

### 启动 BendSQL

要启动 BendSQL，直接在终端或命令提示符中输入 `bendsql`。

:::note
命令 `bendsql` 启动并连接 BendSQL 到本地 Databend 的 127.0.0.1，使用 `root` 用户且无需密码。如果您希望以不同用户（例如 'eric' 用户，密码为 'abc123'）连接到本地 Databend，请使用命令 `bendsql --user eric --password abc123`。要查看所有可用参数及其默认值，请输入 `bendsql --help`。
:::

![Alt text](/img/connect/bendsql-1.gif)

</StepContent>
<StepContent number="3">

### 执行查询

连接成功后，您可以在 BendSQL  shell 中执行 SQL 查询。例如，输入 `SELECT NOW();` 以返回当前时间：

![Alt text](/img/connect/bendsql-2.gif)

</StepContent>
<StepContent number="4">

### 退出 BendSQL

要退出 BendSQL，输入 `quit`。

![Alt text](/img/connect/bendsql-3.gif)

</StepContent>
</StepsWrap>