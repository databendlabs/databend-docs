---
title: 数据备份与恢复 (BendSave)
sidebar_label: BendSave
---

本教程将演示如何使用 BendSave 备份与恢复数据。我们会以本地 MinIO 作为 Databend 的 S3 兼容存储以及备份目标。

## 开始之前

请准备：

- 一台 Linux 机器（x86_64 或 aarch64）：本教程在 Linux 上部署 Databend，可使用本地、虚拟机或云服务器（如 AWS EC2）。
  - [Docker](https://www.docker.com/)：用于部署本地 MinIO。
  - [AWS CLI](https://aws.amazon.com/cli/)：用于管理 MinIO 中的 Bucket。
  - 如果在 AWS EC2 上操作，请确保安全组放开 `8000` 端口，以便 BendSQL 连接 Databend。
- 本地安装 BendSQL，参见 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。
- Databend 发布包：从 [Databend GitHub Releases](https://github.com/databendlabs/databend/releases) 下载。该包的 `bin` 目录包含本教程所需的 `databend-bendsave` 二进制：

```bash
databend-v1.2.725-nightly-x86_64-unknown-linux-gnu/
├── bin
│   ├── bendsql
│   ├── databend-bendsave  # 本教程所用的 BendSave
│   ├── databend-meta
│   ├── databend-metactl
│   └── databend-query
├── configs
│   ├── databend-meta.toml
│   └── databend-query.toml
└── ...
```

## 步骤 1：在 Docker 中启动 MinIO

1. 在 Linux 机器上启动 MinIO 容器，映射 9000（API）与 9001（Web Console）端口：

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

2. 配置凭证并通过 AWS CLI 创建两个 Bucket：一个用于备份（`backupbucket`），一个作为 Databend 的存储（`databend`）。

```bash
export AWS_ACCESS_KEY_ID=minioadmin
export AWS_SECRET_ACCESS_KEY=minioadmin

aws --endpoint-url http://127.0.0.1:9000/ s3 mb s3://backupbucket
aws --endpoint-url http://127.0.0.1:9000/ s3 mb s3://databend
```

## 步骤 2：部署 Databend

1. 下载并解压最新 Databend：

```bash
wget https://github.com/databendlabs/databend/releases/download/v1.2.25-nightly/databend-dbg-v1.2.725-nightly-x86_64-unknown-linux-gnu.tar.gz

tar -xzvf databend-dbg-v1.2.725-nightly-x86_64-unknown-linux-gnu.tar.gz
```

2. 编辑 **configs/databend-query.toml**：

```bash
vi configs/databend-query.toml
```

关键配置如下：

```toml
...
[[query.users]]
name = "root"
auth_type = "no_password"
...
[storage]
type = "s3"
...
[storage.s3]
bucket = "databend"
endpoint_url = "http://127.0.0.1:9000"
access_key_id = "minioadmin"
secret_access_key = "minioadmin"
enable_virtual_host_style = false
```

3. 启动 Meta 与 Query 服务：

```bash
./databend-meta -c ../configs/databend-meta.toml > meta.log 2>&1 &
```

```bash
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

通过健康检查确认服务已启动：

```bash
curl -I  http://127.0.0.1:28002/v1/health
curl -I  http://127.0.0.1:8080/v1/health
```

4. 使用 BendSQL 连接 Databend，激活企业 License、创建表并插入示例数据：

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

5. 在 Linux 主机上检查 Databend Bucket，确认已有数据：

```bash
aws --endpoint-url http://127.0.0.1:9000 s3 ls s3://databend/ --recursive
```

## 步骤 3：使用 BendSave 备份

1. 运行 BendSave，将 Databend 数据备份至 `backupbucket`：

```bash
export AWS_ACCESS_KEY_ID=minioadmin
export AWS_SECRET_ACCESS_KEY=minioadmin

./databend-bendsave backup \
  --from ../configs/databend-query.toml \
  --to 's3://backupbucket?endpoint=http://127.0.0.1:9000/&region=us-east-1'
```

2. 列出 `backupbucket`，确认备份文件：

```bash
aws --endpoint-url http://127.0.0.1:9000 s3 ls s3://backupbucket/ --recursive
```

## 步骤 4：使用 BendSave 恢复

1. 清空 `databend` Bucket：

```bash
aws --endpoint-url http://127.0.0.1:9000 s3 rm s3://databend/ --recursive
```

2. 再次在 BendSQL 中查询 `books`，会因为文件缺失而失败。

3. 执行恢复命令：

```bash
./databend-bendsave restore \
  --from "s3://backupbucket?endpoint=http://127.0.0.1:9000/&region=us-east-1" \
  --to-query ../configs/databend-query.toml \
  --to-meta ../configs/databend-meta.toml \
  --confirm
```

4. 列出 `databend` Bucket，确认文件已恢复：

```bash
aws --endpoint-url http://127.0.0.1:9000 s3 ls s3://databend/ --recursive
```

5. 在 BendSQL 中再次查询 `books`，即可看到记录：

```sql
SELECT * FROM books;

┌────────────────────────────────────────────────────────┐
│        id        │       title      │       genre      │
├──────────────────┼──────────────────┼──────────────────┤
│                1 │ Invisible Stars  │ General          │
└────────────────────────────────────────────────────────┘
```
