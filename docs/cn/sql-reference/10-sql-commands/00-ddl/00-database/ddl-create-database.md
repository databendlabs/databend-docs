---
title: CREATE DATABASE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.866"/>

创建数据库。

## 语法

```sql
CREATE [ OR REPLACE ] DATABASE [ IF NOT EXISTS ] <database_name>
    [ OPTIONS (
        DEFAULT_STORAGE_CONNECTION = '<connection_name>',
        DEFAULT_STORAGE_PATH = '<path>'
    ) ]
```

## 参数

| 参数                           | 描述                                                                                                                          |
|:------------------------------|:------------------------------------------------------------------------------------------------------------------------------|
| `DEFAULT_STORAGE_CONNECTION`  | 已有连接的名称（通过 `CREATE CONNECTION` 创建），作为该数据库中表的默认存储连接。                                               |
| `DEFAULT_STORAGE_PATH`        | 该数据库中表的默认存储路径 URI（如 `s3://bucket/path/`），必须以 `/` 结尾，且与连接的存储类型匹配。                            |

:::note
- `DEFAULT_STORAGE_CONNECTION` 与 `DEFAULT_STORAGE_PATH` 必须同时指定，单独指定其中一个会报错。
- 两个选项均设置时，Databend 会验证连接是否存在、路径 URI 格式是否正确，以及存储位置是否可访问。
:::

## 访问控制要求

| 权限            | 对象类型 | 描述         |
|:----------------|:----------|:-------------|
| CREATE DATABASE | 全局      | 创建数据库。 |

要创建数据库，执行操作的用户或[当前角色（current_role）](/guides/security/access-control/roles)必须拥有 CREATE DATABASE [权限（privilege）](/guides/security/access-control/privileges)。

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

:::info
在 Databend Cloud 中使用 IAM 角色时，需要在你的 AWS 账户与 Databend Cloud 之间建立信任关系。详情请参阅 [使用 AWS IAM 角色进行身份验证](/guides/cloud/security/iam-role)。
:::
