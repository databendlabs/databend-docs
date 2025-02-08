<think>
好的，我现在需要处理用户提供的关于从Snowflake迁移到Databend Cloud的教程翻译任务。首先，我要仔细阅读用户提供的规则，确保翻译过程中严格遵守这些要求。用户特别强调要保持Markdown结构不变，不添加或删除链接，不改变代码块内容，保留原始换行和空行，不处理HTML标签和permalink，以及正确格式化文档。此外，还有一些特定术语的翻译要求，比如'time travel'要译为'时间回溯'，'warehouse'译为'计算集群'，'Data Warehouse'译为'数仓'，'Self-Hosted'译为'私有化部署'，而'Databend Cloud'、'Vector'、'Stage'等保持不译。

接下来，我需要通读整个英文文档，理解每个步骤的内容和结构。文档分为几个主要部分：准备工作、配置Snowflake存储集成、导出数据到S3、加载数据到Databend Cloud。每个步骤都有详细的代码块和说明。我需要确保在翻译过程中，技术术语和专有名词如IAM角色、S3存储桶、Parquet格式等保持原样，或者按照用户指定的方式翻译。

在翻译过程中，我需要特别注意代码块中的内容不能有任何改动，包括注释和命令。例如，在创建IAM策略的JSON代码中，所有的资源ARN和权限设置都必须保持原样。此外，图片的alt文本和路径也不能更改，所以像`![alt text](../../../../static/img/documents/tutorials/trusted-entity.png)`这样的部分需要保留原样。

对于用户提到的特定词汇，比如'Self-Hosted'要翻译为'私有化部署'，我需要确保在文档中所有出现该词的地方都正确替换。同时，'warehouse'在上下文中指的是计算资源，所以要译为'计算集群'，而'Data Warehouse'则译为'数仓'，保持术语的一致性。

在翻译步骤说明时，要保持语句的准确性和专业性，同时符合中文的表达习惯。例如，步骤1中的“Create a policy on IAM > Policies”需要准确翻译为“在IAM > 策略中创建一个策略”，并确保界面元素的名称正确无误。

另外，用户提到如果遇到描述'Personal'版本计划时，要翻译为'基础版'。我需要检查文档中是否有相关内容，确保正确替换。例如，如果文档中提到选择“Personal”计划，应翻译为“基础版”。

在处理JSON和SQL代码时，必须严格保留原内容，不进行任何修改。例如，在创建存储集成的SQL语句中，所有的参数和值都要保持原样，确保用户复制代码后能够正确执行。

最后，完成翻译后，我需要通读整个翻译文档，检查是否符合所有规则，特别是结构是否保持原样，术语是否统一，代码块和链接是否正确保留。同时，确保没有遗漏任何部分，如步骤中的每个子步骤和注意事项都完整呈现。

通过以上步骤，我能够系统地将英文文档准确翻译成简体中文，同时严格遵守用户的所有要求，确保最终文档的专业性和可用性。
</think>

---
title: 从 Snowflake 迁移
---

在本教程中，我们将指导您完成从 Snowflake 导出 Parquet 格式数据到 Amazon S3 存储桶，并将其加载到 Databend Cloud 的流程。

## 准备工作

开始前，请确保满足以下先决条件：

- **Amazon S3 存储桶**：用于存储导出数据的 S3 存储桶，并具备上传文件所需的权限。[了解如何创建 S3 存储桶](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)。本教程使用 `s3://databend-doc/snowflake/` 作为导出数据的暂存位置。
- **AWS 凭证**：具备访问 S3 存储桶权限的 AWS 访问密钥 ID 和秘密访问密钥。[管理您的 AWS 凭证](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)。
- **管理 IAM 角色和策略的权限**：确保您拥有创建和管理 IAM 角色及策略的必要权限，以便配置 Snowflake 与 Amazon S3 之间的访问。[了解 IAM 角色和策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)。

## 步骤 1：为 Amazon S3 配置 Snowflake 存储集成

在此步骤中，我们将配置 Snowflake 使用 IAM 角色访问 Amazon S3。首先创建 IAM 角色，然后使用该角色建立 Snowflake 存储集成以实现安全数据访问。

