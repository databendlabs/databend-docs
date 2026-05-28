---
title: 数据源
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

Databend Cloud 数据源表示与外部系统建立的一条连接，其中保存了访问外部系统所需的凭据和连接信息。数据源配置完成后，可在多个集成任务或通知场景中复用。

数据源本身不会执行数据同步。它的职责是统一管理访问配置，避免在每个任务里重复填写账号、密码、密钥或通知地址。

## 支持的数据源类型

| 类型 | 用途 |
|------|------|
| [AWS - Credentials](./01-aws.md) | 保存访问 Amazon S3 所需的 Access Key 和 Secret Key，可供多个 S3 导入任务复用。 |
| [Amazon SQS (S3)](./05-sqs-s3.md) | 保存 SQS (S3) 接入所需的队列地址、Region、IAM Role 和 S3 路径范围，可用于消费 S3 对象创建事件。 |
| [MySQL - Credentials](./02-mysql.md) | 保存访问 MySQL 所需的主机、端口、用户名、密码和数据库信息，可供多个 MySQL 同步任务复用。 |
| [PostgreSQL - Credentials](./04-postgres.md) | 保存访问 PostgreSQL 所需的主机、端口、用户名、密码和数据库信息，可供多个 PostgreSQL 同步任务复用。 |
| [FeiShuBot](./03-feishu.md) | 保存飞书机器人地址和消息模板，用于任务失败通知等场景。 |

并非每种数据源都会对应一类集成任务。例如，`FeiShuBot` 用于通知配置，而 `AWS - Credentials`、`Amazon SQS (S3)`、`MySQL - Credentials` 和 `PostgreSQL - Credentials` 则会被实际的数据导入、同步或事件消费任务引用。

## 管理数据源

![数据源概览](/img/cloud/dataintegration/databendcloud-dataintegration-datasource-overview.png)

前往 **Data** > **Data Sources**，您可以：

- 查看所有已配置的数据源
- 创建新的数据源
- 编辑或删除现有数据源
- 测试连通性以验证凭据是否有效

:::tip
建议在保存数据源之前先执行 **Test Connectivity**，以尽早发现凭据错误、网络限制或权限不足等问题。
:::

## 后续操作

创建好数据源后，您可以根据用途在[集成任务](../task/index.md)或通知配置中引用它。

<IndexOverviewList />
