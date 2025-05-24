---
title: Tapdata
---

[Tapdata](https://tapdata.net) 是一款面向数据服务平台化的产品，旨在帮助企业打破多源数据孤岛，实现数据快速交付，并通过实时数据同步提升数据传输效率。Tapdata 还支持通过低代码方式创建任务，只需简单拖拽节点即可轻松创建任务，有效降低了开发复杂度，缩短了项目部署周期。

Databend 是 Tapdata 支持的数据源之一。您可以使用 Tapdata 将数据从其他平台同步到 Databend，将 Databend 作为数据迁移/同步的**目的地**。

![Alt text](@site/static/img/documents_cn/getting-started/tapdata-databend.png)

## 与 Tapdata Cloud 集成

要与 Databend Cloud 建立连接并将其设置为 [Tapdata Cloud](https://tapdata.net/tapdata-cloud.html) 中的同步目的地，您需要完成以下步骤：

### 步骤 1: 部署 Tapdata Agent

Tapdata Agent 是数据同步、数据异构和数据开发场景中的关键程序。鉴于这些场景对数据流的实时性要求较高，在本地环境中部署 Tapdata Agent 可以基于低延迟的本地网络，确保最佳性能，从而保证数据流的实时性。

有关 Tapdata Agent 的下载和安装说明，请参阅 [步骤 1: 准备 TapData - Tapdata Cloud](https://docs.tapdata.io/faq/agent-installation)。

### 步骤 2: 创建连接

您需要为数据同步的每个数据源和数据目的地建立连接。例如，如果您想将数据从 MySQL 同步到 Databend Cloud，您需要在 Tapdata Cloud 上创建两个连接——一个连接到 MySQL，另一个连接到 Databend Cloud。请按照 [步骤 2: 连接数据源](https://docs.tapdata.io/quick-start/connect-database) 中概述的步骤创建连接。

以下是连接到 Databend Cloud 的示例：

![Alt text](@site/static/img/documents_cn/getting-started/tapdata-connect.png)

### 步骤 3: 创建数据复制任务

一旦与数据源和 Databend Cloud 的连接建立，您就可以通过创建数据复制任务来开始数据同步。请参阅 [创建数据复制任务](https://docs.tapdata.io/user-guide/copy-data/create-task/) 了解操作步骤。