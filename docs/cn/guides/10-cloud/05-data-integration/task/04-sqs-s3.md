---
title: Amazon SQS (S3) 集成任务
slug: /cloud/data-integration/sqs-s3-event
---

本页介绍如何创建 Amazon SQS (S3) 集成任务，消费 SQS 队列中的 S3 对象创建事件，并将对应对象数据写入 Databend。

该任务面向 S3 事件驱动的数据接入场景：上游系统向 S3 写入对象后，S3 将 `ObjectCreated` 事件发送到 SQS，Databend Cloud 通过 AssumeRole 消费 SQS 消息，并基于事件中的存储桶和对象 key 将数据写入 Databend。

如需先创建可复用的 SQS (S3) 连接配置，请参见 [Amazon SQS (S3)](../datasource/05-sqs-s3.md)。

## 适用场景

- 基于 S3 `ObjectCreated` 事件自动接入新写入的 S3 对象
- 使用 S3 事件通知驱动数据导入，降低新文件到达后的处理延迟
- 避免仅通过轮询 S3 路径发现新文件

## 工作流程

1. 上游系统向 S3 存储桶写入对象。
2. S3 Event Notification 将 `ObjectCreated` 事件发送到 SQS 标准队列。
3. Databend Cloud 通过用户配置的 IAM Role 从 SQS 队列读取消息。
4. 任务解析消息中的 S3 事件记录。
5. 任务根据 S3 事件记录中的存储桶、对象 key 和文件格式写入 Databend 目标表。
6. 写入成功后，任务从 SQS 队列删除已处理消息。

:::note
S3 事件通知和 SQS 标准队列都可能产生重复消息。Databend 会处理失败重试；如果业务需要严格去重，请结合对象信息、事件时间、`sequencer` 或 SQS 消息 ID 设计下游去重逻辑。
:::

## 前置条件

在创建 SQS (S3) 集成任务前，请确保：

- 已创建 **Amazon SQS (S3)** 数据源
- S3 存储桶已配置 `ObjectCreated` 事件通知，并将事件发送到目标 SQS 队列
- SQS 队列策略允许 Amazon S3 执行 `sqs:SendMessage`
- 用户 IAM Role 允许 Databend 平台角色通过 `sts:AssumeRole` 访问
- 用户 IAM Role 具有读取目标 S3 对象和消费目标 SQS 队列的权限
- SQS 队列中保存的是标准 S3 Event Notification 消息格式
- S3 notification 的存储桶、prefix 和 suffix 与数据源配置保持一致

## 创建 SQS (S3) 集成任务

### 步骤 1：基本信息

1. 前往 **Data** > **Data Integration**，点击 **Create Task**。
2. 选择一个 SQS (S3) 数据源，然后配置基本参数：

| 字段 | 是否必填 | 说明 |
|------|----------|------|
| **Data Source** | 是 | 从下拉列表中选择已有的 **Amazon SQS (S3)** 数据源 |
| **Name** | 是 | 当前集成任务名称 |
| **File Format** | 是 | S3 对象的文件格式，例如 CSV、Parquet 或 NDJSON |
| **Object Key Prefix** | 否 | 仅处理指定前缀的对象事件，例如 `raw/events/`。应与数据源和 S3 notification filter 保持一致 |
| **Object Key Suffix** | 否 | 仅处理指定后缀的对象事件，例如 `.json` 或 `.parquet`。应与数据源和 S3 notification filter 保持一致 |

:::tip
建议优先在 S3 Event Notification 中配置前缀或后缀过滤，并与数据源和任务中的过滤条件保持一致，减少进入 SQS 的无关消息数量。
:::

### 步骤 2：预览数据

完成基本设置后，点击 **Next** 预览源数据。

预览结果与 [Amazon S3 集成任务](./01-s3.md) 一致。系统会根据 SQS (S3) 配置定位对应的 S3 对象，读取文件内容并展示：

- 包含列名和数据类型的示例数据
- 匹配到的 S3 对象列表及其大小

:::note
如果当前路径范围内没有可预览的 S3 对象，预览页可能无法展示样例数据。您可以先向目标 S3 路径上传一个匹配 prefix / suffix 的测试对象后再重试预览。
:::

### 步骤 3：设置目标表

配置 Databend 中的目标位置：

| 字段 | 说明 |
|------|------|
| **Warehouse** | 选择用于运行 SQS (S3) 集成任务的 Databend Cloud Warehouse |
| **Target Database** | 选择 Databend 中的目标数据库 |
| **Target Table** | 写入数据的目标表名 |

系统会根据预览到的 S3 对象内容推断列名和数据类型。继续之前，您可以检查并编辑目标表结构；如果写入已有表，请从现有表中选择目标表并确认列映射无误。

点击 **Create** 完成集成任务创建。

## 任务行为

SQS (S3) 集成任务是持续运行任务。启动后，它会周期性从 SQS 队列读取消息并写入目标表，直到被手动停止。

| 场景 | 行为 |
|------|------|
| 队列中有消息 | 读取消息，解析 S3 事件记录，并按事件中的对象信息写入目标表 |
| 写入成功 | 删除对应 SQS 消息，避免重复处理 |
| 写入失败 | 不删除对应 SQS 消息，保留消息用于后续重试 |
| 消息格式不符合 S3 Event Notification | 记录错误，并跳过或停止处理 |
| 手动停止任务 | 任务停止轮询，并保存当前运行状态 |

## 与 Amazon S3 集成任务的区别

| 任务类型 | 处理对象 | 写入 Databend 的内容 | 典型用途 |
|----------|----------|----------------------|----------|
| Amazon S3 集成任务 | S3 文件内容 | CSV、Parquet 或 NDJSON 文件中的业务数据 | 文件数据导入 |
| Amazon SQS (S3) 集成任务 | SQS 中的 S3 ObjectCreated 事件 | 事件对应的 S3 对象数据 | 新对象自动接入、事件驱动导入 |

如果您的目标是定期扫描某个 S3 路径并导入文件内容，请使用 Amazon S3 集成任务。如果您的目标是基于 S3 ObjectCreated 事件触发接入，请使用 Amazon SQS (S3) 集成任务。
