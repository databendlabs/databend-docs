---
title: 'COPY INTO <位置>'
sidebar_label: 'COPY INTO <位置>'
description:
  '使用 COPY INTO <位置> 卸载数据'
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.296"/>

COPY INTO 允许您将数据从表或查询卸载到一个或多个文件中，这些文件位于以下任一位置：

* 用户/内部/外部阶段：请参阅[什么是阶段？](/guides/load-data/stage/what-is-stage)了解 Databend 中的阶段。
* 存储服务中创建的桶或容器。

另请参见：[`COPY INTO <表>`](dml-copy-into-table.md)

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

<TabItem value="Amazon S3类存储服务" label="Amazon S3类存储服务">

```sql
externalLocation ::=
  's3://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```
有关访问 Amazon S3类存储服务的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Azure Blob存储" label="Azure Blob存储">

```sql
externalLocation ::=
  'azblob://<container>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Azure Blob存储的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Google Cloud Storage" label="Google Cloud Storage">

```sql
externalLocation ::=
  'gcs://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Google Cloud Storage的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="阿里云OSS" label="阿里云OSS">

```sql
externalLocation ::=
  'oss://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问阿里云OSS的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="腾讯云对象存储" label="腾讯云对象存储">

```sql
externalLocation ::=
  'cos://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问腾讯云对象存储的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Hadoop分布式文件系统(HDFS)" label="HDFS">

```sql
externalLocation ::=
  'hdfs://<endpoint_url>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问HDFS的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="WebHDFS" label="WebHDFS">

```sql
externalLocation ::=
  'webhdfs://<endpoint_url>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问WebHDFS的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>
</Tabs>

### FILE_FORMAT

详情请参见[输入与输出文件格式](../../00-sql-reference/50-file-format-options.md)。

### copyOptions

```sql
copyOptions ::=
  [ SINGLE = TRUE | FALSE ]
  [ MAX_FILE_SIZE = <num> ]
```

| 参数       | 描述                                                                                                               |
|-----------------|---------------------------------------------------------------------------------------------------------------------------|
| SINGLE        | 当为TRUE时，命令将数据卸载到一个单独的文件中。默认值：FALSE。                                                             |
| MAX_FILE_SIZE | 要创建的每个文件的最大大小（以字节为单位）。<br />当`SINGLE`为FALSE时有效。默认值：67108864字节（64MB）。 |

### DETAILED_OUTPUT

确定是否应返回数据卸载的详细结果，默认值为`false`。更多信息，请参见[输出](#输出)。

## 输出

COPY INTO 提供数据卸载结果的摘要，包含以下列：

| 列            | 描述                                                                                   |
|---------------|-----------------------------------------------------------------------------------------------|
| rows_unloaded | 成功卸载到目的地的行数。                                  |
| input_bytes   | 卸载操作期间从源表读取的数据的总大小，以字节为单位。 |
| output_bytes  | 写入目的地的数据的总大小，以字节为单位。                             |

当`DETAILED_OUTPUT`设置为`true`时，COPY INTO 提供包含以下列的结果。这有助于定位卸载的文件，尤其是在使用`MAX_FILE_SIZE`将卸载的数据分成多个文件时。

| 列        | 描述                                        |
|-----------|----------------------------------------------------|
| file_name | 卸载文件的名称。                     |
| file_size | 卸载文件的大小，以字节为单位。            |
| row_count | 卸载文件中包含的行数。 |

## 示例

本节中提供的示例使用了以下表和数据：

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

### 示例1：卸载到内部阶段

本示例将数据卸载到内部阶段：

```sql
-- 创建内部阶段
CREATE STAGE my_internal_stage;

-- 使用PARQUET文件格式将数据从表卸载到阶段
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

### 示例2：卸载到压缩文件

本示例将数据卸载到压缩文件：

```sql
-- 创建内部阶段
CREATE STAGE my_internal_stage;

-- 使用CSV文件格式和gzip压缩将数据从表卸载到阶段
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

-- COPY INTO 也支持自定义文件格式。请看下面：
-- 创建一个名为my_cs_gzip的自定义文件格式，使用CSV格式和gzip压缩
CREATE FILE FORMAT my_csv_gzip TYPE = CSV COMPRESSION = gzip;
       
-- 使用自定义文件格式my_cs_gzip将数据从表卸载到阶段
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

### 示例3：卸载到桶

本示例将数据卸载到一个名为'databend'的MinIO桶中：

```sql
-- 使用PARQUET文件格式将数据从表卸载到一个名为'databend'的MinIO桶中
COPY INTO 's3://databend'
    CONNECTION = (
    ENDPOINT_URL = 'http://localhost:9000/',
    ACCESS_KEY_ID = 'ROOTUSER',
    SECRET_ACCESS_KEY = 'CHANGEME123',
    region = 'us-west-2'
    )
    FROM canadian_city_population
    FILE_FORMAT = (TYPE = PARQUET);

{/*examples*/}

```
┌────────────────────────────────────────────┐
│ rows_unloaded │ input_bytes │ output_bytes │
├───────────────┼─────────────┼──────────────┤
│            10 │         211 │          572 │
└────────────────────────────────────────────┘
```

![Alt text](@site/docs/public/img/sql/copy-into-bucket.png)