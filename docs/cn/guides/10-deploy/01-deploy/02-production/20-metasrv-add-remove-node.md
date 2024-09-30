---
title: 管理 Databend Meta 服务集群
sidebar_label: 管理 Meta 服务集群
description:
  如何从 Databend Meta 服务集群中添加/移除节点
---

:::tip

预期部署时间：**5分钟 ⏱**

:::

在任何时候，都可以添加或移除 `databend-meta` 节点，而不会导致服务中断。

## 1. 添加节点

### 1.1 为新节点创建 databend-meta-n.toml

新节点必须具有唯一的 `id` 和唯一的监听地址。
例如，要添加一个 id 为 `7` 的新节点，配置 toml 将如下所示：

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
join                = ["localhost:28103"]
```

参数 `join` 指定了一个 raft 地址列表（`<raft_advertise_host>:<raft_api_port>`），表示新节点希望加入的现有集群中的节点。

如果 `databend-meta` 已经加入了一个集群，它将跳过 `join` 参数。它会检查 **committed** 成员资格是否包含其 id 以决定是否加入。此策略的解释如下（但您实际上不必阅读它）：

> - 它不能依赖于是否存在日志。
>   可能领导者已经设置了一个复制到这个新节点的操作，但尚未将其添加为 **voter**。在这种情况下，此节点将永远不会自动加入集群。
>
> - 它必须检测是否存在包含此节点的 **committed** 成员资格配置。因此，只有当一个节点已经加入了一个集群（领导者提交了成员资格并将其复制到此节点），它才会跳过加入过程。
>
> #### 为什么跳过检查 raft 日志中的成员资格：
>
> 领导者可能已经将 **non-committed** 成员资格复制到此节点，然后崩溃了。
> 然后下一个领导者不知道这个新节点。
>
> 只有当成员资格被提交时，此节点才能确定它在一个集群中。

### 1.2 启动新节点

```shell
./databend-meta -c ./databend-meta-7.toml > meta7.log 2>&1 &
```

## 2. 移除节点

使用以下命令移除节点：
`databend-meta --leave-id <node_id_to_remove> --leave-via <node_addr_1> <node_addr_2>...`

此命令可以在任何安装了 `databend-meta` 的地方使用。它将向其可以连接的第一个 `<node_addr_i>` 发送一个 `leave` 请求。作为命令的一部分，节点将被阻止与集群交互，直到 Leave 请求完成或发生错误。

`databend-meta --leave-via` 将在 `leave` RPC 完成后立即退出。

- `--leave-via` 指定了一个节点 `advertise` 地址列表，用于发送 `leave` 请求。
  参见：`--raft-advertise-host`

- `--leave-id` 指定要离开的节点 id。它可以是集群中的任何 id。

## 3. 检查集群成员

在添加或移除节点的每一步，都应检查集群状态以确保一切顺利进行。

配置中定义的 `admin-api-address` 提供了一个管理 HTTP 服务，用于检查集群状态：
例如，`curl -s localhost:28101/v1/cluster/nodes` 将显示集群中的成员：

```json
[
  {
    "name": "1",
    "endpoint": {
      "addr": "localhost",
      "port": 28103
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