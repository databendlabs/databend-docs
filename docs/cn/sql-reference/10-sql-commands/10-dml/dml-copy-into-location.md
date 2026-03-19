---
title: "COPY INTO <location>"
sidebar_label: "COPY INTO <location>"
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.647"/>

COPY INTO 允许您将表或查询中的数据卸载到一个或多个文件中，卸载位置可以是以下之一：

- 用户/内部/外部 Stage：请参阅 [什么是 Stage？](/guides/load-data/stage/what-is-stage) 以了解 Databend 中的 Stage。
- 在存储服务中创建的存储桶或容器。

另请参阅：[`COPY INTO <table>`](dml-copy-into-table.md)

## 语法

```sql
COPY INTO { internalStage | externalStage | externalLocation }
FROM { [<database_name>.]<table_name> | ( <query> ) }
[ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | LANCE } [ formatTypeOptions ]
       ) ]
[ copyOptions ]
[ VALIDATION_MODE = RETURN_ROWS ]
[ DETAILED_OUTPUT = true | false ]
```

### internalStage

```sql
internalStage ::= @<internal_stage_name>[/<path>]
```

### externalStage

```sql
externalStage ::= @<external_stage_name>[/<path>]
```

### externalLocation

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="externallocation">

<TabItem value="Amazon S3-like Storage Services" label="Amazon S3-like Storage Services">

```sql
externalLocation ::=
  's3://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问类似 Amazon S3 的存储服务可用的连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Azure Blob Storage" label="Azure Blob Storage">

```sql
externalLocation ::=
  'azblob://<container>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Azure Blob Storage 可用的连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Google Cloud Storage" label="Google Cloud Storage">

```sql
externalLocation ::=
  'gcs://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Google Cloud Storage 可用的连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Alibaba Cloud OSS" label="Alibaba Cloud OSS">

```sql
externalLocation ::=
  'oss://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问阿里云 OSS 可用的连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Tencent Cloud Object Storage" label="Tencent Cloud Object Storage">

```sql
externalLocation ::=
  'cos://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问腾讯云对象存储可用的连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

</Tabs>

### FILE_FORMAT

有关详细信息，请参阅 [输入 & 输出文件格式](../../00-sql-reference/50-file-format-options.md)。

`LANCE` 仅支持用于 `COPY INTO <location>`。Databend 会在目标路径下写出 Lance 数据集目录，而不是单个文件。

### copyOptions

```sql
copyOptions ::=
  [ SINGLE = true | false ]
  [ MAX_FILE_SIZE = <num> ]
  [ OVERWRITE = true | false ]
  [ INCLUDE_QUERY_ID = true | false ]
  [ USE_RAW_PATH = true | false ]
```

| 参数             | 默认值                 | 描述                                                                                                                                           |
| ---------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| SINGLE           | false                  | 如果为 `true`，则命令将数据卸载到单个文件中。                                                                                                  |
| MAX_FILE_SIZE    | 67108864 bytes (64 MB) | 要创建的每个文件的最大大小（以字节为单位）。当 `SINGLE` 为 false 时生效。                                                                      |
| OVERWRITE        | false                  | 如果为 `true`，则目标路径下具有相同名称的现有文件将被覆盖。注意：`OVERWRITE = true` 需要 `USE_RAW_PATH = true` 和 `INCLUDE_QUERY_ID = false`。 |
| INCLUDE_QUERY_ID | true                   | 如果为 `true`，则导出的文件名中将包含唯一的 UUID。                                                                                             |
| USE_RAW_PATH     | false                  | 如果为 `true`，则将使用用户提供的确切路径（包括完整的文件名）来导出数据。如果设置为 `false`，则用户必须提供目录路径。                          |

:::note
- 当 `TYPE = LANCE` 时，不支持 `SINGLE`。
- 当 `TYPE = LANCE` 时，不支持 `PARTITION BY`。
- 当你希望下游 Lance 读取器使用稳定的数据集 URI 时，建议在 `TYPE = LANCE` 下配合 `USE_RAW_PATH = TRUE`。
- 当 `TYPE = LANCE` 且 `USE_RAW_PATH = FALSE` 时，Databend 会把 query ID 追加到目标路径后面，为每次导出生成独立的数据集根目录。
:::

### DETAILED_OUTPUT

确定是否应返回数据卸载的详细结果，默认值设置为 `false`。有关更多信息，请参阅 [输出](#output)。

## 输出

COPY INTO 提供了数据卸载结果的摘要，包含以下列：

| 列            | 描述                                                     |
| ------------- | -------------------------------------------------------- |
| rows_unloaded | 成功卸载到目标位置的行数。                               |
| input_bytes   | 在卸载操作期间从源表读取的数据的总大小（以字节为单位）。 |
| output_bytes  | 写入到目标位置的数据的总大小（以字节为单位）。           |

当 `DETAILED_OUTPUT` 设置为 `true` 时，COPY INTO 提供包含以下列的结果。这有助于定位卸载的文件，尤其是在使用 `MAX_FILE_SIZE` 将卸载的数据分隔到多个文件中时。

| 列        | 描述                               |
| --------- | ---------------------------------- |
| file_name | 卸载的文件名。                     |
| file_size | 卸载的文件的大小（以字节为单位）。 |
| row_count | 卸载的文件中包含的行数。           |

## 示例

在本节中，提供的示例使用以下表和数据：

```sql
-- 创建示例表
CREATE TABLE canadian_city_population (
     city_name VARCHAR(50),
     population INT
);

