---
title: Snowflake 迁移指南
sidebar_label: Snowflake

---

> **能力**：全量

本教程介绍如何将 Snowflake 数据迁移到 Databend：先把数据导出到 Amazon S3，再加载到 Databend。整体分为三步：

![alt text](@site/static/img/load/snowflake-databend.png)

## 开始之前

请准备以下资源：

- **Amazon S3 Bucket**：用于存放导出的数据，并具备上传权限。示例使用 `s3://databend-doc/snowflake/`。[了解如何创建 Bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)。
- **AWS 凭证**：具备 Bucket 访问权限的 Access Key 与 Secret Key。[管理凭证](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)。
- **管理 IAM 角色与策略的权限**：需要在 Snowflake 与 S3 之间配置可信访问。[了解 IAM 角色与策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)。

## 步骤 1：为 Amazon S3 配置 Snowflake Storage Integration

本步骤会通过 IAM Role 让 Snowflake 能访问 S3。

1. 登录 AWS Console，在 **IAM** > **Policies** 创建策略，内容如下（Bucket 名称与路径请按需修改）：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
              "s3:PutObject",
              "s3:GetObject",
              "s3:GetObjectVersion",
              "s3:DeleteObject",
              "s3:DeleteObjectVersion"
            ],
            "Resource": "arn:aws:s3:::databend-doc/snowflake/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::databend-doc",
            "Condition": {
                "StringLike": {
                    "s3:prefix": [
                        "snowflake/*"
                    ]
                }
            }
        }
    ]
}
```

2. 在 **IAM** > **Roles** 创建名为 `databend-doc-role` 的角色，选择 **AWS account** → **This account**，并附加刚创建的策略。创建完成后保存角色 ARN，如 `arn:aws:iam::123456789012:role/databend-doc-role`。稍后还需更新该角色的信任策略。

3. 在 Snowflake 中创建名为 `my_s3_integration` 的 Storage Integration：

```sql
CREATE OR REPLACE STORAGE INTEGRATION my_s3_integration
  TYPE = EXTERNAL_STAGE
  STORAGE_PROVIDER = 'S3'
  STORAGE_AWS_ROLE_ARN = 'arn:aws:iam::123456789012:role/databend-doc-role'
  STORAGE_ALLOWED_LOCATIONS = ('s3://databend-doc/snowflake/')
  ENABLED = TRUE; 
```

4. 查看 Integration 详情，记录 `STORAGE_AWS_IAM_USER_ARN`（示例：`arn:aws:iam::123456789012:user/example`），稍后需要将其写入角色的信任关系：

```sql
DESCRIBE INTEGRATION my_s3_integration;
```

5. 回到 AWS Console，打开角色 `databend-doc-role`，在 **Trust relationships** 中编辑策略，粘贴以下内容，并将 `arn:aws:iam::123456789012:user/example` 替换为上一步得到的值：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::123456789012:user/example"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```

## 步骤 2：准备并导出数据到 Amazon S3

1. 在 Snowflake 中使用上一步创建的 Integration 定义 External Stage：

```sql
CREATE OR REPLACE STAGE my_external_stage 
    URL = 's3://databend-doc/snowflake/' 
    STORAGE_INTEGRATION = my_s3_integration 
    FILE_FORMAT = (TYPE = 'PARQUET');
```

2. 创建示例数据：

```sql
CREATE DATABASE doc;
USE DATABASE doc;

CREATE TABLE my_table (
    id INT,
    name STRING,
    age INT
);

INSERT INTO my_table (id, name, age) VALUES
(1, 'Alice', 30),
(2, 'Bob', 25),
(3, 'Charlie', 35);
```

3. 将数据导出到 Stage：

```sql
COPY INTO @my_external_stage/my_table_data_
  FROM my_table
  FILE_FORMAT = (TYPE = 'PARQUET') HEADER=true;
```

到 S3 查看 `databend-doc/snowflake` 即可看到生成的 Parquet 文件。

## 步骤 3：加载数据到 Databend Cloud

1. 在 Databend Cloud 内创建目标表：

```sql
CREATE DATABASE doc;
USE DATABASE doc;

CREATE TABLE my_target_table (
    id INT,
    name STRING,
    age INT
);
```

2. 使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 从 Bucket 加载数据：

```sql
COPY INTO my_target_table
FROM 's3://databend-doc/snowflake'
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>',
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
)
PATTERN = '.*[.]parquet'
FILE_FORMAT = (
    TYPE = 'PARQUET'
);
```

3. 验证数据：

```sql
SELECT * FROM my_target_table;

┌──────────────────────────────────────────────────────┐
│        id       │       name       │       age       │
├─────────────────┼──────────────────┼─────────────────┤
│               1 │ Alice            │              30 │
│               2 │ Bob              │              25 │
│               3 │ Charlie          │              35 │
└──────────────────────────────────────────────────────┘
```
