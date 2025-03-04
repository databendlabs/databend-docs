---
title: Iceberg Catalog
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

| 参数                        | 是否必填 | 描述                                                                                                                                                                                                                                                                                                                                                                                                           |
|------------------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<catalog_name>`             | 是       | 要创建的 catalog 名称。                                                                                                                                                                                                                                                                                                                                                                           |
| `TYPE`                       | 是       | 指定 catalog 类型。对于 Iceberg，设置为 `ICEBERG`。                                                                                                                                                                                                                                                                                                                                                            |
| `CONNECTION`                 | 是       | Iceberg catalog 的连接参数。                                                                                                                                                                                                                                                                                                                                                                    |
| `TYPE` (在 `CONNECTION` 内) | 是       | 连接类型。对于 Iceberg，通常设置为 `rest` 以使用基于 REST 的连接。                                                                                                                                                                                                                                                                                                                            |
| `ADDRESS`                    | 是       | Iceberg 服务的地址或 URL（例如 `http://127.0.0.1:8181`）。                                                                                                                                                                                                                                                                                                                                            |
| `WAREHOUSE`                  | 是       | Iceberg 数仓的位置，通常是一个 S3 存储桶或兼容的对象存储系统。                                                                                                                                                                                                                                                                                                                                                      |
| `<connection_parameter>`     | 是       | 用于与外部存储建立连接的参数。所需的参数根据具体的存储服务和认证方法而有所不同。有关详细信息，请参阅[连接参数](/sql/sql-reference/connect-parameters)。如果您使用的是 Amazon S3 或 S3 兼容的存储系统，请确保在参数前加上 `s3.` 前缀（例如 `s3.region`、`s3.endpoint`）。 |

:::note
要从 HDFS 读取数据，您需要在启动 Databend 之前设置以下环境变量。这些环境变量确保 Databend 能够访问必要的 Java 和 Hadoop 依赖项，以有效地与 HDFS 交互。请确保将 "/path/to/java" 和 "/path/to/hadoop" 替换为实际的 Java 和 Hadoop 安装路径，并调整 CLASSPATH 以包含所有必需的 Hadoop JAR 文件。
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

此示例展示了如何使用基于 REST 的连接创建 Iceberg catalog，指定服务地址、数仓位置（S3）以及可选的参数（如 AWS 区域和自定义端点）：

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