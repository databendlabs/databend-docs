---
title: 理解 Databend 的部署方式
sidebar_label: 部署方式
description: 描述 Databend 的部署模式
---

import LanguageDocs from '@site/src/components/LanguageDocs';

## Databend 节点类型

在 Databend 部署中，使用了两种类型的节点：Meta 节点和 Query 节点。

Meta 节点负责存储和管理各种类型的元数据。这包括与数据库、表和集群相关的信息。此外，Meta 节点还处理用户信息，例如授权和身份验证。它作为管理和组织元数据以及用户相关数据的中心仓库。

另一方面，Query 节点专门用于处理查询。它负责执行用户查询，从底层存储中检索数据，并将结果返回给用户。Query 节点处理 Databend 的计算方面，确保高效准确的查询处理。

请注意，当我们提到“节点”时，它指的是托管和运行 Databend 系统特定组件的单个服务器。每个节点，例如 Meta 节点或 Query 节点，通常在处理数据和执行查询方面发挥着不同的作用。

## 部署模式

Databend 部署提供两种模式：standalone 和 cluster，每种模式都有不同的应用场景和节点配置。

### Standalone 部署

在 standalone 模式下，标准配置由单个 Meta 节点和单个 Query 节点组成。这种最小设置适用于测试目的或小规模部署。但是，重要的是要注意，由于其有限的可扩展性和缺少高可用性功能，不建议在生产环境中使用 standalone 模式。

<img src="/img/deploy/deploy-standalone-arch.png"/>

在 Standalone Databend 部署中，可以将 Meta 节点和 Query 节点都托管在单个服务器上。文档中的以下主题可帮助您设置和部署 standalone Databend：

- [Deploying a Standalone Databend](01-non-production/01-deploying-databend.md)
- [Local and Docker Deployments](01-non-production/00-deploying-local.md)

### Cluster 部署

Cluster 模式专为更大规模的部署而设计，并提供增强的功能。在 Databend 集群中，建议至少有三个 Meta 节点，形成一个 Meta 集群，以确保高可用性和容错能力。对于生产目的，Databend 建议使用由三到五个 Meta 节点组成的 Meta 集群。

在 Databend 集群中，可以部署多个 Query 节点，并且可以通过将特定的 Query 节点分组在一起（使用 Cluster ID）来创建更强大的 Query 集群，以满足不同的查询性能需求。一个 Databend 集群有能力容纳多个 Query 集群。默认情况下，Databend 会最大限度地利用计算并发性，允许单个 SQL 查询利用单个 Query 节点中的所有可用 CPU 核心。但是，当使用 Query 集群时，Databend 会利用并发调度并在整个集群中执行计算。这种方法最大限度地提高了系统性能并提供了增强的计算能力。

<img src="/img/deploy/deploy-cluster-arch.png"/>

#### Query 集群大小

对于 Query 集群，Databend 没有特定的最佳实践或推荐的节点数量。Query 集群中的节点数量可以根据您的具体需求和工作负载而变化。

Query 集群的主要目标是确保查询处理速度满足您的需求并提供最佳性能。可以相应地调整集群中的节点数量，以实现所需的查询性能和吞吐量。

#### 租户管理

租户是指利用系统提供的服务或资源的实体或组织。在 Databend 中，租户与唯一的租户 ID 相关联，该 ID 用作在 Databend 中区分和管理其数据、用户和资源的标识符。

对于 Query 集群，当 Query 节点收到 SQL 请求时，计算工作负载会在共享相同租户 ID 和集群 ID 的 Query 节点之间有效地分配。请注意，具有相同租户 ID 但不同集群 ID 的 Query 节点提供了一种工作负载隔离机制，同时仍然共享相同的数据和用户列表。

![Alt text](/img/deploy/tenantid.PNG)

## 部署环境

本主题提供有关 Databend 节点的推荐硬件规格和支持的对象存储平台的信息。

### 硬件建议

<LanguageDocs

cn=
'

Databend 节点可以部署在本地服务器或云端。Databend 兼容各种公共云平台，如 Amazon EC2、Azure VM、腾讯云和阿里云。下表列出了运行 Databend 节点的服务器的推荐硬件规格：

'

en=
'

Databend nodes can be deployed either on-premises servers or in the cloud. Databend is compatible with various public cloud platforms, such as Amazon EC2 and Azure VMs.

The table below outlines the recommended hardware specifications for servers running Databend nodes:

'/>

| Hardware Specification | Standalone Mode   | Cluster Mode (Meta Node) | Cluster Mode (Query Node) |
| ---------------------- | ----------------- | ------------------------ | ------------------------- |
| CPU                    | 16-cores or above | 4-cores or above         | 16-cores or above         |
| Memory                 | 32 GB or above    | 16 GB or above           | 32 GB or above            |
| Data Disk (SSD)        | 200-600 GB        | 100-200 GB               | 100-200 GB                |
| Network Interface Card | 10 Gbps or above  | 10 Gbps or above         | 10 Gbps or above          |

### 支持的对象存储

Databend 支持私有化部署和云对象存储解决方案。在部署 Databend 之前，请准备好您自己的对象存储。以下是支持的对象存储解决方案的列表：

- Amazon S3
- Azure Blob Storage
- Google Cloud Storage
- MinIO
- Ceph
- Wasabi
- SeaweedFS
- Cloudflare R2

<LanguageDocs
cn=
'

- 腾讯 COS
- 阿里云 OSS
- 青云 QingStor
- 华为 OBS

'/>
