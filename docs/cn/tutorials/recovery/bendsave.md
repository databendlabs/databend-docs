---
title: 使用 BendSave 备份和恢复数据
---

本教程将引导你了解如何使用 BendSave 备份和恢复数据。我们将使用一个本地 MinIO 实例，它既作为 Databend 兼容 S3 的存储后端，也作为存储备份的目标位置。

## 在开始之前

在开始之前，请确保你已满足以下先决条件：

- 一台 Linux 机器（x86_64 或 aarch64 架构）：在本教程中，我们将在 Linux 机器上部署 Databend。你可以使用本地机器、虚拟机或云实例（如 AWS EC2）。
    - [Docker](https://www.docker.com/): 用于部署本地 MinIO 实例。
    - [AWS CLI](https://aws.amazon.com/cli/): 用于管理 MinIO 中的存储桶（Bucket）。
    - 如果你使用的是 AWS EC2，请确保你的安全组允许端口 `8000` 的入站流量，因为这是 BendSQL 连接到 Databend 所必需的。

- BendSQL 已安装在你的本地机器上。有关如何使用各种包管理器安装 BendSQL 的说明，请参阅 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。

- Databend 发布包：从 [Databend GitHub 发布页面](https://github.com/databendlabs/databend/releases) 下载发布包。该包的 `bin` 目录中包含 `databend-bendsave` 二进制文件，这是我们在本教程中用于备份和恢复操作的工具。
```bash
databend-v1.2.725-nightly-x86_64-unknown-linux-gnu/
├── bin
│   ├── bendsql
│   ├── databend-bendsave  # 本教程中使用的 BendSave 二进制文件
│   ├── databend-meta
│   ├── databend-metactl
│   └── databend-query
├── configs
│   ├── databend-meta.toml
│   └── databend-query.toml
└── ...
```

## 第一步：在 Docker 中启动 MinIO

1. 在你的 Linux 机器上启动一个 MinIO 容器。以下命令将启动一个名为 **minio** 的 MinIO 容器，并暴露端口 `9000`（用于 API）和 `9001`（用于 Web 控制台）：

```bash
docker run -d --name minio \
  -e "MINIO_ACCESS_KEY=minioadmin" \
  -e "MINIO_SECRET_KEY=minioadmin" \
  -p 9000:9000 \
  -p 9001:9001 \
  minio/minio server /data \
    --address :9000 \
    --console-address :9001
```

2. 将你的 MinIO 凭据设置为环境变量，然后使用 AWS CLI 创建两个存储桶（Bucket）：一个用于存储备份（**backupbucket**），另一个用于存储 Databend 数据（**databend**）：

```bash
export AWS_ACCESS_KEY_ID=minioadmin
export AWS_SECRET_ACCESS_KEY=minioadmin

aws --endpoint-url http://127.0.0.1:9000/ s3 mb s3://backupbucket
aws --endpoint-url http://127.0.0.1:9000/ s3 mb s3://databend
```

## 第二步：设置 Databend

1. 下载最新的 Databend 发布包并解压以获取必要的二进制文件：

```bash
wget https://github.com/databendlabs/databend/releases/download/v1.2.25-nightly/databend-dbg-v1.2.725-nightly-x86_64-unknown-linux-gnu.tar.gz

tar -xzvf databend-dbg-v1.2.725-nightly-x86_64-unknown-linux-gnu.tar.gz
```

2. 配置 **configs** 文件夹中的 **databend-query.toml** 配置文件。

```bash
vi configs/databend-query.toml
```

以下显示了本教程所需的关键配置：

```toml
...
[[query.users]]
name = "root"
auth_type = "no_password"
...
# Storage config.
[storage]
# fs | s3 | azblob | gcs | oss | cos
type = "s3"
...
# To use an Amazon S3-like storage service, uncomment this block and set your values.
[storage.s3]
bucket = "databend"
endpoint_url = "http://127.0.0.1:9000"
access_key_id = "minioadmin"
secret_access_key = "minioadmin"
enable_virtual_host_style = false
```

3. 使用以下命令启动 Meta 和 Query 服务：

```bash
./databend-meta -c ../configs/databend-meta.toml > meta.log 2>&1 &
```

```bash
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

启动服务后，通过检查它们的健康检查端点来验证它们是否正在运行。成功的响应应返回 HTTP 状态 200 OK。

```bash
curl -I  http://127.0.0.1:28002/v1/health

curl -I  http://127.0.0.1:8080/v1/health
```

4. 使用 BendSQL 从你的本地机器连接到 Databend 实例，然后应用你的 Databend 企业版（Enterprise）许可证，创建一个表并插入一些示例数据。

```bash
bendsql -h <your-linux-host>
```

```sql
SET GLOBAL enterprise_license='<your-license-key>';
```

```sql
CREATE TABLE books (
    id BIGINT UNSIGNED,
    title VARCHAR,
    genre VARCHAR DEFAULT 'General'
);

INSERT INTO books(id, title) VALUES(1, 'Invisible Stars');
```

5. 回到你的 Linux 机器上，验证表数据是否已存储在你的 Databend 存储桶（Bucket）中：

```bash
aws --endpoint-url http://127.0.0.1:9000 s3 ls s3://databend/ --recursive
```

```bash
2025-04-07 15:27:06        748 1/169/_b/h0196160323247b1cab49be6060d42df8_v2.parquet
2025-04-07 15:27:06        646 1/169/_sg/h0196160323247c5eb0a1a860a6442c70_v4.mpk
2025-04-07 15:27:06        550 1/169/_ss/h019610dcc72474adb32ef43698db2a09_v4.mpk
2025-04-07 15:27:06        143 1/169/last_snapshot_location_hint_v2
```

## 第三步：使用 BendSave 备份

1. 运行以下命令将你的 Databend 数据备份到 MinIO 中的 **backupbucket**：

```bash
export AWS_ACCESS_KEY_ID=minioadmin
export AWS_SECRET_ACCESS_KEY=minioadmin

./databend-bendsave backup \
  --from ../configs/databend-query.toml \
  --to 's3://backupbucket?endpoint=http://127.0.0.1:9000/&region=us-east-1'
<jemalloc>: Number of CPUs detected is not deterministic. Per-CPU arena disabled.
Backing up from ../configs/databend-query.toml to s3://backupbucket?endpoint=http://127.0.0.1:9000/&region=us-east-1
```

2. 备份完成后，你可以通过列出 **backupbucket** 的内容来验证文件是否已写入：

```bash
aws --endpoint-url http://127.0.0.1:9000 s3 ls s3://backupbucket/ --recursive
```

```bash
2025-04-07 15:44:29        748 1/169/_b/h0196160323247b1cab49be6060d42df8_v2.parquet
2025-04-07 15:44:29        646 1/169/_sg/h0196160323247c5eb0a1a860a6442c70_v4.mpk
2025-04-07 15:44:29        550 1/169/_ss/h019610dcc72474adb32ef43698db2a09_v4.mpk
2025-04-07 15:44:29        143 1/169/last_snapshot_location_hint_v2
2025-04-07 15:44:29     344781 databend_meta.db
```

## 第四步：使用 BendSave 恢复

1. 删除 **databend** 存储桶（Bucket）中的所有文件：

```bash
aws --endpoint-url http://127.0.0.1:9000 s3 rm s3://databend/ --recursive
```

2. 删除后，你可以使用 BendSQL 验证在 Databend 中查询该表会失败：

```sql
SELECT * FROM books;
```

```bash
error: APIError: QueryFailed: [3001]NotFound (persistent) at read, context: { uri: http://127.0.0.1:9000/databend/1/169/_ss/h019610dcc72474adb32ef43698db2a09_v4.mpk, response: Parts { status: 404, version: HTTP/1.1, headers: {"accept-ranges": "bytes", "content-length": "423", "content-type": "application/xml", "server": "MinIO", "strict-transport-security": "max-age=31536000; includeSubDomains", "vary": "Origin", "vary": "Accept-Encoding", "x-amz-id-2": "dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8", "x-amz-request-id": "18342C51C209C7E9", "x-content-type-options": "nosniff", "x-ratelimit-limit": "144", "x-ratelimit-remaining": "144", "x-xss-protection": "1; mode=block", "date": "Mon, 07 Apr 2025 23:14:45 GMT"} }, service: s3, path: 1/169/_ss/h019610dcc72474adb32ef43698db2a09_v4.mpk, range: 0- } => S3Error { code: "NoSuchKey", message: "The specified key does not exist.", resource: "/databend/1/169/_ss/h019610dcc72474adb32ef43698db2a09_v4.mpk", request_id: "18342C51C209C7E9" }
```

3. 运行以下命令将你的 Databend 数据恢复到 MinIO 中的 **databend** 存储桶（Bucket）：

```bash
./databend-bendsave restore \
  --from "s3://backupbucket?endpoint=http://127.0.0.1:9000/&region=us-east-1" \
  --to-query ../configs/databend-query.toml \
  --to-meta ../configs/databend-meta.toml \
  --confirm
<jemalloc>: Number of CPUs detected is not deterministic. Per-CPU arena disabled.
Restoring from s3://backupbucket?endpoint=http://127.0.0.1:9000/&region=us-east-1 to query ../configs/databend-query.toml and meta ../configs/databend-meta.toml with confirmation
```

4. 恢复完成后，你可以通过列出 **databend** 存储桶（Bucket）的内容来验证文件是否已写回：

```bash
aws --endpoint-url http://127.0.0.1:9000 s3 ls s3://databend/ --recursive
```

```bash
2025-04-07 23:21:39        748 1/169/_b/h0196160323247b1cab49be6060d42df8_v2.parquet
2025-04-07 23:21:39        646 1/169/_sg/h0196160323247c5eb0a1a860a6442c70_v4.mpk
2025-04-07 23:21:39        550 1/169/_ss/h019610dcc72474adb32ef43698db2a09_v4.mpk
2025-04-07 23:21:39        143 1/169/last_snapshot_location_hint_v2
2025-04-07 23:21:39     344781 databend_meta.db
```

5. 再次使用 BendSQL 查询该表，你会看到查询现在成功了：

```sql
SELECT * FROM books;
```

```sql
┌────────────────────────────────────────────────────────┐
│        id        │       标题       │       类型       │
├──────────────────┼──────────────────┼──────────────────┤
│                1 │    隐形的星星    │       通用       │
└────────────────────────────────────────────────────────┘
```