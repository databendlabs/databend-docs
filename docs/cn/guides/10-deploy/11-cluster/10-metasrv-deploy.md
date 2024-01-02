---
title: 部署 Databend 集群
sidebar_label: 部署 Databend 集群
description: 
  部署 Databend 集群
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Databend 建议在生产环境中至少部署三个元数据节点和一个查询节点的集群。要更好地理解 Databend 集群部署，请参阅[理解 Databend 部署](../00-understanding-deployment-modes.md)，它将帮助您熟悉相关概念。本主题旨在提供部署 Databend 集群的实用指南。

## 开始之前

在开始之前，请确保您已完成以下准备工作：

- 规划您的部署。本文档基于以下集群部署计划，涉及设置由三个元数据节点组成的元数据集群和由两个查询节点组成的查询集群：

| 节点 #  	| IP 地址      	| 是否为领导元数据节点？	| 租户 ID 	| 查询集群 ID 	|
|---------	|---------------	|-----------------------	|-----------	|--------------	|
| Meta-1  	| 192.168.1.100 	| 是                    	| -         	| -            	|
| Meta-2  	| 192.168.1.101 	| 否                    	| -         	| -            	|
| Meta-3  	| 192.168.1.102 	| 否                    	| -         	| -            	|
| Query-1 	| 192.168.1.10  	| -                     	| default   	| default      	|
| Query-2 	| 192.168.1.20  	| -                     	| default   	| default      	|

- [下载](/download) Databend 包并根据您的部署计划将其解压到您准备好的每台服务器上。

## 步骤 1: 部署元数据集群

1. 在每个元数据节点中配置文件 **databend-meta.toml**。配置每个节点时请注意以下事项：

    - 确保每个节点的 **id** 参数设置为唯一值。

    - 对于领导元数据节点，将 **single** 参数设置为 *true*。

    - 对于追随者元数据节点，使用 # 符号注释掉 **single** 参数，然后添加 **join** 设置，并提供其他元数据节点的 IP 地址数组作为其值。

<Tabs>
  <TabItem value="Meta-1" label="Meta-1" default>

```toml title="databend-meta.toml"
log_dir                 = "/var/log/databend"
admin_api_address       = "0.0.0.0:28101"
grpc_api_address        = "0.0.0.0:9191"
# databend-query 从此地址获取更新，以便在 databend-meta 集群变更时更新其元数据端点列表。
grpc_api_advertise_host = "192.168.1.100"

[raft_config]
id            = 1
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28103

# 在测试配置中分配 raft_{listen|advertise}_host。
# 这允许您在 raft 元数据节点通信出现问题时在单元测试中捕获错误。
raft_listen_host = "192.168.1.100"
raft_advertise_host = "192.168.1.100"

# 启动模式：单节点集群
single        = true
```
  </TabItem>
  <TabItem value="Meta-2" label="Meta-2">

```toml title="databend-meta.toml"
log_dir                 = "/var/log/databend"
admin_api_address       = "0.0.0.0:28101"
grpc_api_address        = "0.0.0.0:9191"
# databend-query 从此地址获取更新，以便在 databend-meta 集群变更时更新其元数据端点列表。
grpc_api_advertise_host = "192.168.1.101"

[raft_config]
id            = 2
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28103

# 在测试配置中分配 raft_{listen|advertise}_host。
# 这允许您在 raft 元数据节点通信出现问题时在单元测试中捕获错误。
raft_listen_host = "192.168.1.101"
raft_advertise_host = "192.168.1.101"

# 启动模式：单节点集群
# single        = true
join            =["192.168.1.100:28103","192.168.1.102:28103"]
```
  </TabItem>
  <TabItem value="Meta-3" label="Meta-3">

```toml title="databend-meta.toml"
log_dir                 = "/var/log/databend"
admin_api_address       = "0.0.0.0:28101"
grpc_api_address        = "0.0.0.0:9191"
# databend-query 从此地址获取更新，以便在 databend-meta 集群变更时更新其元数据端点列表。
grpc_api_advertise_host = "192.168.1.102"

[raft_config]
id            = 3
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28103

# 在测试配置中分配 raft_{listen|advertise}_host。
# 这允许您在 raft 元数据节点通信出现问题时在单元测试中捕获错误。
raft_listen_host = "192.168.1.102"
raft_advertise_host = "192.168.1.102"

# 启动模式：单节点集群
# single        = true
join            =["192.168.1.100:28103","192.168.1.101:28103"]
```
  </TabItem>
</Tabs>

2. 在每个节点上运行以下脚本以启动元数据节点：首先启动领导节点（Meta-1），然后按顺序启动追随者节点。

```shell
./databend-meta -c ./databend-meta.toml > meta.log 2>&1 &
```

3. 所有元数据节点启动后，您可以使用以下 curl 命令检查集群中的节点：

```shell
curl 192.168.1.100:28102/v1/cluster/nodes
```

## 步骤 2: 部署查询集群

1. 在每个查询节点中配置文件 **databend-query.toml**。以下列表仅包括您需要在每个查询节点中设置的参数，以反映本文档中概述的部署计划。

    - 根据部署计划设置租户 ID 和集群 ID。

    - 将 **endpoints** 参数设置为元数据节点的 IP 地址数组。

```toml title="databend-query.toml"
...

tenant_id = "default"
cluster_id = "default"

...

[meta]
# 这是 databend-meta 配置中的 `grpc_api_advertise_host:<grpc-api-port>` 列表
endpoints = ["192.168.1.100:9191","192.168.1.101:9191","192.168.1.102:9191"]
...
```

2. 对于每个查询节点，您还需要在文件 **databend-query.toml** 中配置对象存储。有关详细说明，请参阅[部署查询节点](../01-deploying-databend.md#deploying-a-query-node)。

3. 在每个查询节点上运行以下脚本以启动它们：

```shell
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

## 下一步

部署 Databend 后，您可能需要了解以下主题：

- [管理设置](/sql/sql-reference/manage-settings)：根据您的需求优化 Databend。
- [加载与卸载数据](/guides/load-data)：管理 Databend 中的数据导入/导出。
- [可视化](/guides/visualize)：将 Databend 与可视化工具集成，以获得洞察力。