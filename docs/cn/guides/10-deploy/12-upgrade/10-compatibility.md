---
title: 兼容性
sidebar_label: 兼容性
description:
  调查和管理兼容性
---

本指南将介绍如何调查和管理兼容性：
- databend-query 和 databend-meta 之间的兼容性。
- 不同版本的 databend-meta 之间的兼容性。

## databend-query 和 databend-meta 之间的兼容性

### 确定版本

- 要找出 databend-query 的构建版本及其兼容的 databend-meta 版本：

  ```shell
  databend-query --cmd ver

  # 输出：
  version: 0.7.61-nightly
  min-compatible-metasrv-version: 0.7.59
  ```

  这意味着这个版本的 databend-query（`0.7.61-nightly`）可以至少与版本为 `0.7.59` 的 databend-meta 通信，包括此版本。

- 要找出 databend-meta 的构建版本及其兼容的 databend-query 版本：

  ```shell
  databend-meta --cmd ver

  # 输出：
  version: 0.7.61-nightly
  min-compatible-client-version: 0.7.57
  ```

  这意味着这个版本的 databend-meta（`0.7.61-nightly`）可以至少与版本为 `0.7.57` 的 databend-query 通信，包括此版本。

### 维护兼容性

必须使用兼容版本的 databend-query 和 databend-meta 部署 databend 集群。
一个 databend-query 和 databend-meta 是兼容的，当且仅当以下声明成立：

```
databend-query.version >= databend-meta.min-compatible-client-version
databend-bend.version  >= databend-query.min-compatible-metasrv-version
```

:::caution

如果部署了不兼容的版本，当 databend-query 尝试连接到 databend-meta 时，会发生错误 `InvalidArgument`，
这可以在 databend-query 日志中找到。
然后 databend-query 将停止工作。

:::

#### 兼容性验证协议

在 meta-client（databend-query）和 databend-meta 之间建立连接时，将检查兼容性，在 `handshake` RPC 中。

客户端 `C`（databend-query）和服务器 `S`（databend-meta）维护两个语义版本：

- `C` 维护自己的 semver（`C.ver`）和最小兼容的 `S` semver（`C.min_srv_ver`）。
- `S` 维护自己的 semver（`S.ver`）和最小兼容的 `S` semver（`S.min_cli_ver`）。

握手时：

- `C` 将其版本 `C.ver` 发送给 `S`，
- 当 `S` 收到握手请求时，`S` 断言 `C.ver >= S.min_cli_ver`。
- 然后 `S` 用其 `S.ver` 回复握手回复。
- 当 `C` 收到回复时，`C` 断言 `S.ver >= C.min_srv_ver`。

如果这两个断言都成立，则握手成功。

例如：
- `S: (ver=3, min_cli_ver=1)` 与 `C: (ver=3, min_srv_ver=2)` 兼容。
- `S: (ver=4, min_cli_ver=4)` 与 `C: (ver=3, min_srv_ver=2)` **不**兼容。
  因为尽管 `S.ver(4) >= C.min_srv_ver(3)` 成立，
  但 `C.ver(3) >= S.min_cli_ver(4)` 不成立。

```text
C.ver:    1             3      4
C --------+-------------+------+------------>
          ^      .------'      ^
          |      |             |
          '-------------.      |
                 |      |      |
                 v      |      |
S ---------------+------+------+------------>
S.ver:           2      3      4
```

#### 兼容性状态

以下是当前 query-meta 兼容性的说明：

| `Meta\Query`     | [0.7.59, 0.8.80) | [0.8.80, 0.9.41) | [0.9.41, 1.1.34) | [1.1.34, +∞) |
|:-----------------|:-----------------|:-----------------|:-----------------|:-------------|
| [0.8.30, 0.8.35) | ✅                | ❌                | ❌                | ❌            |
| [0.8.35, 0.9.23) | ✅                | ✅                | ✅                | ❌            |
| [0.9.23, 0.9.42) | ❌                | ✅                | ✅                | ❌            |
| [0.9.42, 1.1.32) | ❌                | ❌                | ✅                | ❌            |
| [1.1.32, 1.2.63) | ❌                | ❌                | ✅                | ✅            |
| [1.2.63, +∞)     | ❌                | ❌                | ✅                | ✅            |

<img src="/img/deploy/compatibility.excalidraw.png"/>


## databend-meta 之间的兼容性

| Meta 版本         | 与之向后兼容的版本 |
|:------------------|:-------------------------|
| [0.9.41, 1.2.212) | [0.9.41, 1.2.212)        |
| [1.2.212, +∞)     | [0.9.41, +∞)             |


- `1.2.53` 不兼容，允许滚动升级而无需传输快照。
  快照格式已更改，因此在滚动升级期间，
  需要所有节点数据都是最新的，确保不需要通过快照复制。

- `1.2.163` 功能：gRPC API：添加了 `kv_read_v1()`。用于流式读取。

- `1.2.212` 特性：raft API：`install_snapshot_v1()`。与旧版本兼容。
  支持滚动升级。
  在此版本中，databend-meta raft-server 引入了一个新的 API `install_snapshot_v1()`。
  raft-client 将尝试使用这个新 API 或原始的 `install_snapshot()`。


## databend-meta 磁盘数据的兼容性

随着时间的推移，Databend-meta 的磁盘数据在保持向后兼容性的同时不断演进。

### 确定版本

启动时，Databend-meta 将显示磁盘数据版本：

例如，运行 `databend-meta --single` 会产生：

```
Databend Metasrv

Version: v1.1.33-nightly-...
Working DataVersion: V0

On Disk Data:
    Dir: ./.databend/meta
    Version: version=V0, upgrading=None
```

- `工作数据版本` 表示 Databend-meta 操作的版本。
- `磁盘数据 -- 数据版本` 表示磁盘数据的版本。

工作数据版本必须大于或等于磁盘数据版本；否则，它将产生 panic。

磁盘数据版本必须与当前的 Databend-meta 版本兼容。
如果不兼容，系统将提示用户降级 Databend-meta 并以 panic 退出。

### 自动升级

当 `databend-meta` 启动时，如果磁盘数据与工作数据版本兼容，将进行升级。
升级进度将打印到 `stderr` 并以 INFO 级别记录到日志文件，例如：

```text
Upgrade on-disk data
    From: V0(2023-04-21: compatible with openraft v07 and v08, using openraft::compat)
    To:   V001(2023-05-15: Get rid of compat, use only openraft v08 data types)
Begin upgrading: version: V0, upgrading: V001
Write header: version: V0, upgrading: V001
Upgraded 167 records
Finished upgrading: version: V001, upgrading: None
Write header: version: V001, upgrading: None
```

如果 `databend-meta` 在升级完成前崩溃，
它将清除部分升级的数据，并在下次启动时恢复升级。

### 备份数据兼容性

- 导出的备份数据**只能**使用相同版本的 `databend-metactl` 导入。

- 备份的第一行是版本，例如：
  `["header",{"DataHeader":{"key":"header","value":{"version":"V100","upgrading":null}}}]`

- 导入时**不会进行自动升级**。
  自动升级只会在 `databend-meta` 启动时进行。