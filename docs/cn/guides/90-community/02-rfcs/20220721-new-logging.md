---
title: 新的日志系统
description: 让 Databend 的日志系统再次伟大起来！
---

- RFC PR: [datafuselabs/databend#6729](https://github.com/datafuselabs/databend/pull/6729)
- 跟踪问题: [datafuselabs/databend#0000](https://github.com/datafuselabs/databend/issues/0000)

# 概要

引入一个新的配置项，使得 databend 的日志系统更加用户友好，并为进一步的改进创造更多空间。

# 动机

Databend 的日志系统过于冗长。

每条日志都会同时写入文件和控制台。用户无法控制日志行为。

例如：

- 用户无法为 stderr 或文件指定 `JSON` / `TEXT` 格式。
- 用户无法禁用文件日志

更糟糕的是，我们无法向用户留下有意义的信息。我们的用户将被大量的日志淹没。我们应该使用 `stdout` 与用户通信。

# 指南级解释

通过这个 RFC，用户将有新的配置选项：

```toml
[log.file]
on = true
level = "debug"
dir = "./databend/logs"
format = "json"

[log.stderr]
on = true
level = "debug"
format = "text"
```

- 用户可以禁用任何输出
- 用户可以控制日志级别和格式

默认情况下，我们将仅启用 `file` 日志。并且启动 `databend-query` 将不再向 `stderr` 打印记录。我们将改为向 `stdout` 打印以下消息：

```shell
Databend Server starting at xxxxxxx (took x.xs)

信息

version: v0.7.128-xxxxx
logs:
  file:   enabled dir=./databend/logs level=DEBUG
  stderr: disabled (set LOG_STDERR_ON=true to enable)
storage: s3://endpoint=127.0.0.1:1090,bucket=test,root=/path/to/data
metasrv: embed

连接

MySQL:             mysql://root@localhost:3307/xxxx
clickhouse:        clickhouse://root@localhost:9000/xxxx
clickhouse (HTTP): http://root:@localhost:9001

有用的链接

文档:    https://docs.databend.com
寻求帮助: https://github.com/datafuselabs/databend/discussions
```

要启用 `stderr` 日志，我们可以设置 `LOG_STDERR_ON=true` 或 `RUST_LOG=info`。

# 参考级解释

在内部，我们将在 `Config` 中添加新的配置结构。旧配置将保持兼容。

# 缺点

无

# 理由和替代方案

## Minio

[Minio](https://github.com/minio/minio) 不会将日志打印到 `stdout` 或 `stderr`。相反，他们只打印欢迎消息：

```shell
:) minio server . --address ":9900"
MinIO 对象存储服务器
版权: 2015-0000 MinIO, Inc.
许可: GNU AGPLv3 [https://www.gnu.org/licenses/agpl-3.0.html](https://www.gnu.org/licenses/agpl-3.0.html)
版本: RELEASE.2022-06-30T20-58-09Z (go1.18.3 Linux/amd64)

API: http://192.168.1.104:9900  http://172.16.195.1:9900  http://192.168.97.1:9900  http://127.0.0.1:9900
root user: minioadmin
RootPass: minioadmin

警告: 控制台端点正在监听一个动态端口 (34219)，请使用 --console-address ":PORT" 选择一个静态端口。
控制台: http://192.168.1.104:34219 http://172.16.195.1:34219 http://192.168.97.1:34219 http://127.0.0.1:34219
root user: minioadmin
RootPass: minioadmin

命令行: https://docs.min.io/docs/minio-client-quickstart-guide
   $ mc alias set myminio http://192.168.1.104:9900 minioadmin minioadmin

文档: https://docs.min.io

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 您正在运行 MinIO 的一个旧版本，发布于 2 周前                       ┃
┃ 更新: 运行 `mc admin update`                                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## CockroachDB

[CockroachDB](https://www.cockroachlabs.com/) 默认不会将日志打印到 `stderr`：

他们允许用户使用 `--log=<yaml-config>` 来指定日志行为。

```shell
:) ./cockroach start-single-node
CockroachDB 节点开始于 2022-07-21 06:56:04.36859988 +0000 UTC (耗时 0.7s)
构建:               CCL v22.1.4 @ 2022/07/19 17:09:48 (go1.17.11)
WebUI:               http://xuanwo-work:8080
sql:                 postgresql://root@xuanwo-work:26257/defaultdb?sslmode=disable
sql (JDBC):          JDBC:postgresql://xuanwo-work:26257/defaultdb?sslmode=disable&user=root
RPC 客户端标志:    ./cockroach <client cmd> --host=xuanwo-work:26257 --insecure
日志:                /tmp/cockroach-v22.1.4.linux-amd64/cockroach-data/logs
临时目录:            /tmp/cockroach-v22.1.4.linux-amd64/cockroach-data/cockroach-temp3237741659
外部 I/O 路径:   /tmp/cockroach-v22.1.4.linux-amd64/cockroach-data/extern
存储[0]:            路径=/tmp/cockroach-v22.1.4.linux-amd64/cockroach-data
存储引擎:      pebble
集群ID:           e1ab003d-7eba-48cd-b635-7a51f40269c2
状态:              重启预存在的节点
节点ID:              1
```

# 先例

无

# 未解决的问题

无

# 未来可能性

## 添加 HTTP 日志支持

允许将日志发送到 HTTP 端点

## 支持从 stdin 读取 SQL

基于这个 RFC，我们可以实现从 stdin 读取 SQL。
