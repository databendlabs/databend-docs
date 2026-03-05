---
title: 管理 Databend Meta Service 集群
sidebar_label: 管理 Meta Service 集群
description:
  如何在 Databend Meta Service 集群中添加或移除节点
---

:::tip

预计部署时间：**5 分钟 ⏱**

:::

可以随时添加或移除 `databend-meta` 节点，而不会导致服务停机。

## 1. 添加节点

### 1.1 为新节点创建 databend-meta-n.toml

新节点必须具有唯一的 `id` 和唯一的监听地址。
例如，要添加一个 ID 为 `7` 的新节点，其配置 toml 文件如下所示：

```shell title="databend-meta-7.toml"
log_dir            = "metadata/_logs7"
admin_api_address  = "0.0.0.0:28701"
grpc_api_address   = "0.0.0.0:28702"

[raft_config]
id                  = 7
raft_dir            = "metadata/datas7"
raft_api_port       = 28703
raft_listen_host    = "127.0.0.1"
raft_advertise_host = "localhost"
join                = ["localhost:28004"]
```

参数 `join` 指定了现有集群中节点的一系列 raft 地址（`<raft_advertise_host>:<raft_api_port>`），新节点将通过这些地址加入集群。

如果 databend-meta 已经加入集群，它将跳过 `join` 参数。
它通过检查**已提交**的成员关系（membership）中是否包含其 ID 来决定是否加入。
以下是此策略的解释（但您无需强制阅读）：

> - 它不能依赖于是否存在日志。
>   领导者（leader）可能已经为这个新节点设置了复制，但尚未将其添加为**投票者（voter）**。在这种情况下，该节点将永远不会被自动添加到集群中。
>
> - 它必须检测是否存在包含此节点的已提交**成员关系（membership）**配置。因此，只有当一个节点已经加入集群（领导者提交了成员关系并将其复制到此节点），它才会跳过加入过程。
>
> #### 为什么跳过检查 raft 日志中的成员关系：
>
> 领导者可能已经将**未提交**的成员关系复制到此节点，然后崩溃了。
> 那么，下一个领导者就不知道这个新节点的存在。
>
> 只有当成员关系被提交后，此节点才能确定它已在集群中。


### 1.2 启动新节点

```shell
./databend-meta -c ./databend-meta-7.toml > meta7.log 2>&1 &
```

## 2. 移除节点

使用以下命令移除节点：
`databend-meta --leave-id <node_id_to_remove> --leave-via <node_addr_1> <node_addr_2>...`

此命令可以在任何安装了 `databend-meta` 的地方使用。
它会向第一个可以连接上的 `<node_addr_i>` 发送一个 `leave` 请求。
作为命令的一部分，该节点将被阻止与集群交互，直到 Leave 请求完成或发生错误。

当 `leave` RPC 完成后，`databend-meta --leave-via` 会立即退出。

- `--leave-via` 指定了发送 `leave` 请求的节点 `advertise` 地址列表。
  请参阅：`--raft-advertise-host`

- `--leave-id` 指定要离开的节点 ID。它可以是集群中的任何 ID。

## 3. 检查集群成员

在添加或移除节点的每一步，都应检查集群状态以确保一切顺利。

在配置中定义的 `admin-api-address` 提供了一个管理 HTTP 服务来检查集群状态：
例如，`curl -s localhost:28002/v1/cluster/nodes` 将显示集群中的成员：

```json
[
  {
    "name": "1",
    "endpoint": {
      "addr": "localhost",
      "port": 28004
    }
  },
  {
    "name": "2",
    "endpoint": {
      "addr": "localhost",
      "port": 28203
    }
  }
]
```