---
title: TiDB 数据源 (Beta)
---

本页介绍如何创建 `TiDB` 数据源。该数据源用于保存 TiDB Cloud Lake 读取 TiDB 集群暂存数据所需的对象存储位置、凭据和可选事件队列，可供多个 TiDB 同步任务复用。

TiDB 数据源只保存对象存储连接信息，不会直接连接 TiDB 服务器。Dumpling 和 TiCDC 将导出数据和变更事件写入对象存储桶，TiDB Cloud Lake 从该桶中读取数据。

## 使用场景

- 为多个 TiDB 同步任务统一管理暂存桶、凭据和可选的 SQS 队列
- 避免在每个任务中重复填写相同的桶和授权配置
- 使用 IAM Role 代替静态密钥，让 TiDB Cloud Lake 获取临时凭据
- 当多个任务引用相同配置时，在一处更新桶、角色或队列即可

## 准备 TiDB 集成环境

TiDB Cloud 通过 Dumpling 导出全量快照，通过 TiCDC 导出增量变更到对象存储桶。由于 TiDB Cloud 各版本之间存在差异，我们建议针对不同版本采用特定的配置方式，以保持配置简洁并确保数据兼容性。

- **Premium / BYOC**：使用 [TiDB Cloud 控制台 **Data Pipeline**](https://docs.pingcap.com/tidbcloud/data-pipeline-sink-to-lake/?plan=premium) 界面统一管理和配置导入导出。
- **Dedicated**：请参阅[集成指南](https://docs.pingcap.com/tidbcloud/data-pipeline-dedicated-sink-to-lake/)了解推荐方式。

## 创建 TiDB 数据源

1. 前往 **Data** > **Data Sources**，点击 **Create**。
2. 将服务类型选择为 **TiDB**，然后填写数据源的 **Name**。
3. 选择 **Storage Provider** 和 **Authentication Method**，然后填写连接信息。字段取决于所选组合，详见下方 [Amazon S3](#amazon-s3) 或 [Alibaba Cloud OSS](#alibaba-cloud-oss)。

   > 请尽可能使用与 TiDB Cloud Lake 部署相同的存储提供商和区域。

4. 点击 **Test Connectivity** 验证桶和凭据。如果测试成功，点击 **OK** 保存数据源。


## Amazon S3

当存储提供商为 **Amazon S3** 时，可选择以下认证方式。

### 认证方式：Role ARN（推荐）

Role ARN 采用 AssumeRole 模型。TiDB Cloud Lake 在您的 AWS 账户中承担一个 IAM Role 并获取临时凭据，因此无需向 TiDB Cloud Lake 提供静态密钥。

在保存数据源之前，IAM Role 的信任策略必须信任两个平台角色（设置/验证和数据加载），并使用对应的 External ID 作为 `sts:ExternalId` 条件。完整的信任策略设置请参阅[使用 AWS IAM Role 认证](https://docs.pingcap.com/tidbcloudlake/authenticate-with-aws-iam-role/)。

| 字段 | 是否必填 | 说明 |
|------|----------|------|
| **Name** | 是 | 数据源的描述性名称 |
| **Storage Provider** | 是 | 选择 **Amazon S3** |
| **Authentication Method** | 是 | 选择 **Role ARN** |
| **Role ARN** | 是 | 您 AWS 账户中允许 TiDB Cloud Lake 承担的 IAM Role ARN，例如 `arn:aws:iam::123456789012:role/tidbcloud-lake-tidb` |
| **S3 Bucket Name** | 是 | TiCDC / Dumpling 暂存数据的桶，TiDB Cloud Lake 从该桶加载数据 |
| **S3 Region** | 是 | 桶所在的 AWS Region，例如 `us-east-1` |
| **S3 Endpoint** | 否 | 仅用于 S3 兼容存储（如 MinIO），例如 `http://localhost:9000`。Amazon S3 请留空 |
| **SQS Queue URL** | 否 | 可选的标准 SQS 队列地址，用于事件驱动模式。详见[可选 SQS 队列](#可选-sqs-队列) |

### 认证方式：Access Key / Secret Key

当您偏好使用静态凭据时，可选择此方式，例如使用不支持角色承担的 S3 兼容存储。

更多详情请参阅 [Amazon S3 - Credentials](https://docs.pingcap.com/tidbcloudlake/aws-credentials/)。

| 字段 | 是否必填 | 说明 |
|------|----------|------|
| **Name** | 是 | 数据源的描述性名称 |
| **Storage Provider** | 是 | 选择 **Amazon S3** |
| **Authentication Method** | 是 | 选择 **Access Key / Secret Key** |
| **S3 Access Key** | 是 | 具有暂存桶访问权限的 Access Key ID |
| **S3 Secret Key** | 是 | 与 Access Key ID 配对的 Secret Access Key |
| **S3 Bucket Name** | 是 | TiCDC / Dumpling 暂存数据的桶，TiDB Cloud Lake 从该桶加载数据 |
| **S3 Region** | 是 | 桶所在的 AWS Region |
| **S3 Endpoint** | 否 | 仅用于 S3 兼容存储。Amazon S3 请留空 |
| **SQS Queue URL** | 否 | 可选的标准 SQS 队列地址，用于事件驱动模式 |

## Alibaba Cloud OSS

当存储提供商为 **Alibaba Cloud OSS** 时，TiDB Cloud Lake 从阿里云读取暂存桶数据。OSS 仅支持 **Access Key / Secret Key** 认证方式。

| 字段 | 是否必填 | 说明 |
|------|----------|------|
| **Name** | 是 | 数据源的描述性名称 |
| **Storage Provider** | 是 | 选择 **Alibaba Cloud OSS** |
| **OSS Access Key ID** | 是 | OSS AccessKey ID |
| **OSS AccessKey Secret** | 是 | OSS AccessKey Secret |
| **OSS Bucket** | 是 | TiCDC / Dumpling 暂存数据的 OSS 桶 |
| **OSS Region** | 只读 | Lake 的部署区域，自动显示，不可更改 |

## 可选 SQS 队列

**SQS Queue URL** 字段为可选项，仅适用于 Amazon S3。当您提供一个接收暂存桶 S3 `ObjectCreated` 事件的标准 SQS 队列时，TiDB Cloud Lake 可以通过队列发现新写入的 changefeed / 导出对象，而无需等待下一次轮询。

- 队列必须为**标准**队列。不支持 FIFO 队列，因为 S3 事件通知无法投递到 FIFO 队列。
- S3 桶和 SQS 队列应位于同一 Region。
- 轮询仍然是权威的对象发现方式，SQS 仅用于降低延迟，不能替代轮询。
- 如果留空，任务将通过轮询发现对象。

队列、桶通知和信任策略的配置请参阅 [Amazon SQS (S3) - IAM Role](../../04-security/iam-role/aws.md)。

## 后续操作

创建好数据源后，您可以使用它来创建 [TiDB 集成任务](../task/06-tidb.md)。
