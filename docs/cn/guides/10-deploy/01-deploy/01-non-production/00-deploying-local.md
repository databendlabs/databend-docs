---
title: Docker 与本地部署
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

为了快速体验 Databend 的功能并获得实践经验，您可以选择以下部署方式：

- [使用 Docker 部署](#deploying-databend-on-docker)：您可以在 Docker 上部署 Databend 以及 [MinIO](https://min.io/)，实现容器化部署。
- [本地机器部署](#deploying-a-local-databend)：如果无法使用对象存储，您可以选择本地部署并使用文件系统作为存储。

:::note 仅限非生产使用

- 对象存储是 Databend 生产使用的必要条件。文件系统仅应用于评估、测试和非生产场景。
- 本章节中涉及的 MinIO 部署仅适用于开发和演示。由于单机环境的资源有限，不建议用于生产环境或性能测试。
  :::

## 使用 Docker 部署

在本指南中，您将在 [Amazon EC2](https://aws.amazon.com/ec2/) 的 Ubuntu 虚拟机上使用 [Docker](https://www.docker.com/) 部署 Databend 和 [MinIO](https://min.io/)，实现容器化部署。

![Alt text](/img/deploy/docker-deploy.png)

<StepsWrap>
<StepContent number="1">

### 设置环境

在开始之前，请在 Amazon EC2 上启动一个实例并安装 Docker 引擎。

1. 登录 [Amazon EC2 控制台](https://console.aws.amazon.com/ec2/)，并启动一个至少具有 8 GiB 内存容量的 Ubuntu 实例。实例启动后，您可以在实例详细信息页面上找到分配给该实例的公有 IP 地址和私有 IP 地址。

![Alt text](/img/deploy/docker-instance.png)

2. 创建一个安全组，并添加一个入站规则以允许通过端口 `9001` 访问您的实例，然后将该安全组添加到实例中。

![Alt text](/img/deploy/docker-create-sg.png)

3. 连接到您的实例。从本地机器连接到实例有多种方式。更多信息，请参阅 [https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-to-linux-instance.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-to-linux-instance.html)。

4. 按照 [Docker 用户手册](https://docs.docker.com/engine/install/ubuntu/) 在您的实例上安装 Docker 引擎。

</StepContent>
<StepContent number="2">

### 部署 MinIO

1. 使用以下命令拉取并运行 MinIO 镜像作为容器：

:::note

- 这里我们将控制台地址更改为 `9001` 以避免端口冲突。
- 该命令还设置了根用户凭证 (`ROOTUSER`/`CHANGEME123`)，您需要在后续步骤中提供这些凭证进行身份验证。如果在此时更改了根用户凭证，请确保在整个过程中保持一致。
  :::

```shell
mkdir -p ${HOME}/minio/data

docker run -d \
   --name minio \
   --user $(id -u):$(id -g) \
   --net=host \
   -e "MINIO_ROOT_USER=ROOTUSER" \
   -e "MINIO_ROOT_PASSWORD=CHANGEME123" \
   -v ${HOME}/minio/data:/data \
   minio/minio server /data --console-address ":9001"
```

2. 运行命令 `docker logs minio` 以在日志消息中找到 MinIO API 和控制台（WebUI）地址：

```shell
docker logs minio

Formatting 1st pool, 1 set(s), 1 drives per set.
WARNING: Host local has more than 0 drives of set. A host failure will result in data becoming unavailable.
MinIO Object Storage Server
Copyright: 2015-2024 MinIO, Inc.
License: GNU AGPLv3 [https://www.gnu.org/licenses/agpl-3.0.html](https://www.gnu.org/licenses/agpl-3.0.html)
Version: RELEASE.2024-04-06T05-26-02Z (go1.21.9 linux/amd64)

// highlight-next-line
API: http://172.31.15.63:9000  http://172.17.0.1:9000  http://127.0.0.1:9000
// highlight-next-line
WebUI: http://172.31.15.63:9001 http://172.17.0.1:9001 http://127.0.0.1:9001

Docs: https://min.io/docs/minio/linux/index.html
Status:         1 Online, 0 Offline.
STARTUP WARNINGS:
- The standard parity is set to 0. This can lead to data loss.
```

3. 在本地机器上打开您的网络浏览器，并使用上述日志中显示的 WebUI 地址访问 MinIO 控制台（将 IP 地址替换为您的实例的公有 IP 地址）。例如，如果您的实例的公有 IP 地址是 `3.142.131.212`，那么您的 MinIO 控制台地址将是 `http://3.142.131.212:9001`。

![Alt text](/img/deploy/docker-minio.png)

4. 使用凭证 `ROOTUSER`/`CHANGEME123` 登录 MinIO 控制台，并创建一个名为 `databend` 的存储桶。

![Alt text](/img/deploy/docker-bucket.png)

</StepContent>

<StepContent number="3">

### 部署 Databend

1. 使用以下命令拉取并运行 Databend 镜像作为容器：

:::note

- 将 `AWS_S3_ENDPOINT` 值替换为 `docker logs minio` 返回的 MinIO 日志消息中显示的 MinIO API 地址。
- 启动 Databend Docker 容器时，可以使用环境变量 `QUERY_DEFAULT_USER` 和 `QUERY_DEFAULT_PASSWORD` 指定用户名和密码。如果未提供这些变量，将创建一个默认的 root 用户且无密码。
- 下面的命令还创建了一个 SQL 用户 (`databend`/`databend`)，您稍后需要使用该用户连接到 Databend。如果在此时更改了 SQL 用户，请确保在整个过程中保持一致。
  :::

```shell
docker run -d \
    --name databend \
    --net=host \
    -v meta_storage_dir:/var/lib/databend/meta \
    -v log_dir:/var/log/databend \
    -e QUERY_DEFAULT_USER=databend \
    -e QUERY_DEFAULT_PASSWORD=databend \
    -e QUERY_STORAGE_TYPE=s3 \
    -e AWS_S3_ENDPOINT=http://172.31.15.63:9000 \
    -e AWS_S3_BUCKET=databend \
    -e AWS_ACCESS_KEY_ID=ROOTUSER \
    -e AWS_SECRET_ACCESS_KEY=CHANGEME123 \
    datafuselabs/databend
```

2. 运行命令 `docker logs databend` 以检查 Databend 日志消息，确保 Databend 容器已成功启动：

```shell
docker logs databend

==> QUERY_CONFIG_FILE is not set, using default: /etc/databend/query.toml
==> /tmp/std-meta.log <==
<jemalloc>: Number of CPUs detected is not deterministic. Per-CPU arena disabled.
Databend Metasrv

Version: v1.2.410-4b8cd16f0c-simd(1.77.0-nightly-2024-04-08T12:27:32.972822624Z)
Working DataVersion: V002(2023-07-22: Store snapshot in a file)

Raft Feature set:
    Server Provide: { append:v0, install_snapshot:v0, install_snapshot:v1, vote:v0 }
    Client Require: { append:v0, install_snapshot:v0, vote:v0 }

On Disk Data:
    Dir: /var/lib/databend/meta
    DataVersion: V001(2023-05-15: Get rid of compat, use only openraft v08 data types)
    In-Upgrading: None

Log:
    File: enabled=true, level=INFO, dir=/var/log/databend, format=json
    Stderr: enabled=false(To enable: LOG_STDERR_ON=true or RUST_LOG=info), level=WARN, format=text
    OTLP: enabled=false, level=INFO, endpoint=http://127.0.0.1:4317, labels=
    Tracing: enabled=false, capture_log_level=INFO, otlp_endpoint=http://127.0.0.1:4317
Id: 0
Raft Cluster Name: foo_cluster
Raft Dir: /var/lib/databend/meta
Raft Status: single

HTTP API
   listening at 127.0.0.1:28002
gRPC API
   listening at 127.0.0.1:9191
   advertise:  -
Raft API
   listening at 127.0.0.1:28004
   advertise:  ip-172-31-15-63:28004

Upgrade on-disk data
    From: V001(2023-05-15: Get rid of compat, use only openraft v08 data types)
    To:   V002(2023-07-22: Store snapshot in a file)
Begin upgrading: version: V001, upgrading: V002
Write header: version: V001, upgrading: V002
tree raft_state not found
tree raft_log not found
Found state machine trees: []
Found min state machine id: 18446744073709551615
No state machine tree, skip upgrade
Finished upgrading: version: V002, upgrading: None
Write header: version: V002, upgrading: None
Wait for 180s for active leader...
Leader Id: 0
    Metrics: id=0, Leader, term=1, last_log=Some(3), last_applied=Some(1-0-3), membership={log_id:Some(1-0-3), voters:[{0:{EmptyNode}}], learners:[]}

Register this node: {id=0 raft=ip-172-31-15-63:28004 grpc=}

    Register-node: Ok

Databend Metasrv started

==> /tmp/std-query.log <==
<jemalloc>: Number of CPUs detected is not deterministic. Per-CPU arena disabled.
Databend Query

Version: v1.2.410-4b8cd16f0c(rust-1.77.0-nightly-2024-04-08T12:20:44.288903419Z)

Logging:
    file: enabled=true, level=INFO, dir=/var/log/databend, format=json
    stderr: enabled=false(To enable: LOG_STDERR_ON=true or RUST_LOG=info), level=WARN, format=text
    otlp: enabled=false, level=INFO, endpoint=http://127.0.0.1:4317, labels=
    query: enabled=false, dir=, otlp_endpoint=, labels=
    tracing: enabled=false, capture_log_level=INFO, otlp_endpoint=http://127.0.0.1:4317
Meta: connected to endpoints [
    "0.0.0.0:9191",
]
Memory:
    limit: unlimited
    allocator: jemalloc
    config: percpu_arena:percpu,oversize_threshold:0,background_thread:true,dirty_decay_ms:5000,muzzy_decay_ms:5000
Cluster: standalone
Storage: s3 | bucket=databend,root=,endpoint=http://172.31.15.63:9000
Cache: none
Builtin users: databend

Admin
    listened at 0.0.0.0:8080
MySQL
    listened at 0.0.0.0:3307
    connect via: mysql -u${USER} -p${PASSWORD} -h0.0.0.0 -P3307
Clickhouse(http)
    listened at 0.0.0.0:8124
    usage:  echo 'create table test(foo string)' | curl -u${USER} -p${PASSWORD}: '0.0.0.0:8124' --data-binary  @-
echo '{"foo": "bar"}' | curl -u${USER} -p${PASSWORD}: '0.0.0.0:8124/?query=INSERT%20INTO%20test%20FORMAT%20JSONEachRow' --data-binary @-
Databend HTTP
    listened at 0.0.0.0:8000
    usage:  curl -u${USER} -p${PASSWORD}: --request POST '0.0.0.0:8000/v1/query/' --header 'Content-Type: application/json' --data-raw '{"sql": "SELECT avg(number) FROM numbers(100000000)"}'
```

</StepContent>

<StepContent number="4">

### 连接到 Databend

在这一步中，您将从本地机器使用 [BendSQL](../../../30-sql-clients/00-bendsql/index.md) 连接到 Databend。

1. 在本地机器上安装 BendSQL。安装说明请参阅 [安装 BendSQL](../../../30-sql-clients/00-bendsql/index.md#installing-bendsql)。

2. 在本地机器上启动一个终端，然后运行命令 `bendsql -h <instance_public_ip> -u databend -p databend` 以建立与 Databend 的连接。例如，如果您的实例的公有 IP 地址是 `3.142.131.212`，命令将是 `bendsql -h 3.142.131.212 -u databend -p databend`。

```shell
bendsql -h 3.142.131.212 -u databend -p databend

Welcome to BendSQL 0.16.0-homebrew.
Connecting to 3.142.131.212:8000 as user databend.
Connected to Databend Query v1.2.410-4b8cd16f0c(rust-1.77.0-nightly-2024-04-08T12:20:44.288903419Z)
```

您已准备就绪！现在，您可以执行一个简单的查询来验证部署：

```sql
databend@3.142.131.212:8000/default> select now();

SELECT
  NOW()

┌────────────────────────────┐
│            now()           │
│          Timestamp         │
├────────────────────────────┤
│ 2024-04-17 17:53:56.307155 │
└────────────────────────────┘
1 row read in 0.178 sec. Processed 1 row, 1 B (5.62 row/s, 5 B/s)
```

</StepContent>
</StepsWrap>

## 本地机器部署

按照以下说明在您的本地机器上部署 Databend。

<StepsWrap>

<StepContent number="1">

### 下载 Databend

1. 从 [下载](/download) 页面下载适合您平台的安装包。

2. 将安装包解压到本地目录。

</StepContent>

1. 配置管理员用户。您将使用此账户连接到 Databend。更多信息，请参阅[配置管理员用户](../../04-references/01-admin-users.md)。在此示例中，取消以下行的注释以选择此账户：

```sql title="databend-query.toml"
[[query.users]]
name = "root"
auth_type = "no_password"
```

2. 打开终端并导航到存储解压文件和文件夹的目录。

3. 在**scripts**文件夹中运行脚本**start.sh**：
   MacOS 可能会提示错误，指出“_databend-meta 无法打开，因为 Apple 无法检查其是否存在恶意软件_”。要继续，请在 Mac 上打开**系统设置**，在左侧菜单中选择**隐私与安全**，然后在右侧的**安全**部分为 databend-meta 点击**打开**。对 databend-query 的错误执行相同操作。

```shell
./scripts/start.sh
```

:::tip
如果您在尝试启动 Databend 时遇到以下错误消息：

```shell
==> query.log <==
: No getcpu support: percpu_arena:percpu
: option background_thread currently supports pthread only
Databend Query start failure, cause: Code: 1104, Text = failed to create appender: Os { code: 13, kind: PermissionDenied, message: "Permission denied" }.
```

请运行以下命令，然后再次尝试启动 Databend：

```shell
sudo mkdir /var/log/databend
sudo mkdir /var/lib/databend
sudo chown -R $USER /var/log/databend
sudo chown -R $USER /var/lib/databend
```

:::

3. 运行以下命令以验证 Databend 是否成功启动：

```shell
ps aux | grep databend

---
eric             12789   0.0  0.0 408495808   1040 s003  U+    2:16pm   0:00.00 grep databend
eric             12781   0.0  0.5 408790416  38896 s003  S     2:15pm   0:00.05 bin/databend-query --config-file=configs/databend-query.toml
eric             12776   0.0  0.3 408654368  24848 s003  S     2:15pm   0:00.06 bin/databend-meta --config-file=configs/databend-meta.toml
```

</StepContent>

<StepContent number="3">

### 连接到 Databend

在这一步中，您将使用 BendSQL CLI 工具与 Databend 建立连接。有关如何安装和操作 BendSQL 的说明，请参阅 [BendSQL](../../../30-sql-clients/00-bendsql/index.md)。

1. 要与本地 Databend 建立连接，请执行以下命令：

```shell
eric@Erics-iMac ~ % bendsql
Welcome to BendSQL 0.13.2-4419bda(2024-02-02T04:21:46.064145000Z).
Connecting to localhost:8000 as user root.
Connected to DatabendQuery v1.2.252-nightly-193ed56304(rust-1.75.0-nightly-2023-12-12T22:07:25.371440000Z)

root@localhost:8000/default>
```

2. 查询 Databend 版本以验证连接：

```sql
root@localhost> SELECT VERSION();

SELECT
  VERSION()

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                          version()                                                         │
│                                                           String                                                           │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DatabendQuery v1.1.75-nightly-59eea5df495245b9475f81a28c7b688f013aac05(rust-1.72.0-nightly-2023-06-28T01:04:32.054683000Z) │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
1 row in 0.024 sec. Processed 1 rows, 1B (41.85 rows/s, 41B/s)
```

</StepContent>
</StepsWrap>

## 下一步

部署 Databend 后，您可能需要了解以下主题：

- [加载与卸载数据](/guides/load-data)：在 Databend 中管理数据的导入/导出。
- [可视化](/guides/visualize)：将 Databend 与可视化工具集成以获取洞察。