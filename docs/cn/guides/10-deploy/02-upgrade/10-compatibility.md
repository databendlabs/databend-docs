---
title: 兼容性
sidebar_label: 兼容性
description:
  调查和管理兼容性
---

本指南将介绍如何调查和管理以下兼容性：
- databend-query 和 databend-meta 之间的兼容性。
- 不同版本的 databend-meta 之间的兼容性。

## databend-query 和 databend-meta 之间的兼容性

### 识别版本

- 查找 databend-query 的构建版本及其兼容的 databend-meta 版本：

  ```shell
  databend-query --cmd ver

  # 输出:
  version: 0.7.61-nightly
  min-compatible-metasrv-version: 0.7.59
  ```

  这意味着此版本的 databend-query(`0.7.61-nightly`) 可以与至少版本为 `0.7.59` 的 databend-meta 通信，包括此版本。

- 查找 databend-meta 的构建版本及其兼容的 databend-query 版本：

  ```shell
  databend-meta --cmd ver

  # 输出:
  version: 0.7.61-nightly
  min-compatible-client-version: 0.7.57
  ```

  这意味着此版本的 databend-meta(`0.7.61-nightly`) 可以与至少版本为 `0.7.57` 的 databend-query 通信，包括此版本。

### 维护兼容性

一个 databend 集群必须部署兼容版本的 databend-query 和 databend-meta。
一个 databend-query 和 databend-meta 是兼容的，当且仅当以下陈述成立：

```
databend-query.version >= databend-meta.min-compatible-client-version
databend-bend.version  >= databend-query.min-compatible-metasrv-version
```

:::caution

如果部署了不兼容的版本，当 databend-query 尝试连接到 databend-meta 时，会出现 `InvalidArgument` 错误，
该错误可以在 databend-query 日志中找到。
然后 databend-query 将停止工作。

:::

#### 兼容性验证协议

当 meta-client(databend-query) 和 databend-meta 之间建立连接时，会在 `handshake` RPC 中检查兼容性。

客户端 `C`(databend-query) 和服务器 `S`(databend-meta) 维护两个语义版本：

- `C` 维护其自身的 semver(`C.ver`) 和最小兼容的 `S` semver(`C.min_srv_ver`)。
- `S` 维护其自身的 semver(`S.ver`) 和最小兼容的 `S` semver(`S.min_cli_ver`)。

当握手时：

- `C` 将其 ver `C.ver` 发送给 `S`，
- 当 `S` 接收到握手请求时，`S` 断言 `C.ver >= S.min_cli_ver`。
- 然后 `S` 用其 `S.ver` 回复握手回复。
- 当 `C` 接收到回复时，`C` 断言 `S.ver >= C.min_srv_ver`。

如果这两个断言都成立，则握手成功。

例如：
- `S: (ver=3, min_cli_ver=1)` 与 `C: (ver=3, min_srv_ver=2)` 兼容。
- `S: (ver=4, min_cli_ver=4)` 与 `C: (ver=3, min_srv_ver=2)` **不兼容**。
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

以下是最近的 query-meta 兼容性图示：

| `Meta\Query`       | [0.9.41, 1.1.34) | [1.1.34, 1.2.287) | [1.2.287, 1.2.361) | [1.2.361, +∞) |
|:-------------------|:-----------------|:---------------|:-----------|:-----------|
| [0.8.30, 0.8.35)   | ❌                | ❌              | ❌          |❌          |
| [0.8.35, 0.9.23)   | ✅                | ❌              | ❌          |❌          |
| [0.9.23, 0.9.42)   | ✅                | ❌              | ❌          |❌          |
| [0.9.42, 1.1.32)   | ✅                | ❌              | ❌          |❌          |
| [1.1.32, 1.2.63)   | ✅                | ✅              | ❌          |❌          |
| [1.2.63, 1.2.226)  | ✅                | ✅              | ❌          |❌          |
| [1.2.226, 1.2.258) | ✅                | ✅              | ✅          |❌          |
| [1.2.258, +∞)      | ✅                | ✅              | ✅          |✅          |

未包含在上表中的历史版本：

- Query `[0.7.59, 0.8.80)` 与 Meta `[0.8.30, 0.9.23)` 兼容。
- Query `[0.8.80, 0.9.41)` 与 Meta `[0.8.35, 0.9.42)` 兼容。


