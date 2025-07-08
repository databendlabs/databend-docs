---
title: Tapdata
---

[Tapdata](https://tapdata.net) 是一款面向数据服务的平台型产品，旨在帮助企业打破多数据孤岛，实现数据的快速交付，并通过实时数据同步提升数据流转效率。我们还支持通过低代码方式创建任务，只需简单的节点拖拽即可轻松创建任务，有效降低开发复杂度，缩短项目部署周期。

Databend 是 Tapdata 支持的数据源之一。你可以使用 Tapdata 将其他平台的数据同步到 Databend，将 Databend 作为数据迁移/同步的**目标**。

![Alt text](@site/static/img/documents_cn/getting-started/tapdata-databend.png)

## 与 Tapdata Cloud 集成

要在 [Tapdata Cloud](https://tapdata.net/tapdata-cloud.html) 中建立与 Databend Cloud 的连接并将其设置为同步目标，你需要完成以下步骤：

### 第一步：部署 Tapdata Agent

Tapdata Agent 是数据同步、数据异构 (Data Heterogeneity)、数据开发场景中的关键程序。考虑到这些场景下对数据流转的高实时性要求，将 Tapdata Agent 部署在你的本地环境中，可以基于低延迟的本地网络确保最佳性能，以保障数据流转的实时性。

关于 Tapdata Agent 的下载和安装说明，请参考 [第一步：准备 Tapdata - Tapdata Cloud](https://docs.tapdata.io/faq/agent-installation)。

### 第二步：创建连接

你需要为数据同步的每个数据源和数据目标建立连接。例如，如果你想将数据从 MySQL 同步到 Databend Cloud，你需要在 Tapdata Cloud 上创建两个连接——一个连接到 MySQL，另一个连接到 Databend Cloud。请按照 [第二步：连接数据源](https://docs.tapdata.io/quick-start/connect-database) 中概述的步骤创建连接。

以下是连接到 Databend Cloud 的示例：

![Alt text](@site/static/img/documents_cn/getting-started/tapdata-connect.png)

### 第三步：创建数据复制任务

一旦与数据源和 Databend Cloud 的连接建立，你就可以通过创建数据复制任务来开始数据同步。有关操作步骤，请参考 [创建数据复制任务](https://docs.tapdata.io/user-guide/copy-data/create-task/)。