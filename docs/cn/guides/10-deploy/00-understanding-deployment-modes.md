---
title: 理解 Databend 部署
sidebar_label: 理解部署
description:
  描述 Databend 部署模式
---

## Databend 节点类型

在 Databend 部署中，使用了两种类型的节点：Meta 和 Query。

Meta 节点负责存储和管理各种类型的元数据。这包括与数据库、表和集群相关的信息。此外，Meta 节点处理用户信息，如授权和认证。它充当管理和组织元数据及用户相关数据的中心仓库。

另一方面，Query 节点专门用于处理查询。它负责执行用户查询，从底层存储中检索数据，并将结果返回给用户。Query 节点处理 Databend 的计算方面，确保高效和准确的查询处理。

请注意，当我们提到“节点”时，是指托管和运行 Databend 系统特定组件的单个服务器。每个节点，如 Meta 节点或 Query 节点，通常在处理数据和执行查询中服务于一个明确的目的。

## 部署模式

Databend 部署提供两种模式：独立和集群，每种模式都有不同的应用场景和节点配置。

### 独立部署

在独立模式中，标准配置包括一个 Meta 节点和一个 Query 节点。这种最小设置适用于测试目的或小规模部署。然而，重要的是要注意，由于其有限的可扩展性和缺乏高可用性特性，不推荐将独立模式用于生产环境。

<img src="/img/deploy/deploy-standalone-arch.png"/>

在独立 Databend 部署中，可以在单个服务器上托管 Meta 和 Query 节点。以下文档主题帮助您设置和部署独立 Databend：

- [部署独立 Databend](01-deploying-databend.md)
- [本地和 Docker 部署](03-deploying-local.md)

### 集群部署

集群模式设计用于更大规模的部署，并提供增强的能力。在 Databend 集群中，建议至少有三个 Meta 节点，形成 Meta 集群以确保高可用性和容错能力。对于生产目的，Databend 建议 Meta 集群由三到五个 Meta 节点组成。

在 Databend 集群中，可以部署多个 Query 节点，并且可以通过将特定的 Query 节点组合在一起（使用 Cluster ID）来创建更强大的 Query 集群，以满足不同的查询性能要求。Databend 集群有能力容纳多个 Query 集群。默认情况下，Databend 将计算并发性发挥到最大潜力，允许单个 SQL 查询使用单个 Query 节点内的所有可用 CPU 核心。然而，当使用 Query 集群时，Databend 利用并发调度，并在整个集群中执行计算。这种方法最大化了系统性能并提供了增强的计算能力。

<img src="/img/deploy/deploy-cluster-arch.png"/>

#### Query 集群大小

Databend 没有为 Query 集群的节点数量提供特定的最佳实践或推荐。Query 集群中的节点数量可以根据您的具体要求和工作负载而变化。

Query 集群的主要目标是确保查询处理速度满足您的需求并提供最佳性能。可以相应地调整集群中的节点数量，以实现所需的查询性能和吞吐量。

#### 租户管理

租户是指使用系统提供的服务或资源的实体或组织。在 Databend 中，租户与唯一的租户 ID 相关联，该 ID 用作区分和管理其在 Databend 中的数据、用户和资源的标识符。

在查询集群的情况下，当查询节点接收到 SQL 请求时，计算工作负载会在共享相同租户 ID 和集群 ID 的查询节点之间有效分配。请注意，具有相同租户 ID 但不同集群 ID 的查询节点提供了一种在共享相同数据和用户列表的同时实现工作负载隔离的机制。

![Alt text](@site/docs/public/img/deploy/tenantid.PNG)

## 部署环境

本主题提供了有关 Databend 节点推荐硬件规格和支持的对象存储平台的信息。

### 硬件推荐

Databend 节点可以部署在本地服务器或云中。Databend 与各种公共云平台兼容，如 Amazon EC2、Azure VMs、腾讯云和阿里巴巴云。下表概述了运行 Databend 节点的服务器推荐硬件规格：

| 硬件规格                  	| 独立模式          	| 集群模式 (Meta 节点) 	| 集群模式 (Query 节点) 	|
|-------------------------	|------------------	|--------------------------	|---------------------------	|
| CPU                     	| 16 核或以上      	| 4 核或以上              	| 16 核或以上               	|
| 内存                     	| 32 GB 或以上     	| 16 GB 或以上            	| 32 GB 或以上             	|
| 数据磁盘 (SSD)            | 200-600 GB       	| 100-200 GB               	| 100-200 GB                	|
| 网络接口卡               	| 10 Gbps 或以上   	| 10 Gbps 或以上          	| 10 Gbps 或以上           	|

### 支持的对象存储

Databend 支持自托管和云对象存储解决方案。在部署 Databend 之前准备好您自己的对象存储。以下是支持的对象存储解决方案列表：

- Amazon S3
- Azure Blob Storage
- Google Cloud Storage
- MinIO
- Ceph
- Wasabi
- SeaweedFS
- Cloudflare R2
- 腾讯 COS
- 阿里巴巴 OSS
- 青云 QingStor