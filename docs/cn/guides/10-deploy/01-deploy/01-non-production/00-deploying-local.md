---
title: Docker 和本地部署
sidebar_label: Docker 和本地部署
---

为了快速访问 Databend 功能并获得实践经验，您有以下部署选项：

- [在 Docker 上部署 Databend](#deploying-databend-on-docker)：您可以在 Docker 上部署 Databend 以及 [MinIO](https://min.io/)，以实现容器化设置。

- [部署本地 Databend](#deploying-a-local-databend)：如果没有对象存储，您可以选择本地部署，并使用文件系统作为存储。

:::note 仅限非生产环境使用

- 对象存储是 Databend 生产使用的要求。文件系统只应用于评估、测试和非生产场景。

- 不建议在 MinIO 之上部署 Databend 用于生产环境或性能测试目的。
:::

## 在 Docker 上部署 Databend

开始之前，请确保您的系统上安装了 Docker。

### 步骤 1. 部署 MinIO

1. 使用以下命令拉取并运行 MinIO 镜像作为容器：

```shell
mkdir -p ${HOME}/minio/data

docker run -d \
   --name minio \
   --user $(id -u):$(id -g) \
   --net=host \
   -e "MINIO_ROOT_USER=ROOTUSER" \
   -e "MINIO_ROOT_PASSWORD=CHANGEME123" \
   -v ${HOME}/minio/data:/data \
   minio/minio server /data --console-address ":9091"
```

:::note
我们在这里将控制台地址更改为 `:9091`，以避免与 Databend 的端口冲突。
:::

请注意，上述命令还设置了根用户凭据（ROOTUSER/CHANGEME123），您将需要在后续步骤中提供这些凭据以进行身份验证。如果您在此时更改了根用户凭据，请确保在整个过程中保持一致性。

您可以通过在终端中检查以下消息来确认 MinIO 容器已成功启动：

```shell
❯ docker logs minio
Formatting 1st pool, 1 set(s), 1 drives per set.
WARNING: Host local has more than 0 drives of set. A host failure will result in data becoming unavailable.
MinIO Object Storage Server
Copyright: 2015-2024 MinIO, Inc.
License: GNU AGPLv3 <https://www.gnu.org/licenses/agpl-3.0.html>
Version: RELEASE.2024-01-05T22-17-24Z (go1.21.5 linux/arm64)

Status:         1 Online, 0 Offline.
S3-API: http://192.168.106.3:9000  http://172.17.0.1:9000  http://192.168.5.1:9000  http://127.0.0.1:9000
Console: http://192.168.106.3:9091 http://172.17.0.1:9091 http://192.168.5.1:9091 http://127.0.0.1:9091

Documentation: https://min.io/docs/minio/linux/index.html
Warning: The standard parity is set to 0. This can lead to data loss.
```

2. 打开您的网络浏览器并访问 http://127.0.0.1:9091/（登录凭据：ROOTUSER/CHANGEME123）。创建一个名为 **databend** 的存储桶。

### 步骤 2. 部署 Databend

使用以下命令拉取并运行 Databend 镜像作为容器：

```shell
docker run -d \
    --name databend \
    --net=host \
    -v meta_storage_dir:/var/lib/databend/meta \
    -v log_dir:/var/log/databend \
    -e QUERY_DEFAULT_USER=databend \
    -e QUERY_DEFAULT_PASSWORD=databend \
    -e QUERY_STORAGE_TYPE=s3 \
    -e AWS_S3_ENDPOINT=http://${IP}:9000 \
    -e AWS_S3_BUCKET=databend \
    -e AWS_ACCESS_KEY_ID=ROOTUSER \
    -e AWS_SECRET_ACCESS_KEY=CHANGEME123 \
    datafuselabs/databend
```

> 其中 ${IP} 是 192.168.106.3 或 192.168.5.1，应用程序需要访问 s3。所以如果您不知道 ${IP}，可以参考 `docker logs minio` 的输出

启动 Databend Docker 容器时，您可以使用环境变量 QUERY_DEFAULT_USER 和 QUERY_DEFAULT_PASSWORD 指定用户名和密码。如果未提供这些变量，则将创建一个没有密码的默认 root 用户。上述命令创建了一个 SQL 用户（databend/databend），您将需要在下一步中使用它来连接到 Databend。如果您在此时更改了 SQL 用户，请确保在整个过程中保持一致性。

您可以通过在终端中检查以下消息来确认 Databend 容器已成功启动：

```shell
❯ docker logs databend
==> QUERY_CONFIG_FILE is not set, using default: /etc/databend/query.toml
==> /tmp/std-meta.log <==
Databend Metasrv

Version: v1.2.287-nightly-8930689add-simd(1.75.0-nightly-2024-01-07T22:13:53.249351145Z)
Working DataVersion: V002(2023-07-22: Store snapshot in a file)

Raft Feature set:
    Server Provide: { append:v0, install_snapshot:v0, install_snapshot:v1, vote:v0 }
    Client Require: { append:v0, install_snapshot:v0, vote:v0 }

On Disk Data:
    Dir: /var/lib/databend/meta
    DataVersion: V0(2023-04-21: compatible with openraft v07 and v08, using openraft::compat)
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
   advertise:  colima:28004

```

### 升级磁盘上的数据

从：V0(2023-04-21: 兼容 openraft v07 和 v08，使用 openraft::compat)
到：V001(2023-05-15: 去除 compat，仅使用 openraft v08 数据类型)
开始升级：版本：V0，升级到：V001
写入头部：版本：V0，升级到：V001
未找到 raft_state 树
未找到 raft_log 树
升级了 0 条记录
完成升级：版本：V001，升级到：无
写入头部：版本：V001，升级到：无
升级磁盘上的数据
从：V001(2023-05-15: 去除 compat，仅使用 openraft v08 数据类型)
到：V002(2023-07-22: 在文件中存储快照)
开始升级：版本：V001，升级到：V002
写入头部：版本：V001，升级到：V002
未找到 raft_state 树
未找到 raft_log 树
找到状态机树：[]
找到最小状态机 id：18446744073709551615
没有状态机树，跳过升级
完成升级：版本：V002，升级到：无
写入头部：版本：V002，升级到：无
等待 180 秒以等待活动领导者...
领导者 Id：0
    指标：id=0, 领导者, 任期=1, last_log=Some(3), last_applied=Some(1-0-3), 成员={log_id:Some(1-0-3), 投票者:[{0:{EmptyNode}}], 学习者:[]}

注册此节点：{id=0 raft=colima:28004 grpc=}

    注册节点：Ok

Databend Metasrv 已启动

==> /tmp/std-query.log <==
Databend 查询

版本：v1.2.287-nightly-8930689add(rust-1.75.0-nightly-2024-01-07T22:05:46.363097970Z)

日志记录：
    文件：enabled=true, 级别=INFO, 目录=/var/log/databend, 格式=json
    stderr：enabled=false(要启用：LOG_STDERR_ON=true 或 RUST_LOG=info), 级别=WARN, 格式=text
    otlp：enabled=false, 级别=INFO, 端点=http://127.0.0.1:4317, 标签=
    查询：enabled=false, 目录=, otlp_endpoint=, 标签=
    跟踪：enabled=false, capture_log_level=INFO, otlp_endpoint=http://127.0.0.1:4317
元数据：已连接到端点 [
    "0.0.0.0:9191",
]
内存：
    限制：无限
    分配器：jemalloc
    配置：percpu_arena:percpu,oversize_threshold:0,background_thread:true,dirty_decay_ms:5000,muzzy_decay_ms:5000
集群：独立
存储：s3 | 桶=databend,root=,端点=http://127.0.0.1:9000
缓存：无
内置用户：databend

管理员
    监听于 0.0.0.0:8080
MySQL
    监听于 0.0.0.0:3307
    通过以下方式连接：mysql -u${USER} -p${PASSWORD} -h0.0.0.0 -P3307
Clickhouse(http)
    监听于 0.0.0.0:8124
    使用方法：echo 'create table test(foo string)' | curl -u${USER} -p${PASSWORD}: '0.0.0.0:8124' --data-binary  @-
echo '{"foo": "bar"}' | curl -u${USER} -p${PASSWORD}: '0.0.0.0:8124/?query=INSERT%20INTO%20test%20FORMAT%20JSONEachRow' --data-binary @-
Databend HTTP
    监听于 0.0.0.0:8000
    使用方法：curl -u${USER} -p${PASSWORD}: --request POST '0.0.0.0:8000/v1/query/' --header 'Content-Type: application/json' --data-raw '{"sql": "SELECT avg(number) FROM numbers(100000000)"}'

### 第 3 步. 连接到 Databend

在此步骤中，您将使用 BendSQL CLI 工具建立与 Databend 的连接。有关如何安装和操作 BendSQL 的说明，请参见 [BendSQL](../../../30-sql-clients/00-bendsql/index.md)。

1. 使用 SQL 用户 (databend/databend) 建立与 Databend 的连接，请运行以下命令：

```shell
❯ bendsql -udatabend -pdatabend
欢迎使用 BendSQL 0.12.1-homebrew。
正在连接到 localhost:8000 作为用户 databend。
已连接到 DatabendQuery v1.2.287-nightly-8930689add(rust-1.75.0-nightly-2024-01-07T22:05:46.363097970Z)

databend@localhost:8000/default>
```

2. 要验证部署，您可以使用 BendSQL 创建一个表并插入一些数据：

```shell
databend@localhost:8000/default> CREATE DATABASE test;
0 行在 0.042 秒内写入。处理了 0 行，0 B (0 行/秒，0 B/秒)

databend@localhost:8000/default> use test;
0 行在 0.028 秒内读取。处理了 0 行，0 B (0 行/秒，0 B/秒)

databend@localhost:8000/test> CREATE TABLE mytable(a int);
0 行在 0.053 秒内写入。处理了 0 行，0 B (0 行/秒，0 B/秒)

databend@localhost:8000/test> INSERT INTO mytable VALUES(1);
1 行在 0.108 秒内写入。处理了 1 行，5 B (9.27 行/秒，46 B/秒)

databend@localhost:8000/test> INSERT INTO mytable VALUES(2);
1 行在 0.102 秒内写入。处理了 1 行，5 B (9.81 行/秒，49 B/秒)

databend@localhost:8000/test> INSERT INTO mytable VALUES(3);
1 行在 0.120 秒内写入。处理了 1 行，5 B (8.33 行/秒，41 B/秒)

databend@localhost:8000/test> select * from mytable;
┌─────────────────┐
│        a        │
│ Nullable(Int32) │
├─────────────────┤
│               1 │
│               2 │
│               3 │
└─────────────────┘
3 行在 0.066 秒内读取。处理了 3 行，15 B (45.2 行/秒，225 B/秒)
```

由于表数据存储在桶中，您将注意到桶大小从 0 开始增加。

![Alt text](@site/docs/public/img/deploy/minio-deployment-verify.png)

## 部署本地 Databend

以下步骤将指导您完成本地部署 Databend 的过程。

### 第 1 步. 下载 Databend

1. 从 [下载](/download) 页面下载适合您平台的安装包。

2. 将安装包解压到本地目录。

### 第 2 步. 启动 Databend

1. 配置管理员用户。您将使用此账户连接到 Databend。有关更多信息，请参见 [配置管理员用户](../../04-references/01-admin-users.md)。在此示例中，取消注释以下行以选择此账户：

```sql  title="databend-query.toml"
[[query.users]]
name = "root"
auth_type = "no_password"
```

2. 打开终端并导航到存储提取的文件和文件夹的目录。

3. 在 **scripts** 文件夹中运行脚本 **start.sh**：
    MacOS 可能会提示错误，说“*databend-meta 无法打开，因为 Apple 无法检查其是否包含恶意软件。*”。要继续，请在您的 Mac 上打开 **系统设置**，在左侧菜单中选择 **隐私与安全**，然后在右侧的 **安全性** 部分为 databend-meta 点击 **仍要打开**。对于 databend-query 上的错误也执行相同操作。

```shell
./scripts/start.sh
```
:::tip
如果在尝试启动 Databend 时遇到以下错误消息：

```shell
==> query.log <==
: 没有 getcpu 支持：percpu_arena:percpu
: 选项 background_thread 当前仅支持 pthread
Databend Query 启动失败，原因：代码：1104，文本 = 无法创建 appender：Os { code: 13, kind: PermissionDenied, message: "Permission denied" }。
```

运行以下命令，然后再次尝试启动 Databend：

```shell
sudo mkdir /var/log/databend
sudo mkdir /var/lib/databend
sudo chown -R $USER /var/log/databend
sudo chown -R $USER /var/lib/databend
```
:::

3. 运行以下命令以验证 Databend 是否已成功启动：

```shell
ps aux | grep databend

---
eric             12789   0.0  0.0 408495808   1040 s003  U+    2:16pm   0:00.00 grep databend
eric             12781   0.0  0.5 408790416  38896 s003  S     2:15pm   0:00.05 bin/databend-query --config-file=configs/databend-query.toml
eric             12776   0.0  0.3 408654368  24848 s003  S     2:15pm   0:00.06 bin/databend-meta --config-file=configs/databend-meta.toml
```

### 第 3 步. 连接到 Databend

在此步骤中，您将使用 BendSQL CLI 工具建立与 Databend 的连接。有关如何安装和操作 BendSQL 的说明，请参见 [BendSQL](../../../30-sql-clients/00-bendsql/index.md)。

1. 执行以下命令以与本地 Databend 建立连接：

```shell
eric@bogon ~ % bendsql
欢迎使用 BendSQL 0.3.11-17b0d8b(2023-06-08T15:23:29.206137000Z)。
尝试以 root 用户连接到 localhost:8000。
已连接到 DatabendQuery v1.1.75-nightly-59eea5df495245b9475f81a28c7b688f013aac05(rust-1.72.0-nightly-2023-06-28T01:04:32.054683000Z)
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
1 行在 0.024 秒内。处理了 1 行，1B (41.85 行/秒，41B/秒)
```

## 下一步

部署 Databend 后，您可能需要了解以下主题：

- [加载与卸载数据](/guides/load-data)：在 Databend 中管理数据导入/导出。
- [可视化](/guides/visualize)：将 Databend 与可视化工具集成以获得洞察。