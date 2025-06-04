```markdown
---
title: Tapdata
---

[Tapdata](https://tapdata.net) 是一款面向平台的数据服务产品，旨在帮助企业打破数据孤岛，通过实时数据同步实现快速数据交付并提升传输效率。同时支持低代码（low-code）方式创建任务，通过简单的节点拖拽即可轻松构建任务，有效降低开发复杂度并缩短项目部署周期。

Databend 是 Tapdata 支持的数据源之一。您可使用 Tapdata 将其他平台数据同步至 Databend，将其作为数据迁移/同步的**目标端**。

![Alt text](@site/static/img/documents_cn/getting-started/tapdata-databend.png)

## 与 Tapdata Cloud 集成

要在 [Tapdata Cloud](https://tapdata.net/tapdata-cloud.html) 中连接 Databend Cloud 并设为同步目标，需完成以下步骤：

### 步骤 1：部署 Tapdata Agent

Tapdata Agent 是数据同步、异构和开发场景的核心组件。鉴于此类场景对数据流的高实时性要求，在本地环境部署 Tapdata Agent 可依托低延迟网络保障最优性能，确保实时数据流动。

Tapdata Agent 下载安装指引详见：[步骤 1：配置 TapData - Tapdata Cloud](https://docs.tapdata.io/faq/agent-installation)。

### 步骤 2：创建连接

需为同步任务的数据源和目标端分别创建连接。例如将 MySQL 数据同步至 Databend Cloud 时，需在 Tapdata Cloud 创建两个连接：MySQL 连接与 Databend Cloud 连接。操作步骤参见：[步骤 2：连接数据源](https://docs.tapdata.io/quick-start/connect-database)。

Databend Cloud 连接示例如下：

![Alt text](@site/static/img/documents_cn/getting-started/tapdata-connect.png)

### 步骤 3：创建数据复制任务

完成数据源与 Databend Cloud 的连接配置后，即可创建数据复制任务启动同步。操作指引参考：[创建数据复制任务](https://docs.tapdata.io/user-guide/copy-data/create-task/)。
```