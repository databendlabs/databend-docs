---
title: 管理 Databend 元服务集群
sidebar_label: 管理元服务集群
description:
  如何从 Databend 元服务集群中添加/移除节点
---

:::tip

预计部署时间：**5 分钟 ⏱**

:::

任何时候都可以添加或移除 `databend-meta` 节点，而不会导致服务中断。

## 1. 添加节点

### 1.1 为新节点创建 databend-meta-n.toml

新节点必须有唯一的 `id` 和唯一的监听地址。
例如，要添加一个 id 为 `7` 的新节点，配置 toml 看起来像这样：

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

参数 `join` 指定了一个 raft 地址列表（`<raft_advertise_host>:<raft_api_port>`）, 这些地址是它想要加入的现有集群中的节点。

如果 databend-meta 已经加入到一个集群中，它将跳过 `join` 参数。
它会检查 **已提交** 的成员身份是否包含其 id 来决定是否加入。这个策略的解释如下（但你并不真的需要阅读它）：

> - 它不能依赖于是否有日志。
>   领导者可能已经设置了对这个新节点的复制，但还没有将其添加为 **投票者**。在这种情况下，这个节点将永远不会自动被添加到集群中。
>
> - 它必须检测是否有一个包含此节点的已提交 **成员身份** 配置。因此，只有当一个节点已经加入到一个集群中（领导者提交了成员身份并已将其复制到此节点）时，它才会跳过加入过程。
>
> #### 为什么跳过检查 raft 日志中的成员身份：
>
> 领导者可能已经复制了 **未提交** 的成员身份到这个节点然后崩溃了。
> 然后下一个领导者不知道这个新节点。
>
> 只有当成员身份被提交时，这个节点才能确保它在一个集群中。


### 1.2 启动新节点

```shell
./databend-meta -c ./databend-meta-7.toml > meta7.log 2>&1 &
```

## 2. 移除节点

使用以下命令移除一个节点：
`databend-meta --leave-id <node_id_to_remove> --leave-via <node_addr_1> <node_addr_2>...`

这个命令可以在安装了 `databend-meta` 的任何地方使用。
它将向它能连接到的第一个 `<node_addr_i>` 发送一个 `leave` 请求。
作为命令的一部分，该节点将被阻止与集群交互，直到 Leave 请求完成或发生错误。

`databend-meta --leave-via` 在 `leave` RPC 完成后立即退出。

- `--leave-via` 指定了一个节点 `advertise` 地址列表，用于发送 `leave` 请求。
  见：`--raft-advertise-host`

- `--leave-id` 指定要离开的节点 id。它可以是集群中的任何 id。

## 3. 检查集群成员

在添加或移除节点的每一步，都应该检查集群状态以确保一切顺利。

配置中定义的 `admin-api-address` 提供了一个管理 HTTP 服务来检查集群状态：
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