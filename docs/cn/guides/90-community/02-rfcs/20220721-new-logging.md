---
title: 新的日志记录
description: 让 Databend 日志记录再次伟大！
---

- RFC PR: [datafuselabs/databend#6729](https://github.com/datafuselabs/databend/pull/6729)
- 跟踪问题: [datafuselabs/databend#0000](https://github.com/datafuselabs/databend/issues/0000)

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

- 用户可以禁用任何输出
- 用户可以控制日志级别和格式

默认情况下，我们将仅启用 `file` 日志。启动 `databend-query` 将不再向 `stderr` 打印记录。我们将改为向 `stdout` 打印以下信息：

```shell
Databend Server 启动于 xxxxxxx (耗时 x.xs)

信息

版本: v0.7.128-xxxxx
日志:
  文件:   启用 目录=./databend/logs 级别=DEBUG
  标准错误: 禁用 (设置 LOG_STDERR_ON=true 以启用)
存储: s3://endpoint=127.0.0.1:1090,bucket=test,root=/path/to/data
元服务: 嵌入式

连接

MySQL:             mysql://root@localhost:3307/xxxx
clickhouse:        clickhouse://root@localhost:9000/xxxx
clickhouse (HTTP): http://root:@localhost:9001

有用链接

文档:    https://docs.databend.com
寻求帮助: https://github.com/datafuselabs/databend/discussions
```

要启用 `stderr` 日志，我们可以设置 `LOG_STDERR_ON=true` 或 `RUST_LOG=info`。

# 参考级解释

在内部，我们将在 `Config` 中添加新的配置结构。旧的配置将保持兼容。

# 缺点

无

# 基本原理和替代方案

## Minio

[Minio](https://github.com/minio/minio) 不会向 `stdout` 或 `stderr` 打印日志。相反，他们只打印欢迎信息：

```shell
:) minio server . --address ":9900"
MinIO 对象存储服务器
版权: 2015-0000 MinIO, Inc.
许可证: GNU AGPLv3 [https://www.gnu.org/licenses/agpl-3.0.html](https://www.gnu.org/licenses/agpl-3.0.html)
版本: RELEASE.2022-06-30T20-58-09Z (go1.18.3 Linux/amd64)

API: http://192.168.1.104:9900  http://172.16.195.1:9900  http://192.168.97.1:9900  http://127.0.0.1:9900
root 用户: minioadmin
RootPass: minioadmin

警告: 控制台端点正在监听动态端口 (34219)，请使用 --console-address ":PORT" 选择静态端口。
控制台: http://192.168.1.104:34219 http://172.16.195.1:34219 http://192.168.97.1:34219 http://127.0.0.1:34219
root 用户: minioadmin
RootPass: minioadmin

命令行: https://docs.min.io/docs/minio-client-quickstart-guide
   $ mc alias set myminio http://192.168.1.104:9900 minioadmin minioadmin

文档: https://docs.min.io

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 您正在运行两周前发布的 MinIO 旧版本 ┃
┃ 更新: 运行 `mc admin update`                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## CockroachDB

[CockroachDB](https://www.cockroachlabs.com/) 默认情况下不会向 `stderr` 打印日志：

他们允许用户使用 `--log=<yaml-config>` 指定日志记录行为。

```shell
:) ./cockroach start-single-node
CockroachDB 节点启动于 2022-07-21 06:56:04.36859988 +0000 UTC (耗时 0.7s)
构建:               CCL v22.1.4 @ 2022/07/19 17:09:48 (go1.17.11)
WebUI:               http://xuanwo-work:8080
sql:                 postgresql://root@xuanwo-work:26257/defaultdb?sslmode=disable
sql (JDBC):          JDBC:postgresql://xuanwo-work:26257/defaultdb?sslmode=disable&user=root
RPC 客户端标志:    ./cockroach <客户端命令> --host=xuanwo-work:26257 --insecure
日志:                /tmp/cockroach-v22.1.4.linux-amd64/cockroach-data/logs
临时目录:            /tmp/cockroach-v22.1.4.linux-amd64/cockroach-data/cockroach-temp3237741659
外部 I/O 路径:   /tmp/cockroach-v22.1.4.linux-amd64/cockroach-data/extern
存储[0]:            path=/tmp/cockroach-v22.1.4.linux-amd64/cockroach-data
存储引擎:      pebble
集群ID:           e1ab003d-7eba-48cd-b635-7a51f40269c2
状态:             重启预先存在的节点
节点ID:              1
```

# 先前技术

无

# 未解决问题

无

# 未来可能性

## 添加 HTTP 日志支持

允许将日志发送到 HTTP 端点

## 支持从标准输入读取 SQL

基于此 RFC，我们可以实现从标准输入读取 SQL。