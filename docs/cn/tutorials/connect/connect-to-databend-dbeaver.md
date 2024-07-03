---
title: '使用DBeaver连接到Databend'
sidebar_label: '连接到Databend（DBeaver）'
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将引导您通过Databend JDBC驱动程序以用户`root`的身份连接到Databend。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 确保您有一个本地Databend实例准备进行测试。详细步骤请参阅[Docker和本地部署](/guides/deploy/deploy/non-production/deploying-local)。
- 在本教程中，您将使用`root`账户连接到Databend。在部署过程中，请在[databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml)配置文件中取消注释以下行以选择此账户：

    ```sql title="databend-query.toml"
    [[query.users]]
    name = "root"
    auth_type = "no_password"
    ```
- 确保您已将Databend JDBC驱动程序添加到DBeaver中。添加步骤请参阅[向DBeaver添加Databend JDBC驱动程序](/guides/sql-clients/jdbc/#adding-databend-jdbc-driver-to-dbeaver)。

</StepContent>
<StepContent number="2">

### 创建连接

1. 在DBeaver中，首先在**数据库** > **新建数据库连接**中搜索并选择`databend`，然后点击**下一步**。

![Alt文本](@site/docs/public/img/integration/jdbc-new-driver.png)

2. 如有需要，配置您的连接设置。默认设置将连接到本地实例的Databend，使用用户`root`。

![Alt文本](@site/docs/public/img/integration/jdbc-connect.png)

3. 点击**测试连接**以检查连接是否成功。

</StepContent>
</StepsWrap>