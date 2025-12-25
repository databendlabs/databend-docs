---
title: 兼容性
sidebar_label: 兼容性
description: 探究和管理兼容性
---

本指南将介绍如何探究和管理以下兼容性：

- databend-query 与 databend-meta 之间的兼容性。
- 不同版本 databend-meta 之间的兼容性。

## databend-query 与 databend-meta 之间的兼容性

### 识别版本

- 查看 databend-query 的构建版本及其兼容的 databend-meta 版本：

  ```shell
  databend-query --cmd ver

  # output:
  version: 0.7.61-nightly
  min-compatible-metasrv-version: 0.7.59
  ```

  表示该构建的 databend-query（`0.7.61-nightly`）可与版本不低于 `0.7.59`（含）的 databend-meta 通信。

- 查看 databend-meta 的构建版本及其兼容的 databend-query 版本：

  ```shell
  databend-meta --cmd ver

  # output:
  version: 0.7.61-nightly
  min-compatible-client-version: 0.7.57
  ```

  表示该构建的 databend-meta（`0.7.61-nightly`）可与版本不低于 `0.7.57`（含）的 databend-query 通信。

### 维护兼容性

Databend 集群必须使用兼容版本的 databend-query 与 databend-meta 部署。
当且仅当下列条件同时满足时，databend-query 与 databend-meta 才兼容：

```
databend-query.version >= databend-meta.min-compatible-client-version
databend-meta.version  >= databend-query.min-compatible-metasrv-version
```

:::caution

若部署了不兼容版本，databend-query 连接 databend-meta 时将抛出 `InvalidArgument` 错误，可在 databend-query 日志中查看。
随后 databend-query 将停止工作。

:::

#### 兼容性验证协议

当 meta-client（databend-query）与 databend-meta 建立连接时，会在 `handshake` RPC 中检查兼容性。

客户端 `C`（databend-query）与服务器 `S`（databend-meta）维护两个语义版本（Semantic Version）：

- `C` 维护自身版本（`C.ver`）及最低兼容的 `S` 版本（`C.min_srv_ver`）。
- `S` 维护自身版本（`S.ver`）及最低兼容的 `C` 版本（`S.min_cli_ver`）。

握手流程：

- `C` 将自身版本 `C.ver` 发送给 `S`。
- `S` 收到握手请求后，断言 `C.ver >= S.min_cli_ver`。
- `S` 以自身版本 `S.ver` 回复握手响应。
- `C` 收到响应后，断言 `S.ver >= C.min_srv_ver`。

若以上两个断言均成立，则握手成功。

示例：

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

以下为最新 query-meta 兼容性概览：

| `Meta\Query`       | [0.9.41, 1.1.34) | [1.1.34, 1.2.287) | [1.2.287, 1.2.361) | [1.2.361, +∞) |
| :----------------- | :--------------- | :---------------- | :----------------- | :------------ |
| [0.8.30, 0.8.35)   | ❌               | ❌                | ❌                 | ❌            |
| [0.8.35, 0.9.23)   | ✅               | ❌                | ❌                 | ❌            |
| [0.9.23, 0.9.42)   | ✅               | ❌                | ❌                 | ❌            |
| [0.9.42, 1.1.32)   | ✅               | ❌                | ❌                 | ❌            |
| [1.1.32, 1.2.63)   | ✅               | ✅                | ❌                 | ❌            |
| [1.2.63, 1.2.226)  | ✅               | ✅                | ❌                 | ❌            |
| [1.2.226, 1.2.258) | ✅               | ✅                | ✅                 | ❌            |
| [1.2.258, +∞)      | ✅               | ✅                | ✅                 | ✅            |

上表未包含的历史版本：

- Query `[0.7.59, 0.8.80)` 与 Meta `[0.8.30, 0.9.23)` 兼容。
- Query `[0.8.80, 0.9.41)` 与 Meta `[0.8.35, 0.9.42)` 兼容。

<img alt="兼容性状态" src="/img/deploy/compatibility.excalidraw.png"/>

# databend-query 之间的兼容性

## 版本兼容性矩阵

| Query 版本         | 向后兼容                 | 关键变更                                 |
| :----------------- | :----------------------- | :--------------------------------------- |
| [-∞, 1.2.307)      | [-∞, 1.2.311)            | 原始格式                                 |
| [1.2.307, 1.2.311) | [-∞, 1.2.311)            | 新增支持 PB/JSON 的角色信息              |
| [1.2.311, 1.2.709) | [1.2.307, +∞)            | 角色信息仅序列化为 PB                    |
| [1.2.709, +∞)      | [1.2.709, +∞)            | **重要**：Fuse 存储路径已更改            |

## 重要变更与升级说明

### 版本 1.2.307

