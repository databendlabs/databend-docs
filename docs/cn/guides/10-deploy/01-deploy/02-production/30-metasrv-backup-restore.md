---
title: 备份和恢复 Databend 元服务集群
sidebar_label: 备份和恢复元服务
description: 如何备份和恢复元服务集群数据
---

本指南将介绍如何备份和恢复元服务集群数据。

## 从元服务导出数据

支持从 databend-meta 数据目录或正在运行的 databend-meta 服务器导出。

### 从运行中的服务器导出

与从数据目录导出类似，但是使用服务端点参数 `--grpc-api-address <ip:port>` 替代 `--raft-dir`，
其中 `<ip:port>` 是 [databend-meta.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 中的 `grpc_api_address`，例如：

```shell
databend-metactl export --grpc-api-address "127.0.0.1:9191" --db <output_fn>

# tail "<output_fn>"
# ["state_machine/0",{"Nodes":{"key":2,"value":{"name":"","endpoint":{"addr":"localhost","port":28203}}}}]
# ...
```

### 从数据目录导出

关闭 `databend-meta` 服务。

然后从存储元数据的 `databend-meta` 目录(`<your_meta_dir>`)中导出 sled DB 到本地文件 `output_fn`，以多行 JSON 格式。
例如，输出文件中的每一行都是一个导出的键值记录的 JSON。

```sh

databend-metactl export --raft-dir "<your_meta_dir>" --db <output_fn>

# tail "<output_fn>"
# ["state_machine/0",{"Nodes":{"key":2,"value":{"name":"","endpoint":{"addr":"localhost","port":28203}}}}]
# ["state_machine/0",{"Nodes":{"key":3,"value":{"name":"","endpoint":{"addr":"localhost","port":28303}}}}]
# ["state_machine/0",{"StateMachineMeta":{"key":"LastApplied","value":{"LogId":{"term":1,"index":378}}}}]
# ["state_machine/0",{"StateMachineMeta":{"key":"Initialized","value":{"Bool":true}}}]
# ...
```

注意：如果没有 `--db` 参数，导出的数据将输出到标准输出中。

## 恢复一个 databend-meta

以下命令从导出的元数据中在 `<your_meta_dir>` 重建一个元服务数据库：

```sh
databend-metactl import --raft-dir "<your_meta_dir>" --db <output_fn>

databend-meta --raft-dir "<your_meta_dir>" ...
```

注意：如果没有 `--db` 参数，导入的数据将来自标准输入，如：

```sh
cat "<output_fn>" | databend-metactl import --raft-dir "<your_meta_dir>"
```

**注意**：`<your_meta_dir>` 中的数据将被清除。

## 将数据导入为新的 databend-meta 集群

通过指定 `--initial-cluster` 参数，`databend-metactl` 可以将数据导入为一个新集群。
`--initial-cluster` 的格式为：`node_id=raft_advertise_host:raft_api_port`，每个节点配置由空格分隔，`raft_advertise_host`、`raft_api_port` 的含义与 raft 配置中相同。

例如：

```
databend-metactl import --raft-dir ./.databend/new_meta1 --id=1 --db meta.db --initial-cluster 1=localhost:29103 --initial-cluster 2=localhost:29203 --initial-cluster 3=localhost:29303
databend-metactl import --raft-dir ./.databend/new_meta2 --id=2 --db meta.db --initial-cluster 1=localhost:29103 --initial-cluster 2=localhost:29203 --initial-cluster 3=localhost:29303
databend-metactl import --raft-dir ./.databend/new_meta3 --id=3 --db meta.db --initial-cluster 1=localhost:29103 --initial-cluster 2=localhost:29203 --initial-cluster 3=localhost:29303
```

上述脚本从 `meta.db` 导入导出的数据，并初始化三个集群节点：id 1，其 raft 目录为 `./.databend/new_meta1`，id 2 和 3 也是如此，但使用不同的 raft 目录。
注意，这三个命令行中的 `--initial-cluster` 参数是相同的。

之后，可以使用新配置和导入的数据启动一个新的三节点 databend-meta 集群。
