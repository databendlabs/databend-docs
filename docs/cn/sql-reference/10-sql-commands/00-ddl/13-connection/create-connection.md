---
title: CREATE CONNECTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

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

| 参数        | 描述                                                                                                                                        |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| STORAGE_TYPE     | 存储服务类型。可选值包括：`s3`、`azblob`、`gcs`、`oss` 和 `cos`。                                                         |
| storage_params   | 根据存储类型和认证方式而异，详见下文常用认证方式。 |

其他存储类型及附加参数，请参见 [连接参数](../../../00-sql-reference/51-connect-parameters.md)。

### Amazon S3 的认证方式

Databend 支持两种 Amazon S3 连接认证方式：

#### 1. 访问密钥认证

使用 AWS 访问密钥进行认证，即传统的 Access Key ID 与 Secret Access Key 方式。

```sql
CREATE CONNECTION <connection_name> 
    STORAGE_TYPE = 's3' 
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>';
```

| 参数 | 描述 |
|-----------|-------------|
| ACCESS_KEY_ID | AWS Access Key ID。 |
| SECRET_ACCESS_KEY | AWS Secret Access Key。 |

#### 2. IAM 角色认证

使用 AWS IAM 角色进行认证，无需 Access Key，更安全地访问 S3 存储桶。

```sql
CREATE CONNECTION <connection_name> 
    STORAGE_TYPE = 's3' 
    ROLE_ARN = '<your-role-arn>';
```

| 参数 | 描述 |
|-----------|-------------|
| ROLE_ARN  | Databend 将扮演的 IAM 角色的 Amazon Resource Name (ARN)。 |


## 访问控制要求

| 权限         | 对象类型 | 描述           |
|:------------------|:------------|:----------------------|
| CREATE CONNECTION | 全局      | 创建连接。 |


创建连接时，执行操作的用户或 [current_role](/guides/security/access-control/roles) 必须拥有 CREATE CONNECTION [权限](/guides/security/access-control/privileges)。

:::note

`enable_experimental_connection_rbac_check` 设置用于控制连接级访问，默认禁用。  
创建连接仅需超级用户权限，绕过详细 RBAC 检查。启用后，将在建立连接时执行细粒度权限验证。  
此为实验性功能，未来可能默认启用。

:::

## 示例

### 使用访问密钥

以下示例创建名为 toronto 的 Amazon S3 连接，并建立名为 my_s3_stage 的外部 Stage，指向 `s3://databend-toronto`，使用 toronto 连接。更多示例请参见 [使用示例](index.md#usage-examples)。

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

以下示例使用 IAM 角色创建 Amazon S3 连接，并创建使用该连接的 Stage。无需在 Databend 中存储访问密钥，更加安全。

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
在 Databend Cloud 中使用 IAM 角色，需在 AWS 账户与 Databend Cloud 之间建立信任关系。详见 [使用 AWS IAM 角色创建外部 Stage](/guides/load-data/stage/aws-iam-role)。
:::