1. 登录 AWS 管理控制台，在 **IAM** > **策略** 中创建策略，使用以下 JSON 代码：

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

该策略适用于名为 `databend-doc` 的 S3 存储桶及其内的 `snowflake` 文件夹：

- `s3:PutObject`、`s3:GetObject`、`s3:GetObjectVersion`、`s3:DeleteObject`、`s3:DeleteObjectVersion`：允许对 `snowflake` 文件夹（如 `s3://databend-doc/snowflake/`）内的对象进行操作。您可以在此文件夹中上传、读取和删除对象。
- `s3:ListBucket`、`s3:GetBucketLocation`：允许列出 `databend-doc` 存储桶内容并获取其位置。`Condition` 元素确保列表操作仅限于 `snowflake` 文件夹内的对象。

2. 在 **IAM** > **角色** 中创建名为 `databend-doc-role` 的角色，并附加刚创建的策略：
    - 在创建角色的第一步中，选择 **AWS 账户** 作为 **可信实体类型**，并选择 **此账户 (xxxxx)** 作为 **AWS 账户**。

    ![替代文本](../../../../static/img/documents/tutorials/trusted-entity.png)

    - 角色创建完成后，复制并安全保存角色 ARN，例如 `arn:aws:iam::123456789012:role/databend-doc-role`。
    - 我们将在获取 Snowflake 账户的 IAM 用户 ARN 后更新角色的 **信任关系**。

3. 在 Snowflake 中打开 SQL 工作表，使用角色 ARN 创建名为 `my_s3_integration` 的存储集成：

```sql
CREATE OR REPLACE STORAGE INTEGRATION my_s3_integration
  TYPE = EXTERNAL_STAGE
  STORAGE_PROVIDER = 'S3'
  STORAGE_AWS_ROLE_ARN = 'arn:aws:iam::123456789012:role/databend-doc-role'
  STORAGE_ALLOWED_LOCATIONS = ('s3://databend-doc/snowflake/')
  ENABLED = TRUE; 
```

4. 显示存储集成详细信息，并获取结果中 `STORAGE_AWS_IAM_USER_ARN` 属性的值，例如 `arn:aws:iam::123456789012:user/example`。我们将在下一步中使用此值更新角色 `databend-doc-role` 的 **信任关系**。

```sql
DESCRIBE INTEGRATION my_s3_integration;
```

5. 返回 AWS 管理控制台，打开角色 `databend-doc-role`，导航至 **信任关系** > **编辑信任策略**，将以下代码复制到编辑器中：

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

其中 ARN `arn:aws:iam::123456789012:user/example` 是我们在上一步中获取的 Snowflake 账户的 IAM 用户 ARN。

## 步骤 2：准备数据并导出到 Amazon S3

1. 使用 Snowflake 存储集成 `my_s3_integration` 在 Snowflake 中创建外部 stage：

```sql
CREATE OR REPLACE STAGE my_external_stage 
    URL = 's3://databend-doc/snowflake/' 
    STORAGE_INTEGRATION = my_s3_integration 
    FILE_FORMAT = (TYPE = 'PARQUET');
```

`URL = 's3://databend-doc/snowflake/'` 指定了数据暂存的 S3 存储桶和文件夹。路径 `s3://databend-doc/snowflake/` 对应 S3 存储桶 `databend-doc` 及其内的 `snowflake` 文件夹。

2. 准备要导出的数据：

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

3. 使用 COPY INTO 将表数据导出到外部 stage：

```sql
COPY INTO @my_external_stage/my_table_data_
  FROM my_table
  FILE_FORMAT = (TYPE = 'PARQUET') HEADER=true;
```

现在打开存储桶 `databend-doc`，您应该能在 `snowflake` 文件夹中看到一个 Parquet 文件：

![替代文本](../../../../static/img/documents/tutorials/bucket-folder.png)

## 步骤 3：将数据加载到 Databend Cloud

1. 在 Databend Cloud 中创建目标表：

```sql
CREATE DATABASE doc;
USE DATABASE doc;

CREATE TABLE my_target_table (
    id INT,
    name STRING,
    age INT
);
```

2. 使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 加载存储桶中的导出数据：

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

3. 验证加载的数据：

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