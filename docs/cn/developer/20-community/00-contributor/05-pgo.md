---
title: PGO 优化
sidebar_label: PGO 优化
description: Building an optimized Databend with Profile Guided Optimization.
---

Profile-guided Optimization 是一种编译器优化技术，它涉及在程序执行期间收集典型的执行数据，包括可能的分支。然后，这些收集到的数据用于优化代码的各个方面，例如内联、条件分支、机器代码布局和寄存器分配。

根据[测试](https://github.com/databendlabs/databend/issues/9387#issuecomment-1566210063)，PGO 将 Databend 性能提升高达 10%。性能优势取决于您的典型工作负载 - 您可能会获得更好或更差的结果。

有关 Databend 中 PGO 的更多信息，您可以阅读 [Issue #9387 | Feature: add PGO support](https://github.com/databendlabs/databend/issues/9387)。

## Prerequisites

在您使用 PGO 构建 Databend 之前，请确保已满足以下要求：

- 通过将 `llvm-tools-preview` 组件添加到您的工具链中来安装 PGO 辅助二进制文件：

```bash
$ rustup component add llvm-tools-preview
```

- 安装 [`cargo-pgo`](https://crates.io/crates/cargo-pgo)，它可以更轻松地使用 [PGO](https://doc.rust-lang.org/rustc/profile-guided-optimization.html) 来优化 Rust 二进制文件。

```bash
$ cargo install cargo-pgo
```

## Building Databend with PGO

请按照以下步骤构建 Databend：

1. 下载源代码。

```shell
git clone https://github.com/databendlabs/databend.git
```

2. 安装依赖项并编译源代码。

```shell
cd databend
make setup -d
export PATH=$PATH:~/.cargo/bin
```

3. 使用 `cargo-pgo` 构建 Databend。由于 PyO3 存在一个[已知问题](https://github.com/PyO3/pyo3/issues/1084)，我们需要在构建过程中跳过 `bendpy`。

```shell
cargo pgo build -- --workspace --exclude bendpy
```

4. 导入数据集并运行典型查询工作负载。

```shell
# 在单机模式下运行 Databend，或者您可以尝试在集群模式下运行它。
BUILD_PROFILE=<target-tuple>/release ./scripts/ci/deploy/databend-query-standalone.sh
# 这里 Databend 的 SQL 逻辑测试用作演示，但您需要针对目标工作负载进行调整
ulimit -n 10000;ulimit -s 16384; cargo run -p databend-qllogictest --release -- --enable_sandbox --parallel 16 --no-fail-fast
# 停止正在运行的 databend 实例以转储配置文件数据。
killall databend-query
killall databend-meta
```

:::tip

- 您需要检查与当前构建对应的平台三元组，并替换上面的 `<target-tuple>`。例如：`x86_64-unknown-linux-gnu`。
- 为了获得更精确的配置文件，请使用以下环境变量运行它：`LLVM_PROFILE_FILE=./target/pgo-profiles/%m_%p.profraw`。
  :::

5. 构建优化的 Databend

```shell
cargo pgo optimize -- --workspace --exclude bendpy
```