---
title: CREATE CONNECTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.339"/>

创建到外部存储的连接。

## 语法

```sql
CREATE [ OR REPLACE ] CONNECTION [ IF NOT EXISTS ] <connection_name> 
    STORAGE_TYPE = '<type>' 
    [ <storage_params> ]

```

| 参数             | 描述                                                                                                                                            |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| STORAGE_TYPE     | 存储服务类型。可能的值包括：`s3`、`azblob`、`gcs`、`oss`、`cos`、`hdfs` 和 `webhdfs`。                                                                 |
| storage_params   | 根据存储类型和身份验证方法而有所不同。有关详细信息，请参见 [连接参数](../../../00-sql-reference/51-connect-parameters.md)。 |

## 示例

此示例创建名为“toronto”的到 Amazon S3 的连接，并建立一个名为“my_s3_stage”的外部 Stage，该 Stage 链接到“s3://databend-toronto”URL，使用“toronto”连接。有关连接的更多实际示例，请参见 [使用示例](index.md#usage-examples)。

```sql
CREATE CONNECTION toronto 
    STORAGE_TYPE = 's3' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>' 
    ACCESS_KEY_ID = '<your-access-key-id>';

CREATE STAGE my_s3_stage 
    URL = 's3://databend-toronto' 
    CONNECTION = (CONNECTION_NAME = 'toronto');
```