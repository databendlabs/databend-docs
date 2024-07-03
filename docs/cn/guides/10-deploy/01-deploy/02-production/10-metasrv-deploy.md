---
title: 部署 Databend 集群
sidebar_label: 部署 Databend 集群
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Databend 建议在生产环境中部署至少包含三个元数据节点和一个查询节点的集群。为了更好地理解 Databend 集群部署，请参阅 [理解 Databend 部署模式](../00-understanding-deployment-modes.md)，这将帮助您熟悉相关概念。本文旨在提供一个实用的指南，指导您部署 Databend 集群。

## 开始之前

在开始之前，请确保已完成以下准备工作：

- 规划您的部署。本主题基于以下集群部署计划，该计划涉及设置一个包含三个元数据节点的元数据集群和一个包含两个查询节点的查询集群：

| 节点编号 | IP 地址           | 是否为领导者元数据节点 | 租户 ID | 集群 ID |
| -------- | ----------------- | ---------------------- | ------- | ------- |
| Meta-1   | 172.16.125.128/24 | 是                     | -       | -       |
| Meta-2   | 172.16.125.129/24 | 否                     | -       | -       |
| Meta-3   | 172.16.125.130/24 | 否                     | -       | -       |
| Query-1  | 172.16.125.131/24 | -                      | default | default |
| Query-2  | 172.16.125.132/24 | -                      | default | default |

- 下载并解压最新版本的 Databend 包到每个节点。

```shell title='示例：'
root@meta-1:/usr# mkdir databend && cd databend
root@meta-1:/usr/databend# curl -O https://repo.databend.com/databend/v1.2.410/databend-v1.2.410-aarch64-unknown-linux-gnu.tar.gz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  333M  100  333M    0     0  18.5M      0  0:00:18  0:00:18 --:--:-- 16.4M
root@meta-1:/usr/databend# tar -xzvf databend-v1.2.410-aarch64-unknown-linux-gnu.tar.gz
```

## 步骤 1：部署元数据节点

1. 在每个元数据节点上配置文件 [databend-meta.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml)：

   - 确保 [raft_config] 中的 **id** 参数设置为唯一值。
   - 对于领导者元数据节点，将 **single** 参数设置为 _true_。
   - 对于跟随者元数据节点，使用 # 符号注释掉 **single** 参数，然后添加一个名为 **join** 的参数，并将其值设置为其他元数据节点的 IP 地址数组。

| 参数                    | Meta-1         | Meta-2                                          | Meta-3                                          |
| ----------------------- | -------------- | ----------------------------------------------- | ----------------------------------------------- |
| grpc_api_advertise_host | 172.16.125.128 | 172.16.125.129                                  | 172.16.125.130                                  |
| id                      | 1              | 2                                               | 3                                               |
| raft_listen_host        | 172.16.125.128 | 172.16.125.129                                  | 172.16.125.130                                  |
| raft_advertise_host     | 172.16.125.128 | 172.16.125.129                                  | 172.16.125.130                                  |
| single                  | true           | /                                               | /                                               |
| join                    | /              | ["172.16.125.128:28103","172.16.125.130:28103"] | ["172.16.125.128:28103","172.16.125.129:28103"] |

```shell
cd configs && nano databend-meta.toml
```

<Tabs>
  <TabItem value="Meta-1" label="Meta-1" default>

```toml title="databend-meta.toml"
log_dir                 = "/var/log/databend"
admin_api_address       = "0.0.0.0:28101"
grpc_api_address        = "0.0.0.0:9191"
# databend-query 获取此地址以更新其 databend-meta 端点列表，
# 以防 databend-meta 集群发生变化。
grpc_api_advertise_host = "172.16.125.128"

[raft_config]
id            = 1
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28103

# 在测试配置中分配 raft_{listen|advertise}_host。
# 这允许您在单元测试中捕获 raft 元数据节点通信出错时的错误。
raft_listen_host = "172.16.125.128"
raft_advertise_host = "172.16.125.128"

# 启动模式：单节点集群
single        = true
```

  </TabItem>
  <TabItem value="Meta-2" label="Meta-2">

```toml title="databend-meta.toml"
log_dir                 = "/var/log/databend"
admin_api_address       = "0.0.0.0:28101"
grpc_api_address        = "0.0.0.0:9191"
# databend-query 获取此地址以更新其 databend-meta 端点列表，
# 以防 databend-meta 集群发生变化。
grpc_api_advertise_host = "172.16.125.129"

[raft_config]
id            = 2
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28103

# 在测试配置中分配 raft_{listen|advertise}_host。
# 这允许您在单元测试中捕获 raft 元数据节点通信出错时的错误。
raft_listen_host = "172.16.125.129"
raft_advertise_host = "172.16.125.129"

# 启动模式：单节点集群
# single        = true
join            = ["172.16.125.128:28103", "172.16.125.130:28103"]
```

  </TabItem>
  <TabItem value="Meta-3" label="Meta-3">

