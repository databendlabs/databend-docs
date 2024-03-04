---
title: '通过 SQL 客户端连接到 Databend'
sidebar_label: '连接到 Databend'
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将指导您通过 Databend JDBC 驱动程序作为用户 `root` 连接到 Databend 的过程。

<StepsWrap>
<StepContent number="0" title="开始之前">

- 确保您已准备好本地 Databend 实例以供测试。请参阅 [Docker 和本地部署](../../10-deploy/01-deploy/01-non-production/00-deploying-local.md) 获取详细说明。
- 在本教程中，您将使用 `root` 账户连接到 Databend。在部署期间，取消注释 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中的以下行以选择此账户：

    ```sql title="databend-query.toml"
    [[query.users]]
    name = "root"
    auth_type = "no_password"
    ```
- 确保您已将 Databend JDBC 驱动程序添加到您的 DBeaver 中。请参阅 [将 Databend JDBC 驱动程序添加到 DBeaver](index.md#adding-databend-jdbc-driver-to-dbeaver) 获取详细说明。

</StepContent>
<StepContent number="1" title="创建连接">

1. 在 DBeaver 中，首先在 **数据库** > **新建数据库连接** 中搜索并选择 `databend`，然后点击 **下一步**。

![Alt text](@site/docs/public/img/integration/jdbc-new-driver.png)

2. 如有需要，配置您的连接设置。默认设置将连接到作为用户 `root` 的本地 Databend 实例。

![Alt text](@site/docs/public/img/integration/jdbc-connect.png)

3. 点击 **测试连接** 以检查连接是否成功。

</StepContent>
</StepsWrap>