-- 插入示例数据
INSERT INTO canadian_city_population (city_name, population)
VALUES
('Toronto', 2731571),
('Montreal', 1704694),
('Vancouver', 631486),
('Calgary', 1237656),
('Ottawa', 934243),
('Edmonton', 972223),
('Quebec City', 542298),
('Winnipeg', 705244),
('Hamilton', 536917),
('Halifax', 403390);
```

### 示例 1：卸载到内部 Stage

此示例将数据卸载到内部 Stage：

```sql
-- 创建一个内部 Stage
CREATE STAGE my_internal_stage;

-- 使用 PARQUET 文件格式将表中的数据卸载到 Stage
COPY INTO @my_internal_stage
    FROM canadian_city_population
    FILE_FORMAT = (TYPE = PARQUET);

┌────────────────────────────────────────────┐
│ rows_unloaded │ input_bytes │ output_bytes │
├───────────────┼─────────────┼──────────────┤
│            10 │         211 │          572 │
└────────────────────────────────────────────┘

LIST @my_internal_stage;

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               name                              │  size  │        md5       │         last_modified         │      creator     │
├─────────────────────────────────────────────────────────────────┼────────┼──────────────────┼───────────────────────────────┼──────────────────┤
│ data_abe520a3-ee88-488c-9221-b07c562c9a30_0000_00000000.parquet │    572 │ NULL             │ 2024-01-18 16:20:48.979 +0000 │ NULL             │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 示例 2：卸载到压缩文件

此示例将数据卸载到压缩文件中：

```sql
-- 创建一个内部 Stage
CREATE STAGE my_internal_stage;

-- 使用 CSV 文件格式和 gzip 压缩将表中的数据卸载到 Stage
COPY INTO @my_internal_stage
    FROM canadian_city_population
    FILE_FORMAT = (TYPE = CSV COMPRESSION = gzip);

┌────────────────────────────────────────────┐
│ rows_unloaded │ input_bytes │ output_bytes │
├───────────────┼─────────────┼──────────────┤
│            10 │         182 │          168 │
└────────────────────────────────────────────┘

LIST @my_internal_stage;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              name                              │  size  │        md5       │         last_modified         │      creator     │
├─────────────────────────────────────────────────────────────────┼────────┼──────────────────┼───────────────────────────────┼──────────────────┤
│ data_7970afa5-32e3-4e7d-b793-e42a2a82a8e6_0000_00000000.csv.gz │    168 │ NULL             │ 2024-01-18 16:27:01.663 +0000 │ NULL             │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- COPY INTO 也适用于自定义文件格式。请参见下文：
-- 创建一个名为 my_csv_gzip 的自定义文件格式，该格式采用 CSV 格式和 gzip 压缩
CREATE FILE FORMAT my_csv_gzip TYPE = CSV COMPRESSION = gzip;

-- 使用自定义文件格式 my_csv_gzip 将表中的数据卸载到 Stage
COPY INTO @my_internal_stage
    FROM canadian_city_population
    FILE_FORMAT = (FORMAT_NAME = 'my_csv_gzip');

┌────────────────────────────────────────────┐
│ rows_unloaded │ input_bytes │ output_bytes │
├───────────────┼─────────────┼──────────────┤
│            10 │         182 │          168 │
└────────────────────────────────────────────┘

LIST @my_internal_stage;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              name                              │  size  │        md5       │         last_modified         │      creator     │
├────────────────────────────────────────────────────────────────┼────────┼──────────────────┼───────────────────────────────┼──────────────────┤
│ data_d006ba1c-0609-46d7-a67b-75c7078d86ff_0000_00000000.csv.gz │    168 │ NULL             │ 2024-01-18 16:29:29.721 +0000 │ NULL             │
│ data_7970afa5-32e3-4e7d-b793-e42a2a82a8e6_0000_00000000.csv.gz │    168 │ NULL             │ 2024-01-18 16:27:01.663 +0000 │ NULL             │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘


```

### 示例 3：卸载到 Bucket

此示例将数据卸载到 MinIO 上的一个 bucket 中：

```sql
-- 使用 PARQUET 文件格式将表中的数据卸载到 MinIO 上名为 'databend' 的 bucket 中
COPY INTO 's3://databend'
    CONNECTION = (
    ENDPOINT_URL = 'http://localhost:9000/',
    ACCESS_KEY_ID = 'ROOTUSER',
    SECRET_ACCESS_KEY = 'CHANGEME123',
    region = 'us-west-2'
    )
    FROM canadian_city_population
    FILE_FORMAT = (TYPE = PARQUET);

┌────────────────────────────────────────────┐
│ rows_unloaded │ input_bytes │ output_bytes │
├───────────────┼─────────────┼──────────────┤
│            10 │         211 │          572 │
└────────────────────────────────────────────┘
```

![Alt text](/img/sql/copy-into-bucket.png)

### 示例 4：导出为 Lance 数据集

这个示例把数据导出成 Lance 数据集目录，而不是独立文件：

```sql
CREATE STAGE ml_stage;

COPY INTO @ml_stage/datasets/train
FROM (
    SELECT number, number + 1 AS label
    FROM numbers(10)
)
FILE_FORMAT = (TYPE = LANCE)
USE_RAW_PATH = TRUE
OVERWRITE = TRUE
DETAILED_OUTPUT = TRUE;
```

目标路径下会出现类似下面的 Lance 数据集结构：

```text
datasets/train/_versions/...
datasets/train/data/... .lance
datasets/train/*.manifest
```

如果你想看包含 Python `lance` 验证的完整端到端示例，请参阅 [导出 Lance 数据集](/guides/unload-data/unload-lance)。
