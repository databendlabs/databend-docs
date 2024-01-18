---
title: "TPC-H 基准测试：Databend Cloud 与 Snowflake 对比"
sidebar_label: "TPC-H SF100 基准测试"
---

## 快速概览

### TPC-H

TPC-H 基准测试是评估决策支持系统的标准，重点关注复杂查询和数据维护。在此分析中，我们使用 TPC-H SF100（SF1 = 600万行）数据集比较 Databend Cloud 和 Snowflake，该数据集包含 100GB 数据和大约 6 亿行，跨越 22 个查询。

:::info 免责声明
TPC 基准测试™ 和 TPC-H™ 是交易处理性能委员会（[TPC](http://www.tpc.org)）的商标。我们的基准测试虽然受到 TPC-H 的启发，但与官方 TPC-H 结果不直接可比。
:::

### Snowflake 和 Databend Cloud

- **[Snowflake](https://www.snowflake.com)**：Snowflake 以其先进的功能而闻名，例如分离存储和计算、按需可扩展的计算、数据共享和克隆能力。

- **[Databend Cloud](https://www.databend.com)**：Databend Cloud 提供与 Snowflake [类似的功能](https://github.com/datafuselabs/databend/issues/13059)，是一个云原生数据仓库，也将存储与计算分离，并根据需要提供可扩展的计算。
 它是从开源的 [Databend 项目](https://github.com/datafuselabs/databend)发展而来，定位为 Snowflake 的现代化、高性价比替代品，特别适合大规模分析。

## 性能和成本比较

- **数据加载成本**：与 Snowflake 相比，Databend 在数据加载方面实现了 **67% 的成本降低**。
- **查询执行成本**：Databend 的查询执行成本大约比 Snowflake **低 60%**。

:::info 注意

在此基准测试中，没有应用特殊调优。Snowflake 和 Databend Cloud 均使用其默认设置。
记住，**不要只是相信我们的话 —— 我们鼓励您自己运行并验证这些结果。** 
:::

### 数据加载基准测试

![image](https://github.com/datafuselabs/wizard/assets/172204/0e51510d-5aa6-4891-8510-c2741e7ddae0)

| 表格            | Snowflake(695秒, 成本 $0.77) | Databend Cloud(446秒, 成本 $0.25) | 行数        |
|------------------|-----------------------------|----------------------------------|-------------|
| customer         | 18.137                      | 13.436                           | 15,000,000  |
| lineitem         | 477.740                     | 305.812                          | 600,037,902 |
| nation           | 1.347                       | 0.708                            | 25          |
| orders           | 103.088                     | 64.323                           | 150,000,000 |
| part             | 19.908                      | 12.192                           | 20,000,000  |
| partsupp         | 67.410                      | 45.346                           | 80,000,000  |
| region           | 0.743                       | 0.725                            | 5           |
| supplier         | 3.000                       | 3.687                            | 10,000,000  |
| **总时间**       | **695秒**                   | **446秒**                        |             |
| **总成本**       | **$0.77**                   | **$0.25**                        |             |
| **存储大小**     | **20.8GB**                  | **24.5GB**                       |             |

### 查询基准测试：冷启动

![image](https://github.com/datafuselabs/wizard/assets/172204/d796acf0-0a66-4b1d-8754-cd2cd1de04c7)

| 查询            | Snowflake(总计 207秒, 成本 $0.23) | Databend Cloud(总计 166秒, 成本 $0.09) |
|----------------|-----------------------------------|----------------------------------------|
| TPC-H 1        | 11.703                            | 8.036                                  |
| TPC-H 2        | 4.524                             | 3.786                                  |
| TPC-H 3        | 8.908                             | 6.040                                  |
| TPC-H 4        | 8.108                             | 4.462                                  |
| TPC-H 5        | 9.202                             | 7.014                                  |
| TPC-H 6        | 1.237                             | 3.234                                  |
| TPC-H 7        | 9.082                             | 7.345                                  |
| TPC-H 8        | 10.886                            | 8.976                                  |
| TPC-H 9        | 18.152                            | 13.340                                 |
| TPC-H 10       | 13.525                            | 12.891                                 |
| TPC-H 11       | 2.582                             | 2.183                                  |
| TPC-H 12       | 10.099                            | 8.839                                  |
| TPC-H 13       | 13.458                            | 7.206                                  |
| TPC-H 14       | 8.001                             | 4.612                                  |
| TPC-H 15       | 8.737                             | 4.621                                  |
| TPC-H 16       | 4.864                             | 1.645                                  |
| TPC-H 17       | 5.363                             | 14.315                                 |
| TPC-H 18       | 19.971                            | 12.058                                 |
| TPC-H 19       | 9.893                             | 12.579                                 |
| TPC-H 20       | 8.538                             | 8.836                                  |
| TPC-H 21       | 16.439                            | 12.270                                 |
| TPC-H 22       | 3.744                             | 1.926                                  |
| **总时间**     | **207秒**                         | **166秒**                               |
| **总成本**     | **$0.23**                         | **$0.09**                              |

### 查询基准测试：热启动

![image](https://github.com/datafuselabs/wizard/assets/172204/9a5533e1-b432-4c69-8e10-6a2d289793e7)



| 查询            | Snowflake (总计 138s, 费用 $0.15) | Databend Cloud (总计 124s, 费用 $0.07) |
|----------------|------------------------------------|-----------------------------------------|
| TPC-H 1        | 8.934                              | 7.568                                   |
| TPC-H 2        | 3.018                              | 3.125                                   |
| TPC-H 3        | 6.089                              | 5.234                                   |
| TPC-H 4        | 4.914                              | 3.392                                   |
| TPC-H 5        | 5.800                              | 4.857                                   |
| TPC-H 6        | 0.891                              | 2.142                                   |
| TPC-H 7        | 5.381                              | 4.389                                   |
| TPC-H 8        | 5.724                              | 5.887                                   |
| TPC-H 9        | 10.283                             | 9.621                                   |
| TPC-H 10       | 10.368                             | 8.524                                   |
| TPC-H 11       | 1.165                              | 1.364                                   |
| TPC-H 12       | 7.052                              | 5.352                                   |
| TPC-H 13       | 12.829                             | 6.180                                   |
| TPC-H 14       | 3.288                              | 2.725                                   |
| TPC-H 15       | 3.475                              | 2.748                                   |
| TPC-H 16       | 4.094                              | 1.124                                   |
| TPC-H 17       | 4.203                              | 13.757                                  |
| TPC-H 18       | 18.583                             | 11.630                                  |
| TPC-H 19       | 3.888                              | 7.881                                   |
| TPC-H 20       | 6.379                              | 5.797                                   |
| TPC-H 21       | 10.287                             | 9.806                                   |
| TPC-H 22       | 1.573                              | 1.122                                   |
| **总时间**     | **138s**                           | **124s**                                |
| **总费用**     | **$0.15**                          | **$0.07**                               |

## 复现基准测试

您可以按照以下步骤复现基准测试。

### 基准测试环境

Snowflake 和 Databend Cloud 在类似条件下进行了测试：

| 参数            | Snowflake                                                           | Databend Cloud                            |
|----------------|---------------------------------------------------------------------|-------------------------------------------|
| 仓库大小       | 小型                                                                | 小型                                      |
| vCPU           | 16                                                                  | 16                                        |
| 价格            | [$4/小时](https://www.snowflake.com/en/data-cloud/pricing-options/) | [$2/小时](https://www.databend.com/plan/) |
| AWS 区域       | us-east-2                                                           | us-east-2                                 |
| 存储            | AWS S3                                                              | AWS S3                                    |

- TPC-H SF100 数据集，来源于 [Amazon Redshift](https://github.com/awslabs/amazon-redshift-utils/tree/master/src/CloudDataWarehouseBenchmark/Cloud-DWB-Derived-from-TPCH)，已经加载到 Databend Cloud 和 Snowflake 中，没有进行任何特定的调优。

### 基准测试方法

我们对查询执行进行了冷热两轮运行：
1. **冷运行**：在执行查询之前，数据仓库被挂起并恢复。
2. **热运行**：数据仓库没有被挂起，使用本地磁盘缓存。

### 前提条件

- 拥有一个 [Snowflake 账户](https://singup.snowflake.com)
- 创建一个 [Databend Cloud 账户](https://www.databend.com/apply/).

### 数据加载

1. **Snowflake 数据加载**：
    - 登录您的 [Snowflake 账户](https://app.snowflake.com/).
    - 创建对应 TPC-H 架构的表。[SQL 脚本](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/snow/setup.sql#L1-L92).
    - 使用 `COPY INTO` 命令从 AWS S3 加载数据。[SQL 脚本](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/snow/setup.sql#L95-L102).

2. **Databend Cloud 数据加载**：
    - 登录您的 [Databend Cloud 账户](https://app.databend.com).
    - 创建必要的表，与 TPC-H 架构相符。[SQL 脚本](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/bend/setup.sql#L1-L92).
    - 使用类似 Snowflake 的方法从 AWS S3 加载数据。[SQL 脚本](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/bend/setup.sql#L95-L133).

### TPC-H 查询

1. **Snowflake 查询**：
    - 登录您的 [Snowflake 账户](https://app.snowflake.com/).
    - 运行 TPC-H 查询。[SQL 脚本](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/snow/queries.sql#L1-L651).

2. **Databend Cloud 查询**：
    - 登录您的 [Databend Cloud 账户](https://app.databend.com).
    - 运行 TPC-H 查询。[SQL 脚本](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/bend/queries.sql#L1-L651).