---
title: "COPY INTO <location>"
sidebar_label: "COPY INTO <location>"
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.647"/>

COPY INTO 允许您将数据从表或查询中卸载到一个或多个文件中，这些文件位于以下位置之一：

- 用户/内部/外部阶段：请参阅 [什么是 Stage？](/guides/load-data/stage/what-is-stage) 以了解 Databend 中的阶段。
- 在存储服务中创建的存储桶或容器。

另请参阅：[`COPY INTO <table>`](dml-copy-into-table.md)

## 语法

```sql
COPY INTO { internalStage | externalStage | externalLocation }
FROM { [<database_name>.]<table_name> | ( <query> ) }
[ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET } [ formatTypeOptions ]
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

有关访问 Amazon S3-like 存储服务的连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Azure Blob Storage" label="Azure Blob Storage">

```sql
externalLocation ::=
  'azblob://<container>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Azure Blob Storage 的连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Google Cloud Storage" label="Google Cloud Storage">

```sql
externalLocation ::=
  'gcs://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Google Cloud Storage 的连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Alibaba Cloud OSS" label="Alibaba Cloud OSS">

```sql
externalLocation ::=
  'oss://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Alibaba Cloud OSS 的连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Tencent Cloud Object Storage" label="Tencent Cloud Object Storage">

```sql
externalLocation ::=
  'cos://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Tencent Cloud Object Storage 的连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Hadoop Distributed File System (HDFS)" label="HDFS">

```sql
externalLocation ::=
  'hdfs://<endpoint_url>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 HDFS 的连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="WebHDFS" label="WebHDFS">

```sql
externalLocation ::=
  'webhdfs://<endpoint_url>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 WebHDFS 的连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>
</Tabs>

### FILE_FORMAT

详情请参阅 [输入 & 输出文件格式](../../00-sql-reference/50-file-format-options.md)。

### copyOptions

```sql
copyOptions ::=
  [ SINGLE = true | false ]
  [ MAX_FILE_SIZE = <num> ]
  [ OVERWRITE = true | false ]
  [ INCLUDE_QUERY_ID = true | false ]
  [ USE_RAW_PATH = true | false ]
```

| 参数             | 默认值                   | 描述                                                                                                                                                           |
|------------------|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| SINGLE           | false                  | 当 `true` 时，命令将数据卸载到一个单一文件中。                                                                                                             |
| MAX_FILE_SIZE    | 67108864 bytes (64 MB) | 每个文件的最大大小（以字节为单位）。当 `SINGLE` 为 false 时有效。                                                                             |
| OVERWRITE        | false                  | 当 `true` 时，目标路径中同名现有文件将被覆盖。注意：`OVERWRITE = true` 需要 `USE_RAW_PATH = true` 且 `INCLUDE_QUERY_ID = false`。   |
| INCLUDE_QUERY_ID | true                   | 当 `true` 时，导出的文件名中将包含一个唯一的 UUID。                                                                                                 |
| USE_RAW_PATH     | false                  | 当 `true` 时，将使用用户提供的精确路径（包括完整文件名）来导出数据。如果设置为 `false`，用户必须提供一个目录路径。 |

### DETAILED_OUTPUT

确定是否应返回数据卸载的详细结果，默认值为 `false`。更多信息请参阅 [输出](#output)。

## 输出

COPY INTO 提供数据卸载结果的摘要，包含以下列：

| 列            | 描述                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------- |
| rows_unloaded | 成功卸载到目标的行数。                                  |
| input_bytes   | 从源表读取的数据总大小（以字节为单位）。 |
| output_bytes  | 写入目标的数据总大小（以字节为单位）。                             |

当 `DETAILED_OUTPUT` 设置为 `true` 时，COPY INTO 提供以下列的结果。这有助于定位卸载的文件，尤其是在使用 `MAX_FILE_SIZE` 将卸载的数据分成多个文件时。

| 列        | 描述                                        |
| --------- | -------------------------------------------------- |
| file_name | 卸载文件的名称。                     |
| file_size | 卸载文件的大小（以字节为单位）。            |
| row_count | 卸载文件中包含的行数。 |

## 示例

在本节中，提供的示例使用了以下表和数据：

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

### 示例 1: 卸载到内部阶段

此示例将数据卸载到内部阶段：

```sql
-- 创建内部阶段
CREATE STAGE my_internal_stage;

-- 使用 PARQUET 文件格式将表中的数据卸载到阶段
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

### 示例 2: 卸载到压缩文件

此示例将数据卸载到压缩文件：

```sql
-- 创建内部阶段
CREATE STAGE my_internal_stage;

-- 使用 CSV 文件格式和 gzip 压缩将表中的数据卸载到阶段
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
├────────────────────────────────────────────────────────────────┼────────┼──────────────────┼───────────────────────────────┼──────────────────┤
│ data_7970afa5-32e3-4e7d-b793-e42a2a82a8e6_0000_00000000.csv.gz │    168 │ NULL             │ 2024-01-18 16:27:01.663 +0000 │ NULL             │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- COPY INTO 也适用于自定义文件格式。请参见下方：
-- 创建名为 my_cs_gzip 的自定义文件格式，使用 CSV 格式和 gzip 压缩
CREATE FILE FORMAT my_csv_gzip TYPE = CSV COMPRESSION = gzip;

-- 使用自定义文件格式 my_cs_gzip 将表中的数据卸载到阶段
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

### 示例 3：卸载到桶

此示例将数据卸载到 MinIO 上的一个桶中：

```sql
-- 将数据从表中卸载到 MinIO 上名为 'databend' 的桶中，使用 PARQUET 文件格式
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