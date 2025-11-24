---
title: "Databend Cloud：通过 ATTACH TABLE 共享数据"
sidebar_label: "数据共享"
---

本教程将演示如何在 Databend Cloud 中使用 [ATTACH TABLE](/sql/sql-commands/ddl/table/attach-table) 命令，将一张 Databend Cloud 表链接到存放在 S3 Bucket 中的自建 Databend 表。

## 开始之前

请确保已经满足以下前提条件：

- 本地已安装 [Docker](https://www.docker.com/)，用于启动自建 Databend。
- 已有一个供自建 Databend 使用的 AWS S3 Bucket。参见 [创建 S3 Bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)。
- 拥有具备目标 Bucket 访问权限的 AWS Access Key ID 与 Secret Access Key。参见 [管理 AWS 凭证](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)。
- 本地已安装 BendSQL。安装方法请见 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。

## 步骤 1：在 Docker 中启动 Databend

1. 在本地启动 Databend 容器。以下命令以 `databend-doc` 作为存储 Bucket，并填写了 S3 Endpoint 与访问凭证：

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

2. 创建名为 `population` 的表来保存城市、省份与人口数据，并插入示例记录：

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

3. 运行以下语句获取该表在 S3 上的位置。下列结果显示表的 S3 URI 为 `s3://databend-doc/1/16/`：

```sql
SELECT snapshot_location FROM FUSE_SNAPSHOT('default', 'population');

┌──────────────────────────────────────────────────┐
│                 snapshot_location                │
├──────────────────────────────────────────────────┤
│ 1/16/_ss/513c5100aa0243fe863b4cc2df0e3046_v4.mpk │
└──────────────────────────────────────────────────┘
```

## 步骤 2：在 Databend Cloud 中创建附加表

1. 使用 BendSQL 连接 Databend Cloud。如需了解 BendSQL 连接方法，可参考教程：[使用 BendSQL 连接 Databend Cloud](../getting-started/connect-to-databendcloud-bendsql.md)。

2. 执行以下语句创建两张附加表：
   - `population_all_columns`：包含来源表的全部列。
   - `population_only`：仅包含 `city` 与 `population` 两列。

```sql
-- 附加包含所有列的表
ATTACH TABLE population_all_columns 's3://databend-doc/1/16/' CONNECTION = (
  ACCESS_KEY_ID = '<your_aws_key_id>',
  SECRET_ACCESS_KEY = '<your_aws_secret_key>'
);

-- 附加只保留 city 与 population 的表
ATTACH TABLE population_only (city, population) 's3://databend-doc/1/16/' CONNECTION = (
  ACCESS_KEY_ID = '<your_aws_key_id>',
  SECRET_ACCESS_KEY = '<your_aws_secret_key>'
);
```

## 步骤 3：验证附加表

1. 查询两张附加表，确认数据一致：

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

2. 如果在自建 Databend 中更新原表（例如把 Toronto 的人口改为 2,371,571），附加表也会反映同样的变更：

```sql
UPDATE population
SET population = 2371571
WHERE city = 'Toronto';
```

随后再次查询即可看到变化：

```sql
-- 查询包含全部列的附加表
SELECT population FROM population_all_columns WHERE city = 'Toronto';

-- 查询仅包含 population 列的附加表
SELECT population FROM population_only WHERE city = 'Toronto';
```

预期输出：

```sql
┌─────────────────┐
│    population   │
├─────────────────┤
│         2371571 │
└─────────────────┘
```

3. 如果在原表中删除 `province` 列，附加表中同样无法再查询该列：

```sql
ALTER TABLE population DROP province;
```

之后任何引用 `province` 的查询都会报错，而其他列仍可正常使用。

示例：查询已删除的列会失败：

```sql
SELECT province FROM population_all_columns;
error: APIError: QueryFailed: [1065]error:
  --> SQL:1:8
  |
1 | SELECT province FROM population_all_columns
  |        ^^^^^^^^ column province doesn't exist
```

但 `city`、`population` 仍可照常查询：

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
