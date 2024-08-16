---
title: "使用 DBeaver 连接到 Databend Cloud"
sidebar_label: "连接到 Databend Cloud (DBeaver)"
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将引导您通过 Databend JDBC 驱动程序连接到 Databend Cloud。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 确保您已将 Databend JDBC 驱动程序添加到 DBeaver 中。详细步骤请参阅[将 Databend JDBC 驱动程序添加到 DBeaver](/guides/sql-clients/jdbc/#adding-databend-jdbc-driver-to-dbeaver)。
- 确保您已拥有 Databend Cloud 账户并能成功登录。

</StepContent>
<StepContent number="2">

### 创建连接

在创建与 Databend Cloud 的连接之前，您需要登录 Databend Cloud 以获取连接信息。更多信息，请参阅[连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

1. 在 DBeaver 中，首先在**数据库** > **新建数据库连接**中搜索并选择`databendcloud`，然后点击**下一步**。

![Alt text](@site/static/img/documents/develop/jdbc-select-driver.png)

2. 配置您的连接设置。

| 设置        | 值                                                             |
| ----------- | -------------------------------------------------------------- |
| 主机        | 复制并粘贴您从 Databend Cloud 获取的主机地址，以`https://`开头 |
| 密码        | 复制并粘贴您从 Databend Cloud 生成的密码                       |
| 数据库/模式 | 例如，`default`                                                |

![Alt text](@site/static/img/documents/develop/jdbc-connect.png)

3. 点击**测试连接**以检查连接是否成功。

</StepContent>
</StepsWrap>