```toml title="databend-meta.toml"
log_dir                 = "/var/log/databend"
admin_api_address       = "0.0.0.0:28101"
grpc_api_address        = "0.0.0.0:9191"
# databend-query 获取此地址以更新其 databend-meta 端点列表，
# 以防 databend-meta 集群发生变化。
grpc_api_advertise_host = "172.16.125.130"

[raft_config]
id            = 3
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28103

# 在测试配置中分配 raft_{listen|advertise}_host。
# 这允许您在单元测试中捕获 raft 元数据节点通信出错时的错误。
raft_listen_host = "172.16.125.130"
raft_advertise_host = "172.16.125.130"

# 启动模式：单节点集群
# single        = true
join            = ["172.16.125.128:28103", "172.16.125.129:28103"]
```

  </TabItem>
</Tabs>

2. 在每个节点上运行以下脚本来启动元数据节点：先从领导者节点（Meta-1）开始，然后按顺序启动跟随者节点。

```shell
cd .. && cd bin
./databend-meta -c ../configs/databend-meta.toml > meta.log 2>&1 &
```

3. 所有元数据节点启动后，您可以使用以下 curl 命令检查它们：

```shell
curl 172.16.125.128:28101/v1/cluster/nodes
[{"name":"1","endpoint":{"addr":"172.16.125.128","port":28103},"grpc_api_advertise_address":"172.16.125.128:9191"},{"name":"2","endpoint":{"addr":"172.16.125.129","port":28103},"grpc_api_advertise_address":"172.16.125.129:9191"},{"name":"3","endpoint":{"addr":"172.16.125.130","port":28103},"grpc_api_advertise_address":"172.16.125.130:9191"}]
```

## 步骤 2：部署查询节点

1. 在每个查询节点上配置文件 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml)。以下列表仅包括您需要在每个查询节点上设置的参数，以反映本文档中概述的部署计划。

   - 根据部署计划设置租户 ID 和集群 ID。
   - 将 **endpoints** 参数设置为元数据节点的 IP 地址数组。

| 参数       | Query-1 / Query-2                                                   |
| ---------- | ------------------------------------------------------------------- |
| tenant_id  | default                                                             |
| cluster_id | default                                                             |
| endpoints  | ["172.16.125.128:9191","172.16.125.129:9191","172.16.125.130:9191"] |

```shell
cd configs/
nano databend-query.toml
```

<Tabs>
  <TabItem value="Query-1" label="Query-1" default>

```toml title="databend-query.toml"
...

tenant_id = "default"
cluster_id = "default"

...

[meta]
# 这是 databend-meta 配置中 `grpc_api_advertise_host:<grpc-api-port>` 的列表
endpoints = ["172.16.125.128:9191","172.16.125.129:9191","172.16.125.130:9191"]
...
```

  </TabItem>
    <TabItem value="Query-2" label="Query-2">

```toml title="databend-query.toml"
...

tenant_id = "default"
cluster_id = "default"

...

[meta]
# 这是 databend-meta 配置中 `grpc_api_advertise_host:<grpc-api-port>` 的列表
endpoints = ["172.16.125.128:9191","172.16.125.129:9191","172.16.125.130:9191"]
...
```

  </TabItem>
</Tabs>

2. 对于每个查询节点，您还需要在文件 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 中配置对象存储和 admin 用户。有关详细说明，请参阅 [这里](../01-non-production/01-deploying-databend.md#deploying-a-query-node)。

3. 在每个查询节点上运行以下脚本来启动它们：

```shell
cd .. && cd bin
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

## 步骤 3：验证部署

使用 [BendSQL](/guides/sql-clients/bendsql/) 连接到其中一个查询节点，并检索现有查询节点的信息：

```shell
bendsql -h 172.16.125.131
欢迎使用 BendSQL 0.16.0-homebrew。
正在连接到 172.16.125.131:8000，用户为 root。
已连接到 Databend Query v1.2.410-4b8cd16f0c(rust-1.77.0-nightly-2024-04-08T12:21:53.785045868Z)

root@172.16.125.131:8000/default> SELECT * FROM system.clusters;

SELECT
  *
FROM
  system.clusters

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│          name          │ cluster │      host      │  port  │                                 version                                 │
├────────────────────────┼─────────┼────────────────┼────────┼─────────────────────────────────────────────────────────────────────────┤
│ 7rwadq5otY2AlBDdT25QL4 │ default │ 172.16.125.132 │   9091 │ v1.2.410-4b8cd16f0c(rust-1.77.0-nightly-2024-04-08T12:21:53.785045868Z) │
│ cH331pYsoFmvMSZXKRrn2  │ default │ 172.16.125.131 │   9091 │ v1.2.410-4b8cd16f0c(rust-1.77.0-nightly-2024-04-08T12:21:53.785045868Z) │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
2 行在 0.031 秒内读取。处理了 2 行，327 B (64.1 行/秒，10.23 KiB/秒)
```

## 下一步

部署 Databend 后，您可能需要了解以下主题：

- [加载与卸载数据](/guides/load-data)：在 Databend 中管理数据的导入/导出。
- [可视化](/guides/visualize)：将 Databend 与可视化工具集成以获取洞察。
