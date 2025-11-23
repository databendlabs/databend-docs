---
title: 使用 ATTACH TABLE
---

本教程介绍如何使用 [ATTACH TABLE](/sql/sql-commands/ddl/table/attach-table) 命令将 Databend Cloud 中的表链接到 S3 中的现有表。

## 准备工作

在开始之前，请确保您已准备好以下先决条件：

- 您的本地机器上已安装 [Docker](https://www.docker.com/)，因为它将用于启动私有化部署的 Databend。
- 一个 AWS S3 bucket，用作您的私有化部署 Databend 的存储。[了解如何创建 S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)。
- 具有足够权限访问您的 S3 bucket 的 AWS Access Key ID 和 Secret Access Key。[管理您的 AWS 凭证](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)。
- 您的本地机器上已安装 BendSQL。有关如何使用各种包管理器安装 BendSQL 的说明，请参阅 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。

## 步骤 1：在 Docker 中启动 Databend

1. 在您的本地机器上启动一个 Databend 容器。以下命令启动一个以 S3 作为存储后端的 Databend 容器，使用 `databend-doc` bucket，以及指定的 S3 endpoint 和身份验证凭证。

```bash
docker run \
    -p 8000:8000 \
    -e QUERY_STORAGE_TYPE=s3 \
    -e AWS_S3_ENDPOINT="https://s3.us-east-2.amazonaws.com" \
    -e AWS_S3_BUCKET=databend-doc\
    -e AWS_ACCESS_KEY_ID=<your-aws-access-key-id> \ 
    -e AWS_SECRET_ACCESS_KEY=<your-aws-secrect-access-key> \ 
    datafuselabs/databend:v1.2.699-nightly
```

2. 创建一个名为 `population` 的表来存储城市、省份和人口数据，并插入示例如下：

```sql
CREATE TABLE population (
  city VARCHAR(50),
  province VARCHAR(50),  
  population INT
);

INSERT INTO population (city, province, population) VALUES
  ('Toronto', 'Ontario', 2731571),
  ('Montreal', 'Quebec', 1704694),
  ('Vancouver', 'British Columbia', 631486);
```

3. 运行以下语句以检索表在 S3 中的位置。如下面的结果所示，本教程中该表的 S3 URI 为 `s3://databend-doc/1/16/`。

```sql
SELECT snapshot_location FROM FUSE_SNAPSHOT('default', 'population');

┌──────────────────────────────────────────────────┐
│                 snapshot_location                │
├──────────────────────────────────────────────────┤
│ 1/16/_ss/513c5100aa0243fe863b4cc2df0e3046_v4.mpk │
└──────────────────────────────────────────────────┘
```

## 步骤 2：在 Databend Cloud 中设置 Attached Tables

1. 使用 BendSQL 连接到 Databend Cloud。如果您不熟悉 BendSQL，请参阅本教程：[使用 BendSQL 连接到 Databend Cloud](../connect/connect-to-databendcloud-bendsql.md)。

2. 执行以下语句以创建两个 attached tables：
    - 第一个表 `population_all_columns` 包含源数据中的所有列。
    - 第二个表 `population_only` 仅包含选定的列（`city` 和 `population`）。

```sql
-- 创建一个包含源数据中所有列的 attached table
ATTACH TABLE population_all_columns 's3://databend-doc/1/16/' CONNECTION = (
  REGION='us-east-2',
  AWS_KEY_ID = '<your_aws_key_id>',
  AWS_SECRET_KEY = '<your_aws_secret_key>'
);

-- 创建一个仅包含源数据中选定列（city 和 population）的 attached table
ATTACH TABLE population_only (city, population) 's3://databend-doc/1/16/' CONNECTION = (
  REGION='us-east-2',
  AWS_KEY_ID = '<your_aws_key_id>',
  AWS_SECRET_KEY = '<your_aws_secret_key>'
);
```

## 步骤 3：验证 Attached Tables

1. 查询两个 attached tables 以验证其内容：

```sql
SELECT * FROM population_all_columns;

┌───────────────────────────────────────────────────────┐
│       city       │     province     │    population   │
├──────────────────┼──────────────────┼─────────────────┤
│ Toronto          │ Ontario          │         2731571 │
│ Montreal         │ Quebec           │         1704694 │
│ Vancouver        │ British Columbia │          631486 │
└───────────────────────────────────────────────────────┘

SELECT * FROM population_only;

┌────────────────────────────────────┐
│       city       │    population   │
├──────────────────┼─────────────────┤
│ Toronto          │         2731571 │
│ Montreal         │         1704694 │
│ Vancouver        │          631486 │
└────────────────────────────────────┘
```

2. 如果您更新 Databend 中的源表，您可以在 Databend Cloud 上的 attached table 中观察到相同的更改。例如，如果您将源表中 Toronto 的人口更改为 2,371,571：

```sql
UPDATE population
SET population = 2371571
WHERE city = 'Toronto';
```

执行更新后，您可以查询两个 attached tables 以验证是否反映了更改：

```sql
-- 检查包含所有列的 attached table 中更新后的人口
SELECT population FROM population_all_columns WHERE city = 'Toronto';

-- 检查仅包含人口列的 attached table 中更新后的人口
SELECT population FROM population_only WHERE city = 'Toronto';
```

上述两个查询的预期输出：

```sql
┌─────────────────┐
│    population   │
├─────────────────┤
│         2371571 │
└─────────────────┘
```

3. 如果您从源表中删除 `province` 列，则该列将不再在 attached table 中可用于查询。

```sql
ALTER TABLE population DROP province;
```

删除列后，任何引用它的查询都将导致错误。但是，仍然可以成功查询剩余的列。

例如，尝试查询删除的 `province` 列将失败：

```sql
SELECT province FROM population_all_columns;
error: APIError: QueryFailed: [1065]error:
  --> SQL:1:8
  |
1 | SELECT province FROM population_all_columns
  |        ^^^^^^^^ column province doesn't exist
```

但是，您仍然可以检索 `city` 和 `population` 列：

```sql
SELECT city, population FROM population_all_columns;

┌────────────────────────────────────┐
│       city       │    population   │
├──────────────────┼─────────────────┤
│ Toronto          │         2371571 │
│ Montreal         │         1704694 │
│ Vancouver        │          631486 │
└────────────────────────────────────┘
```