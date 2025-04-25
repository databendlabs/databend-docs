---
title: "使用 BendSQL 连接到私有化部署 Databend"
sidebar_label: "连接到私有化部署 Databend (BendSQL)"
slug: /
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将指导您完成使用 BendSQL 连接到私有化部署 Databend 实例的过程。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 确保您的本地机器上安装了 [Docker](https://www.docker.com/)，因为它将用于启动 Databend。
- 确保您的机器上安装了 BendSQL。有关如何使用各种包管理器安装 BendSQL 的说明，请参阅 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。

</StepContent>
<StepContent number="2">

### 启动 Databend

在您的终端中运行以下命令以启动 Databend 实例：

```bash
docker run -d --name databend \
  -e QUERY_DEFAULT_USER=eric \
  -e QUERY_DEFAULT_PASSWORD=abc123 \
  -p 3307:3307 -p 8000:8000 -p 8124:8124 -p 8900:8900 \
  datafuselabs/databend:nightly
```

此命令在 Docker 容器中本地启动一个 Databend 实例，连接信息如下：

- Host: `127.0.0.1`
- Port: `8000`
- User: `eric`
- Password: `abc123`

</StepContent>
<StepContent number="3">

### 启动 BendSQL

一旦 Databend 实例正在运行，您可以使用 BendSQL 连接到它。打开一个终端并使用以下命令进行连接：

```bash
bendsql --host 127.0.0.1 --port 8000 --user eric --password abc123
```

这将使用 HTTP API 通过用户 `eric` 和密码 `abc123` 连接到 `127.0.0.1:8000` 上的 Databend。运行此命令后，您应该会看到一个成功的连接消息，如下所示：

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

连接后，您可以在 BendSQL shell 中执行 SQL 查询。例如，键入 `SELECT NOW();` 以返回当前时间：

```bash
eric@127.0.0.1:8000/default> SELECT NOW();

SELECT NOW()

┌────────────────────────────┐
│            now()           │
│          Timestamp         │
├────────────────────────────┤
│ 2025-04-24 13:24:06.640616 │
└────────────────────────────┘
1 row read in 0.025 sec. Processed 1 row, 1 B (40 rows/s, 40 B/s)
```

</StepContent>
<StepContent number="5">

### 退出 BendSQL

要退出 BendSQL，请键入 `quit`。

```bash
eric@127.0.0.1:8000/default> quit
Bye~
➜  ~
```

</StepContent>
</StepsWrap>