- 支持使用 PB 与 JSON 反序列化角色信息
- 仅支持将角色信息序列化为 JSON
- **若当前版本早于 1.2.307，请先升级至此版本**

### 版本 1.2.311

- 仅支持将角色信息序列化为 PB
- **在升级至 1.2.307 后，下一步升级至此版本**
- 升级路径示例：`1.2.306 → 1.2.307 → 1.2.311 → 1.2.312`

### 版本 1.2.709

- **重要变更**：Fuse 存储路径已修改
- ⚠️ 1.2.709 之前的版本可能无法读取 1.2.709+ 的部分数据
- ⚠️ **建议**：同一租户下的所有节点应同时升级
- 避免混用 1.2.709 之前与之后的节点，以防潜在的数据访问问题

### 版本 1.2.764

- 若需为 `system_history` 表指定不同存储位置，同一租户下的所有节点需升级至 1.2.764+

## databend-meta 之间的兼容性

| Meta 版本          | 向后兼容                 |
| :----------------- | :----------------------- |
| [0.9.41, 1.2.212)  | [0.9.41, 1.2.212)        |
| [1.2.212, 1.2.479) | [0.9.41, 1.2.479)        |
| [1.2.479, 1.2.655) | [1.2.288, 1.2.655)       |
| [1.2.655, +∞)      | [1.2.288, +∞)            |

![](@site/static/img/deploy/compat-meta-meta-1-2-655.svg)

- `1.2.53` 不兼容，但允许不传输快照的滚动升级。
  快照格式已变更，因此在滚动升级期间需确保所有节点数据最新，避免依赖快照复制。

- `1.2.163` 功能：新增 gRPC API `kv_read_v1()`，用于流式读取。

- `1.2.212` 2023-11-16 功能：新增 raft API `install_snapshot_v1()`，兼容旧版本。
  支持滚动升级。
  此版本中，databend-meta raft-server 引入新 API `install_snapshot_v1()`。
  raft-client 将尝试使用该新 API 或原始 `install_snapshot()`。

- `1.2.479` 2024-05-21 移除：客户端与服务器端移除 `install_snapshot()`(v0)。
  `install_snapshot_v1()` 成为安装快照的唯一 API，且对客户端 **必需**。

- `1.2.528` 2024-06-13 移除：磁盘数据版本 V001。首个使用 V002 的版本为 `1.2.53`（2023-08-08）。
  因此，自 `1.2.528` 起，最旧兼容版本为 `1.2.53`。
  自此版本起，兼容性保持不变。

- `1.2.552` 2024-07-02 引入：磁盘版本 V003，采用 rotbl 格式快照，与 V002 兼容。最旧兼容版本为 `1.2.288`（`1.2.212~1.2.287` 已移除）。

- `1.2.655` 2024-11-11 引入：磁盘版本 V004，采用基于 WAL 的 Raft 日志存储，与 V002 兼容。最旧兼容版本为 `1.2.288`（`1.2.212~1.2.287` 已移除）。

## databend-meta 磁盘数据兼容性

Databend-meta 的磁盘数据随时间演进，同时保持向后兼容。

| 数据版本 | Databend 版本 | 最低兼容版本 |
| :------- | :------------ | :----------- |
| V004     | 1.2.655       | V002         |
| V003     | 1.2.547       | V002         |
| V002     | 1.2.53        | V001         |
| V001     | 1.1.40        | V0           |

### 识别版本

启动时，Databend-meta 会显示磁盘数据版本：

例如，执行 `databend-meta --single` 将输出：

```
Databend Metasrv

Version: v1.1.33-nightly-...
Working DataVersion: V0

On Disk Data:
    Dir: ./.databend/meta
    Version: version=V0, upgrading=None
```

- `Working DataVersion` 表示 Databend-meta 运行时的数据版本。
- `On Disk Data -- DataVersion` 表示磁盘上数据的版本。

工作数据版本必须大于或等于磁盘数据版本，否则将 panic。

磁盘数据版本必须与当前 Databend-meta 版本兼容。
若不兼容，系统将提示用户降级 Databend-meta 并以 panic 退出。

### 自动升级

`databend-meta` 启动时，若磁盘数据与工作数据版本兼容，将执行升级。
升级进度将输出至 `stderr` 并以 INFO 级别写入日志，例如：

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

若 `databend-meta` 在升级完成前崩溃，
再次启动时将清除部分升级数据并继续升级。

### 备份数据兼容性

- 导出的备份数据 **只能** 使用相同版本的 `databend-metactl` 导入。

- 备份首行为版本信息，例如：
  `["header",{"DataHeader":{"key":"header","value":{"version":"V100","upgrading":null}}}]`

- 导入时 **不会** 执行自动升级。
  自动升级仅在 `databend-meta` 启动时进行。