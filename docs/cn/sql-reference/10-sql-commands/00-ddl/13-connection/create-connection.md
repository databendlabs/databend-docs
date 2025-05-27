---
title: CREATE CONNECTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.339"/>

创建到外部存储的连接。

:::warning
重要提示: 当对象 (Stage、表等) 使用连接时，它们会复制并永久存储连接的参数。如果您稍后使用 CREATE OR REPLACE CONNECTION 修改连接，现有对象将继续使用旧参数。要使用新连接参数更新对象，您必须删除并重新创建这些对象。
:::

## 语法

```sql
CREATE [ OR REPLACE ] CONNECTION [ IF NOT EXISTS ] <connection_name> 
    STORAGE_TYPE = '<type>' 
    [ <storage_params> ]
```

| 参数        | 描述                                                                                                                                        |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| STORAGE_TYPE     | 存储服务类型。可能的值包括: `s3`、`azblob`、`gcs`、`oss` 和 `cos`。                                                         |
| storage_params   | 根据存储类型和身份验证方法而有所不同。有关常见身份验证方法的详细信息，请参见下文。 |

有关其他存储类型和附加参数，请参见 [连接参数](../../../00-sql-reference/51-connect-parameters.md) 了解详细信息。

### Amazon S3 的身份验证方法

Databend 支持两种主要的 Amazon S3 连接身份验证方法:

#### 1. Access Keys 身份验证

使用 AWS access keys 进行身份验证。这是使用 access key ID 和 secret access key 的传统方法。

```sql
CREATE CONNECTION <connection_name> 
    STORAGE_TYPE = 's3' 
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>';
```

| 参数 | 描述 |
|-----------|-------------|
| ACCESS_KEY_ID | 您的 AWS access key ID。 |
| SECRET_ACCESS_KEY | 您的 AWS secret access key。 |

#### 2. IAM Role 身份验证

使用 AWS IAM 角色进行身份验证，而不是 access keys。这提供了一种更安全的方式来访问您的 S3 存储桶，无需在 Databend 中直接管理凭据。

```sql
CREATE CONNECTION <connection_name> 
    STORAGE_TYPE = 's3' 
    ROLE_ARN = '<your-role-arn>';
```

| 参数 | 描述 |
|-----------|-------------|
| ROLE_ARN  | Databend 将承担的 IAM 角色的 Amazon 资源名称 (ARN)，用于访问您的 S3 资源。 |


## 示例

### 使用 Access Keys

此示例创建一个名为 'toronto' 的 Amazon S3 连接，并建立一个名为 'my_s3_stage' 的外部 Stage，链接到 's3://databend-toronto' URL，使用 'toronto' 连接。有关连接的更多实际示例，请参见 [使用示例](index.md#usage-examples)。  

```sql
CREATE CONNECTION toronto 
    STORAGE_TYPE = 's3' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>' 
    ACCESS_KEY_ID = '<your-access-key-id>';

CREATE STAGE my_s3_stage 
    URL = 's3://databend-toronto' 
    CONNECTION = (CONNECTION_NAME = 'toronto');
```

### 使用 AWS IAM Role

此示例使用 IAM 角色创建到 Amazon S3 的连接，然后创建一个使用此连接的 Stage。这种方法更安全，因为它不需要在 Databend 中存储 access keys。

```sql
CREATE CONNECTION databend_test 
    STORAGE_TYPE = 's3' 
    ROLE_ARN = 'arn:aws:iam::987654321987:role/databend-test';

CREATE STAGE databend_test 
    URL = 's3://test-bucket-123' 
    CONNECTION = (CONNECTION_NAME = 'databend_test');

-- 现在您可以从 S3 存储桶查询数据
SELECT * FROM @databend_test/test.parquet LIMIT 1;
```

:::info
要在 Databend Cloud 中使用 IAM 角色，您需要在您的 AWS 账户和 Databend Cloud 之间建立信任关系。详细说明请参见 [使用 AWS IAM Role 创建外部 Stage](/guides/load-data/stage/aws-iam-role)。
:::