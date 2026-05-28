---
title: 集成任务
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

Databend Cloud 集成任务定义了数据如何从源端流入 Databend 中的目标表。每个任务都会引用一个已有数据源，并指定源配置、目标 Warehouse、目标数据库 / 表，以及与任务类型相关的运行参数。

与数据源不同，集成任务是实际执行数据搬运和同步的运行单元。数据源负责保存访问配置，任务负责调度、导入、同步、停止、恢复和监控。

## 支持的任务类型

| 任务类型 | 说明 |
|----------|------|
| [Amazon S3](./01-s3.md) | 从 Amazon S3 导入 CSV、Parquet 或 NDJSON 文件，支持一次性导入和持续导入。 |
| [Amazon SQS (S3)](./04-sqs-s3.md) | 消费 SQS 队列中的 S3 对象创建事件，并将对应对象数据写入 Databend。 |
| [MySQL](./02-mysql.md) | 从 MySQL 表同步数据到 Databend，支持 `Snapshot`、`CDC Only` 和 `Snapshot + CDC`。 |
| [PostgreSQL](./03-postgres.md) | 从 PostgreSQL 表同步数据到 Databend，支持 `Snapshot`、`CDC Only` 和 `Snapshot + CDC`。 |

## 阅读建议

建议按以下顺序阅读：

1. 先阅读 [任务管理](./00-management.md)，了解任务的创建流程、启动停止方式、状态和运行历史。
2. 再根据任务类型阅读对应详情页，完成具体配置。

## 任务类型差异

- S3 任务面向文件导入场景，通常围绕文件路径、文件格式和导入策略进行配置。
- SQS (S3) 任务面向 S3 事件驱动的数据接入场景，通常围绕 SQS 队列、S3 事件过滤、IAM Role 和目标表进行配置。
- MySQL 和 PostgreSQL 任务面向表同步场景，通常围绕同步模式、主键、增量捕获和归档策略进行配置。

<IndexOverviewList />
