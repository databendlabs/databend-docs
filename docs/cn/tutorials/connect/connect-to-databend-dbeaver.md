---
title: "使用 DBeaver 连接到 Databend"
sidebar_label: "连接到 Databend (DBeaver)"
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将指导您通过 Databend JDBC 驱动程序以 `root` 用户身份连接到 Databend。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 确保您有一个本地 Databend 实例可供测试。详细步骤请参阅 [Docker 和本地部署](/guides/deploy/deploy/non-production/deploying-local)。
- 在本教程中，您将使用 `root` 账户连接到 Databend。在部署过程中，取消注释 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中的以下行以选择此账户：

  ```sql title="databend-query.toml"
  [[query.users]]
  name = "root"
  auth_type = "no_password"
  ```

- 确保您已将 Databend JDBC 驱动程序添加到 DBeaver 中。详细步骤请参阅 [将 Databend JDBC 驱动程序添加到 DBeaver](/guides/sql-clients/jdbc/#adding-databend-jdbc-driver-to-dbeaver)。

</StepContent>
<StepContent number="2">

### 创建连接

1. 在 DBeaver 中，首先在 **Database** > **New Database Connection** 中搜索并选择 `databend`，然后点击 **Next**。

![Alt text](/img/integration/jdbc-new-driver.png)

2. 根据需要配置您的连接设置。默认设置将以 `root` 用户身份连接到本地 Databend 实例。

![Alt text](/img/integration/jdbc-connect.png)

3. 点击 **Test Connection** 以检查连接是否成功。

</StepContent>
</StepsWrap>