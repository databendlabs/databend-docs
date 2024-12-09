---
title: Apache Hive
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.668"/>

Databend 支持集成 [Apache Hive](https://hive.apache.org/) 目录，增强了其数据管理和分析的兼容性和多功能性。这扩展了 Databend 的能力，通过无缝整合 Apache Hive 强大的元数据和存储管理功能到平台中。

## 数据类型映射

此表映射了 Apache Hive 和 Databend 之间的数据类型。请注意，Databend 目前不支持表中未列出的 Hive 数据类型。

| Apache Hive         | Databend             |
| ------------------- | -------------------- |
| BOOLEAN             | [BOOLEAN](/sql/sql-reference/data-types/data-type-logical-types)              |
| TINYINT             | [TINYINT (INT8)](/sql/sql-reference/data-types/data-type-numeric-types#integer-data-types)       |
| SMALLINT            | [SMALLINT (INT16)](/sql/sql-reference/data-types/data-type-numeric-types#integer-data-types)     |
| INT                 | [INT (INT32)](/sql/sql-reference/data-types/data-type-numeric-types#integer-data-types)          |
| BIGINT              | [BIGINT (INT64)](/sql/sql-reference/data-types/data-type-numeric-types#integer-data-types)       |
| DATE                | [DATE](/sql/sql-reference/data-types/data-type-time-date-types)                 |
| TIMESTAMP           | [TIMESTAMP](/sql/sql-reference/data-types/data-type-time-date-types)            |
| FLOAT               | [FLOAT (FLOAT32)](/sql/sql-reference/data-types/data-type-numeric-types#floating-point-data-types)      |
| DOUBLE              | [DOUBLE (FLOAT64)](/sql/sql-reference/data-types/data-type-numeric-types#floating-point-data-types)     |
| VARCHAR             | [VARCHAR (STRING)](/sql/sql-reference/data-types/data-type-string-types)     |
| DECIMAL             | [DECIMAL](/sql/sql-reference/data-types/data-type-decimal-types)              |
| ARRAY&lt;TYPE&gt;    | [ARRAY](/sql/sql-reference/data-types/data-type-array-types), 支持嵌套 |
| MAP&lt;KEYTYPE, VALUETYPE&gt; | [MAP](/sql/sql-reference/data-types/data-type-map)             |

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
TYPE = <catalog_type>
CONNECTION = (
    METASTORE_ADDRESS = '<hive_metastore_address>'
    URL = '<data_storage_path>'
    <connection_parameter> = '<connection_parameter_value>'
    <connection_parameter> = '<connection_parameter_value>'
    ...
)
```

| 参数                  | 必需？    | 描述                                                                                                               | 
|-----------------------|-----------|---------------------------------------------------------------------------------------------------------------------------| 
| TYPE                  | 是        | 目录类型：'HIVE' 用于 Hive 目录或 'ICEBERG' 用于 Iceberg 目录。                                      | 
| METASTORE_ADDRESS     | 否        | Hive Metastore 地址。仅对 Hive 目录必需。| 
| URL                   | 是        | 与此目录关联的外部存储位置。这可以是桶或桶内的文件夹。例如，'s3://databend-toronto/'。                       | 
| connection_parameter  | 是        | 用于与外部存储建立连接的连接参数。所需的参数根据特定的存储服务和认证方法而异。请参阅 [连接参数](/sql/sql-reference/connect-parameters) 获取详细信息。 |

:::note
要从 HDFS 读取数据，您需要在启动 Databend 之前设置以下环境变量。这些环境变量确保 Databend 可以访问必要的 Java 和 Hadoop 依赖项，以有效与 HDFS 交互。请确保将 "/path/to/java" 和 "/path/to/hadoop" 替换为 Java 和 Hadoop 安装的实际路径，并调整 CLASSPATH 以包含所有必需的 Hadoop JAR 文件。
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

将当前会话切换到指定的目录。

#### 语法

```sql
USE CATALOG <catalog_name>
```

## 使用示例

此示例演示了创建一个配置为与 Hive Metastore 交互并访问存储在 Amazon S3 上的数据的目录，位于 's3://databend-toronto/'。

```sql
CREATE CATALOG hive_ctl 
TYPE = HIVE 
CONNECTION =(
    METASTORE_ADDRESS = '127.0.0.1:9083' 
    URL = 's3://databend-toronto/' 
    AWS_KEY_ID = '<your_key_id>' 
    AWS_SECRET_KEY = '<your_secret_key>' 
);

SHOW CREATE CATALOG hive_ctl;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  Catalog │  Type  │                                                          Option                                                          │
├──────────┼────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ hive_ctl │ hive   │ METASTORE ADDRESS\n127.0.0.1:9083\nSTORAGE PARAMS\ns3 | bucket=databend-toronto,root=/,endpoint=https://s3.amazonaws.com │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```