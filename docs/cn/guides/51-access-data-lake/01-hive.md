---
title: Apache Hive
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.668"/>

Databend 支持集成 [Apache Hive](https://hive.apache.org/) catalog，从而增强了其数据管理和分析的兼容性和多功能性。通过将 Apache Hive 强大的元数据和存储管理功能无缝集成到平台中，扩展了 Databend 的功能。

## 数据类型映射

下表映射了 Apache Hive 和 Databend 之间的数据类型。请注意，Databend 目前不支持表中未列出的 Hive 数据类型。

| Apache Hive         | Databend             |
| ------------------- | -------------------- |
| BOOLEAN             | [BOOLEAN](/sql/sql-reference/data-types/boolean)              |
| TINYINT             | [TINYINT (INT8)](/sql/sql-reference/data-types/numeric#integer-data-types)       |
| SMALLINT            | [SMALLINT (INT16)](/sql/sql-reference/data-types/numeric#integer-data-types)     |
| INT                 | [INT (INT32)](/sql/sql-reference/data-types/numeric#integer-data-types)          |
| BIGINT              | [BIGINT (INT64)](/sql/sql-reference/data-types/numeric#integer-data-types)       |
| DATE                | [DATE](/sql/sql-reference/data-types/datetime)                 |
| TIMESTAMP           | [TIMESTAMP](/sql/sql-reference/data-types/datetime)            |
| FLOAT               | [FLOAT (FLOAT32)](/sql/sql-reference/data-types/numeric#floating-point-data-types)      |
| DOUBLE              | [DOUBLE (FLOAT64)](/sql/sql-reference/data-types/numeric#floating-point-data-types)     |
| VARCHAR             | [VARCHAR (STRING)](/sql/sql-reference/data-types/string)     |
| DECIMAL             | [DECIMAL](/sql/sql-reference/data-types/decimal)              |
| ARRAY&lt;TYPE&gt;    | [ARRAY](/sql/sql-reference/data-types/array), supports nesting |
| MAP&lt;KEYTYPE, VALUETYPE&gt; | [MAP](/sql/sql-reference/data-types/map)             |

## 管理 Catalog

Databend 提供了以下命令来管理 catalog：

- [CREATE CATALOG](#create-catalog)
- [SHOW CREATE CATALOG](#show-create-catalog)
- [SHOW CATALOGS](#show-catalogs)
- [USE CATALOG](#use-catalog)

### CREATE CATALOG

在 Databend 查询引擎中定义并建立一个新的 catalog。

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

| Parameter             | Required? | Description                                                                                                               | 
|-----------------------|-----------|---------------------------------------------------------------------------------------------------------------------------| 
| TYPE                  | Yes       | catalog 的类型：Hive catalog 为 'HIVE'，Iceberg catalog 为 'ICEBERG'。                                      | 
| METASTORE_ADDRESS     | No        | Hive Metastore 地址。仅 Hive catalog 需要。| 
| URL                   | Yes       | 链接到此 catalog 的外部存储的位置。这可以是 bucket 或 bucket 中的文件夹。例如，'s3://databend-toronto/'。                       | 
| connection_parameter  | Yes       | 用于建立与外部存储连接的连接参数。所需的参数因特定的存储服务和身份验证方法而异。有关详细信息，请参阅 [连接参数](/sql/sql-reference/connect-parameters)。 |

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

此示例演示如何创建一个配置为与 Hive Metastore 交互并访问存储在 Amazon S3 上（位于 's3://databend-toronto/'）的数据的 catalog。

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