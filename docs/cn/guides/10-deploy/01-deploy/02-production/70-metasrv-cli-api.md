---
title: Databend Meta CLI
sidebar_label: Meta Service Command Line API
description:
    Access Databend Meta Service Cluster with Command Line Interface
---

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
