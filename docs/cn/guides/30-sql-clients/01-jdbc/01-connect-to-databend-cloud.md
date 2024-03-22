---
title: "通过 SQL 客户端连接到 Databend Cloud"
sidebar_label: "连接到 Databend Cloud"
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将指导您通过 Databend JDBC 驱动程序连接到 Databend Cloud。

<StepsWrap>
<StepContent number="0" title="开始之前">

- 确保您已将 Databend JDBC 驱动程序添加到您的 DBeaver 中。详细说明请参见[将 Databend JDBC 驱动程序添加到 DBeaver](index.md#adding-databend-jdbc-driver-to-dbeaver)。
- 确保您已经拥有一个 Databend Cloud 账户并且可以成功登录。

</StepContent>
<StepContent number="1" title="创建连接">

在创建连接到 Databend Cloud 之前，您需要登录到 Databend Cloud 以获取连接信息。更多信息，请参见[连接到计算集群](../../20-cloud/10-using-databend-cloud/00-warehouses.md#connecting)。

1. 在 DBeaver 中，首先在 **Database** > **New Database Connection** 中搜索并选择 `databendcloud`，然后点击 **Next**。

![Alt text](@site/static/img/documents/develop/jdbc-select-driver.png)

2. 配置您的连接设置。

| 设置            | 值                                                             |
| --------------- | -------------------------------------------------------------- |
| Host            | 从 Databend Cloud 获取的主机地址复制并粘贴，以 `https://` 开头 |
| Password        | 从 Databend Cloud 生成的密码复制并粘贴                         |
| Database/Schema | 例如，`default`                                                |

![Alt text](@site/static/img/documents/develop/jdbc-connect.png)

3. 点击 **Test Connection** 来检查连接是否成功。

</StepContent>
</StepsWrap>
