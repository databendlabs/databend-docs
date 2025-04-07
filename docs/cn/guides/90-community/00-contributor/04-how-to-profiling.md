```md
---
title: 如何分析 Databend
---

## CPU 分析

```
go tool pprof -http="0.0.0.0:8081" http://localhost:8080/debug/pprof/profile?seconds=30
```

打开 `<your-ip>:8081` 并在站点标题的 VIEW 菜单中选择 `Flame Graph`:
<img src="https://user-images.githubusercontent.com/172204/208336392-5b64bb9b-cce8-4562-9e05-c3d538e9d8a6.png"/>

## 内存分析

`databend-query` 和 `databend-meta` 可以选择使用 `jemalloc` 构建，
它提供了各种内存分析功能。

目前，它在 Mac 上不起作用，无论使用 intel 还是 Arm。

### 启用内存分析

1. 构建启用 `memory-profiling` 功能的 `databend-query`:
  ```
  cargo build --bin databend-query --release --features memory-profiling
  ```

2. 启动 `databend`，使用环境变量 `MALLOC_CONF` 启用内存分析:
  
  ```
  MALLOC_CONF=prof:true,lg_prof_interval:30 ./target/release/databend-query
  ```

### 生成堆分析

在 `pdf` 中生成一个调用图，说明此间隔期间的内存分配:

```
jeprof --pdf ./target/release/databend-query heap.prof > heap.pdf
```

<img src="https://user-images.githubusercontent.com/172204/204963954-f6eacf10-d8bd-4469-9c8d-7d30955f1a78.png" width="600"/>

### 快速 jeprof
对于大型堆分析，jeprof 非常慢，瓶颈在于 `addr2line`，如果想从 **30 分钟加速到 3 秒**，请使用:
```
git clone https://github.com/gimli-rs/addr2line
cd addr2line
cargo b --examples -r
cp ./target/release/examples/addr2line <your-addr2line-find-with-whereis-addr2line>
```
