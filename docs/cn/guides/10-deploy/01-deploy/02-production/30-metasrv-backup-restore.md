---
title: 备份与恢复 Databend Meta 服务集群
sidebar_label: 备份与恢复 Meta 服务
description: 如何备份和恢复 Meta 服务集群数据
---

本指南将介绍如何备份和恢复 Meta 服务集群数据。

## 从 Meta 服务导出数据

支持从 databend-meta 数据目录或从运行的 databend-meta 服务器导出数据。

### 从运行中的服务器导出

类似于从数据目录导出，但使用 `--grpc-api-address <ip:port>` 参数代替 `--raft-dir`，其中 `<ip:port>` 是 [databend-meta.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 中的 `grpc_api_address`，例如：

```shell
databend-metactl export --grpc-api-address "127.0.0.1:9191" --db <output_fn>

# tail "<output_fn>"
# ["state_machine/0",{"Nodes":{"key":2,"value":{"name":"","endpoint":{"addr":"localhost","port":28203}}}}]
# ...
```

### 从数据目录导出

关闭 `databend-meta` 服务。

然后从 `databend-meta` 存储元数据的目录（`<your_meta_dir>`）导出 sled DB 到本地文件 `output_fn`，格式为多行 JSON。例如，输出文件中的每一行都是一个导出的键值记录的 JSON。

```sh

databend-metactl export --raft-dir "<your_meta_dir>" --db <output_fn>

# tail "<output_fn>"
# ["state_machine/0",{"Nodes":{"key":2,"value":{"name":"","endpoint":{"addr":"localhost","port":28203}}}}]
# ["state_machine/0",{"Nodes":{"key":3,"value":{"name":"","endpoint":{"addr":"localhost","port":28303}}}}]
# ["state_machine/0",{"StateMachineMeta":{"key":"LastApplied","value":{"LogId":{"term":1,"index":378}}}}]
# ["state_machine/0",{"StateMachineMeta":{"key":"Initialized","value":{"Bool":true}}}]
# ...
```

注意：如果不使用 `--db` 参数，导出的数据将输出到标准输出。

## 恢复 databend-meta

以下命令从导出的元数据重建 `<your_meta_dir>` 中的 meta 服务数据库：

```sh
databend-metactl import --raft-dir "<your_meta_dir>" --db <output_fn>

databend-meta --raft-dir "<your_meta_dir>" ...
```

注意：如果不使用 `--db` 参数，导入的数据将来自标准输入，例如：

```sh
cat "<output_fn>" | databend-metactl import --raft-dir "<your_meta_dir>"
```

**注意**：`<your_meta_dir>` 中的数据将被清除。

## 将数据作为新的 databend-meta 集群导入

通过指定 `--initial-cluster` 参数，`databend-metactl` 可以将数据作为新集群导入。`--initial-cluster` 的格式为：`node_id=raft_advertise_host:raft_api_port`，每个节点配置用空格分隔，`raft_advertise_host` 和 `raft_api_port` 的含义与 raft 配置中的相同。

例如：

```
databend-metactl import --raft-dir ./.databend/new_meta1 --id=1 --db meta.db --initial-cluster 1=localhost:29103 --initial-cluster 2=localhost:29203 --initial-cluster 3=localhost:29303
databend-metactl import --raft-dir ./.databend/new_meta2 --id=2 --db meta.db --initial-cluster 1=localhost:29103 --initial-cluster 2=localhost:29203 --initial-cluster 3=localhost:29303
databend-metactl import --raft-dir ./.databend/new_meta3 --id=3 --db meta.db --initial-cluster 1=localhost:29103 --initial-cluster 2=localhost:29203 --initial-cluster 3=localhost:29303
```

上述脚本从 `meta.db` 导入导出的数据，并初始化三个集群节点：ID 为 1，raft 目录为 `./.databend/new_meta1`，ID 为 2 和 3 的节点分别对应不同的 raft 目录。注意，这三个命令行中的 `--initial-cluster` 参数是相同的。

之后，可以使用新的配置和导入的数据启动一个新的三节点 databend-meta 集群。