<img src="/img/deploy/compatibility.excalidraw.png"/>

## databend-query 之间的兼容性

| Query 版本         | 向后兼容           |
|:-------------------|:-------------------|
| [-∞, 1.2.307)      | [-∞, 1.2.311)      |
| [1.2.307, 1.2.311) | [-∞, 1.2.311)      |
| [1.2.311, +∞)      | [1.2.307, +∞)      |

自 1.2.307 起，支持以 pb 和 json 反序列化角色信息，但仅支持将角色信息序列化为 json。

自 1.2.311 起，仅支持将角色信息序列化为 pb。

防止在滚动升级期间，未成功升级的查询节点因角色操作而读取数据。建议先升级到 1.2.307，然后再升级到 1.2.311。

例如，当前版本为 1.2.306 升级到 1.2.312：

```
1.2.307 -> 1.2.311 -> 1.2.312
```

## databend-meta 之间的兼容性

| Meta 版本          | 向后兼容           |
|:-------------------|:-------------------|
| [0.9.41,   1.2.212) | [0.9.41,  1.2.212) |
| [1.2.212,  1.2.479) | [0.9.41,  1.2.479) |
| [1.2.479, +∞)       | [1.2.288, +∞)      |


- `1.2.53` 不兼容，允许滚动升级，无需传输快照。
  快照格式改变，因此在滚动升级期间，
  要求所有节点数据是最新的，确保无需通过快照进行复制。

- `1.2.163` 特性：gRPC API：添加了 `kv_read_v1()`。用于流式读取。

- `1.2.212` 2023-11-16 特性：raft API：`install_snapshot_v1()`。兼容旧版本。
  支持滚动升级。
  在此版本中，databend-meta raft-server 引入了一个新的 API `install_snapshot_v1()`。
  raft-client 将尝试使用此新 API 或原始的 `install_snapshot()`。

- `1.2.479` 2024-05-21 移除：从客户端和服务器中移除 `install_snapshot()`(v0)。
  `install_snapshot_v1()` 是唯一用于安装快照的 API，并且成为客户端的**必需** API。

- `1.2.528` 2024-06-13 移除磁盘数据版本 `V001`。第一个使用 `V002` 的版本是 `1.2.53`，2023-08-08。
  因此，自 `1.2.528` 起，最旧的兼容版本是 `1.2.53`。
  因此，从此版本起，兼容性保持不变。

- `1.2.552` 2024-07-02 引入磁盘 `V003`，使用 `rotbl` 格式快照，
  与 `V002` 兼容。最旧的兼容版本是 `1.2.288`（`1.2.212~1.2.287` 被移除）。


## databend-meta 磁盘数据的兼容性

Databend-meta 的磁盘数据随着时间的推移而演进，同时保持向后兼容性。

### 识别版本

启动时，Databend-meta 会显示磁盘数据版本：

例如，运行 `databend-meta --single` 会产生：

```
Databend Metasrv

Version: v1.1.33-nightly-...
Working DataVersion: V0

On Disk Data:
    Dir: ./.databend/meta
    Version: version=V0, upgrading=None
```

- `Working DataVersion` 表示 Databend-meta 运行的版本。
- `On Disk Data -- DataVersion` 表示磁盘数据的版本。

Working DataVersion 必须大于或等于磁盘 DataVersion；否则会 panic。

磁盘 DataVersion 必须与当前 Databend-meta 版本兼容。
如果不兼容，系统会提示用户降级 Databend-meta 并 panic 退出。

### 自动升级

当 `databend-meta` 启动时，如果磁盘数据与 Working DataVersion 兼容，则会进行升级。
升级进度会打印到 `stderr` 和 INFO 级别的日志文件中，例如：

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

如果 `databend-meta` 在升级完成之前崩溃，
它会清除部分升级的数据，并在再次启动时恢复升级。

### 备份数据兼容性

- 导出的备份数据**只能**使用相同版本的 `databend-metactl` 导入。

- 备份的第一行是版本，例如：
  `["header",{"DataHeader":{"key":"header","value":{"version":"V100","upgrading":null}}}]`

- **不会自动升级**导入时的数据。
  自动升级仅在 `databend-meta` 启动时进行。