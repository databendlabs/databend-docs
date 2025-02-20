---
title: 使用 ATTACH TABLE 链接表
---

在本教程中，我们将指导您如何使用 [ATTACH TABLE](/sql/sql-commands/ddl/table/attach-table) 命令将 Databend Cloud 中的表与存储在 S3 桶中的现有 Databend 表链接起来。

## 开始之前

在开始之前，请确保您已具备以下先决条件：

- 本地机器上已安装 [Docker](https://www.docker.com/)，因为它将用于启动私有化部署的 Databend。
- 一个 AWS S3 桶，用作私有化部署 Databend 的存储。[了解如何创建 S3 桶](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)。
- 具有足够权限访问 S3 桶的 AWS Access Key ID 和 Secret Access Key。[管理您的 AWS 凭证](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)。
- 本地机器上已安装 BendSQL。有关如何使用各种包管理器安装 BendSQL 的说明，请参阅 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。

## 步骤 1：在 Docker 中启动 Databend

1. 在本地机器上启动一个 Databend 容器。以下命令使用 S3 作为存储后端，使用 `databend-doc` 桶以及指定的 S3 端点和认证凭证启动 Databend 容器。

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

2. 创建一个名为 `population` 的表来存储城市、省份和人口数据，并插入示例记录如下：

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

3. 运行以下语句以检索表在 S3 中的位置。如下所示的结果中，本教程中表的 S3 URI 为 `s3://databend-doc/1/16/`。

```sql
SELECT snapshot_location FROM FUSE_SNAPSHOT('default', 'population');

┌──────────────────────────────────────────────────┐
│                 snapshot_location                │
├──────────────────────────────────────────────────┤
│ 1/16/_ss/513c5100aa0243fe863b4cc2df0e3046_v4.mpk │
└──────────────────────────────────────────────────┘
```

## 步骤 2：在 Databend Cloud 中设置附加表

1. 使用 BendSQL 连接到 Databend Cloud。如果您不熟悉 BendSQL，请参考本教程：[使用 BendSQL 连接到 Databend Cloud](../connect/connect-to-databendcloud-bendsql.md)。

2. 执行以下语句以创建两个附加表：
    - 第一个表 `population_all_columns` 包含源数据中的所有列。
    - 第二个表 `population_only` 仅包含选定的列（`city` 和 `population`）。

```sql
-- 创建一个包含源数据中所有列的附加表
ATTACH TABLE population_all_columns 's3://databend-doc/1/16/' CONNECTION = (
  REGION='us-east-2',
  AWS_KEY_ID = '<your_aws_key_id>',
  AWS_SECRET_KEY = '<your_aws_secret_key>'
);

-- 创建一个仅包含选定列（city 和 population）的附加表
ATTACH TABLE population_only (city, population) 's3://databend-doc/1/16/' CONNECTION = (
  REGION='us-east-2',
  AWS_KEY_ID = '<your_aws_key_id>',
  AWS_SECRET_KEY = '<your_aws_secret_key>'
);
```

## 步骤 3：验证附加表

1. 查询两个附加表以验证其内容：

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

2. 如果您在 Databend 中更新源表，您可以在 Databend Cloud 的附加表中观察到相同的变化。例如，如果您将源表中 Toronto 的人口更改为 2,371,571：

```sql
UPDATE population
SET population = 2371571
WHERE city = 'Toronto';
```

执行更新后，您可以查询两个附加表以验证更改是否反映：

```sql
-- 检查包含所有列的附加表中的更新后人口  
SELECT population FROM population_all_columns WHERE city = 'Toronto';

-- 检查仅包含人口列的附加表中的更新后人口  
SELECT population FROM population_only WHERE city = 'Toronto';
```

上述查询的预期输出：

```sql
┌─────────────────┐
│    population   │
├─────────────────┤
│         2371571 │
└─────────────────┘
```

3. 如果您从源表中删除 `province` 列，它将不再在附加表中可用。

```sql
ALTER TABLE population DROP province;
```

删除列后，任何引用它的查询都将导致错误。然而，剩余的列仍然可以成功查询。

例如，尝试查询已删除的 `province` 列将失败：

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