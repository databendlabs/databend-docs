---
title: 兼容性
sidebar_label: 兼容性
description:
  检查和管理兼容性
---

本指南将介绍如何检查和管理以下组件之间的兼容性：
- databend-query 和 databend-meta 之间
- 不同版本的 databend-meta 之间

## databend-query 和 databend-meta 之间的兼容性

### 识别版本

- 查询 databend-query 的构建版本及其兼容的 databend-meta 版本：

  ```shell
  databend-query --cmd ver

  # output:
  version: 0.7.61-nightly
  min-compatible-metasrv-version: 0.7.59
  ```

  这意味着此构建版本的 databend-query（`0.7.61-nightly`）可与版本至少为 `0.7.59`（含）的 databend-meta 通信。

- 查询 databend-meta 的构建版本及其兼容的 databend-query 版本：

  ```shell
  databend-meta --cmd ver

  # output:
  version: 0.7.61-nightly
  min-compatible-client-version: 0.7.57
  ```

  这意味着此构建版本的 databend-meta（`0.7.61-nightly`）可与版本至少为 `0.7.57`（含）的 databend-query 通信。

### 维护兼容性

Databend 集群必须部署兼容版本的 databend-query 和 databend-meta。
当且仅当以下条件成立时，两者兼容：

```
databend-query.version >= databend-meta.min-compatible-client-version
databend-meta.version  >= databend-query.min-compatible-metasrv-version
```

:::caution

若部署不兼容版本，当 databend-query 尝试连接 databend-meta 时将出现 `InvalidArgument` 错误（可在 databend-query 日志中查看），
随后 databend-query 将停止工作。

:::

#### 兼容性验证协议

当 meta-client（databend-query）与 databend-meta 建立连接时，会在 `handshake` RPC 中检查兼容性。

客户端 `C`（databend-query）和服务器 `S`（databend-meta）各自维护两个语义版本：
- `C` 维护自身版本（`C.ver`）和兼容的最低 `S` 版本（`C.min_srv_ver`）
- `S` 维护自身版本（`S.ver`）和兼容的最低 `C` 版本（`S.min_cli_ver`）

握手流程：
1. `C` 发送 `C.ver` 至 `S`
2. `S` 收到请求后断言 `C.ver >= S.min_cli_ver`
3. `S` 回复握手响应并返回 `S.ver`
4. `C` 收到响应后断言 `S.ver >= C.min_srv_ver`

两项断言均成立时握手成功。

示例：
- `S: (ver=3, min_cli_ver=1)` 兼容 `C: (ver=3, min_srv_ver=2)`
- `S: (ver=4, min_cli_ver=4)` **不**兼容 `C: (ver=3, min_srv_ver=2)`  
  （因 `C.ver(3) >= S.min_cli_ver(4)` 不成立）

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

最新 query-meta 兼容性图示：

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

历史版本补充：
- Query `[0.7.59, 0.8.80)` 兼容 Meta `[0.8.30, 0.9.23)`
- Query `[0.8.80, 0.9.41)` 兼容 Meta `[0.8.35, 0.9.42)`

<img src="/img/deploy/compatibility.excalidraw.png"/>

# databend-query 版本兼容性

## 版本兼容性矩阵

| Query 版本         | 向后兼容版本              | 主要变更 |
|:-------------------|:--------------------------|:------------|
| [-∞, 1.2.307)      | [-∞, 1.2.311)             | 原始格式 |
| [1.2.307, 1.2.311) | [-∞, 1.2.311)             | 新增 Role 信息（支持 PB/JSON） |
| [1.2.311, 1.2.709) | [1.2.307, +∞)             | Role 信息仅序列化为 PB |
| [1.2.709, +∞)      | [1.2.709, +∞)             | **重要**：Fuse 存储路径变更 |

## 重要变更与升级说明

### 版本 1.2.307
- 支持通过 PB/JSON 反序列化 Role 信息
- 仅支持将 Role 信息序列化为 JSON
- **若使用早期版本，请优先升级至此版本**

