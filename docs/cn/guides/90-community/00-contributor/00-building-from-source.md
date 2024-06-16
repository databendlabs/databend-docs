---
title: 构建 Databend
sidebar_label: 构建 Databend
description:
  从源码获取并构建 Databend
---

作为一个开源平台，Databend 为用户提供了根据其特定需求修改、分发和增强软件的灵活性。此外，用户还可以从源代码构建 Databend，这使他们能够充分了解软件的工作原理，并有可能为其开发做出贡献。

:::tip
Databend 提供了一个包含所有必要开发工具的 Docker 镜像，但目前仅适用于 amd64 架构。要使用它，请确保 Docker 已安装并正在运行，然后运行 `INTERACTIVE=true scripts/setup/run_build_tool.sh`。这将启动一个用于构建和测试的环境，`INTERACTIVE=true` 标志启用交互模式。
:::

## 先决条件

在构建 Databend 之前，请确保已满足以下要求：

- 构建 Databend 的源代码至少需要 16 GB 的 RAM。
- 您已安装以下所需工具：
  - Git
  - cmake
  - [rustup](https://rustup.rs/)

## 构建 Databend

按照以下步骤构建 Databend：

1. 下载源代码。

```shell
git clone https://github.com/datafuselabs/databend.git
```

2. 安装依赖并编译源代码。

```shell
cd databend
make setup -d
export PATH=$PATH:~/.cargo/bin
```

3. 构建 Databend。

  - 要构建包含调试信息的 Databend 以进行调试，请运行 `make build`。结果文件将位于 "target/debug/" 目录中。

```shell
make build
```
  - 要为生产环境构建 Databend，优化您的本地 CPU，请运行 `make build-release`。结果文件将位于 "target/release/" 目录中。

```shell
make build-release
```

## 启动 Databend 进行调试

```shell
# 1. 首先启动 databend-meta：
nohup target/debug/databend-meta --single --log-level=ERROR &

# 2. 启动 databend-query 并将其连接到 databend-meta：
nohup target/debug/databend-query -c scripts/ci/deploy/config/databend-query-node-1.toml &
```
:::tip
要停止 databend-meta 和 databend-query，请运行以下命令：

```shell
killall -9 databend-meta
killall -9 databend-query
```
:::

## 常见错误

1. 在 osx 中构建：
  - 最好使用官方的 clang 而不是 apple clang：
    ```bash
    brew install llvm
    ```
    并设置编译器环境，例如：

    ```bash
    export CMAKE_CC_COMPILER=/opt/homebrew/opt/llvm/bin/clang
    export CMAKE_CXX_COMPILER=/opt/homebrew/opt/llvm/bin/clang++
    ```

  - 使用自定义 jemalloc 环境配置：
    ```bash
    export JEMALLOC_SYS_WITH_LG_PAGE=14
    export JEMALLOC_SYS_WITH_MALLOC_CONF="oversize_threshold:0,dirty_decay_ms:5000,muzzy_decay_ms:5000"
    ```


2. protoc 失败：未知标志：--experimental_allow_proto3_optional\n

```bash
  --- stderr
  Error: Custom { kind: Other, error: "protoc failed: Unknown flag: --experimental_allow_proto3_optional\n" }
warning: build failed, waiting for other jobs to finish...
All done...
# 通过压缩二进制文件来减小二进制大小。
objcopy --compress-debug-sections=zlib-gnu /home/aucker/mldb/databend/target/release/databend-query
objcopy: '/home/aucker/mldb/databend/target/release/databend-query': No such file
make: *** [Makefile:51: build-release] Error 1
```

错误信息表明在使用 protoc（一种协议缓冲区编译器）时由于使用了未知标志（--experimental_allow_proto3_optional）导致构建 Databend 出现问题。这个标志只在 protoc 版本 3.12 或更高版本中可用，当前使用的版本不支持它。

推荐的解决方案是升级到支持该标志的 protoc 版本。您可以通过从官方发布页面（ https://github.com/protocolbuffers/protobuf/releases ）下载最新版本的 protoc 并在您的系统上安装它来实现这一点。

```bash
PB_REL="https://github.com/protocolbuffers/protobuf/releases"
curl -LO $PB_REL/download/v3.15.8/protoc-3.15.8-linux-x86_64.zip
unzip protoc-3.15.8-linux-x86_64.zip
$sudo cp bin/protoc /usr/bin/
$protoc --version
libprotoc 3.15.6
```

3. 在一个 fork 的 Databend 项目中无法连接到 databend-meta。

这个问题可能是由于 Databend-meta 实现的版本检查没有被 fork 项目满足所导致的。

一个可能的解决方案是使用命令 `git fetch https://github.com/datafuselabs/databend.git --tags` 从官方 Databend 仓库获取最新的标签。这应该确保项目使用的是最新版本的 Databend-meta，并将通过版本检查。
