---
title: 兼容性
sidebar_label: 兼容性
description:
  调查和管理兼容性
---

本指南将介绍如何调查和管理兼容性：
- databend-query 与 databend-meta 之间的兼容性。
- 不同版本的 databend-meta 之间的兼容性。

## databend-query 与 databend-meta 之间的兼容性

### 确定版本

- 要找出 databend-query 的构建版本及其兼容的 databend-meta 版本：

  ```shell
  databend-query --cmd ver

  # 输出：
  version: 0.7.61-nightly
  min-compatible-metasrv-version: 0.7.59
  ```

  这意味着这个版本的 databend-query（`0.7.61-nightly`）可以与至少版本为 `0.7.59` 的 databend-meta 通信，包括此版本。

- 要找出 databend-meta 的构建版本及其兼容的 databend-query 版本：

  ```shell
  databend-meta --cmd ver

  # 输出：
  version: 0.7.61-nightly
  min-compatible-client-version: 0.7.57
  ```

  这意味着这个版本的 databend-meta（`0.7.61-nightly`）可以与至少版本为 `0.7.57` 的 databend-query 通信，包括此版本。

### 维护兼容性

一个 databend 集群必须部署兼容版本的 databend-query 和 databend-meta。
一个 databend-query 和 databend-meta 是兼容的，当且仅当以下声明成立：

```
databend-query.version >= databend-meta.min-compatible-client-version
databend-bend.version  >= databend-query.min-compatible-metasrv-version
```

:::caution

如果部署了不兼容的版本，当 databend-query 尝试连接到 databend-meta 时，会发生 `InvalidArgument` 错误，
这可以在 databend-query 日志中找到。
然后 databend-query 将停止工作。

:::

#### 兼容性验证协议

在 meta-client（databend-query）和 databend-meta 之间建立连接时，将检查兼容性，在一个 `handshake` RPC 中。

客户端 `C`（databend-query）和服务器 `S`（databend-meta）维护两个语义版本：

- `C` 维护自己的 semver（`C.ver`）和最小兼容的 `S` semver（`C.min_srv_ver`）。
- `S` 维护自己的 semver（`S.ver`）和最小兼容的 `S` semver（`S.min_cli_ver`）。

握手时：

- `C` 将其版本 `C.ver` 发送给 `S`，
- 当 `S` 收到握手请求时，`S` 断言 `C.ver >= S.min_cli_ver`。
- 然后 `S` 以其 `S.ver` 回复握手回复。
- 当 `C` 收到回复时，`C` 断言 `S.ver >= C.min_srv_ver`。

如果这两个断言都成立，则握手成功。

例如：
- `S: (ver=3, min_cli_ver=1)` 与 `C: (ver=3, min_srv_ver=2)` 兼容。
- `S: (ver=4, min_cli_ver=4)` 与 `C: (ver=3, min_srv_ver=2)` **不**兼容。
  因为虽然 `S.ver(4) >= C.min_srv_ver(3)` 成立，
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

| `Meta\Query`      | [0.7.59, 0.8.80) | [0.8.80, 0.9.41) | [0.9.41, 1.1.34) | [1.1.34, 1.2.287) | [1.2.287, +∞) |
|:------------------|:-----------------|:-----------------|:-----------------|:---------------|:-----------|
| [0.8.30, 0.8.35)  | ✅                | ❌                | ❌                | ❌              | ❌          |
| [0.8.35, 0.9.23)  | ✅                | ✅                | ✅                | ❌              | ❌          |
| [0.9.23, 0.9.42)  | ❌                | ✅                | ✅                | ❌              | ❌          |
| [0.9.42, 1.1.32)  | ❌                | ❌                | ✅                | ❌              | ❌          |
| [1.1.32, 1.2.63)  | ❌                | ❌                | ✅                | ✅              | ❌          |
| [1.2.63, 1.2.226) | ❌                | ❌                | ✅                | ✅              | ❌          |
| [1.2.226, +∞)     | ❌                | ❌                | ✅                | ✅              | ✅          |

<img src="/img/deploy/compatibility.excalidraw.png"/>

## databend-query 之间的兼容性

| 查询版本          | 向后兼容              |
|:-----------------|:---------------------|
| [-∞, 1.2.307)    | [-∞, 1.2.311)        |
| [1.2.307, 1.2.311) | [-∞, 1.2.311)      |
| [1.2.311, +∞)    | [1.2.307, +∞)        |

自1.2.307起，支持使用pb和json反序列化角色信息，但只支持将角色信息序列化为json。

自1.2.311起，仅支持将角色信息序列化为pb。

防止未成功升级的查询节点因滚动升级期间对角色的操作而无法读取数据。建议先升级到1.2.307，然后升级到1.2.311。

例如，当前版本是1.2.306升级到1.2.312：

```
1.2.307 -> 1.2.311 -> 1.2.312

```

## databend-meta之间的兼容性

| Meta版本          | 向后兼容               |
|:------------------|:----------------------|
| [0.9.41, 1.2.212) | [0.9.41, 1.2.212)     |
| [1.2.212, +∞)     | [0.9.41, +∞)          |


- `1.2.53` 不兼容，允许滚动升级但不传输快照。
  快照格式更改，因此在滚动升级期间，
  需要所有节点数据都是最新的，确保不需要通过快照复制。

- `1.2.163` 功能：gRPC API：添加了`kv_read_v1()`。用于流式读取。

- `1.2.212` 功能：raft API：`install_snapshot_v1()`。与旧版本兼容。
  支持滚动升级。
  在此版本中，databend-meta raft-server引入了一个新的API `install_snapshot_v1()`。
  raft-client将尝试使用这个新API或原始的`install_snapshot()`。


## databend-meta磁盘数据的兼容性

Databend-meta的磁盘数据随时间演进，同时保持向后兼容性。

### 确定版本

启动时，Databend-meta将显示磁盘数据版本：

例如，运行`databend-meta --single`产生：

```
Databend Metasrv

版本：v1.1.33-nightly-...
工作数据版本：V0

磁盘数据：
    目录：./.databend/meta
    版本：version=V0, upgrading=None
```

- `工作数据版本`表示Databend-meta操作的版本。
- `磁盘数据 -- 数据版本`表示磁盘数据的版本。

工作数据版本必须大于或等于磁盘数据版本；否则，将会产生panic。

磁盘数据版本必须与当前Databend-meta版本兼容。
如果不兼容，系统将提示用户降级Databend-meta并以panic退出。

### 自动升级

当`databend-meta`启动时，如果磁盘数据与工作数据版本兼容，则会进行升级。
升级进度将打印到`stderr`并以INFO级别记录到日志文件，例如：

```text
升级磁盘数据
    从：V0(2023-04-21: 兼容openraft v07和v08，使用openraft::compat)
    到：V001(2023-05-15: 去除compat，仅使用openraft v08数据类型)
开始升级：版本：V0，升级中：V001
写入头部：版本：V0，升级中：V001
升级了167条记录
完成升级：版本：V001，升级中：None
写入头部：版本：V001，升级中：None
```

如果`databend-meta`在升级完成前崩溃，
它将清除部分升级的数据，并在下次启动时恢复升级。

### 备份数据兼容性

- 导出的备份数据**只能**用相同版本的`databend-metactl`导入。

- 备份的第一行是版本，例如：
  `["header",{"DataHeader":{"key":"header","value":{"version":"V100","upgrading":null}}}]`

- 导入时**不会进行自动升级**。
  自动升级只会在`databend-meta`启动时进行。