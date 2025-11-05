---
title: "Databend vs. Snowflake: 数据导入基准测试"
sidebar_label: "数据导入基准测试"
---

import DetailsWrap from '@site/src/components/DetailsWrap';

## 概述

我们进行了四项具体的基准测试，以评估 Databend Cloud 与 Snowflake：

1. **TPC-H SF100 数据集加载**：侧重于大型数据集（100GB，约 6 亿行）的加载性能和成本。
2. **ClickBench Hits 数据集加载**：测试加载宽表数据集（76GB，约 1 亿行，105 列）的效率，重点关注与高列数相关的挑战。
3. **1 秒时效性**：衡量平台在严格的 1 秒时效性要求下摄取数据的能力。
4. **5 秒时效性**：比较平台在 5 秒时效性约束下的数据摄取能力。

## 平台

- **[Snowflake](https://snowflake.com)**：一个知名的云数据平台，强调可扩展的计算、数据共享。
- **[Databend Cloud](https://databend.com)**：一个构建在开源 Databend 项目之上的云原生数仓，专注于可扩展性和成本效益。

## 基准测试条件

在 `Small-Size` 计算集群（16vCPU，AWS us-east-2）上使用来自同一 S3 存储桶的数据进行。

## 性能和成本比较

## 性能和成本

- **TPC-H SF100 数据**：Databend Cloud 比 Snowflake 节省 **67% 的成本**。
- **ClickBench Hits 数据**：Databend Cloud 实现了 **91% 的成本降低**。
- **1 秒时效性**：Databend 加载的数据量是 Snowflake 的 **400 倍**。
- **5 秒时效性**：Databend 加载的数据量是 Snowflake 的 **27 倍以上**。

## 数据导入基准测试

![image](https://github.com/databendlabs/databend/assets/172204/c61d7a40-f6fe-4fb9-83e8-06ea9599aeb4)

### TPC-H SF100 数据集

| 指标       | Snowflake | Databend Cloud | 描述               |
| ---------- | --------- | -------------- | ------------------ |
| **总时间** | 695s      | 446s           | 加载数据集的时间。 |
| **总成本** | $0.77     | $0.25          | 数据加载的成本。   |

- 数据量：100GB
- 行数：约 6 亿

### ClickBench Hits 数据集

| 指标       | Snowflake | Databend Cloud | 描述               |
| ---------- | --------- | -------------- | ------------------ |
| **总时间** | 51m 17s   | 9m 58s         | 加载数据集的时间。 |
| **总成本** | $3.42     | $0.30          | 数据加载的成本。   |

- 数据量：76GB
- 行数：约 1 亿
- 表宽度：105 列

## 时效性基准测试

![image](https://github.com/databendlabs/databend/assets/172204/41b04e6a-9027-47bf-a749-49c267a7f9ec)

### 1 秒时效性基准测试

评估在 1 秒时效性要求内摄取的数据量。

| 指标       | Snowflake | Databend Cloud | 描述                        |
| ---------- | --------- | -------------- | --------------------------- |
| **总时间** | 1s        | 1s             | 加载时间范围。              |
| **总行数** | 100 Rows  | 40,000 Rows    | 在 1 秒内成功摄取的数据量。 |

### 5 秒时效性基准测试

评估在 5 秒时效性要求内可以摄取的数据量。

| 指标       | Snowflake   | Databend Cloud | 描述                        |
| ---------- | ----------- | -------------- | --------------------------- |
| **总时间** | 5s          | 5s             | 加载时间范围。              |
| **总行数** | 90,000 Rows | 2,500,000 Rows | 在 5 秒内成功摄取的数据量。 |

## 重现基准测试

您可以按照以下步骤重现基准测试。

### 基准测试环境

Snowflake 和 Databend Cloud 都在相似的条件下进行了测试：

| 参数         | Snowflake                                                | Databend Cloud                            |
| ------------ | -------------------------------------------------------- | ----------------------------------------- |
| 计算集群大小 | Small                                                    | Small                                     |
| vCPU         | 16                                                       | 16                                        |
| 价格         | [$4/hour](https://www.snowflake.com/en/pricing-options/) | [$2/hour](https://www.databend.com/plan/) |
| AWS 区域     | us-east-2                                                | us-east-2                                 |
| 存储         | AWS S3                                                   | AWS S3                                    |

- TPC-H SF100 数据集，来源于 [Amazon Redshift](https://github.com/awslabs/amazon-redshift-utils/tree/master/src/CloudDataWarehouseBenchmark/Cloud-DWB-Derived-from-TPCH)。
- ClickBench 数据集，来源于 [ClickBench](https://github.com/ClickHouse/ClickBench)。

### 前提条件

- 拥有一个 [Snowflake 账户](https://singup.snowflake.com)
- 创建一个 [Databend Cloud 账户](https://www.databend.com/apply/)。

### 数据导入基准测试

可以使用以下步骤重现数据导入基准测试：

<DetailsWrap>

<details>
  <summary>TPC-H 数据加载</summary>

1. **Snowflake 数据加载**：

   - 登录您的 [Snowflake 账户](https://app.snowflake.com/)。
   - 创建与 TPC-H 模式对应的表。[SQL 脚本](https://github.com/databendlabs/benchmarks/blob/main/tpch-100/snowflake/setup.sql)。
   - 使用 `COPY INTO` 命令从 AWS S3 加载数据。[SQL 脚本](https://github.com/databendlabs/benchmarks/blob/main/tpch-100/snowflake/setup.sql)。

2. **Databend Cloud 数据加载**：
   - 登录您的 [Databend Cloud 账户](https://app.databend.com)。
   - 根据 TPC-H 模式创建必要的表。[SQL 脚本](https://github.com/databendlabs/benchmarks/blob/main/tpch-100/databend/setup.sql)。
   - 使用与 Snowflake 类似的方法从 AWS S3 加载数据。[SQL 脚本](https://github.com/databendlabs/benchmarks/blob/main/tpch-100/databend/setup.sql)。

</details>

<details>
  <summary> ClickBench Hits 数据加载</summary>

1. **Snowflake 数据加载**：

   - 登录您的 [Snowflake 账户](https://app.snowflake.com/)。
   - 创建与 `hits` 模式对应的表。[SQL 脚本](https://gist.github.com/BohuTANG/2a23e5f829a8d180f7388c530526ab21?permalink_comment_id=4991762#file-hits-snowflake-schema)。
   - 使用 `COPY INTO` 命令从 AWS S3 加载数据。[SQL 脚本](https://gist.github.com/BohuTANG/2a23e5f829a8d180f7388c530526ab21?permalink_comment_id=4991762#gistcomment-4991762)。

2. **Databend Cloud 数据加载**：
   - 登录您的 [Databend Cloud 账户](https://app.databend.com)。
   - 根据 `hits` 模式创建必要的表。[SQL 脚本](https://gist.github.com/BohuTANG/ab45d251c533dcf0b1ccd3ea1263b8a0#file-hits-databend-schema)。
   - 使用与 Snowflake 类似的方法从 AWS S3 加载数据。[SQL 脚本](https://gist.github.com/BohuTANG/ab45d251c533dcf0b1ccd3ea1263b8a0?permalink_comment_id=4991767#gistcomment-4991767)。

</details>

</DetailsWrap>

### 时效性基准测试

可以使用以下步骤重现时效性基准测试的数据生成和摄取：

1. 在 Databend Cloud 中创建一个 [external stage](https://docs.databend.com/sql/sql-commands/ddl/stage/ddl-create-stage#example-2-create-external-stage-with-aws-access-key)

```sql
CREATE STAGE hits_unload_stage
URL = 's3://unload/files/'
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>',
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

2. 将数据卸载到 external stage。

```sql
CREATE or REPLACE FILE FORMAT tsv_unload_format_gzip
    TYPE = TSV,
    COMPRESSION = gzip;

 COPY INTO @hits_unload_stage
FROM (
    SELECT *
    FROM hits limit <the-rows-you-want>
)
FILE_FORMAT = (FORMAT_NAME = 'tsv_unload_format_gzip')
DETAILED_OUTPUT = true;
```

3. 将数据从 external stage 加载到 `hits` 表。

```sql
COPY INTO hits
    FROM @hits_unload_stage
    PATTERN = '.*[.]tsv.gz'
    FILE_FORMAT = (TYPE = TSV,  COMPRESSION=auto);
```

4. 从仪表板衡量结果。
