---
title: 如何对 Databend 进行性能分析
---

## CPU 性能分析

```
go tool pprof -http="0.0.0.0:8081" http://localhost:8080/debug/pprof/profile?seconds=30
```

打开 `<your-ip>:8081` 并在网站头部的 VIEW 菜单中选择 `Flame Graph`（火焰图）：
<img src="https://user-images.githubusercontent.com/172204/208336392-5b64bb9b-cce8-4562-9e05-c3d538e9d8a6.png"/>

## 查询（Query）级 CPU 性能分析

`EXPLAIN PERF <statement>` 也可用于 CPU 性能分析，它专注于特定的查询（Query），并从其他节点收集 CPU 性能分析数据，以帮助分析查询（Query）性能。更多详细信息，请查看 [EXPLAIN PERF](/sql/sql-commands/explain-cmds/explain-perf)。

## 内存性能分析

`databend-query` 和 `databend-meta` 可以选择性地使用 `jemalloc` 进行构建，`jemalloc` 提供了多种内存性能分析功能。

目前，此功能在 Mac（无论是 Intel 还是 Arm 芯片）上无法使用。

### 启用内存性能分析

1. 启用 `memory-profiling` 功能来构建 `databend-query`：
  ```
  cargo build --bin databend-query --release --features memory-profiling
  ```

2. 启动 `databend`，使用环境变量 `MALLOC_CONF` 来启用内存性能分析：
  
  ```
  MALLOC_CONF=prof:true,lg_prof_interval:30 ./target/release/databend-query
  ```

### 生成堆分析报告（Heap Profile）

生成一个 `pdf` 格式的调用图，展示此时间间隔内的内存分配情况：

```
jeprof --pdf ./target/release/databend-query heap.prof > heap.pdf
```

<img src="https://user-images.githubusercontent.com/172204/204963954-f6eacf10-d8bd-4469-9c8d-7d30955f1a78.png" width="600"/>

### 快速 jeprof
对于大型堆分析，jeprof 非常慢，瓶颈在于 `addr2line`。如果你想将速度从 **30 分钟** 提升到 **3 秒**，请使用：
```
git clone https://github.com/gimli-rs/addr2line
cd addr2line
cargo b --examples -r
cp ./target/release/examples/addr2line <your-addr2line-find-with-whereis-addr2line>
```