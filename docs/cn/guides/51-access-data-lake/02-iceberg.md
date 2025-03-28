---
title: Apache Iceberg
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.668"/>

Databend 支持集成 [Apache Iceberg](https://iceberg.apache.org/) 目录，增强了其在数据管理和分析方面的兼容性与多功能性。这一特性通过无缝整合 Apache Iceberg 强大的元数据及存储管理能力，进一步扩展了 Databend 的平台功能。

## 数据类型映射

下表展示了 Apache Iceberg 与 Databend 之间的数据类型对应关系。请注意，Databend 目前不支持表中未列出的 Iceberg 数据类型。

| Apache Iceberg                  | Databend                |
| ------------------------------- | ----------------------- |
| BOOLEAN                         | [BOOLEAN](/sql/sql-reference/data-types/boolean)                 |
| INT                             | [INT32](/sql/sql-reference/data-types/numeric#integer-data-types)                   |
| LONG                            | [INT64](/sql/sql-reference/data-types/numeric#integer-data-types)                   |
| DATE                            | [DATE](/sql/sql-reference/data-types/datetime)                    |
| TIMESTAMP/TIMESTAMPZ            | [TIMESTAMP](/sql/sql-reference/data-types/datetime)               |
| FLOAT                           | [FLOAT](/sql/sql-reference/data-types/numeric#floating-point-data-types)                  |
| DOUBLE                          | [DOUBLE](/sql/sql-reference/data-types/numeric#floating-point-data-type)                  |
| STRING/BINARY                   | [STRING](/sql/sql-reference/data-types/string)                  |
| DECIMAL                         | [DECIMAL](/sql/sql-reference/data-types/decimal)                 |
| ARRAY&lt;TYPE&gt;               | [ARRAY](/sql/sql-reference/data-types/array)，支持嵌套 |
| MAP&lt;KEYTYPE, VALUETYPE&gt;       | [MAP](/sql/sql-reference/data-types/map)                     |
| STRUCT&lt;COL1: TYPE1, COL2: TYPE2, ...&gt; | [TUPLE](/sql/sql-reference/data-types/tuple)           |
| LIST                            | [ARRAY](/sql/sql-reference/data-types/array)                   |

## 管理目录

Databend 提供以下命令用于管理目录：

- [CREATE CATALOG](#create-catalog)
- [SHOW CREATE CATALOG](#show-create-catalog)
- [SHOW CATALOGS](#show-catalogs)
- [USE CATALOG](#use-catalog)

### CREATE CATALOG

在 Databend 查询引擎中定义并建立一个新的目录。

#### 语法

```sql
CREATE CATALOG <catalog_name>
TYPE=ICEBERG
CONNECTION=(
    TYPE='<connection_type>'
    ADDRESS='<address>'
    WAREHOUSE='<warehouse_location>'
    "<connection_parameter>"='<connection_parameter_value>'
    "<connection_parameter>"='<connection_parameter_value>'
    ...
);
```

| 参数                     | 是否必填 | 描述                                                                                                                                                                                                                                                                                                                                                                                                           |
|------------------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<catalog_name>`             | 是       | 要创建的 catalog 名称。                                                                                                                                                                                                                                                                                                                                                                           |
| `TYPE`                       | 是       | 指定 catalog 类型。对于 Iceberg，设置为 `ICEBERG`。                                                                                                                                                                                                                                                                                                                                                            |
| `CONNECTION`                 | 是       | Iceberg catalog 的连接参数。                                                                                                                                                                                                                                                                                                                                                                    |
| `TYPE` (在 `CONNECTION` 内) | 是       | 连接类型。对于 Iceberg，通常设置为 `rest` 以使用基于 REST 的连接。                                                                                                                                                                                                                                                                                                                            |
| `ADDRESS`                    | 是       | Iceberg 服务的地址或 URL（例如：`http://127.0.0.1:8181`）。                                                                                                                                                                                                                                                                                                                                            |
| `WAREHOUSE`                  | 是       | Iceberg 数仓的位置，通常是一个 S3 存储桶或兼容的对象存储系统。                                                                                                                                                                                                                                                                                                                      |
| `<connection_parameter>`     | 是       | 用于与外部存储建立连接的参数。所需参数因具体存储服务和认证方式而异。完整可用参数列表请参见下表。 |

| 连接参数                  | 描述                                                                                                                             |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `s3.endpoint`             | S3终端节点。                                                                                                                   |
| `s3.access-key-id`        | S3访问密钥ID。                                                                                                                |
| `s3.secret-access-key`    | S3秘密访问密钥。                                                                                                              |
| `s3.session-token`        | S3会话令牌，使用临时凭证时必需。                                                                                               |
| `s3.region`               | S3区域。                                                                                                                       |
| `client.region`           | S3客户端使用的区域，优先级高于`s3.region`。                                                                                    |
| `s3.path-style-access`    | S3路径风格访问。                                                                                                              |
| `s3.sse.type`             | S3服务器端加密(SSE)类型。                                                                                                      |
| `s3.sse.key`              | S3 SSE密钥。若加密类型为`kms`，则为KMS密钥ID；若为`custom`，则是base-64编码的AES256对称密钥。                                  |
| `s3.sse.md5`              | S3 SSE MD5校验和。                                                                                                             |
| `client.assume-role.arn`  | 用于替代默认凭证链的IAM角色ARN。                                                                                               |
| `client.assume-role.external-id` | 用于承担IAM角色的可选外部ID。                                                                                                 |
| `client.assume-role.session-name` | 用于承担IAM角色的可选会话名称。                                                                                              |
| `s3.allow-anonymous`      | 允许匿名访问选项（例如公共存储桶/文件夹）。                                                                                    |
| `s3.disable-ec2-metadata` | 禁用从EC2元数据加载凭证的选项（通常与`s3.allow-anonymous`配合使用）。                                                          |
| `s3.disable-config-load`  | 禁用从配置文件和环境变量加载配置的选项。                                                                                       |

:::note
要从HDFS读取数据，需在启动Databend前设置以下环境变量。这些变量确保Databend能访问必要的Java和Hadoop依赖以有效对接HDFS。请将"/path/to/java"和"/path/to/hadoop"替换为实际的Java和Hadoop安装路径，并调整CLASSPATH包含所有必需的Hadoop JAR文件。
```shell
export JAVA_HOME=/path/to/java
export LD_LIBRARY_PATH=${JAVA_HOME}/lib/server:${LD_LIBRARY_PATH}
export HADOOP_HOME=/path/to/hadoop
export CLASSPATH=/all/hadoop/jar/files
```
:::

### SHOW CREATE CATALOG

返回指定目录的详细配置，包括其类型和存储参数。

#### 语法

```sql
SHOW CREATE CATALOG <catalog_name>;
```

### SHOW CATALOGS

显示所有已创建的目录。

#### 语法

```sql
SHOW CATALOGS [LIKE '<pattern>']
```

### USE CATALOG

将当前会话切换至指定目录。

#### 语法

```sql
USE CATALOG <catalog_name>
```

## Iceberg表函数

Databend提供以下表函数用于查询Iceberg元数据，使用户能高效检查快照和清单：

- [ICEBERG_MANIFEST](/sql/sql-functions/table-functions/iceberg-manifest)
- [ICEBERG_SNAPSHOT](/sql/sql-functions/table-functions/iceberg-snapshot)

## 使用示例

本示例展示如何通过REST连接创建Iceberg目录，指定服务地址、数仓位置(S3)及可选参数如AWS区域和自定义终端节点：

```sql
CREATE CATALOG ctl
TYPE=ICEBERG
CONNECTION=(
    TYPE='rest'
    ADDRESS='http://127.0.0.1:8181'
    WAREHOUSE='s3://iceberg-tpch'
    "s3.region"='us-east-1'
    "s3.endpoint"='http://127.0.0.1:9000'
);
```