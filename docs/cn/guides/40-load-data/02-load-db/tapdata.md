---
title: Tapdata
---

[Tapdata](https://tapdata.net) 是一款面向数据服务的平台型产品，旨在帮助企业打通多个数据孤岛，实现数据的快速交付，并通过实时数据同步提升数据流转效率。同时，我们支持以低代码方式创建任务，只需简单拖拽节点即可轻松完成任务构建，有效降低开发难度，缩短项目部署周期。

Databend 是 Tapdata 支持的数据源之一。你可以使用 Tapdata 将其他平台的数据同步到 Databend，并将 Databend 作为数据迁移/同步的**目标端**。

![Alt text](@site/static/img/documents_cn/getting-started/tapdata-databend.png)

## 与 Tapdata Cloud 集成

要在 [Tapdata Cloud](https://tapdata.net/tapdata-cloud.html) 中建立与 Databend Cloud 的连接并将其设置为同步目标端，请完成以下步骤：

### 第一步：部署 Tapdata Agent

Tapdata Agent 是数据同步、数据异构及数据开发场景中的关键程序。鉴于这些场景对数据流的高实时性要求，将 Tapdata Agent 部署在本地环境，可依托低延迟的本地网络确保最佳性能，从而保障数据流的实时性。

有关 Tapdata Agent 的下载与安装说明，请参考 [第一步：准备 TapData - Tapdata Cloud](https://docs.tapdata.io/faq/agent-installation)。

### 第二步：创建连接

你需要分别为数据源和数据目标端建立连接。例如，若要将数据从 MySQL 同步到 Databend Cloud，则需在 Tapdata Cloud 上创建两个连接——一个连接 MySQL，另一个连接 Databend Cloud。请按照 [第二步：连接数据源](https://docs.tapdata.io/connectors/) 中的步骤创建连接。

以下是连接 Databend Cloud 的示例：

![Alt text](@site/static/img/documents_cn/getting-started/tapdata-connect.png)

### 第三步：创建数据复制任务

完成数据源与 Databend Cloud 的连接后，即可通过创建数据复制任务开始数据同步。有关操作步骤，请参考 [创建数据复制任务](https://docs.tapdata.io/data-replication/create-task/)。