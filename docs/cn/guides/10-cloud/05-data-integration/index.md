---
title: 数据集成
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

Databend Cloud 的 Data Integration 功能通过可视化、无代码界面，让您能够将外部数据源中的数据加载到 Databend。您可以直接在 Databend Cloud 控制台中创建数据源、配置集成任务并监控同步状态。

## 支持的数据源

| 数据源               | 说明                                                                           |
| -------------------- | ------------------------------------------------------------------------------ |
| [MySQL](./mysql.md)  | 支持从 MySQL 数据库同步数据，支持 `Snapshot`、`CDC` 和 `Snapshot + CDC` 模式。 |
| [Amazon S3](./s3.md) | 支持从 Amazon S3 存储桶导入文件，支持 CSV、Parquet 和 NDJSON 格式。            |

## 核心概念

### 数据源

数据源表示与外部系统建立的一条连接，其中保存了访问源数据所需的凭据和连接信息。数据源配置完成后，可在多个集成任务之间复用。

Databend Cloud 当前支持两类数据源：

- **MySQL - Credentials**：连接到 MySQL 数据库（主机、端口、用户名、密码、数据库）。
- **AWS - Credentials**：连接到 Amazon S3（Access Key 和 Secret Key）。

### 集成任务

集成任务定义了数据如何从源端流入 Databend 中的目标表。每个任务都会指定源配置、目标 Warehouse 和目标表，以及与数据源类型相关的运行参数。

## 管理数据源

![数据源概览](/img/cloud/dataintegration/databendcloud-dataintegration-datasource-overview.png)

要管理数据源，请在左侧导航栏中进入 **Data** > **Data Sources**。在该页面，您可以：

- 查看所有已配置的数据源
- 创建新的数据源
- 编辑或删除现有数据源
- 测试连通性以验证凭据是否有效

:::tip
建议在保存数据源之前始终先进行连接测试，这有助于及早发现凭据错误、网络限制等常见问题。
:::

## 管理任务

### 启动与停止任务

任务创建完成后，初始状态为 **Stopped**。要开始同步数据，请在任务上点击 **Start** 按钮。

![任务列表](/img/cloud/dataintegration/dataintegration-task-list-with-action-button.png)

要停止正在运行的任务，请点击 **Stop** 按钮。任务会优雅停止并保存当前进度。

### 任务状态

Data Integration 页面会展示所有任务及其当前状态：

| 状态    | 说明                   |
| ------- | ---------------------- |
| Running | 任务正在主动同步数据   |
| Stopped | 任务当前未运行         |
| Failed  | 任务执行过程中发生错误 |

### 查看运行历史

点击某个任务即可查看其执行历史。运行历史包括：

- 执行开始与结束时间
- 已同步的行数
- 错误详情（如有）

![运行历史](/img/cloud/dataintegration/dataintegration-run-history-page.png)

<IndexOverviewList />

## 视频导览

<iframe width="853" height="505" className="iframe-video" src="//player.bilibili.com/player.html?isOutside=true&aid=116208124821841&bvid=BV14KcZztEp5&cid=36612931991&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
