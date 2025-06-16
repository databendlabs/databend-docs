---
title: 管理 Databend Meta Service 集群
sidebar_label: 管理 Meta Service 集群
description:
  如何从 Databend Meta Service 集群添加/删除节点
---

:::tip

预计部署时间：**5 分钟 ⏱**

:::

可以随时添加或删除 `databend-meta` 节点，而不会导致服务中断。

## 1. 添加节点

### 1.1 为新节点创建 databend-meta-n.toml

新节点必须具有唯一的 `id` 和唯一的监听地址。
例如，要添加一个 id 为 `7` 的新节点，配置 toml 如下所示：

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

参数 `join` 指定要加入的现有集群中节点的 raft 地址列表 (`<raft_advertise_host>:<raft_api_port>`)。

如果 Databend-meta 已经加入集群，它将跳过 `join` 参数。
它会检查 **committed** 成员资格是否包含其 id，以决定是否加入。对此策略的解释是：（但您实际上不必阅读它:)

> - 它不能依赖于是否存在日志。
>   领导者可能已经设置了到这个新节点的复制，但尚未将其添加为 **voter**。
>   在这种情况下，此节点将永远不会自动添加到集群中。
>
> - 它必须检测是否存在已提交的 **membership** 配置，其中包含此节点。
>   因此，只有当节点已经加入到集群（领导者提交了成员资格并已将其复制到此节点）时，它才会跳过加入过程。
>
> #### 为什么跳过检查 raft 日志中的成员资格：
>
> 领导者可能已将 **non-committed** 成员资格复制到此节点并崩溃。
> 然后下一个领导者不知道这个新节点。
>
> 只有当成员资格已提交时，此节点才能确定它是否在集群中。

### 1.2 启动新节点

```shell
./databend-meta -c ./databend-meta-7.toml > meta7.log 2>&1 &
```

## 2. 删除节点

使用以下命令删除节点：
`databend-meta --leave-id <node_id_to_remove> --leave-via <node_addr_1> <node_addr_2>...`

此命令可以在安装了 `databend-meta` 的任何地方使用。
它将向它可以连接的第一个 `<node_addr_i>` 发送 `leave` 请求。
作为命令的一部分，该节点将被阻止与集群交互，直到 Leave 请求完成或发生错误。

当 `leave` RPC 完成时，`databend-meta --leave-via` 将立即退出。

- `--leave-via` 指定节点 `advertise` 地址的列表，以将 `leave` 请求发送到这些地址。
  请参阅：`--raft-advertise-host`

- `--leave-id` 指定要离开的节点 id。它可以是集群中的任何 id。

## 3. 检查集群成员

在添加或删除节点的每个步骤中，都应检查集群状态，以确保一切顺利。

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
