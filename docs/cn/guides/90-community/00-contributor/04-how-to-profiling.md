---
title: 如何对 Databend 进行性能分析
---

## CPU 性能分析

```
go tool pprof -http="0.0.0.0:8081" http://localhost:8080/debug/pprof/profile?seconds=30
```

打开 `<your-ip>:8081` 并在网站头部的 VIEW 菜单中选择 `Flame Graph`：
<img src="https://user-images.githubusercontent.com/172204/208336392-5b64bb9b-cce8-4562-9e05-c3d538e9d8a6.png"/>

## 内存性能分析

`databend-query` 和 `databend-meta` 可以选择性地使用 `jemalloc` 构建，
它提供了各种内存性能分析功能。

目前，无论是在 Mac 的 intel 还是 Arm 上，这都不起作用。

### 启用内存性能分析

1. 使用 `memory-profiling` 功能启用构建 `databend-query`：
  ```
  cargo build --bin databend-query --release --features memory-profiling
  ```

2. 使用环境变量 `MALLOC_CONF` 启用内存性能分析来启动 `databend`：
  
  ```
  MALLOC_CONF=prof:true,lg_prof_interval:30 ./target/release/databend-query
  ```

### 生成堆分析文件

生成一个 `pdf` 调用图，展示这段时间内的内存分配情况：

```
jeprof --pdf ./target/release/databend-query heap.prof > heap.pdf
```

<img src="https://user-images.githubusercontent.com/172204/204963954-f6eacf10-d8bd-4469-9c8d-7d30955f1a78.png" width="600"/>

### 快速 jeprof
对于大型堆分析，jeprof 非常慢，瓶颈是 `addr2line`，如果你想从 **30 分钟加速到 3 秒**，请使用：
```
git clone https://github.com/gimli-rs/addr2line
cd addr2line
cargo b --examples -r
cp ./target/release/examples/addr2line <your-addr2line-find-with-whereis-addr2line>
```