---
title: CREATE DATABASE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

创建数据库。

## 语法

```sql
CREATE [ OR REPLACE ] DATABASE [ IF NOT EXISTS ] <database_name>
    [ OPTIONS ( <database_option> = '<value>' [, ...] ) ]

CREATE [ OR REPLACE ] DATABASE [ IF NOT EXISTS ] <database_name>
    FROM SHARE <provider_tenant>.<share_name>
```

## 参数

| 参数                           | 描述                                                                                                                          |
|:------------------------------|:------------------------------------------------------------------------------------------------------------------------------|
| `DEFAULT_STORAGE_CONNECTION`  | 已有连接的名称（通过 `CREATE CONNECTION` 创建），作为该数据库中表的默认存储连接。                                               |
| `DEFAULT_STORAGE_PATH`        | 该数据库中表的默认存储路径 URI（如 `s3://bucket/path/`），必须以 `/` 结尾，且与连接的存储类型匹配。                            |
| `DEFAULT_S3_STORAGE_CLASS`    | 新建非临时外部 Fuse 表的默认 S3 存储类别。支持 `standard` 和 `intelligent_tiering`，不区分大小写。 |
| `FROM SHARE`                  | 基于 Share 创建只读的共享数据库。`provider_tenant` 是提供方的租户 ID。参见[基于 Share 创建数据库](#from-share)。 |

:::note
- `DEFAULT_STORAGE_CONNECTION` 与 `DEFAULT_STORAGE_PATH` 必须同时指定，单独指定其中一个会报错。
- 两个选项均设置时，Databend 会验证连接是否存在、路径 URI 格式是否正确，以及存储位置是否可访问。
- `DEFAULT_S3_STORAGE_CLASS` 可以单独设置，不要求数据库同时配置 `DEFAULT_STORAGE_CONNECTION` 和 `DEFAULT_STORAGE_PATH`。
- 新建非临时外部 Fuse 表时，如果未指定 `S3_STORAGE_CLASS`，表会继承 `DEFAULT_S3_STORAGE_CLASS`。显式指定的外部位置和从数据库默认选项继承的外部位置均适用。
- 内部表、临时表和非 Fuse 引擎不会继承此存储类别默认值。限制说明参见 [S3 存储类别](../01-table/10-ddl-create-table-external-location.md#s3-storage-class)。
:::

## 访问控制要求

| 权限            | 对象类型 | 描述         |
|:----------------|:----------|:-------------|
| CREATE DATABASE | 全局      | 创建数据库。 |

要创建数据库，执行操作的用户或[当前角色（current_role）](/guides/security/access-control/roles)必须拥有 CREATE DATABASE [权限（privilege）](/guides/security/access-control/privileges)。

使用 `FROM SHARE` 时，消费方租户还必须是该 Share 的消费方账号。在自托管 Databend 中，许可证必须包含 `DataSharing` 功能。

## 基于 Share 创建数据库 {/* #from-share */}

在消费方租户中使用 `FROM SHARE`。Databend 基于提供方的 Share 创建只读的共享数据库。

- 如果租户 ID 包含大写字母或特殊字符，将 ID 放在反引号中。
- 在默认 catalog 中创建共享数据库。不要在 `FROM SHARE` 中使用 `ENGINE` 或 `OPTIONS`。
- 创建数据库时，Databend 检查 Share。Share 必须存在，消费方租户必须是消费方账号，且 Share 必须授权了数据库。任一条件不满足时，语句失败。
- 每次查询时，Databend 会再次检查授权。
- 共享表为只读。
- `DROP DATABASE` 只删除共享数据库，提供方数据不变。
- 如果已存在同名数据库，`IF NOT EXISTS` 不执行任何操作，Databend 不检查 Share。

:::caution
`OR REPLACE` 会替换同名数据库，包括含有数据的本地数据库。Databend 在替换数据库前检查 Share。
:::

要求和操作步骤参见[数据共享](/guides/data-management/data-sharing)。

## 示例

### 创建基础数据库

以下示例创建一个名为 `test` 的数据库：

```sql
CREATE DATABASE test;
```

### 创建带默认存储连接的数据库

以下示例先使用 AWS IAM 角色创建连接，再创建一个以该连接作为默认存储的数据库。相比访问密钥，使用 IAM 角色更安全，因为无需在 Databend 中存储凭证。

```sql
CREATE CONNECTION my_s3
    STORAGE_TYPE = 's3'
    ROLE_ARN = 'arn:aws:iam::987654321987:role/databend-test';

CREATE DATABASE analytics OPTIONS (
    DEFAULT_STORAGE_CONNECTION = 'my_s3',
    DEFAULT_STORAGE_PATH = 's3://mybucket/analytics/'
);
```

### 创建带默认 S3 存储类别的数据库

此默认值适用于新建非临时外部 Fuse 表，不会将表自动变为外部表。创建表时需指定外部位置，或为数据库配置默认存储连接和路径。

```sql
CREATE OR REPLACE DATABASE external_analytics OPTIONS (
    DEFAULT_S3_STORAGE_CLASS = 'intelligent_tiering'
);
```

### 基于 Share 创建数据库

以下示例基于提供方租户 `provider_acct` 的 Share `sales_share` 创建共享数据库：

```sql
CREATE DATABASE shared_orders FROM SHARE provider_acct.sales_share;
SELECT * FROM shared_orders.orders;
```

:::info
在 Databend Cloud 中使用 IAM 角色时，需要在你的 AWS 账户与 Databend Cloud 之间建立信任关系。详情请参阅 [使用 AWS IAM 角色进行身份验证](/guides/cloud/security/iam-role)。
:::
