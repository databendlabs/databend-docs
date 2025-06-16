---
title: 部署 Databend 集群
sidebar_label: 部署 Databend 集群
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<!-- import LanguageFileParse from '@site/src/components/LanguageDocs/file-parse'
import VideoCN from '@site/docs/fragment/10-metasrv-deploy-cnvideo.md' -->

Databend 建议在生产环境中部署至少包含三个 meta 节点和一个 query 节点的集群。为了更好地理解 Databend 集群的部署，请参考 [了解 Databend 部署模式](../00-understanding-deployment-modes.md)，这将帮助您熟悉相关概念。本主题旨在为部署 Databend 集群提供实用的指南。

## 准备工作

在开始之前，请确保您已完成以下准备工作：

- 规划您的部署。本主题基于以下集群部署计划，包括设置一个包含三个 meta 节点的 meta 集群和一个包含两个 query 节点的 query 集群：

| 节点 #  | IP 地址         | Leader Meta 节点？ | Tenant ID | Cluster ID |
| ------- | ----------------- | ----------------- | --------- | ---------- |
| Meta-1  | 172.16.125.128/24 | 是                | -         | -          |
| Meta-2  | 172.16.125.129/24 | 否                | -         | -          |
| Meta-3  | 172.16.125.130/24 | 否                | -         | -          |
| Query-1 | 172.16.125.131/24 | -                 | default   | default    |
| Query-2 | 172.16.125.132/24 | -                 | default   | default    |

- 下载最新的 Databend 安装包并解压到每个节点。

```shell title='示例:'
root@meta-1:/usr# mkdir databend && cd databend
root@meta-1:/usr/databend# curl -O https://repo.databend.com/databend/v1.2.410/databend-v1.2.410-aarch64-unknown-linux-gnu.tar.gz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  333M  100  333M    0     0  18.5M      0  0:00:18  0:00:18 --:--:-- 16.4M
root@meta-1:/usr/databend# tar -xzvf databend-v1.2.410-aarch64-unknown-linux-gnu.tar.gz
```

## 步骤 1：部署 Meta 节点

