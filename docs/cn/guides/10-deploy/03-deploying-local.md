---
title: Docker 和本地部署
sidebar_label: Docker 和本地部署
description:
  在本地或使用 Docker 部署 Databend
---

为了快速访问 Databend 功能并获得实践经验，您可以选择以下部署选项：

- [在 Docker 上部署 Databend](#deploying-databend-on-docker)：您可以在 Docker 上部署 Databend 和 [MinIO](https://min.io/)，以实现容器化设置。

- [部署本地 Databend](#deploying-a-local-databend)：如果没有对象存储可用，您可以选择本地部署，并使用文件系统作为存储。

:::note 仅限非生产环境使用
- 对象存储是 Databend 生产使用的要求。文件系统应仅用于评估、测试和非生产场景。

- 不建议在 MinIO 之上部署 Databend 用于生产环境或性能测试目的。
:::

## 在 Docker 上部署 Databend

在开始之前，请确保您的系统上安装了 Docker。

### 步骤 1. 部署 MinIO

1. 使用以下命令作为容器拉取并运行 MinIO 镜像：

```shell
mkdir -p ${HOME}/minio/data

docker run \
   -p 9000:9000 \
   -p 9090:9090 \
   --user $(id -u):$(id -g) \
   --name minio1 \
   -e "MINIO_ROOT_USER=ROOTUSER" \
   -e "MINIO_ROOT_PASSWORD=CHANGEME123" \
   -v ${HOME}/minio/data:/data \
   quay.io/minio/minio server /data --console-address ":9090"
```
请注意，上面的命令还设置了根用户凭据（ROOTUSER/CHANGEME123），您将需要在后续步骤中提供这些凭据进行身份验证。如果您在此时更改了根用户凭据，请确保在整个过程中保持一致性。

您可以通过在终端中检查以下消息来确认 MinIO 容器已成功启动：

```shell
Unable to find image 'quay.io/minio/minio:latest' locally
latest: Pulling from minio/minio
68c8102008d3: Pull complete 
be9f9df177bb: Pull complete 
3af46996e2ef: Pull complete 
c8b0b68d12b4: Pull complete 
4273a1648411: Pull complete 
2fd0bc041cb4: Pull complete 
Digest: sha256:ab5296018bfca75d45f451e050f6c79c6e8b9927bbc444274a74123ea7921021
Status: Downloaded newer image for quay.io/minio/minio:latest
Formatting 1st pool, 1 set(s), 1 drives per set.
WARNING: Host local has more than 0 drives of set. A host failure will result in data becoming unavailable.
MinIO Object Storage Server
Copyright: 2015-2023 MinIO, Inc.
License: GNU AGPLv3 <https://www.gnu.org/licenses/agpl-3.0.html>
Version: RELEASE.2023-04-13T03-08-07Z (go1.20.3 linux/arm64)

Status:         1 Online, 0 Offline. 
API: http://172.17.0.2:9000  http://127.0.0.1:9000 
Console: http://172.17.0.2:9090 http://127.0.0.1:9090 

Documentation: https://min.io/docs/minio/linux/index.html
Warning: The standard parity is set to 0. This can lead to data loss.
```

2. 打开您的网络浏览器，访问 http://127.0.0.1:9090/（登录凭据：ROOTUSER/CHANGEME123）。创建一个名为 **databend** 的存储桶。

### 步骤 2. 部署 Databend

使用以下命令作为容器拉取并运行 Databend 镜像：

```shell
docker run \
    -p 8000:8000 \
    -p 3307:3307 \
    -v meta_storage_dir:/var/lib/databend/meta \
    -v query_storage_dir:/var/lib/databend/query \
    -v log_dir:/var/log/databend \
    -e QUERY_DEFAULT_USER=databend \
    -e QUERY_DEFAULT_PASSWORD=databend \
    -e QUERY_STORAGE_TYPE=s3 \
    -e AWS_S3_ENDPOINT=http://172.17.0.2:9000 \
    -e AWS_S3_BUCKET=databend \
    -e AWS_ACCESS_KEY_ID=ROOTUSER \
    -e AWS_SECRET_ACCESS_KEY=CHANGEME123 \
    datafuselabs/databend
```

启动 Databend Docker 容器时，您可以使用环境变量 QUERY_DEFAULT_USER 和 QUERY_DEFAULT_PASSWORD 指定用户名和密码。如果没有提供这些变量，将创建一个没有密码的默认 root 用户。上面的命令创建了一个 SQL 用户（databend/databend），您将需要使用它来连接到 Databend 的下一步。如果您在此时更改了 SQL 用户，请确保在整个过程中保持一致性。

### 步骤 3. 连接到 Databend

在此步骤中，您将使用 BendSQL CLI 工具与 Databend 建立连接。有关如何安装和操作 BendSQL 的说明，请参阅 [BendSQL](../30-sql-clients/00-bendsql/index.md)。

1. 使用 SQL 用户（databend/databend）运行以下命令以与 Databend 建立连接：

```shell
eric@bogon ~ % bendsql -udatabend -pdatabend
Welcome to BendSQL 0.3.11-17b0d8b(2023-06-08T15:23:29.206137000Z).
Trying connect to localhost:8000 as user databend.
Connected to DatabendQuery v1.1.75-nightly-59eea5df495245b9475f81a28c7b688f013aac05(rust-1.72.0-nightly-2023-06-28T01:04:32.054683000Z)
```

2. 要验证部署，您可以使用 BendSQL 创建一个表并插入一些数据：

```shell
databend@localhost> CREATE DATABASE eric;
Processed in (0.083 sec)

databend@localhost> CREATE TABLE mytable(a int);
Processed in (0.051 sec)

databend@localhost> INSERT INTO mytable VALUES(1);
1 rows affected in (0.242 sec)

databend@localhost> INSERT INTO mytable VALUES(2);
1 rows affected in (0.060 sec)

databend@localhost> INSERT INTO mytable VALUES(3);
1 rows affected in (0.053 sec)
```

由于表数据存储在存储桶中，您将注意到存储桶大小从 0 开始增加。

![Alt text](@site/docs/public/img/deploy/minio-deployment-verify.png)

## 部署本地 Databend

以下步骤将指导您完成本地部署 Databend 的过程。

### 步骤 1. 下载 Databend

1. 从 [下载](/download) 页面下载适合您平台的安装包。

2. 将安装包解压到本地目录。

### 步骤 2. 启动 Databend

1. 配置管理员用户。您将使用此帐户连接到 Databend。有关更多信息，请参阅 [配置管理员用户](04-admin-users.md)。对于本示例，取消注释以下行以选择此帐户：

```sql title="databend-query.toml"
[[query.users]]
name = "root"
auth_type = "no_password"
```

2. 打开终端并导航到存储提取的文件和文件夹的文件夹。

3. 在 **scripts** 文件夹中运行脚本 **start.sh**：

    MacOS 可能会提示错误 "*databend-meta 无法打开，因为 Apple 无法检查其是否包含恶意软件。*"。要继续，请在您的 Mac 上打开 **系统设置**，在左侧菜单中选择 **隐私与安全**，然后在右侧的 **安全性** 部分为 databend-meta 点击 **仍要打开**。对于 databend-query 的错误也执行相同操作。

```shell
./scripts/start.sh
```

:::tip
如果在尝试启动 Databend 时遇到以下错误消息：

```shell
==> query.log <==
: No getcpu support: percpu_arena:percpu
: option background_thread currently supports pthread only
Databend Query start failure, cause: Code: 1104, Text = failed to create appender: Os { code: 13, kind: PermissionDenied, message: "Permission denied" }.
```
运行以下命令并再次尝试启动 Databend：

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

在这一步中，您将使用 BendSQL CLI 工具与 Databend 建立连接。有关如何安装和操作 BendSQL 的说明，请参见 [BendSQL](../30-sql-clients/00-bendsql/index.md)。

1. 要与本地 Databend 建立连接，请执行以下命令：

```shell
eric@bogon ~ % bendsql      
Welcome to BendSQL 0.3.11-17b0d8b(2023-06-08T15:23:29.206137000Z).
Trying connect to localhost:8000 as user root.
Connected to DatabendQuery v1.1.75-nightly-59eea5df495245b9475f81a28c7b688f013aac05(rust-1.72.0-nightly-2023-06-28T01:04:32.054683000Z)
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

## 下一步

在部署 Databend 之后，您可能需要了解以下主题：

- [管理设置](/sql/sql-reference/manage-settings)：根据您的需求优化 Databend。
- [加载和卸载数据](/guides/load-data)：管理 Databend 中的数据导入/导出。
- [可视化](/guides/visualize)：将 Databend 与可视化工具集成以获得洞察力。