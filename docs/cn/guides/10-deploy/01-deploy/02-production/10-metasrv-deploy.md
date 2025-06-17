---
title: 部署 Databend 集群
sidebar_label: 部署 Databend 集群
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Databend 建议在生产环境中部署至少包含三个元节点（Meta Node）和一个查询节点（Query Node）的集群。要深入了解 Databend 集群部署，请参阅[理解 Databend 部署模式](../00-understanding-deployment-modes.md)，该文档将帮助您掌握相关概念。本文旨在提供部署 Databend 集群的实践指南。

## 准备工作

开始前请确保完成以下准备：

- 规划部署方案。本文基于以下集群部署计划：包含三个元节点的元集群和两个查询节点组成的查询集群：

| Node #  | IP Address        | Leader Meta Node? | Tenant ID | Cluster ID |
| ------- | ----------------- | ----------------- | --------- | ---------- |
| Meta-1  | 172.16.125.128/24 | 是                | -         | -          |
| Meta-2  | 172.16.125.129/24 | 否                | -         | -          |
| Meta-3  | 172.16.125.130/24 | 否                | -         | -          |
| Query-1 | 172.16.125.131/24 | -                 | default   | default    |
| Query-2 | 172.16.125.132/24 | -                 | default   | default    |

- 在每个节点下载并解压最新 Databend 安装包：

```shell title='示例：'
root@meta-1:/usr# mkdir databend && cd databend
root@meta-1:/usr/databend# curl -O https://repo.databend.cn/databend/v1.2.410/databend-v1.2.410-aarch64-unknown-linux-gnu.tar.gz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  333M  100  333M    0     0  18.5M      0  0:00:18  0:00:18 --:--:-- 16.4M
root@meta-1:/usr/databend# tar -xzvf databend-v1.2.410-aarch64-unknown-linux-gnu.tar.gz
```

## 步骤一：部署元节点

1. 在每个元节点配置 [databend-meta.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 文件：

   - 确保 [raft_config] 中的 **id** 参数值唯一
   - Leader 元节点将 **single** 参数设为 _true_
   - Follower 元节点用 # 注释 **single** 参数，添加 **join** 参数并填入其他元节点 IP 地址数组

| 参数                    | Meta-1         | Meta-2                                          | Meta-3                                          |
| ----------------------- | -------------- | ----------------------------------------------- | ----------------------------------------------- |
| grpc_api_advertise_host | 172.16.125.128 | 172.16.125.129                                  | 172.16.125.130                                  |
| id                      | 1              | 2                                               | 3                                               |
| raft_listen_host        | 172.16.125.128 | 172.16.125.129                                  | 172.16.125.130                                  |
| raft_advertise_host     | 172.16.125.128 | 172.16.125.129                                  | 172.16.125.130                                  |
| single                  | true           | /                                               | /                                               |
| join                    | /              | ["172.16.125.128:28004","172.16.125.130:28004"] | ["172.16.125.128:28004","172.16.125.129:28004"] |

```shell
cd configs && nano databend-meta.toml
```

<Tabs>
  <TabItem value="Meta-1" label="Meta-1" default>

```toml title="databend-meta.toml"
log_dir                 = "/var/log/databend"
admin_api_address       = "0.0.0.0:28002"
grpc_api_address        = "0.0.0.0:9191"
# databend-query 通过此地址更新元节点端点列表
# 以应对元集群变更
grpc_api_advertise_host = "172.16.125.128"

[raft_config]
id            = 1
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28004

# 测试配置中显式声明 raft_{listen|advertise}_host
# 便于单元测试中定位元节点通信问题
raft_listen_host = "172.16.125.128"
raft_advertise_host = "172.16.125.128"

# 启动模式：单节点集群
single        = true
```

  </TabItem>
  <TabItem value="Meta-2" label="Meta-2">

```toml title="databend-meta.toml"
log_dir                 = "/var/log/databend"
admin_api_address       = "0.0.0.0:28002"
grpc_api_address        = "0.0.0.0:9191"
# databend-query 通过此地址更新元节点端点列表
# 以应对元集群变更
grpc_api_advertise_host = "172.16.125.129"

[raft_config]
id            = 2
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28004

# 测试配置中显式声明 raft_{listen|advertise}_host
# 便于单元测试中定位元节点通信问题
raft_listen_host = "172.16.125.129"
raft_advertise_host = "172.16.125.129"

# 启动模式：单节点集群
# single        = true
join            = ["172.16.125.128:28004", "172.16.125.130:28004"]
```

  </TabItem>
  <TabItem value="Meta-3" label="Meta-3">

```toml title="databend-meta.toml"
log_dir                 = "/var/log/databend"
admin_api_address       = "0.0.0.0:28002"
grpc_api_address        = "0.0.0.0:9191"
# databend-query 通过此地址更新元节点端点列表
# 以应对元集群变更
grpc_api_advertise_host = "172.16.125.130"

[raft_config]
id            = 3
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28004

# 测试配置中显式声明 raft_{listen|advertise}_host
# 便于单元测试中定位元节点通信问题
raft_listen_host = "172.16.125.130"
raft_advertise_host = "172.16.125.130"

# 启动模式：单节点集群
# single        = true
join            = ["172.16.125.128:28004", "172.16.125.129:28004"]
```

  </TabItem>
</Tabs>

2. 在每个节点执行以下脚本启动元节点，按顺序先启动 Leader 节点（Meta-1）再启动 Follower 节点：

```shell
cd .. && cd bin
./databend-meta -c ../configs/databend-meta.toml > meta.log 2>&1 &
```

3. 所有元节点启动后，使用 curl 命令验证：

```shell
curl 172.16.125.128:28002/v1/cluster/nodes
[{"name":"1","endpoint":{"addr":"172.16.125.128","port":28004},"grpc_api_advertise_address":"172.16.125.128:9191"},{"name":"2","endpoint":{"addr":"172.16.125.129","port":28004},"grpc_api_advertise_address":"172.16.125.129:9191"},{"name":"3","endpoint":{"addr":"172.16.125.130","port":28004},"grpc_api_advertise_address":"172.16.125.130:9191"}]
```

## 步骤二：部署查询节点

1. 在每个查询节点配置 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 文件，以下为根据本文部署方案需设置的参数：

   - 按部署计划设置租户 ID（Tenant ID）和集群 ID（Cluster ID）
   - 将 **endpoints** 参数设为元节点 IP 地址数组

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
# 元节点配置中 `grpc_api_advertise_host:<grpc-api-port>` 的列表
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
# 元节点配置中 `grpc_api_advertise_host:<grpc-api-port>` 的列表
endpoints = ["172.16.125.128:9191","172.16.125.129:9191","172.16.125.130:9191"]
...
```

  </TabItem>
</Tabs>

2. 每个查询节点还需在 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 中配置对象存储和管理员用户，详见[此文档](../01-non-production/01-deploying-databend.md#部署查询节点)。

3. 在每个查询节点执行启动脚本：

```shell
cd .. && cd bin
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

## 步骤三：验证部署

通过 [BendSQL](/guides/sql-clients/bendsql/) 连接任一查询节点，检索现有节点信息：

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

## 后续步骤

部署完成后，您可能需要了解以下主题：

- [数据导入导出](/guides/load-data)：管理 Databend 数据导入/导出
- [可视化分析](/guides/visualize)：将 Databend 与可视化工具集成

<!-- <LanguageFileParse
cn={<VideoCN />}
/> -->