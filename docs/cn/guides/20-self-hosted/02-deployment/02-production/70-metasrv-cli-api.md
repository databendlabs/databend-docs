---
title: Databend Meta CLI
sidebar_label: Meta Service 命令行 API
description:
    通过命令行接口访问 Databend Meta Service 集群
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

二进制文件 `databend-meta` 提供了几个方便的命令来访问 databend meta service 的 KVApi。
`databend-meta --help` 还包括一个关于使用这些 CLI 命令的简单指南。

:::caution

这些都是底层 API，如果可能，应该避免使用：

- 存储在 databend-meta 中的一些数据是相关的，添加或删除可能会破坏这些内部一致性。
  例如，当仍然有属于它的 `table` 时，删除一个 `database`。

- databend-mate 中的大多数数据都是原始字节。数据解释是在客户端完成的，即通过 databend-query。
  修改数据可能会导致兼容性问题。

:::

:::note

命令行 API 受到限制：
- 仅支持字符串键和字符串值。
- 不支持 `seq`。

:::

### 设置 `foo=bar`：
```shell
databend-meta --grpc-api-address 1.2.3.4:5678 --cmd kvapi::upsert --key foo --value bar
```
输出是应用此命令之前和之后的状态：
```json
{
  "ident": null,
  "prev": {
    "seq": 18,
    "meta": null,
    "data": [ 98, 97, 114 ]
  },
  "result": {
    "seq": 20,
    "meta": null,
    "data": [ 98, 97, 114 ]
  }
}
```

### 设置 `foo=bar` 并通知 databend-meta 在 5 秒后删除它：
```shell
databend-meta --grpc-api-address 1.2.3.4:5678 --cmd kvapi::upsert --key foo --value bar --expire-after 5
```
输出是应用此命令之前和之后的状态，并且设置了 `expire_at`。
```json
{
  "ident": null,
  "prev": {
    "seq": 20,
    "meta": null,
    "data": [ 98, 97, 114 ]
  },
  "result": {
    "seq": 21,
    "meta": {
      "expire_at": 1668996718
    },
    "data": [ 98, 97, 114 ]
  }
}
```

### 删除 `foo`：
```shell
databend-meta --grpc-api-address 1.2.3.4:5678 --cmd kvapi::delete --key foo
```
输出是应用此命令之前和之后的状态，并且 `result` 始终为 `null`。
```json
{
  "ident": null,
  "prev": {
    "seq": 22,
    "meta": null,
    "data": [ 98, 97, 114 ]
  },
  "result": null
}
```

### 获取 `foo`：
```shell
databend-meta --grpc-api-address 1.2.3.4:5678 --cmd kvapi::get --key foo
```
输出是键 `foo` 的状态。
```json
{
  "seq": 23,
  "meta": null,
  "data": [ 98, 97, 114 ]
}
```

### 使用 mget 获取多个键：`foo,bar,wow`：
```shell
databend-meta --grpc-api-address 1.2.3.4:5678 --cmd kvapi::mget --key foo bar wow
```
输出是每个指定键的状态。
```json
[
  {
    "seq": 23,
    "meta": null,
    "data": [ 98, 97, 114 ]
  },
  null,
  null
]
```

### 列出以 `foo/` 开头的键：
```shell
databend-meta --grpc-api-address 1.2.3.4:5678 --cmd kvapi::list --prefix foo/
```
输出是以 `prefix` 开头的每个键的键值。
```json
[
  [
    "foo/a",
    {
      "seq": 24,
      "meta": null,
      "data": [ 98, 97, 114 ]
    }
  ],
  [
    "foo/b",
    {
      "seq": 25,
      "meta": null,
      "data": [ 119, 111, 119 ]
    }
  ]
]
```

## Lua gRPC 客户端选项

`databend-metactl lua` 提供独立的 Lua 接口。从 v1.2.953 开始，`metactl.new_grpc_client(address[, opts])` 接受一个可选的选项表。默认 RPC 超时从 2 秒增加到 60 秒。此变更不为所有 Meta Service CLI 命令或 HTTP API 设置超时。

选项表支持以下字段。省略的字段保留默认值。未知字段会报错。

| 字段 | 含义 | 默认值 |
| --- | --- | --- |
| `timeout` | RPC 超时，单位为秒 | `60` |
| `auto_sync_interval` | 客户端同步间隔，单位为秒 | `1` |
| `username` | gRPC 用户名 | 继承 CLI 客户端配置 |
| `password` | gRPC 密码 | 继承 CLI 客户端配置 |
| `max_msg_size` | 最大 gRPC 消息大小，单位为字节 | 客户端库默认值 |

`timeout` 和 `auto_sync_interval` 支持小数秒。每个值必须是有限的正数，且能表示为非零时长。负值、零、溢出和舍入为零的值会被拒绝。

客户端继承已配置的凭据和 TLS 设置。Lua 表可以覆盖凭据，但不能覆盖 TLS。请通过 CLI 客户端选项配置 TLS，不要在此表中配置。

以下是只读示例。请将脚本保存为 `read-meta.lua`。请使用现有客户端配置可以访问的 Meta Service 端点。

```lua
local client = metactl.new_grpc_client("127.0.0.1:9191", {
    timeout = 120,
    auto_sync_interval = 2
})
local value, err = client:get("example/key")
assert(err == nil, tostring(err))
print(metactl.to_string(value))
```

使用已配置的客户端凭据和 TLS 设置运行脚本：

```shell
databend-metactl lua --file read-meta.lua
```

更大的超时为 RPC 留出更多时间，但不能消除过载，也不保证写入重试安全。超时的写入仍可能在服务端提交。

失败的 Lua 客户端 RPC 会以 `WARN` 级别记录耗时。耗时至少 500 毫秒的成功调用也会以 `WARN` 级别记录。请使用这些日志定位缓慢或失败的调用。它们不构成性能保证。
