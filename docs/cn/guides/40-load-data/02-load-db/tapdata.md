---
title: Tapdata
---

[Tapdata](https://tapdata.net) 是一款面向数据服务的平台型产品，旨在帮助企业打破多个数据孤岛，实现快速数据交付，并通过实时数据同步提高数据传输效率。我们还支持通过低代码方式创建任务，只需简单拖拽节点即可轻松创建任务，有效降低开发复杂性并缩短项目部署周期。

Databend 是 Tapdata 支持的数据源之一。您可以使用 Tapdata 将其他平台的数据同步到 Databend，将 Databend 用作数据迁移/同步的**目标**。

![Alt text](@site/static/img/documents_cn/getting-started/tapdata-databend.png)

## 与 Tapdata Cloud 集成

要在 [Tapdata Cloud](https://tapdata.net/tapdata-cloud.html) 中建立与 Databend Cloud 的连接并将其设置为同步目标，您需要完成以下步骤：

### 步骤 1：部署 Tapdata Agent

Tapdata Agent 是数据同步、数据异构和数据开发场景中的关键程序。鉴于这些场景对数据流的高实时性要求，在本地环境中部署 Tapdata Agent 可确保基于低延迟本地网络的最佳性能，从而保证实时数据流。

有关 Tapdata Agent 的下载和安装说明，请参阅 [Step 1: Provision TapData - Tapdata Cloud](https://docs.tapdata.io/faq/agent-installation)。

### 步骤 2：创建连接

您需要为数据源和数据目标分别建立连接，以进行数据同步。例如，如果您想将数据从 MySQL 同步到 Databend Cloud，则需要在 Tapdata Cloud 上创建两个连接，一个连接到 MySQL，另一个连接到 Databend Cloud。按照 [Step 2: Connect Data Sources](https://docs.tapdata.io/quick-start/connect-database) 中概述的步骤创建连接。

以下是连接到 Databend Cloud 的示例：

![Alt text](@site/static/img/documents_cn/getting-started/tapdata-connect.png)

### 步骤 3：创建数据复制任务

建立与数据源和 Databend Cloud 的连接后，您可以通过创建数据复制任务来开始数据同步。有关操作步骤，请参阅 [Create a Data Replication Task](https://docs.tapdata.io/user-guide/copy-data/create-task/)。