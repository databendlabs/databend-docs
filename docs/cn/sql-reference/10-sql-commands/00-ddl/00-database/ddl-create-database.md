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

以下示例创建一个名为 `test` 的数据库：

```sql
CREATE DATABASE test;
```

以下示例创建一个指定默认存储连接和路径的数据库：

```sql
CREATE CONNECTION my_s3 STORAGE_TYPE = 's3' ACCESS_KEY_ID = '<key>' SECRET_ACCESS_KEY = '<secret>';

CREATE DATABASE analytics OPTIONS (
    DEFAULT_STORAGE_CONNECTION = 'my_s3',
    DEFAULT_STORAGE_PATH = 's3://mybucket/analytics/'
);
```
