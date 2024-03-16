---
title: Iceberg 目录
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.83"/>

Databend 支持集成 [Apache Iceberg](https://iceberg.apache.org/) 目录，增强了其数据管理和分析的兼容性和多样性。这通过无缝整合 Apache Iceberg 强大的元数据和存储管理能力，扩展了 Databend 的功能。

## 数据类型映射

此表将 Apache Iceberg 与 Databend 之间的数据类型进行了映射。请注意，Databend 目前不支持表中未列出的 Iceberg 数据类型。

| Apache Iceberg                              | Databend                                                                                 |
| ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| BOOLEAN                                     | [BOOLEAN](/sql/sql-reference/data-types/data-type-logical-types)                         |
| INT                                         | [INT32](/sql/sql-reference/data-types/data-type-numeric-types#integer-data-types)        |
| LONG                                        | [INT64](/sql/sql-reference/data-types/data-type-numeric-types#integer-data-types)        |
| DATE                                        | [DATE](/sql/sql-reference/data-types/data-type-time-date-types)                          |
| TIMESTAMP/TIMESTAMPZ                        | [TIMESTAMP](/sql/sql-reference/data-types/data-type-time-date-types)                     |
| FLOAT                                       | [FLOAT](/sql/sql-reference/data-types/data-type-numeric-types#floating-point-data-types) |
| DOUBLE                                      | [DOUBLE](/sql/sql-reference/data-types/data-type-numeric-types#floating-point-data-type) |
| STRING/BINARY                               | [STRING](/sql/sql-reference/data-types/data-type-string-types)                           |
| DECIMAL                                     | [DECIMAL](/sql/sql-reference/data-types/data-type-decimal-types)                         |
| ARRAY&lt;TYPE&gt;                           | [ARRAY](/sql/sql-reference/data-types/data-type-array-types), 支持嵌套                   |
| MAP&lt;KEYTYPE, VALUETYPE&gt;               | [MAP](/sql/sql-reference/data-types/data-type-map)                                       |
| STRUCT&lt;COL1: TYPE1, COL2: TYPE2, ...&gt; | [TUPLE](/sql/sql-reference/data-types/data-type-tuple-types)                             |
| LIST                                        | [ARRAY](/sql/sql-reference/data-types/data-type-array-types)                             |

## 管理目录

Databend 提供以下命令来管理目录：

- [CREATE CATALOG](#create-catalog)
- [SHOW CREATE CATALOG](#show-create-catalog)
- [SHOW CATALOGS](#show-catalogs)

### CREATE CATALOG

在 Databend 查询引擎中定义并建立一个新的目录。

#### 语法

```sql
CREATE CATALOG <catalog_name>
TYPE = <catalog_type>
CONNECTION = (
    METASTORE_ADDRESS = '<hive_metastore_address>'
    URL = '<data_storage_path>'
    <connection_parameter> = '<connection_parameter_value>'
    <connection_parameter> = '<connection_parameter_value>'
    ...
)
```

| 参数                 | 是否必须？ | 描述                                                                                                                                             |
| -------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| TYPE                 | 是         | 目录的类型：'HIVE' 表示 Hive 目录，'ICEBERG' 表示 Iceberg 目录。                                                                                 |
| METASTORE_ADDRESS    | 否         | Hive Metastore 地址。仅 Hive 目录需要。                                                                                                          |
| URL                  | 是         | 与此目录链接的外部存储位置。这可以是一个桶或桶内的一个文件夹。例如，'s3://databend-toronto/'。                                                   |
| connection_parameter | 是         | 建立与外部存储连接的连接参数。所需参数根据特定的存储服务和认证方法而有所不同。详细信息请参考 [连接参数](/sql/sql-reference/connect-parameters)。 |

:::note
要从 HDFS 读取数据，您需要在启动 Databend 之前设置以下环境变量。这些环境变量确保 Databend 可以有效地访问必要的 Java 和 Hadoop 依赖项，以与 HDFS 交互。请确保将 "/path/to/java" 和 "/path/to/hadoop" 替换为您的 Java 和 Hadoop 安装的实际路径，并调整 CLASSPATH 以包含所有必需的 Hadoop JAR 文件。

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

## 使用示例

此示例演示了创建一个配置为与位于 MinIO 中的 Iceberg 数据存储进行交互的目录，地址为 's3://databend/iceberg/'。

```sql
CREATE CATALOG iceberg_ctl
TYPE = ICEBERG
CONNECTION = (
    URL = 's3://databend/iceberg/'
    AWS_KEY_ID = 'minioadmin'
    AWS_SECRET_KEY = 'minioadmin'
    ENDPOINT_URL = 'http://127.0.0.1:9000'
    REGION = 'us-east-2'
);

SHOW CREATE CATALOG iceberg_ctl;

┌─────────────┬─────────┬────────────────────────────────────────────────────────────────────────────────────────┐
│  Catalog    │  Type   │  Option                                                                                │
├─────────────┼─────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ iceberg_ctl │ iceberg │ STORAGE PARAMS s3 | bucket=databend, root=/iceberg/, endpoint=http://127.0.0.1:9000    │
└─────────────┴─────────┴────────────────────────────────────────────────────────────────────────────────────────┘
```
