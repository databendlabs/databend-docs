---
title: CREATE CONNECTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<FunctionDescription description="引入或更新于：v1.2.780"/>

创建到外部存储的连接。

:::warning
重要提示：当对象（如 Stage、表等）使用连接时，它们会永久复制并存储该连接的参数。如果之后使用 CREATE OR REPLACE CONNECTION 修改连接，现有对象将继续使用旧参数。要使用新的连接参数更新对象，必须删除并重新创建这些对象。
:::

## 语法

```sql
CREATE [ OR REPLACE ] CONNECTION [ IF NOT EXISTS ] <connection_name>
    STORAGE_TYPE = '<type>'
    [ <storage_params> ]
```

| 参数            | 描述                                                                                              |
|-----------------|---------------------------------------------------------------------------------------------------|
| STORAGE_TYPE    | 存储服务类型。可选值包括 `s3`、`azblob`、`gcs`、`oss`、`cos` 等。                                 |
| storage_params  | 根据存储类型和认证方式而变化。完整参数请参阅 [连接参数](../../../00-sql-reference/51-connect-parameters.md)。 |

## 连接参数

连接用于封装外部存储的凭据和配置。创建连接时请选择合适的 `STORAGE_TYPE` 并填写所需参数。

| STORAGE_TYPE | 常见参数 | 说明 |
|--------------|----------|------|
| `s3`         | `ACCESS_KEY_ID`/`SECRET_ACCESS_KEY`、或 `ROLE_ARN`/`EXTERNAL_ID`，可选 `ENDPOINT_URL`、`REGION` | Amazon S3 及兼容服务（MinIO、Cloudflare R2 等）。 |
| `azblob`     | `ACCOUNT_NAME`、`ACCOUNT_KEY`、`ENDPOINT_URL` | Azure Blob Storage。 |
| `gcs`        | `CREDENTIAL`（Base64 编码的服务账号密钥） | Google Cloud Storage。 |
| `oss`        | `ACCESS_KEY_ID`、`ACCESS_KEY_SECRET`、`ENDPOINT_URL` | 阿里云对象存储 OSS。 |
| `cos`        | `SECRET_ID`、`SECRET_KEY`、`ENDPOINT_URL` | 腾讯云对象存储 COS。 |
| `hf`         | `REPO_TYPE`、`REVISION`，可选 `TOKEN` | Hugging Face Hub 数据集与模型。 |

展开下列选项卡以查看各存储类型示例：

<Tabs groupId="connection-storage-types">
<TabItem value="s3" label="Amazon S3">

Amazon S3 及兼容服务支持以下两种认证方式：

<Tabs groupId="s3-auth-methods">
<TabItem value="access-keys" label="Access Keys">

```sql
CREATE CONNECTION <connection_name>
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>';
```

| 参数 | 描述 |
|------|------|
| ACCESS_KEY_ID | AWS Access Key ID。 |
| SECRET_ACCESS_KEY | AWS Secret Access Key。 |

</TabItem>
<TabItem value="iam-role" label="IAM Role">

```sql
CREATE CONNECTION <connection_name>
    STORAGE_TYPE = 's3'
    ROLE_ARN = '<your-role-arn>';
```

| 参数 | 描述 |
|------|------|
| ROLE_ARN | Databend 将扮演的 IAM 角色的 Amazon Resource Name (ARN)。 |

</TabItem>
</Tabs>

</TabItem>
<TabItem value="azblob" label="Azure Blob">

```sql
CREATE CONNECTION <connection_name>
    STORAGE_TYPE = 'azblob'
    ACCOUNT_NAME = '<account-name>'
    ACCOUNT_KEY = '<account-key>'
    ENDPOINT_URL = 'https://<account-name>.blob.core.windows.net';
```

</TabItem>
<TabItem value="gcs" label="Google Cloud Storage">

```sql
CREATE CONNECTION <connection_name>
    STORAGE_TYPE = 'gcs'
    CREDENTIAL = '<base64-encoded-service-account>';
```

</TabItem>
<TabItem value="oss" label="Alibaba Cloud OSS">

```sql
CREATE CONNECTION <connection_name>
    STORAGE_TYPE = 'oss'
    ACCESS_KEY_ID = '<your-ak>'
    ACCESS_KEY_SECRET = '<your-sk>'
    ENDPOINT_URL = 'https://<bucket-name>.<region-id>[-internal].aliyuncs.com';
```

</TabItem>
<TabItem value="cos" label="Tencent COS">

```sql
CREATE CONNECTION <connection_name>
    STORAGE_TYPE = 'cos'
    SECRET_ID = '<your-secret-id>'
    SECRET_KEY = '<your-secret-key>'
    ENDPOINT_URL = '<your-endpoint-url>';
```

</TabItem>
<TabItem value="hf" label="Hugging Face">

```sql
CREATE CONNECTION <connection_name>
    STORAGE_TYPE = 'hf'
    REPO_TYPE = 'dataset'
    REVISION = 'main'
    TOKEN = '<optional-access-token>';
```

访问公开仓库时可以省略 `TOKEN`，访问私有或受限资源再补上即可。

</TabItem>
</Tabs>

## 访问控制要求

| 权限              | 对象类型 | 描述     |
|:------------------|:---------|:---------|
| CREATE CONNECTION | 全局     | 创建连接 |

创建连接时，执行操作的用户或 [current_role](/guides/security/access-control/roles) 必须拥有 CREATE CONNECTION [权限](/guides/security/access-control/privileges)。

## 更新已存在表的连接

若要将现有外部表切换到新的连接，可使用 [`ALTER TABLE ... CONNECTION`](/sql/sql-commands/ddl/table/alter-table-connection) 命令，无需重新创建表。

## 示例

### 使用访问密钥

示例：创建名为 toronto 的 Amazon S3 连接，并建立外部 Stage `my_s3_stage` 指向 `s3://databend-toronto`。更多与连接相关的示例请参阅 [使用示例](index.md#usage-examples)。

```sql
CREATE CONNECTION toronto
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>';

CREATE STAGE my_s3_stage
    URL = 's3://databend-toronto'
    CONNECTION = (CONNECTION_NAME = 'toronto');
```

### 使用 AWS IAM 角色

示例：使用 IAM Role 创建 Amazon S3 连接，并让 Stage 复用该连接，无需在 Databend 中存储访问密钥。

```sql
CREATE CONNECTION databend_test
    STORAGE_TYPE = 's3'
    ROLE_ARN = 'arn:aws:iam::987654321987:role/databend-test';

CREATE STAGE databend_test
    URL = 's3://test-bucket-123'
    CONNECTION = (CONNECTION_NAME = 'databend_test');

-- 现在可直接查询 S3 桶中的数据
SELECT * FROM @databend_test/test.parquet LIMIT 1;
```

:::info
在 Databend Cloud 中使用 IAM 角色，需要在 AWS 账户与 Databend Cloud 之间建立信任关系。详见 [使用 AWS IAM 角色进行认证](/guides/cloud/advanced/iam-role)。
:::
