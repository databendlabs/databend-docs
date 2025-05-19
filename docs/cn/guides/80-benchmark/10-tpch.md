---
title: "TPC-H 基准测试：Databend Cloud vs. Snowflake"
sidebar_label: "TPC-H SF100 基准测试"
---

## 快速概览

### TPC-H

TPC-H 基准测试是评估决策支持系统的标准，侧重于复杂的查询和数据维护。在此分析中，我们使用 TPC-H SF100（SF1 = 6 百万行）数据集比较 Databend Cloud 和 Snowflake，该数据集包含 100GB 的数据和大约 6 亿行，涵盖 22 个查询。

:::info Disclaimer
TPC Benchmark™ 和 TPC-H™ 是事务处理性能委员会 ([TPC](http://www.tpc.org)) 的商标。我们的基准测试虽然受到 TPC-H 的启发，但与官方 TPC-H 结果不具有直接可比性。
:::

### Snowflake 和 Databend Cloud

- **[Snowflake](https://www.snowflake.com)**: Snowflake 以其先进的功能而闻名，例如存储和计算分离、按需扩展计算、数据共享和克隆功能。

- **[Databend Cloud](https://www.databend.com)**: Databend Cloud 提供与 Snowflake [类似的功能](https://github.com/databendlabs/databend/issues/13059)，作为一个云原生数仓，它也将存储与计算分离，并根据需要提供可扩展的计算。
  它由开源 [Databend 项目](https://github.com/databendlabs/databend) 开发而来，定位于 Snowflake 的现代、经济高效的替代方案，尤其适用于大规模分析。

## 性能和成本比较

- **数据加载成本**：与 Snowflake 相比，Databend 在数据加载方面实现了 **67% 的成本降低**。
- **查询执行成本**：Databend 的查询执行成本比 Snowflake 大约 **低 60%**。

:::info Note

对于此基准测试，未应用任何特殊调整。Snowflake 和 Databend Cloud 均使用其默认设置。
请记住，**不要只相信我们的话 - 我们鼓励您自己运行并验证这些结果。**
:::

### 数据加载基准测试

![Alt text](@site/static/img/documents/tpch1.png)

| Table            | Snowflake(695s, Cost $0.77) | Databend Cloud(446s, Cost $0.25) | Rows        |
| ---------------- | --------------------------- | -------------------------------- | ----------- |
| customer         | 18.137                      | 13.436                           | 15,000,000  |
| lineitem         | 477.740                     | 305.812                          | 600,037,902 |
| nation           | 1.347                       | 0.708                            | 25          |
| orders           | 103.088                     | 64.323                           | 150,000,000 |
| part             | 19.908                      | 12.192                           | 20,000,000  |
| partsupp         | 67.410                      | 45.346                           | 80,000,000  |
| region           | 0.743                       | 0.725                            | 5           |
| supplier         | 3.000                       | 3.687                            | 10,000,000  |
| **Total Time**   | **695s**                    | **446s**                         |             |
| **Total Cost**   | **$0.77**                   | **$0.25**                        |             |
| **Storage Size** | **20.8GB**                  | **24.5GB**                       |             |

### 查询基准测试：冷启动

![Alt text](@site/static/img/documents/tpch2.png)

| Query          | Snowflake(Total 207s, Cost $0.23) | Databend Cloud(Total 166s, Cost $0.09) |
| -------------- | --------------------------------- | -------------------------------------- |
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
| **Total Time** | **207s**                          | **166s**                               |
| **Total Cost** | **$0.23**                         | **$0.09**                              |

### 查询基准测试：热启动

![Alt text](@site/static/img/documents/tpch3.png)

| 查询       | Snowflake (总计 138s, 成本 $0.15) | Databend Cloud (总计 124s, 成本 $0.07) |
| ---------- | --------------------------------- | -------------------------------------- |
| TPC-H 1    | 8.934                             | 7.568                                  |
| TPC-H 2    | 3.018                             | 3.125                                  |
| TPC-H 3    | 6.089                             | 5.234                                  |
| TPC-H 4    | 4.914                             | 3.392                                  |
| TPC-H 5    | 5.800                             | 4.857                                  |
| TPC-H 6    | 0.891                             | 2.142                                  |
| TPC-H 7    | 5.381                             | 4.389                                  |
| TPC-H 8    | 5.724                             | 5.887                                  |
| TPC-H 9    | 10.283                            | 9.621                                  |
| TPC-H 10   | 10.368                            | 8.524                                  |
| TPC-H 11   | 1.165                             | 1.364                                  |
| TPC-H 12   | 7.052                             | 5.352                                  |
| TPC-H 13   | 12.829                            | 6.180                                  |
| TPC-H 14   | 3.288                             | 2.725                                  |
| TPC-H 15   | 3.475                             | 2.748                                  |
| TPC-H 16   | 4.094                             | 1.124                                  |
| TPC-H 17   | 4.203                             | 13.757                                 |
| TPC-H 18   | 18.583                            | 11.630                                 |
| TPC-H 19   | 3.888                             | 7.881                                  |
| TPC-H 20   | 6.379                             | 5.797                                  |
| TPC-H 21   | 10.287                            | 9.806                                  |
| TPC-H 22   | 1.573                             | 1.122                                  |
| **总时间** | **138s**                          | **124s**                               |
| **总成本** | **$0.15**                         | **$0.07**                              |

## 重现基准测试

您可以按照以下步骤重现基准测试。

### 基准测试环境

Snowflake 和 Databend Cloud 均在相似条件下进行了测试：

| 参数         | Snowflake                                                | Databend Cloud                            |
| ------------ | -------------------------------------------------------- | ----------------------------------------- |
| 计算集群大小 | Small                                                    | Small                                     |
| 价格         | [$4/小时](https://www.snowflake.com/en/pricing-options/) | [$2/小时](https://www.databend.com/plan/) |
| AWS 区域     | us-east-2                                                | us-east-2                                 |
| 存储         | AWS S3                                                   | AWS S3                                    |

- TPC-H SF100 数据集来源于 [Amazon Redshift](https://github.com/awslabs/amazon-redshift-utils/tree/master/src/CloudDataWarehouseBenchmark/Cloud-DWB-Derived-from-TPCH)，已加载到 Databend Cloud 和 Snowflake 中，未进行任何特定调整。

### 基准测试方法

我们对查询执行进行了冷启动和热启动两种方式：

1. **冷启动**: 在执行查询之前，数仓被暂停并恢复。
2. **热启动**: 数仓未被暂停，使用本地磁盘缓存。

### 前提条件

- 拥有一个 [Snowflake 账户](https://singup.snowflake.com)
- 创建一个 [Databend Cloud 账户](https://www.databend.com/apply/)。

### 数据加载

1. **Snowflake 数据加载**:

   - 登录您的 [Snowflake 账户](https://app.snowflake.com/)。
   - 创建与 TPC-H 模式对应的表。[SQL 脚本](https://github.com/databendlabs/wizard/blob/b34cc686d2e43c3e3b0b3311eac5a50e8f68afc9/benchsb/sql/snow/setup.sql#L1-L84)。
   - 使用 `COPY INTO` 命令从 AWS S3 加载数据。[SQL 脚本](https://github.com/databendlabs/wizard/blob/b34cc686d2e43c3e3b0b3311eac5a50e8f68afc9/benchsb/sql/snow/setup.sql#L87-L94)。

2. **Databend Cloud 数据加载**:
   - 登录您的 [Databend Cloud 账户](https://app.databend.com)。
   - 按照 TPC-H 模式创建必要的表。[SQL 脚本](https://github.com/databendlabs/wizard/blob/b34cc686d2e43c3e3b0b3311eac5a50e8f68afc9/benchsb/sql/bend/setup.sql#L1-L84)。
   - 使用类似于 Snowflake 的方法从 AWS S3 加载数据。[SQL 脚本](https://github.com/databendlabs/wizard/blob/b34cc686d2e43c3e3b0b3311eac5a50e8f68afc9/benchsb/sql/bend/setup.sql#L87-L117)。

### TPC-H 查询

1. **Snowflake 查询**:

   - 登录您的 [Snowflake 账户](https://app.snowflake.com/)。
   - 运行 TPC-H 查询。[SQL 脚本](https://github.com/databendlabs/wizard/blob/b34cc686d2e43c3e3b0b3311eac5a50e8f68afc9/benchsb/sql/snow/queries.sql)。

2. **Databend Cloud 查询**:
   - 登录您的 [Databend Cloud 账户](https://app.databend.com)。
   - 运行 TPC-H 查询。[SQL 脚本](https://github.com/databendlabs/wizard/blob/b34cc686d2e43c3e3b0b3311eac5a50e8f68afc9/benchsb/sql/bend/queries.sql)。
