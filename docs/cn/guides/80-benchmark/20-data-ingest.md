---
title: "Databend 与 Snowflake：数据摄取基准测试"
sidebar_label: "摄取基准测试"
---

## 概览

本基准测试评估了 Databend Cloud 和 Snowflake 的数据摄取能力，重点关注性能和成本效率。高效的数据摄取能够实现更快的数据加载，以便更快地进行分析。此分析包括加载两个不同的数据集，并检查它们在 1 秒和 5 秒数据新鲜度场景下的性能。

### 关键比较

- **TPC-H SF100 数据集摄取**：测量将 TPC-H SF100 数据集（包含 100GB 数据和约 6 亿行）加载到两个平台的时间和成本。
- **ClickBench 点击数据集摄取**：评估将 ClickBench 点击数据集（包含 76GB 数据、约 1 亿行和 105 列宽度的表）摄取到每个数据仓库的效率。
- **1 秒数据新鲜度挑战**：比较两个平台在 1 秒新鲜度要求下摄取数据的能力，重点关注在此约束下摄取的数据量。
- **5 秒数据新鲜度挑战**：比较两个平台在 5 秒新鲜度要求下摄取数据的能力，详细说明在此时间框架内可以摄取的数据量。

### 平台概览

- **[Snowflake](https://www.snowflake.com)**：一个领先的云数据平台，以可扩展的计算和存储分离、按需计算、数据共享和克隆而闻名。
- **[Databend Cloud](https://www.databend.com)**：一个云原生数据仓库，提供类似于 Snowflake 的功能，基于开源的 [Databend 项目](https://github.com/datafuselabs/databend)，专注于可扩展性、成本效率和高性能分析。

:::info

基准测试在 AWS us-east-2 区域的 `Small-Size` 仓库配置（16vCPU）上进行，从同一个 S3 桶加载数据。

:::

## 性能和成本比较

- **TPC-H 数据加载成本**：Databend Cloud 较 Snowflake 实现了 **67% 的成本降低**。
- **点击数据（宽列）加载成本**：Databend Cloud 在数据加载方面较 Snowflake 实现了 **91% 的成本降低**。
- **1 秒数据新鲜度**：Databend Cloud 显著优于 Snowflake，在 1 秒新鲜度期内加载的数据量 **增加了 400 倍**。
- **5 秒数据新鲜度**：Databend Cloud 在 5 秒新鲜度期内加载的数据量 **超过 Snowflake 27 倍**。

## 数据摄取基准测试

![image](https://github.com/datafuselabs/databend/assets/172204/530317ec-c895-492a-8403-f7b8694b02f2)

### TPC-H SF100 数据集

| 指标             | Snowflake | Databend Cloud | 描述                     |
|------------------|-----------|----------------|---------------------------|
| **总时间**       | 695s      | 446s           | 加载数据集的时间。         |
| **总成本**       | $0.77     | $0.25          | 数据加载的成本。           |

- 数据量：100GB
- 行数：约 6 亿

### ClickBench 点击数据集

| 指标             | Snowflake | Databend Cloud | 描述                     |
|------------------|-----------|----------------|---------------------------|
| **总时间**       | 51m 17s   | 9m 58s         | 加载数据集的时间。         |
| **总成本**       | $3.42     | $0.30          | 数据加载的成本。           |

- 数据量：76GB
- 行数：约 1 亿
- 表宽度：105 列


## 新鲜度基准测试

![image](https://github.com/datafuselabs/databend/assets/172204/41b04e6a-9027-47bf-a749-49c267a7f9ec)

### 1 秒新鲜度基准测试

评估在 1 秒新鲜度要求内摄取的数据量。

| 指标             | Snowflake | Databend Cloud | 描述                                              |
|------------------|-----------|----------------|--------------------------------------------------|
| **总时间**       | 1s        | 1s             | 加载时间框架。                                      |
| **总行数**       | 100 行    | 40,000 行      | 在 1s 内成功摄取的数据量。                          |

### 5 秒新鲜度基准测试

评估在 5 秒新鲜度要求内可以摄取的数据量。

| 指标             | Snowflake   | Databend Cloud | 描述                                             |
|------------------|-------------|----------------|-------------------------------------------------|
| **总时间**       | 5s          | 5s             | 加载时间框架。                                     |
| **总行数**       | 90,000 行   | 2,500,000 行   | 在 5s 内成功摄取的数据量。                          |


## 重现基准测试

您可以按照以下步骤重现基准测试。

### 基准测试环境

Snowflake 和 Databend Cloud 在类似条件下进行了测试：



| 参数            | Snowflake                                                                | Databend Cloud                            |
|----------------|--------------------------------------------------------------------------|-------------------------------------------|
| 仓库大小        | 小                                                                      | 小                                        |
| vCPU           | 16                                                                       | 16                                        |
| 价格            | [每小时 $4](https://www.snowflake.com/en/data-cloud/pricing-options/)    | [每小时 $2](https://www.databend.com/plan/) |
| AWS 区域       | us-east-2                                                                | us-east-2                                 |
| 存储            | AWS S3                                                                   | AWS S3                                    |

- TPC-H SF100 数据集，来源于 [Amazon Redshift](https://github.com/awslabs/amazon-redshift-utils/tree/master/src/CloudDataWarehouseBenchmark/Cloud-DWB-Derived-from-TPCH)，已经被加载到 Databend Cloud 和 Snowflake 中，没有进行任何特定的调优。

### 先决条件

- 拥有一个 [Snowflake 账户](https://singup.snowflake.com)
- 创建一个 [Databend Cloud 账户](https://www.databend.com/apply/)。

### TPC-H 数据加载

1. **Snowflake 数据加载**:
    - 登录您的 [Snowflake 账户](https://app.snowflake.com/)。
    - 创建与 TPC-H 模式相对应的表。[SQL 脚本](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/snow/setup.sql#L1-L92)。
    - 使用 `COPY INTO` 命令从 AWS S3 加载数据。[SQL 脚本](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/snow/setup.sql#L95-L102)。

2. **Databend Cloud 数据加载**:
    - 登录您的 [Databend Cloud 账户](https://app.databend.com)。
    - 创建必要的表，与 TPC-H 模式相符。[SQL 脚本](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/bend/setup.sql#L1-L92)。
    - 使用与 Snowflake 类似的方法从 AWS S3 加载数据。[SQL 脚本](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/bend/setup.sql#L95-L133)。

### ClickBench Hits 数据加载

1. **Snowflake 数据加载**:
    - 登录您的 [Snowflake 账户](https://app.snowflake.com/)。
   - 创建与 `hits` 模式相对应的表。[SQL 脚本](https://gist.github.com/BohuTANG/2a23e5f829a8d180f7388c530526ab21?permalink_comment_id=4991762#file-hits-snowflake-schema)。
    - 使用 `COPY INTO` 命令从 AWS S3 加载数据。[SQL 脚本](https://gist.github.com/BohuTANG/2a23e5f829a8d180f7388c530526ab21?permalink_comment_id=4991762#gistcomment-4991762)。

2. **Databend Cloud 数据加载**:
    - 登录您的 [Databend Cloud 账户](https://app.databend.com)。
    - 创建必要的表，与 `hits` 模式相符。[SQL 脚本](https://gist.github.com/BohuTANG/ab45d251c533dcf0b1ccd3ea1263b8a0#file-hits-databend-schema)。
    - 使用与 Snowflake 类似的方法从 AWS S3 加载数据。[SQL 脚本](https://gist.github.com/BohuTANG/ab45d251c533dcf0b1ccd3ea1263b8a0?permalink_comment_id=4991767#gistcomment-4991767)。


### 新鲜度基准测试

可以使用以下步骤重现数据生成和摄取的新鲜度基准测试：


1. 在 Databend Cloud 中创建一个[外部阶段](https://docs.databend.com/sql/sql-commands/ddl/stage/ddl-create-stage#example-2-create-external-stage-with-aws-access-key)
```sql
CREATE STAGE hits_unload_stage
URL = 's3://unload/files/'
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>',
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

2. 将数据卸载到外部阶段。

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

3. 从外部阶段加载数据到 `hits` 表。

```sql
COPY INTO hits
    FROM @hits_unload_stage
    PATTERN = '.*[.]tsv.gz'
    FILE_FORMAT = (TYPE = TSV,  COMPRESSION=auto); 
```

4. 从仪表板测量结果。