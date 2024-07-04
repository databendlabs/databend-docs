---
title: '使用BendSQL连接到Databend'
sidebar_label: '连接到Databend（BendSQL）'
slug: /
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将引导您通过使用BendSQL作为用户`root`来连接到Databend的过程。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 确保您的机器上已安装BendSQL。请参阅[安装BendSQL](/guides/sql-clients/bendsql/#安装bendsql)了解如何使用各种包管理器安装BendSQL的说明。
- 确保您的Databend实例已成功启动。
- 在本教程中，您将使用`root`账户连接到Databend。在部署过程中，请在[databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml)配置文件中取消注释以下行以选择此账户：

    ```sql title="databend-query.toml"
    [[query.users]]
    name = "root"
    auth_type = "no_password"
    ```

</StepContent>
<StepContent number="2">

### 启动BendSQL

要启动BendSQL，请直接在终端或命令提示符中输入`bendsql`。

:::note
命令`bendsql`启动并连接BendSQL到本地Databend（127.0.0.1），使用`root`用户无需密码。如果您希望使用不同的用户（如'eric'，密码'abc123'）连接到本地Databend，请使用命令`bendsql --user eric --password abc123`。要查看所有可用参数及其默认值，请输入`bendsql --help`。
:::

![Alt text](/img/connect/bendsql-1.gif)


</StepContent>
<StepContent number="3">

### 执行查询

连接后，您可以在BendSQL shell中执行SQL查询。例如，输入`SELECT NOW();`以返回当前时间：

![Alt text](/img/connect/bendsql-2.gif)

</StepContent>
<StepContent number="4">

### 退出BendSQL

要退出BendSQL，请输入`quit`。

![Alt text](/img/connect/bendsql-3.gif)

</StepContent>
</StepsWrap>