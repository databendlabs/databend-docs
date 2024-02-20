---
title: '使用 BendSQL 连接到 Databend'
sidebar_label: '连接到 Databend'
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将指导您使用 BendSQL 作为用户 `root` 连接到 Databend 的过程。

<StepsWrap>
<StepContent number="0" title="开始之前">

- 确保您的机器上安装了 BendSQL。请参阅[安装 BendSQL](index.md#installing-bendsql) 了解如何使用各种包管理器安装 BendSQL 的说明。
- 确保您的 Databend 实例已成功启动。
- 在本教程中，您将使用 `root` 账户连接到 Databend。在部署时，取消注释 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中的以下行以选择此账户：

    ```sql title="databend-query.toml"
    [[query.users]]
    name = "root"
    auth_type = "no_password"
    ```

</StepContent>
<StepContent number="1" title="启动 BendSQL">

要启动 BendSQL，请直接在您的终端或命令提示符中输入 `bendsql`。

:::note
命令 `bendsql` 启动并将 BendSQL 连接到本地 Databend，地址为 127.0.0.1，使用 `root` 用户且不需要密码。如果您希望以不同的用户连接到本地 Databend，例如使用密码 'abc123' 的 'eric'，请使用命令 `bendsql --user eric --password abc123`。要查看所有可用参数及其默认值，请输入 `bendsql --help`。
:::

![Alt text](/img/connect/bendsql-1.gif)


</StepContent>
<StepContent number="2" title="执行查询">

连接后，您可以在 BendSQL shell 中执行 SQL 查询。例如，输入 `SELECT NOW();` 来返回当前时间：

![Alt text](/img/connect/bendsql-2.gif)

</StepContent>
<StepContent number="3" title="退出 BendSQL">

要退出 BendSQL，请输入 `quit`。

![Alt text](/img/connect/bendsql-3.gif)

</StepContent>
</StepsWrap>