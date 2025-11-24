---
title: "连接 Databend (BendSQL)"
sidebar_label: "BendSQL"
slug: /
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将指导你如何使用 BendSQL 连接到自托管的 Databend 实例。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 确保本地已安装 [Docker](https://www.docker.com/)，我们将用它启动 Databend。
- 确保本地已安装 BendSQL。安装方法请参考 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。

</StepContent>
<StepContent number="2">

### 启动 Databend

在终端运行以下命令启动 Databend 实例：

```bash
docker run -d --name databend \
  -e QUERY_DEFAULT_USER=eric \
  -e QUERY_DEFAULT_PASSWORD=abc123 \
  -p 3307:3307 -p 8000:8000 -p 8124:8124 -p 8900:8900 \
  datafuselabs/databend:nightly
```

该命令会在本地 Docker 容器中启动 Databend，连接信息如下：

- 主机：`127.0.0.1`
- 端口：`8000`
- 用户：`eric`
- 密码：`abc123`

</StepContent>
<StepContent number="3">

### 启动 BendSQL

Databend 实例运行后，即可用 BendSQL 连接。打开终端并执行：

```bash
bendsql --host 127.0.0.1 --port 8000 --user eric --password abc123
```

该命令通过 `127.0.0.1:8000` 的 HTTP API，以用户 `eric` 和密码 `abc123` 连接 Databend。成功后可见如下提示：

```bash
Welcome to BendSQL 0.24.7-ff9563a(2024-12-27T03:23:17.723492000Z).
Connecting to 127.0.0.1:8000 as user eric.
Connected to Databend Query v1.2.725-nightly-25ee2d6e65(rust-1.88.0-nightly-2025-04-16T13:54:25.363718584Z)
Loaded 1432 auto complete keywords from server.
Started web server at 127.0.0.1:8080
```

</StepContent>
<StepContent number="4">

### 执行查询

连接成功后，可在 BendSQL Shell 中执行 SQL。例如输入 `SELECT NOW();` 查看当前时间：

```bash
eric@127.0.0.1:8000/default> SELECT NOW();

SELECT NOW()

┌────────────────────────────┐
│            now()           │
│         Timestamp          │
├────────────────────────────┤
│ 2025-04-24 13:24:06.640616 │
└────────────────────────────┘
1 row read in 0.025 sec. Processed 1 row, 1 B (40 rows/s, 40 B/s)
```

</StepContent>
<StepContent number="5">

### 退出 BendSQL

输入 `quit` 即可退出 BendSQL。

```bash
eric@127.0.0.1:8000/default> quit
Bye~
➜  ~
```

### BendSQL UI
使用 `--ui` 选项，BendSQL 会启动 Web 服务器并自动打开浏览器展示图形界面。你可以在浏览器中执行 SQL、分析查询性能，还可通过复制 URL 与他人共享结果。

```bash
❯ bendsql -h 127.0.0.1 --port 8000 --ui
```

</StepContent>
</StepsWrap>