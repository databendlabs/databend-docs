---
title: 新的日志记录
description: 让 Databend 日志记录再次伟大！
---

- RFC PR: [datafuselabs/databend#6729](https://github.com/databendlabs/databend/pull/6729)
- 跟踪问题: [datafuselabs/databend#0000](https://github.com/databendlabs/databend/issues/0000)

# 概要

引入新的配置，使 Databend 的日志记录更加用户友好，并为未来的改进创造更多空间。

# 动机

Databend 的日志记录过于冗长。

每条日志都会同时写入文件和控制台。用户无法控制日志记录行为。

例如：

- 用户无法为标准错误或文件指定 `JSON` / `TEXT` 格式。
- 用户无法禁用文件日志记录。

更糟糕的是，我们无法向用户留下有意义的信息。我们的用户会被大量的日志淹没。我们应该使用 `stdout` 与用户沟通。

# 指南级解释

通过此 RFC，用户将拥有新的配置选项：

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

- 用户可以禁用任何输出。
- 用户可以控制日志级别和格式。

默认情况下，我们将仅启用 `file` 日志。启动 `databend-query` 将不再将记录打印到 `stderr`。我们将改为将以下消息打印到 `stdout`：

```shell
Databend Server starting at xxxxxxx (took x.xs)

Information

version: v0.7.128-xxxxx
logs:
  file:   enabled dir=./databend/logs level=DEBUG
  stderr: disabled (set LOG_STDERR_ON=true to enable)
storage: s3://endpoint=127.0.0.1:1090,bucket=test,root=/path/to/data
metasrv: embed

Connection

MySQL:             mysql://root@localhost:3307/xxxx
clickhouse:        clickhouse://root@localhost:9000/xxxx
clickhouse (HTTP): http://root:@localhost:9001

Useful Links

Documentation:    https://docs.databend.com
Looking for help: https://github.com/databendlabs/databend/discussions
```

要启用 `stderr` 日志，我们可以设置 `LOG_STDERR_ON=true` 或 `RUST_LOG=info`。

# 参考级解释

在内部，我们将在 `Config` 中添加新的配置结构。旧的配置将保持兼容。

# 缺点

无

# 理由和替代方案

## Minio

[Minio](https://github.com/minio/minio) 不会将日志打印到 `stdout` 或 `stderr`。相反，他们只打印欢迎消息：

```shell
:) minio server . --address ":9900"
MinIO Object Storage Server
Copyright: 2015-0000 MinIO, Inc.
License: GNU AGPLv3 [https://www.gnu.org/licenses/agpl-3.0.html](https://www.gnu.org/licenses/agpl-3.0.html)
Version: RELEASE.2022-06-30T20-58-09Z (go1.18.3 Linux/amd64)

API: http://192.168.1.104:9900  http://172.16.195.1:9900  http://192.168.97.1:9900  http://127.0.0.1:9900
root user: minioadmin
RootPass: minioadmin

WARNING: Console endpoint is listening on a dynamic port (34219), please use --console-address ":PORT" to choose a static port.
Console: http://192.168.1.104:34219 http://172.16.195.1:34219 http://192.168.97.1:34219 http://127.0.0.1:34219
root user: minioadmin
RootPass: minioadmin

Command-line: https://docs.min.io/docs/minio-client-quickstart-guide
   $ mc alias set myminio http://192.168.1.104:9900 minioadmin minioadmin

Documentation: https://docs.min.io

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ You are running an older version of MinIO released 2 weeks ago ┃
┃ Update: Run `mc admin update`                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## CockroachDB

[CockroachDB](https://www.cockroachlabs.com/) 默认情况下不会将日志打印到 `stderr`：

他们允许用户使用 `--log=<yaml-config>` 指定日志记录行为。

```shell
:) ./cockroach start-single-node
CockroachDB node starting at 2022-07-21 06:56:04.36859988 +0000 UTC (took 0.7s)
build:               CCL v22.1.4 @ 2022/07/19 17:09:48 (go1.17.11)
WebUI:               http://xuanwo-work:8080
sql:                 postgresql://root@xuanwo-work:26257/defaultdb?sslmode=disable
sql (JDBC):          JDBC:postgresql://xuanwo-work:26257/defaultdb?sslmode=disable&user=root
RPC client flags:    ./cockroach <client cmd> --host=xuanwo-work:26257 --insecure
logs:                /tmp/cockroach-v22.1.4.linux-amd64/cockroach-data/logs
temp dir:            /tmp/cockroach-v22.1.4.linux-amd64/cockroach-data/cockroach-temp3237741659
external I/O path:   /tmp/cockroach-v22.1.4.linux-amd64/cockroach-data/extern
store[0]:            path=/tmp/cockroach-v22.1.4.linux-amd64/cockroach-data
storage engine:      pebble
clusterID:           e1ab003d-7eba-48cd-b635-7a51f40269c2
status:              restarted preexisting node
nodeID:              1
```

# 先例

无

# 未解决的问题

无

# 未来的可能性

## 添加 HTTP 日志支持

允许将日志发送到 HTTP 端点。

## 支持从 stdin 读取 SQL

基于此 RFC，我们可以实现从 stdin 读取 SQL。
