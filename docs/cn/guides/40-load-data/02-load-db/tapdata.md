---
title: Tapdata
---

[Tapdata](https://tapdata.net) 是一个面向数据服务的平台型产品，旨在帮助企业打破多个数据孤岛，实现快速的数据交付，并通过实时数据同步提升数据传输效率。我们还支持通过低代码方式创建任务，只需简单拖拽节点即可轻松创建任务，有效降低开发复杂度，缩短项目部署周期。

Databend 是 Tapdata 支持的数据源之一。您可以使用 Tapdata 将其他平台的数据同步到 Databend，将 Databend 作为数据迁移/同步的**目的地**。

![Alt text](@site/static/img/documents_cn/getting-started/tapdata-databend.png)

## 与 Tapdata Cloud 集成

要与 Databend Cloud 建立连接，并将其设置为 [Tapdata Cloud](https://tapdata.net/tapdata-cloud.html) 中的同步目的地，您需要完成以下步骤：

### 步骤 1：部署 Tapdata Agent

Tapdata Agent 是数据同步、数据异构、数据开发场景中的关键程序。鉴于这些场景中数据流对实时性的高要求，在您的本地环境中部署 Tapdata Agent 可以基于低延迟的本地网络确保最佳性能，以保证实时数据流。

有关 Tapdata Agent 的下载和安装说明，请参阅 [步骤 1：配置 TapData - Tapdata Cloud](https://docs.tapdata.io/quick-start/install/install-tapdata-agent)。

### 步骤 2：创建连接

您需要为数据同步的数据源和数据目的地分别建立连接。例如，如果您想将数据从 MySQL 同步到 Databend Cloud，您需要在 Tapdata Cloud 上创建两个连接——一个连接到 MySQL，另一个连接到 Databend Cloud。请按照 [步骤 2：连接数据源](https://docs.tapdata.io/quick-start/connect-database) 中的步骤创建连接。

以下是连接到 Databend Cloud 的示例：

![Alt text](@site/static/img/documents_cn/getting-started/tapdata-connect.png)

### 步骤 3：创建数据复制任务

一旦建立了数据源和 Databend Cloud 的连接，您就可以通过创建数据复制任务开始数据同步。请参阅 [创建数据复制任务](https://docs.tapdata.io/user-guide/copy-data/create-task/) 了解操作步骤。
