---
title: 使用 Tapdata 迁移数据
---

[Tapdata](https://tapdata.net) 是一款面向数据服务的平台化产品，旨在帮助企业打破多个数据孤岛，完成数据快速交付，同时依靠实时数据同步，提高数据传输效率。我们还支持通过低代码的方式创建任务，简单的拖拽节点即可完成创建，有效降低开发难度，缩短项目上线周期。

Databend Cloud 是 [Tapdata 支持的数据源](https://docs.tapdata.io/cloud/introduction/supported-databases#beta-%E6%95%B0%E6%8D%AE%E6%BA%90) 之一。您可以把 Databend Cloud 作为数据迁移/同步的**目的地**，使用 Tapdata 将数据从其他平台同步到 Databend Cloud。

![Alt text](@site/static/img/documents_cn/getting-started/tapdata-databend.png)

## 与 Tapdata Cloud 建立连接

在 [Tapdata Cloud](https://tapdata.net/tapdata-cloud.html)，与 Databend Cloud 建立连接并设置将 Databend Cloud 设置为同步目的地需要完成以下步骤：

### 第一步：部署 Tapdata Agent

Tapdata Agent 是数据同步、数据异构、数据开发场景中的关键程序。以上场景对数据的流转有着极高的实时性要求，因此，通过下载 Tapdata Agent 并将其部署在你的本地环境，基于低延迟的本地网络，Tapdata Agent 能够发挥最佳性能以确保数据流转的实时性。

Tapdata Agent 下载及安装，请参考 https://docs.tapdata.io/cloud/quick-start/install-agent/


### 第二步：创建连接

您需要为做数据同步的数据源和数据目的地分别建立一个连接。比如，将数据从 MySQL 同步到 Databend Cloud，您需要在 Tapdata Cloud 上建立两个连接，一个连接到 MySQL，另外一个连接到 Databend Cloud。

获取与 Databend Cloud 连接所需的连接参数，请参考[接到计算集群](../02-using-databend-cloud/00-warehouses.md#连接到计算集群-connecting)。建立连接的步骤，请参考 https://docs.tapdata.io/cloud/quick-start/connect-database

以下是一个连接到 Databend Cloud 的例子：

![Alt text](@site/static/img/documents_cn/getting-started/tapdata-connect.png)


### 第三步：创建数据复制任务

建立好与数据源和 Databend Cloud 的连接后，就可以通过创建数据复制任务来开始数据同步。操作步骤请参考 https://docs.tapdata.io/cloud/user-guide/copy-data/create-task