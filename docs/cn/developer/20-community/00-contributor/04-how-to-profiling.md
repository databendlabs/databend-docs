---
title: 性能分析
---

import FunctionDescription from '@site/src/components/FunctionDescription';

## CPU 性能分析

```
go tool pprof -http="0.0.0.0:8081" http://localhost:8080/debug/pprof/profile?seconds=30
```

打开 `<your-ip>:8081`，并从网站头部的 VIEW 菜单中选择 `Flame Graph`：
<img alt="CPU profiling" src="https://user-images.githubusercontent.com/172204/208336392-5b64bb9b-cce8-4562-9e05-c3d538e9d8a6.png"/>

## 查询级别的 CPU 性能分析

`EXPLAIN PERF <statement>` 也可用于 CPU 性能分析，它专注于特定查询，并从其他节点收集 CPU 分析数据，以帮助分析查询性能。更多细节请查阅 [EXPLAIN PERF](/sql/sql-commands/explain-cmds/explain-perf)。

## 对正在运行的查询进行性能分析

<FunctionDescription description="Introduced or updated: Unreleased"/>

查询变慢后，可以通过 Query Admin API 采集 CPU 样本。无需使用 `EXPLAIN PERF` 重新运行查询。请使用可信的管理连接。不要将管理端口暴露到公共网络。这些端点不在 SQL HTTP 端口上。

1. 在 Query Admin API 地址上打开 `/v1/processlist`，例如 `http://127.0.0.1:8080`。
2. 复制正在运行的查询的 `current_query_id`。
3. 在同一地址上打开 `/v1/queries/<query_id>/perf`。
4. 在查看器中启动采样。
5. 收集足够的数据后停止采样。

查看器默认每 30 秒刷新一次累计火焰图。每个集群节点都有独立的火焰图。也可以直接调用 API：

```shell
ADMIN_URL='http://127.0.0.1:8080'
QUERY_ID='replace-with-current-query-id'
PERF_URL="$ADMIN_URL/v1/queries/$QUERY_ID/perf"

curl -sS -X POST "$PERF_URL/start?frequency=99&seconds=300"
curl -sS "$PERF_URL/status"
# Allow time to collect samples, then stop and download them.
curl -sS -X POST "$PERF_URL/stop"
curl -fS "$PERF_URL/flamegraph?format=html" -o query-flamegraph.html
```

在浏览器中打开 `query-flamegraph.html`。如需导出供其他性能分析工具使用的折叠堆栈，请使用 `GET .../flamegraph?format=folded`。

| 目标 | 基础路径 | 默认采样 | 最长持续时间 |
|---|---|---|---|
| 一个正在运行的查询 | `/v1/queries/<query_id>/perf` | 99 Hz，持续 300 秒 | 3,600 秒 |
| 所有集群节点上的全部线程 | `/v1/perf` | 49 Hz，持续 60 秒 | 600 秒 |

两个基础路径均支持查看器、`POST /start`、`POST /stop`、`GET /status` 和 `GET /flamegraph`。全进程采样的开销可能高于查询采样。请先使用较短的采样时间。尚未测量其在大型 Linux 主机上的开销。

### 解读结果与限制

- 检查响应中 `nodes` 对象的每个条目。`200 OK` 不表示每个节点都已启动采样。请读取各节点的 `state` 和 `message`。
- 如果查询未在任何节点上运行，且未保留性能分析数据，`nodes` 可以为空。查询不存在本身不会导致 `404`。没有样本时，HTML 火焰图返回 `404`。折叠堆栈输出可以为空。
- 每个节点只允许一个活动 CPU 性能分析器。查询采样、全进程采样、`EXPLAIN PERF` 和 `/debug/pprof/profile` 共同占用此资源。请先结束当前采样，再启动另一个。
- 样本从启动时起累计。若要查看最近一段时间，请先停止再重新启动。重新启动会替换此前的样本。
- 采样开始后才在某个节点上启动的查询片段，不会纳入该节点的采样。短查询可能在收集到足够样本前就已结束。

## 内存性能分析

`databend-query` 和 `databend-meta` 可以选择性地使用 `jemalloc` 进行构建，`jemalloc` 提供了多种内存性能分析功能。

目前，它在 Mac（无论是 Intel 还是 Arm 芯片）上无法工作。

### 启用内存性能分析

1. 启用 `memory-profiling` 功能来构建 `databend-query`：

```
cargo build --bin databend-query --release --features memory-profiling
```

2. 启动 `databend`，使用环境变量 `MALLOC_CONF` 来启用内存性能分析：

```
MALLOC_CONF=prof:true,lg_prof_interval:30 ./target/release/databend-query
```

### 生成堆分析报告

生成一个 `pdf` 格式的调用图，展示此时间间隔内的内存分配情况：

```
jeprof --pdf ./target/release/databend-query heap.prof > heap.pdf
```

<img alt="Generate heap profile" src="https://user-images.githubusercontent.com/172204/204963954-f6eacf10-d8bd-4469-9c8d-7d30955f1a78.png" width="600"/>

### 快速 jeprof

对于大型堆分析，jeprof 非常慢，瓶颈在于 `addr2line`。如果你想从 **30 分钟** 加速到 **3 秒**，请使用：

```
git clone https://github.com/gimli-rs/addr2line
cd addr2line
cargo b --examples -r
cp ./target/release/examples/addr2line <your-addr2line-find-with-whereis-addr2line>
```