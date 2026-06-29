---
title: 数据集成 (Data Integration)
sidebar_position: 1
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

Databend Cloud 的 Data Integration 功能通过可视化、无代码界面，让您能够将外部系统中的数据导入或同步到 Databend。整个功能围绕两个核心概念展开：**数据源** 和 **集成任务**。

## 核心概念

| 概念                            | 说明                                                                                                                                                        |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [数据源](./datasource/index.md) | 一组可复用的连接配置或凭据，用于访问外部系统或发送通知，例如 AWS Access Key / Secret Key、MySQL 主机名 / 用户名 / 密码、SQS (S3) 队列地址、Kafka broker 地址、飞书机器人地址。 |
| [集成任务](./task/index.md)     | 一条实际运行的数据同步、导入或消费任务，定义了数据从哪里来、写到哪里或如何保存结果、使用什么运行参数，以及如何启动和监控。                                  |

数据源本身不搬运数据，它只负责保存访问外部系统所需的信息；真正执行数据导入、快照同步或持续增量同步的是集成任务。

:::info
运行 Data Integration 任务会产生服务托管费，按服务的实际运行时长按秒计费。详情请参阅 [服务托管定价](/guides/cloud/overview/pricing#服务托管定价)。
:::

并非所有数据源都会对应一种导入任务。例如，`FeiShuBot` 数据源用于通知，而不是用于把源数据导入 Databend。

## 支持的集成任务类型

| 任务类型                                      | 说明                                                                             |
| --------------------------------------------- | -------------------------------------------------------------------------------- |
| [Amazon S3](./task/01-s3.md)                  | 从 Amazon S3 导入 CSV、Parquet 或 NDJSON 文件，可选择一次性导入或持续导入。      |
| [Amazon SQS (S3) (Beta)](./task/02-sqs-s3.md) | 消费 SQS 队列中的 S3 对象创建事件，并将对应对象数据写入云平台。                  |
| [MySQL](./task/03-mysql.md)                   | 从 MySQL 同步表数据，支持 `Snapshot`、`CDC Only` 和 `Snapshot + CDC` 模式。      |
| [PostgreSQL](./task/04-postgres.md)           | 从 PostgreSQL 同步表数据，支持 `Snapshot`、`CDC Only` 和 `Snapshot + CDC` 模式。 |
| [Kafka Consumer 集成任务 (Beta)](./task/05-kafka.md) | 从 Kafka topic 持续消费消息，并将消息内容保存到内部对象存储。 |

## 推荐使用流程

1. 在 [数据源](./datasource/index.md) 页面创建并测试可复用的连接配置。
2. 在 [集成任务](./task/index.md) 页面了解支持的任务类型及其适用场景。
3. 阅读具体任务类型文档，完成源配置、预览数据和结果设置。
4. 参考 [任务管理](./task/00-management.md) 页面启动任务、查看状态和排查运行问题。

<IndexOverviewList />

## 视频导览

<iframe width="853" height="505" className="iframe-video" src="//player.bilibili.com/player.html?isOutside=true&aid=116208124821841&bvid=BV14KcZztEp5&cid=36612931991&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
