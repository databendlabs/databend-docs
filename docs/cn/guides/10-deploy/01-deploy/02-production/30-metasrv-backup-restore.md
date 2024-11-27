---
title: 备份和恢复 Databend Meta 服务集群
sidebar_label: 备份和恢复 Meta 服务
description: 如何备份和恢复 Meta 服务集群数据
---

本指南将介绍如何备份和恢复 Meta 服务集群数据。

## 从 databend-meta 导出数据

支持从 databend-meta 数据目录或正在运行的 databend-meta 服务器导出数据。由于 Raft 将数据复制到所有节点，因此从任何一个节点导出数据就足够了。

### 从正在运行的 databend-meta 导出

类似于从数据目录导出，但使用服务端点参数 `--grpc-api-address <ip:port>` 代替 `--raft-dir`，其中 `<ip:port>` 是 [databend-meta.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 中的 `grpc_api_address`，例如：

```shell
databend-metactl export --grpc-api-address "127.0.0.1:9191" --db <output_fn>

# tail "<output_fn>"
# ["state_machine/0",{"Nodes":{"key":2,"value":{"name":"","endpoint":{"addr":"localhost","port":28203}}}}]
# ...
```

### 从数据目录导出

关闭 `databend-meta` 服务。

然后从 `databend-meta` 存储元数据的目录（`<your_meta_dir>`）导出数据到本地文件 `output_fn`，格式为多行 JSON。例如，输出文件中的每一行都是一个导出的键值记录的 JSON。

```sh

databend-metactl export --raft-dir "<your_meta_dir>" --db <output_fn>

# tail "<output_fn>"
# ["state_machine/0",{"Nodes":{"key":2,"value":{"name":"","endpoint":{"addr":"localhost","port":28203}}}}]
# ["state_machine/0",{"Nodes":{"key":3,"value":{"name":"","endpoint":{"addr":"localhost","port":28303}}}}]
# ["state_machine/0",{"StateMachineMeta":{"key":"LastApplied","value":{"LogId":{"term":1,"index":378}}}}]
# ["state_machine/0",{"StateMachineMeta":{"key":"Initialized","value":{"Bool":true}}}]
# ...
```

注意：如果没有 `--db` 参数，导出的数据将输出到标准输出。

## 恢复 databend-meta

要恢复 databend-meta 节点，请使用以下命令。

```sh
databend-metactl import --raft-dir "<your_meta_dir>" --db <output_fn>

# 然后可以启动 databend-meta 节点。
# databend-meta --raft-dir "<your_meta_dir>" ...
```

注意：如果没有 `--db` 参数，导入数据将来自标准输入，例如：

```sh
cat "<output_fn>" | databend-metactl import --raft-dir "<your_meta_dir>"
```

请注意，备份数据包含节点 ID，因此需要确保备份数据中的节点 ID 与恢复的 databend-meta 节点中的节点 ID 一致。要恢复不同的节点，即使用节点 1 的备份数据恢复节点 2，您需要在导入时指定集群配置，请参见下一节。

**注意**：导入时 `<your_meta_dir>` 中的数据将被清除。

## 将数据导入为新的 databend-meta 集群

使用 `--initial-cluster` 参数，`databend-metactl` 将导入数据并重新初始化集群信息和节点 ID。`--initial-cluster` 值的格式为：`<node_id>=<raft_advertise_host>:<raft_api_port`，`raft_advertise_host` 和 `raft_api_port` 与 toml 配置文件中的字段相同。

例如，要恢复一个包含三个节点的 databend-meta 集群：

```
databend-metactl import --raft-dir ./.databend/new_meta1 --db meta.db \
    --id=1 \
    --initial-cluster 1=localhost:29103 \
    --initial-cluster 2=localhost:29203 \
    --initial-cluster 3=localhost:29303
databend-metactl import --raft-dir ./.databend/new_meta2 --db meta.db \
    --id=2 \
    --initial-cluster 1=localhost:29103 \
    --initial-cluster 2=localhost:29203 \
    --initial-cluster 3=localhost:29303
databend-metactl import --raft-dir ./.databend/new_meta3 --db meta.db \
    --id=3 \
    --initial-cluster 1=localhost:29103 \
    --initial-cluster 2=localhost:29203 \
    --initial-cluster 3=localhost:29303
```

在上面的命令中，集群信息都是相同的。但每个 databend-meta 节点都有一个不同的节点 ID 指定。

之后，就可以启动一个新的包含三个节点的 databend-meta 集群。