1. 在每个 meta 节点中配置 [databend-meta.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 文件：

   - 确保 [raft_config] 中的 **id** 参数设置为唯一值。
   - 对于 leader meta 节点，将 **single** 参数设置为 _true_。
   - 对于 follower meta 节点，使用 # 符号注释掉 **single** 参数，然后添加一个名为 **join** 的参数，并提供其他 meta 节点的 IP 地址数组作为其值。

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
admin_api_address       = "0.0.0.0:28002"
grpc_api_address        = "0.0.0.0:9191"
# databend-query fetch this address to update its databend-meta endpoints list,
# in case databend-meta cluster changes.
grpc_api_advertise_host = "172.16.125.128"

[raft_config]
id            = 1
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28103

# Assign raft_{listen|advertise}_host in test config.
# This allows you to catch a bug in unit tests when something goes wrong in raft meta nodes communication.
raft_listen_host = "172.16.125.128"
raft_advertise_host = "172.16.125.128"

# Start up mode: single node cluster
single        = true
```

  </TabItem>
  <TabItem value="Meta-2" label="Meta-2">

```toml title="databend-meta.toml"
log_dir                 = "/var/log/databend"
admin_api_address       = "0.0.0.0:28002"
grpc_api_address        = "0.0.0.0:9191"
# databend-query fetch this address to update its databend-meta endpoints list,
# in case databend-meta cluster changes.
grpc_api_advertise_host = "172.16.125.129"

[raft_config]
id            = 2
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28103

# Assign raft_{listen|advertise}_host in test config.
# This allows you to catch a bug in unit tests when something goes wrong in raft meta nodes communication.
raft_listen_host = "172.16.125.129"
raft_advertise_host = "172.16.125.129"

# Start up mode: single node cluster
# single        = true
join            = ["172.16.125.128:28103", "172.16.125.130:28103"]
```

  </TabItem>
  <TabItem value="Meta-3" label="Meta-3">

```toml title="databend-meta.toml"
log_dir                 = "/var/log/databend"
admin_api_address       = "0.0.0.0:28002"
grpc_api_address        = "0.0.0.0:9191"
# databend-query fetch this address to update its databend-meta endpoints list,
# in case databend-meta cluster changes.
grpc_api_advertise_host = "172.16.125.130"

[raft_config]
id            = 3
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28103

# Assign raft_{listen|advertise}_host in test config.
# This allows you to catch a bug in unit tests when something goes wrong in raft meta nodes communication.
raft_listen_host = "172.16.125.130"
raft_advertise_host = "172.16.125.130"

# Start up mode: single node cluster
# single        = true
join            = ["172.16.125.128:28103", "172.16.125.129:28103"]
```

  </TabItem>
</Tabs>

2. 要启动 meta 节点，请在每个节点上运行以下脚本：从 leader 节点 (Meta-1) 开始，然后依次启动 follower 节点。

```shell
cd .. && cd bin
./databend-meta -c ../configs/databend-meta.toml > meta.log 2>&1 &
```

3. 启动所有 meta 节点后，您可以使用以下 curl 命令检查它们：

```shell
curl 172.16.125.128:28002/v1/cluster/nodes
[{"name":"1","endpoint":{"addr":"172.16.125.128","port":28103},"grpc_api_advertise_address":"172.16.125.128:9191"},{"name":"2","endpoint":{"addr":"172.16.125.129","port":28103},"grpc_api_advertise_address":"172.16.125.129:9191"},{"name":"3","endpoint":{"addr":"172.16.125.130","port":28103},"grpc_api_advertise_address":"172.16.125.130:9191"}]
```

## 步骤 2：部署 Query 节点

1. 在每个 query 节点中配置 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 文件。以下列表仅包含您需要在每个 query 节点中设置的参数，以反映本文档中概述的部署计划。

   - 根据部署计划设置 tenant ID 和 cluster ID。
   - 将 **endpoints** 参数设置为 meta 节点的 IP 地址数组。

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
# It is a list of `grpc_api_advertise_host:<grpc-api-port>` of databend-meta config
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
# It is a list of `grpc_api_advertise_host:<grpc-api-port>` of databend-meta config
endpoints = ["172.16.125.128:9191","172.16.125.129:9191","172.16.125.130:9191"]
...
```

  </TabItem>
</Tabs>

2. 对于每个 query 节点，您还需要在 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 文件中配置对象存储和管理用户。有关详细说明，请参见 [此处](../01-non-production/01-deploying-databend.md#deploying-a-query-node)。

3. 在每个 query 节点上运行以下脚本以启动它们：

```shell
cd .. && cd bin
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

## 步骤 3：验证部署

使用 [BendSQL](/guides/sql-clients/bendsql/) 连接到其中一个 query 节点，并检索有关现有 query 节点的信息：


```shell
bendsql -h 172.16.125.131
Welcome to BendSQL 0.16.0-homebrew.
Connecting to 172.16.125.131:8000 as user root.
Connected to Databend Query v1.2.410-4b8cd16f0c(rust-1.77.0-nightly-2024-04-08T12:21:53.785045868Z)

root@172.16.125.131:8000/default> SELECT * FROM system.clusters;

SELECT
  *
FROM
  system.clusters

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│          name          │ cluster │      host      │  port  │                                 version                                 │
├────────────────────────┼─────────┼────────────────┼────────┼─────────────────────────────────────────────────────────────────────────┤
│ 7rwadq5otY2AlBDdT25QL4 │ default │ 172.16.125.132 │   9090 │ v1.2.410-4b8cd16f0c(rust-1.77.0-nightly-2024-04-08T12:21:53.785045868Z) │
│ cH331pYsoFmvMSZXKRrn2  │ default │ 172.16.125.131 │   9090 │ v1.2.410-4b8cd16f0c(rust-1.77.0-nightly-2024-04-08T12:21:53.785045868Z) │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
2 rows read in 0.031 sec. Processed 2 rows, 327 B (64.1 rows/s, 10.23 KiB/s)
```

## Next Steps

在部署 Databend 之后，您可能需要了解以下主题：

- [Load & Unload Data](/guides/load-data): 管理 Databend 中的数据导入/导出。
- [Visualize](/guides/visualize): 将 Databend 与可视化工具集成以获得见解。

<!-- <LanguageFileParse
cn={<VideoCN />}
/> -->
