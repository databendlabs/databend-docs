---
title: Kafka Consumer 集成任务 (Beta)
slug: /cloud/data-integration/kafka
---

本页介绍如何创建 Kafka Consumer 任务，从 Kafka topic 持续消费消息，并将消息内容保存到内部对象存储（租户 Stage）中。

与 S3、MySQL 或 PostgreSQL 集成任务不同，Kafka Consumer 任务不会直接写入普通目标表。任务创建完成并启动后，您可以通过 `@kafka_consumer/<task_name>/` stage 路径查看已保存的消息对象，并使用 SQL 查询对象内容。

如需先创建可复用的 Kafka 连接配置，请参见 [Kafka - Credentials (Beta)](../datasource/06-kafka.md)。

## 适用场景

- 从 Kafka topic 持续接入 JSON 消息
- 将 Kafka 消息先落到内部对象存储，再由下游 SQL 进行查询或处理
- 为实时或准实时数据管道保留原始 Kafka 消息对象

## 工作流程

1. 上游系统向 Kafka topic 写入消息。
2. Kafka Consumer 任务从指定 topic 中读取消息。
3. 任务按批次将消息保存到内部对象存储（租户 Stage）。
4. 用户通过 `@kafka_consumer/<task_name>/` 查看已生成的对象。
5. 用户使用 stage 查询读取消息内容，并根据需要执行后续入表或转换处理。

:::note
Kafka Consumer 任务保存的是 Kafka 消息内容对应的对象文件。如果需要写入业务表，请基于 stage 查询结果执行后续 `INSERT INTO ... SELECT`、`COPY INTO` 或其他处理流程。
:::

## 前置条件

在创建 Kafka Consumer 任务前，请确保：

- 已创建 **Kafka - Credentials** 数据源
- 云平台可以通过网络访问 Kafka broker
- Kafka 数据源中的认证方式、TLS 配置和账号信息正确
- Kafka 用户具有读取目标 topic 的权限
- 目标 topic 中的消息格式与任务中选择的 **Data Format** 保持一致

## 创建 Kafka Consumer 任务

### 步骤 1：基本信息

1. 前往 **Data** > **Data Integration**，点击 **Create Task**。
2. 选择一个 Kafka 数据源，然后配置基本参数：

| 字段 | 是否必填 | 说明 |
|------|----------|------|
| **Data Source** | 是 | 从下拉列表中选择已有的 **Kafka - Credentials** 数据源 |
| **Name** | 是 | 当前 Kafka Consumer 任务名称 |
| **Topics** | 是 | 要消费的 Kafka topic 列表，多个 topic 用英文逗号分隔，例如 `topic-1,topic-2` |
| **Data Format** | 是 | Kafka 消息的数据格式，当前为 **JSON** |
| **Start Position** | 是 | 无已提交 offset 时的消费起始位置，支持 **Latest** 和 **Earliest** |
| **Max Batch Bytes** | 否 | 单批最大数据量，默认值为 **16 MiB** |
| **Max Batch Wait Interval** | 否 | 单批最大等待时间，默认值为 **1 Minute** |

:::tip
**Latest** 只消费新消息，**Earliest** 从 Kafka 中最早保留的消息开始消费。该设置仅在 Consumer Group 没有已提交 offset 时生效，不会重置已有 offset。
:::

### 步骤 2：预览数据

完成基本设置后，点击 **Next** 进入 **Preview Data Info**。

系统会尝试从指定 Kafka topic 中读取样例消息。如果当前可读取到消息，页面会显示 1 到 2 条 JSON 消息内容，便于确认 topic、数据格式和消息结构是否符合预期。

如果当前没有可预览的消息，页面会显示 **No sample data available**。您仍可以继续创建任务，但建议先确认 topic 中是否已有消息，以及所选 **Start Position** 是否能读取到样例数据。

### 步骤 3：查看结果

在 **Result Viewing** 步骤中，选择用于运行 Kafka Consumer 任务的 **Warehouse**。

任务启动后，Kafka 消息会被读取并保存到内部对象存储（租户 Stage）。页面会提供 SQL 示例，您可以使用 `LIST @kafka_consumer/<task_name>/` 查看已生成的对象，并使用 stage 查询读取消息内容。

```sql
-- List stage objects:
LIST @kafka_consumer/<task_name>/;

-- Query object data (replace with correct PATTERN path):
SELECT $1
FROM @kafka_consumer (
    FILE_FORMAT=>'ndjson',
    PATTERN=>'<task_name>/year=YYYY/month=MM/day=DD/hour=HH/.*[.]ndjson'
);
```

确认无误后，点击 **Create** 完成任务创建。

## 任务行为

Kafka Consumer 任务是持续运行任务。启动后，任务会从指定 topic 消费消息，并按批次将消息保存为内部对象存储中的对象文件，直到被手动停止。

| 场景 | 行为 |
|------|------|
| Topic 中有新消息 | 读取消息并写入租户 Stage |
| 达到 Max Batch Bytes | 将当前批次写入对象存储 |
| 达到 Max Batch Wait Interval | 即使批次未达到大小上限，也会将当前批次写入对象存储 |
| 写入成功 | 保存消费进度，用于后续继续消费 |
| 手动停止任务 | 任务停止消费，并保留已保存的消息对象 |

## 查询已保存的消息

Kafka Consumer 任务会将消息对象保存到 `@kafka_consumer/<task_name>/` 路径下。任务启动并写入对象后，您可以打开任务详情页，切换到 **Data Browsing** tab，按 UTC 小时查看已写入的对象数量和对象列表。

您也可以使用 SQL 先列出对象，再按实际路径查询内容：

```sql
LIST @kafka_consumer/<task_name>/;
```

```sql
SELECT $1
FROM @kafka_consumer (
    FILE_FORMAT=>'ndjson',
    PATTERN=>'<task_name>/year=YYYY/month=MM/day=DD/hour=HH/.*[.]ndjson'
);
```

如果需要将消息写入业务表，可以基于上述查询结果继续执行数据转换或入表操作。

## 高级配置

### Runtime Size

Kafka Consumer 任务支持调整运行资源大小。修改 Runtime Size 前需要先停止任务，然后通过 **Edit** 菜单进入编辑页面，在 **Runtime Size** 区域选择合适的运行规格并保存。重新启动任务后，任务会按新的资源规格运行。

:::note
具体可选规格和价格取决于您的付费计划，请以控制台显示和定价说明为准。
:::