### 版本 1.2.311
- 仅支持将 Role 信息序列化为 PB
- **升级至 1.2.307 后需升级至此版本**
- 升级路径示例：`1.2.306 → 1.2.307 → 1.2.311 → 1.2.312`

### 版本 1.2.709
- **重要变更**：Fuse 存储路径调整
- ⚠️ 1.2.709 之前版本可能无法读取 1.2.709+ 版本的部分数据
- ⚠️ **建议**：同一租户下所有节点需同时升级
- 避免混用 1.2.709 前后版本节点，防止数据访问异常

### 版本 1.2.764
- 若需为 `system_history` 表指定不同存储位置，租户内所有节点需升级至 1.2.764+

## databend-meta 版本兼容性

| Meta 版本           | 向后兼容版本             |
|:--------------------|:-------------------------|
| [0.9.41,   1.2.212) | [0.9.41,  1.2.212)       |
| [1.2.212,  1.2.479) | [0.9.41,  1.2.479)       |
| [1.2.479,  1.2.655) | [1.2.288, 1.2.655)       |
| [1.2.655, +∞)       | [1.2.288, +∞)            |

![](@site/static/img/deploy/compat-meta-meta-1-2-655.svg)

- `1.2.53` 不兼容，允许无快照传输的滚动升级  
  快照格式变更要求所有节点数据保持最新，确保无需快照复制
- `1.2.163` 功能：新增流式读取 gRPC API `kv_read_v1()`
- `1.2.212` (2023-11-16) 功能：新增 raft API `install_snapshot_v1`（兼容旧版本，支持滚动升级）  
  raft-client 将自动选择新 API 或原始 `install_snapshot()`
- `1.2.479` (2024-05-21) 移除：客户端/服务端的 `install_snapshot()`(v0)  
  `install_snapshot_v1()` 成为唯一快照安装 API（**必需**）
- `1.2.528` (2024-06-13) 移除磁盘数据版本 `V001`  
  首个使用 `V002` 的版本为 `1.2.53` (2023-08-08)，故自此版本起最低兼容版本为 `1.2.53`
- `1.2.552` (2024-07-02) 引入磁盘数据版本 `V003`（`rotbl` 格式快照，兼容 `V002`）  
  最低兼容版本为 `1.2.288`（已移除 `1.2.212~1.2.287`）
- `1.2.655` (2024-11-11) 引入磁盘数据版本 `V004`（基于 WAL 的 Raft 日志存储，兼容 `V002`）  
  最低兼容版本为 `1.2.288`（已移除 `1.2.212~1.2.287`）

## databend-meta 磁盘数据兼容性

Databend-meta 磁盘数据随版本演进并保持向后兼容：

| 数据版本（DataVersion） | Databend 版本 | 最低兼容版本 |
|:------------|:-----------------|:--------------------|
| V004        | 1.2.655          | V002                | 
| V003        | 1.2.547          | V002                | 
| V002        | 1.2.53           | V001                | 
| V001        | 1.1.40           | V0                  |

### 识别版本

启动时显示磁盘数据版本：
```shell
databend-meta --single

# 输出：
Databend Metasrv

Version: v1.1.33-nightly-...
Working DataVersion: V0

On Disk Data:
    Dir: ./.databend/meta
    Version: version=V0, upgrading=None
```
- **工作数据版本（Working DataVersion）**：运行所用版本
- **磁盘数据版本（On Disk Data Version）**：磁盘数据版本

工作数据版本 ≥ 磁盘数据版本（否则 panic）。  
磁盘数据版本需与当前版本兼容（否则提示降级并退出）。

### 自动升级

启动时若磁盘数据与工作版本兼容，将自动升级。升级进度输出至 `stderr` 和日志：
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
若升级过程中崩溃，重启时将清除部分升级数据并继续。

### 备份数据兼容性

- 导出备份**仅限**同版本 `databend-metactl` 导入
- 备份首行为版本标识：  
  `["header",{"DataHeader":{"key":"header","value":{"version":"V100","upgrading":null}}}]`
- 导入时**不触发**自动升级（仅 `databend-meta` 启动时执行）