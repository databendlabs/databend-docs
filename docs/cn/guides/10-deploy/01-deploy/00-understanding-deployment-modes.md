---
title: 理解 Databend 部署
sidebar_label: 理解部署
description: 描述 Databend 的部署模式
---

## Databend 节点类型

在 Databend 部署中，使用了两种类型的节点：Meta 和 Query。

Meta 节点负责存储和管理各种类型的元数据。这包括与数据库、表和集群相关的信息。此外，Meta 节点还处理用户信息，如授权和认证。它作为管理和组织元数据及用户相关数据的中央存储库。

另一方面，Query 节点专门用于处理查询。它负责执行用户查询，从底层存储中检索数据，并将结果返回给用户。Query 节点处理 Databend 的计算方面，确保高效和准确的查询处理。

请注意，当我们提到“节点”时，它指的是托管和运行 Databend 系统特定组件的单个服务器。每个节点，如 Meta 节点或 Query 节点，通常在处理数据和执行查询中扮演不同的角色。

## 部署模式

Databend 部署提供了两种模式：独立模式和集群模式，每种模式都有不同的应用场景和节点配置。

### 独立部署

在独立模式下，标准配置包括一个 Meta 节点和一个 Query 节点。这种最小化设置适用于测试目的或小规模部署。然而，重要的是要注意，独立模式不推荐用于生产环境，因为它具有有限的扩展性和缺乏高可用性功能。

<img src="/img/deploy/deploy-standalone-arch.png"/>

在独立 Databend 部署中，可以在单个服务器上托管 Meta 和 Query 节点。以下文档主题帮助您设置和部署独立 Databend：

- [部署独立 Databend](01-non-production/01-deploying-databend.md)
- [本地和 Docker 部署](01-non-production/00-deploying-local.md)

### 集群部署

集群模式设计用于更大规模的部署，并提供增强的功能。在 Databend 集群中，建议至少有三个 Meta 节点，形成一个 Meta 集群以确保高可用性和容错性。对于生产目的，Databend 建议拥有一个由三到五个 Meta 节点组成的 Meta 集群。

在 Databend 集群中，可以部署多个 Query 节点，并且可以通过将特定 Query 节点分组在一起（使用集群 ID）来创建更强大的 Query 集群，以满足不同的查询性能要求。Databend 集群能够容纳多个 Query 集群。默认情况下，Databend 充分利用计算并发性，允许单个 SQL 查询利用单个 Query 节点中的所有可用 CPU 核心。然而，当使用 Query 集群时，Databend 利用并发调度并在整个集群中执行计算。这种方法最大化系统性能并提供增强的计算能力。

<img src="/img/deploy/deploy-cluster-arch.png"/>

#### Query 集群大小

Databend 没有针对 Query 集群的特定最佳实践或推荐节点数量。Query 集群中的节点数量可以根据您的具体需求和负载而变化。

Query 集群的主要目标是确保查询处理速度满足您的需求并提供最佳性能。可以根据需要调整集群中的节点数量，以实现所需的查询性能和吞吐量。

#### 租户管理

租户是指利用系统提供的服务或资源的实体或组织。在 Databend 中，租户与唯一的租户 ID 相关联，作为标识符以区分和管理其在 Databend 中的数据、用户和资源。

在查询集群的情况下，当查询节点接收到 SQL 请求时，计算负载会有效地分布在共享相同租户 ID 和集群 ID 的查询节点之间。请注意，具有相同租户 ID 但不同集群 ID 的查询节点提供了工作负载隔离的机制，同时仍然共享相同的数据和用户列表。

![Alt text](/img/deploy/tenantid.PNG)

## 部署环境

本主题提供有关 Databend 节点的推荐硬件规格和支持的对象存储平台的信息。

### 硬件推荐

Databend 节点可以部署在本地服务器或云中。Databend 兼容各种公共云平台，如 Amazon EC2、Azure VM、腾讯云和阿里云。下表概述了运行 Databend 节点的服务器的推荐硬件规格：

| 硬件规格             | 独立模式          | 集群模式（Meta 节点） | 集群模式（Query 节点） |
| -------------------- | ----------------- | --------------------- | ---------------------- |
| CPU                  | 16 核或以上       | 4 核或以上            | 16 核或以上            |
| 内存                 | 32 GB 或以上      | 16 GB 或以上          | 32 GB 或以上           |
| 数据盘（SSD）        | 200-600 GB        | 100-200 GB            | 100-200 GB             |
| 网络接口卡           | 10 Gbps 或以上    | 10 Gbps 或以上        | 10 Gbps 或以上         |

### 支持的对象存储

Databend 支持自托管和云对象存储解决方案。在部署 Databend 之前准备您自己的对象存储。以下是支持的对象存储解决方案列表：

- Amazon S3
- Azure Blob Storage
- Google Cloud Storage
- MinIO
- Ceph
- Wasabi
- SeaweedFS
- Cloudflare R2
- 腾讯 COS
- 阿里 OSS
- 青云 QingStor