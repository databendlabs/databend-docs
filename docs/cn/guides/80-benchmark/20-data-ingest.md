---
title: "Databend 与 Snowflake：数据摄取基准测试"
sidebar_label: "数据摄取基准测试"
---

import DetailsWrap from '@site/src/components/DetailsWrap';

## 概览

我们进行了四项基准测试，以具体评估 Databend Cloud 与 Snowflake 的数据摄取性能与成本：

1. **TPC-H SF100 数据集加载**：关注大规模数据集（100GB，约 6 亿行）的加载性能和成本。
2. **ClickBench Hits 数据集加载**：测试加载宽表数据集（76GB，约 1 亿行，105 列）的效率，强调高列计数带来的挑战。
3. **1 秒新鲜度**：衡量平台在严格的 1 秒新鲜度要求下的数据摄取能力。
4. **5 秒新鲜度**：衡量平台在 5 秒新鲜度要求下的数据摄取能力。

## 平台

- **[Snowflake](https://snowflake.com)**：知名的云数据平台，强调可扩展的计算、数据共享。
- **[Databend Cloud](https://databend.com)**：基于开源 Databend 项目构建的云原生数据仓库，专注于可扩展性和成本效率。

## 基准测试条件

在 `Small-Size` 计算集群（16vCPU，AWS us-east-2）上进行，使用来自同一个 S3 桶的数据。

## 性能和成本比较

## 性能和成本

- **TPC-H SF100 数据**：Databend Cloud 比 Snowflake **成本降低 67%**。
- **ClickBench Hits 数据**：Databend Cloud 实现了 **成本降低 91%**。
- **1 秒新鲜度**：Databend 摄取的数据量是 Snowflake 的 **400 倍**。
- **5 秒新鲜度**：Databend 摄取的数据量超过 **27 倍**。

## 数据摄取基准测试

![image](https://github.com/datafuselabs/databend/assets/172204/c61d7a40-f6fe-4fb9-83e8-06ea9599aeb4)

### TPC-H SF100 数据集

| 指标       | Snowflake | Databend Cloud | 描述                   |
| ---------- | --------- | -------------- | ---------------------- |
| **总时间** | 695s      | 446s           | 加载数据集所需的时间。 |
| **总成本** | $0.77     | $0.25          | 数据加载的成本。       |

- 数据量：100GB
- 行数：约 6 亿

### ClickBench Hits 数据集

| 指标       | Snowflake | Databend Cloud | 描述                   |
| ---------- | --------- | -------------- | ---------------------- |
| **总时间** | 51m 17s   | 9m 58s         | 加载数据集所需的时间。 |
| **总成本** | $3.42     | $0.30          | 数据加载的成本。       |

- 数据量：76GB
- 行数：约 1 亿
- 表宽度：105 列

## 新鲜度基准测试

![image](https://github.com/datafuselabs/databend/assets/172204/41b04e6a-9027-47bf-a749-49c267a7f9ec)

### 1 秒新鲜度基准测试

评估在 1 秒新鲜度要求内摄取的数据量。

| 指标       | Snowflake | Databend Cloud | 描述                       |
| ---------- | --------- | -------------- | -------------------------- |
| **总时间** | 1s        | 1s             | 加载时间框架。             |
| **总行数** | 100 行    | 40,000 行      | 在 1s 内成功摄取的数据量。 |

### 5 秒新鲜度基准测试

评估在 5 秒新鲜度要求内能摄取的数据量。

| 指标       | Snowflake | Databend Cloud | 描述                       |
| ---------- | --------- | -------------- | -------------------------- |
| **总时间** | 5s        | 5s             | 加载时间框架。             |
| **总行数** | 90,000 行 | 2,500,000 行   | 在 5s 内成功摄取的数据量。 |

## 重现基准测试

您可以按照以下步骤重现基准测试。

### 基准测试环境

Snowflake 和 Databend Cloud 在类似条件下进行了测试：

| 参数         | Snowflake                                                           | Databend Cloud                            |
| ------------ | ------------------------------------------------------------------- | ----------------------------------------- |
| 计算集群大小 | Small                                                               | Small                                     |
| vCPU         | 16                                                                  | 16                                        |
| 价格         | [$4/小时](https://www.snowflake.com/en/data-cloud/pricing-options/) | [$2/小时](https://www.databend.com/plan/) |
| AWS 区域     | us-east-2                                                           | us-east-2                                 |
| 存储         | AWS S3                                                              | AWS S3                                    |

- 来自 [Amazon Redshift](https://github.com/awslabs/amazon-redshift-utils/tree/master/src/CloudDataWarehouseBenchmark/Cloud-DWB-Derived-from-TPCH) 的 TPC-H SF100 数据集。
- 来自 [ClickBench](https://github.com/ClickHouse/ClickBench) 的 ClickBench 数据集。

### 先决条件

- 拥有一个 [Snowflake 账户](https://singup.snowflake.com)
- 创建一个 [Databend Cloud 账户](https://www.databend.com/apply/)。

### 数据摄取基准测试

可以使用以下步骤复现数据摄取基准测试：

<DetailsWrap>

<details>
  <summary>TPC-H 数据加载</summary>

1. **Snowflake 数据加载**：

   - 登录您的 [Snowflake 账户](https://app.snowflake.com/)。
   - 创建与 TPC-H 架构相对应的表。[SQL 脚本](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/snow/setup.sql#L1-L92)。
   - 使用 `COPY INTO` 命令从 AWS S3 加载数据。[SQL 脚本](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/snow/setup.sql#L95-L102)。

2. **Databend Cloud 数据加载**：
   - 登录您的 [Databend Cloud 账户](https://app.databend.com)。
   - 创建必要的表，与 TPC-H 架构相对应。[SQL 脚本](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/bend/setup.sql#L1-L92)。
   - 使用与 Snowflake 类似的方法从 AWS S3 加载数据。[SQL 脚本](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/bend/setup.sql#L95-L133)。

</details>

<details>
  <summary> ClickBench Hits 数据加载</summary>

1. **Snowflake 数据加载**：

   - 登录您的 [Snowflake 账户](https://app.snowflake.com/)。
   - 创建与 `hits` 架构相对应的表。[SQL 脚本](https://gist.github.com/BohuTANG/2a23e5f829a8d180f7388c530526ab21?permalink_comment_id=4991762#file-hits-snowflake-schema)。
   - 使用 `COPY INTO` 命令从 AWS S3 加载数据。[SQL 脚本](https://gist.github.com/BohuTANG/2a23e5f829a8d180f7388c530526ab21?permalink_comment_id=4991762#gistcomment-4991762)。

2. **Databend Cloud 数据加载**：
   - 登录您的 [Databend Cloud 账户](https://app.databend.com)。
   - 创建必要的表，与 `hits` 架构相对应。[SQL 脚本](https://gist.github.com/BohuTANG/ab45d251c533dcf0b1ccd3ea1263b8a0#file-hits-databend-schema)。
   - 使用与 Snowflake 类似的方法从 AWS S3 加载数据。[SQL 脚本](https://gist.github.com/BohuTANG/ab45d251c533dcf0b1ccd3ea1263b8a0?permalink_comment_id=4991767#gistcomment-4991767)。

</details>

</DetailsWrap>

### 新鲜度基准测试

可以使用以下步骤复现新鲜度基准测试的数据生成和摄取：

1. 在 Databend Cloud 中创建一个[外部 Stage](https://docs.databend.com/sql/sql-commands/ddl/stage/ddl-create-stage#example-2-create-external-stage-with-aws-access-key)

```sql
CREATE STAGE hits_unload_stage
URL = 's3://unload/files/'
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>',
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

2. 将数据卸载到外部 Stage。

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

3. 从外部 Stage 加载数据到 `hits` 表。

```sql
COPY INTO hits
    FROM @hits_unload_stage
    PATTERN = '.*[.]tsv.gz'
    FILE_FORMAT = (TYPE = TSV,  COMPRESSION=auto);
```

4. 从仪表盘测量结果。
