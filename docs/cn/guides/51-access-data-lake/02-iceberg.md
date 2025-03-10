---
title: Apache Iceberg
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.668"/>

Databend 支持集成 [Apache Iceberg](https://iceberg.apache.org/) 目录，增强了其在数据管理和分析方面的兼容性和多功能性。这通过将 Apache Iceberg 强大的元数据和存储管理能力无缝集成到平台中，扩展了 Databend 的功能。

## 数据类型映射

下表列出了 Apache Iceberg 和 Databend 之间的数据类型映射。请注意，Databend 目前不支持表中未列出的 Iceberg 数据类型。

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
| ARRAY&lt;TYPE&gt;               | [ARRAY](/sql/sql-reference/data-types/array), 支持嵌套 |
| MAP&lt;KEYTYPE, VALUETYPE&gt;       | [MAP](/sql/sql-reference/data-types/map)                     |
| STRUCT&lt;COL1: TYPE1, COL2: TYPE2, ...&gt; | [TUPLE](/sql/sql-reference/data-types/tuple)           |
| LIST                            | [ARRAY](/sql/sql-reference/data-types/array)                   |

## 管理目录

Databend 提供了以下命令来管理目录：

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

| 参数                    | 是否必填 | 描述                                                                                                                                                                                                                                                                                                                                                                                                           |
|------------------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<catalog_name>`             | 是       | 要创建的 catalog 名称。                                                                                                                                                                                                                                                                                                                                                                           |
| `TYPE`                       | 是       | 指定 catalog 类型。对于 Iceberg，设置为 `ICEBERG`。                                                                                                                                                                                                                                                                                                                                                            |
| `CONNECTION`                 | 是       | Iceberg catalog 的连接参数。                                                                                                                                                                                                                                                                                                                                                                    |
| `TYPE` (在 `CONNECTION` 内) | 是       | 连接类型。对于 Iceberg，通常设置为 `rest` 以进行基于 REST 的连接。                                                                                                                                                                                                                                                                                                                            |
| `ADDRESS`                    | 是       | Iceberg 服务的地址或 URL（例如，`http://127.0.0.1:8181`）。                                                                                                                                                                                                                                                                                                                                            |
| `WAREHOUSE`                  | 是       | Iceberg 计算集群的位置，通常是一个 S3 存储桶或兼容的对象存储系统。                                                                                                                                                                                                                                                                                                                                                      |
| `<connection_parameter>`     | 是       | 用于与外部存储建立连接的参数。所需的参数根据具体的存储服务和认证方法而有所不同。请参阅下表以获取可用参数的完整列表。 |

| 连接参数                  | 描述                                                                                                                            |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `s3.endpoint`             | S3 端点。                                                                                                                           |
| `s3.access-key-id`        | S3 访问密钥 ID。                                                                                                                      |
| `s3.secret-access-key`    | S3 秘密访问密钥。                                                                                                                  |
| `s3.session-token`        | S3 会话令牌，使用临时凭证时需要。                                                                           |
| `s3.region`               | S3 区域。                                                                                                                             |
| `client.region`           | S3 客户端使用的区域，优先于 `s3.region`。                                                                    |
| `s3.path-style-access`    | S3 路径风格访问。                                                                                                                  |
| `s3.sse.type`             | S3 服务器端加密 (SSE) 类型。                                                                                                  |
| `s3.sse.key`              | S3 SSE 密钥。如果加密类型为 `kms`，则为 KMS 密钥 ID。如果加密类型为 `custom`，则为 base-64 AES256 对称密钥。 |
| `s3.sse.md5`              | S3 SSE MD5 校验和。                                                                                                                   |
| `client.assume-role.arn`  | 要假设的 IAM 角色的 ARN，而不是使用默认的凭证链。                                                           |
| `client.assume-role.external-id`  | 用于假设 IAM 角色的可选外部 ID。                                                                                       |
| `client.assume-role.session-name` | 用于假设 IAM 角色的可选会话名称。                                                                                      |
| `s3.allow-anonymous`      | 允许匿名访问的选项（例如，用于公共存储桶/文件夹）。                                                                   |
| `s3.disable-ec2-metadata` | 禁用从 EC2 元数据加载凭证的选项（通常与 `s3.allow-anonymous` 一起使用）。                                    |
| `s3.disable-config-load`  | 禁用从配置文件和环境变量加载配置的选项。                                                   |

:::note
要从 HDFS 读取数据，您需要在启动 Databend 之前设置以下环境变量。这些环境变量确保 Databend 能够访问必要的 Java 和 Hadoop 依赖项，以有效地与 HDFS 交互。请确保将 "/path/to/java" 和 "/path/to/hadoop" 替换为您的 Java 和 Hadoop 安装的实际路径，并调整 CLASSPATH 以包含所有必需的 Hadoop JAR 文件。
```shell
export JAVA_HOME=/path/to/java
export LD_LIBRARY_PATH=${JAVA_HOME}/lib/server:${LD_LIBRARY_PATH}
export HADOOP_HOME=/path/to/hadoop
export CLASSPATH=/all/hadoop/jar/files
```
:::

### SHOW CREATE CATALOG

返回指定 catalog 的详细配置，包括其类型和存储参数。

#### 语法

```sql
SHOW CREATE CATALOG <catalog_name>;
```

### SHOW CATALOGS

显示所有已创建的 catalog。

#### 语法

```sql
SHOW CATALOGS [LIKE '<pattern>']
```

### USE CATALOG

将当前会话切换到指定的 catalog。

#### 语法

```sql
USE CATALOG <catalog_name>
```

## 使用示例

此示例展示了如何使用基于 REST 的连接创建 Iceberg catalog，指定服务地址、计算集群位置（S3）以及可选参数如 AWS 区域和自定义端点：

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