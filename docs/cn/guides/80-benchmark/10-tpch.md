---
title: "TPC-H 基准测试：Databend Cloud vs. Snowflake"
sidebar_label: "TPC-H SF100 基准测试"
toc_max_heading_level: 2
benchmark_card:
  title: Databend vs. Snowflake
  views:
    - tab: 耗时
      headline: 3.97×
      summary: 冷启动查询速度
      context: 22 条查询 · 100 GB · Small 规格
      unit: 秒
      groups:
        - label: 冷启动
          rows:
            - { label: Databend, value: 52, highlight: true }
            - { label: Snowflake, value: 207 }
        - label: 热启动
          rows:
            - { label: Databend, value: 41, highlight: true }
            - { label: Snowflake, value: 138 }
      note: 耗时越短越好
    - tab: 成本
      headline: ~87%
      summary: 查询成本节省
      context: 22 条查询 · 100 GB · Small 规格
      prefix: $
      decimals: 2
      groups:
        - label: 冷启动
          rows:
            - { label: Databend, value: 0.03, highlight: true }
            - { label: Snowflake, value: 0.23 }
        - label: 热启动
          rows:
            - { label: Databend, value: 0.02, highlight: true }
            - { label: Snowflake, value: 0.15 }
        - label: 数据加载
          rows:
            - { label: Databend, value: 0.25, highlight: true }
            - { label: Snowflake, value: 0.77 }
      note: 成本越低越好
---

import SignupCard from '@site/src/components/SignupCard';

## 快速概览

### TPC-H

TPC-H 基准测试是评估决策支持系统的标准，侧重于复杂的查询和数据维护。在此分析中，我们使用 TPC-H SF100（SF1 = 6 百万行）数据集比较 Databend Cloud 和 Snowflake，该数据集包含 100GB 的数据和大约 6 亿行，涵盖 22 个查询。

:::info[Disclaimer]
TPC Benchmark™ 和 TPC-H™ 是事务处理性能委员会 ([TPC](http://www.tpc.org)) 的商标。我们的基准测试虽然受到 TPC-H 的启发，但与官方 TPC-H 结果不具有直接可比性。
:::

### Snowflake 和 Databend Cloud

- **[Snowflake](https://www.snowflake.com)**: Snowflake 以其先进的功能而闻名，例如存储和计算分离、按需扩展计算、数据共享和克隆功能。

- **[Databend Cloud](https://www.databend.com)**: Databend Cloud 提供与 Snowflake [类似的功能](https://github.com/databendlabs/databend/issues/13059)，作为一个云原生数仓，它也将存储与计算分离，并根据需要提供可扩展的计算。
  它由开源 [Databend 项目](https://github.com/databendlabs/databend) 开发而来，定位于 Snowflake 的现代、经济高效的替代方案，尤其适用于大规模分析。

## 性能和成本比较

- **数据加载成本**：与 Snowflake 相比，Databend 在数据加载方面实现了 **67% 的成本降低**。
- **查询执行成本**：Databend 的查询执行成本比 Snowflake 大约 **低 87%**。

:::info[Note]

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

| Query          | Snowflake(Total 207s, Cost $0.23) | Databend Cloud(Total 52s, Cost $0.03) |
| -------------- | --------------------------------- | ------------------------------------- |
| TPC-H 1        | 11.703                            | 3.368                                 |
| TPC-H 2        | 4.524                             | 1.621                                 |
| TPC-H 3        | 8.908                             | 2.847                                 |
| TPC-H 4        | 8.108                             | 2.062                                 |
| TPC-H 5        | 9.202                             | 2.989                                 |
| TPC-H 6        | 1.237                             | 0.760                                 |
| TPC-H 7        | 9.082                             | 2.658                                 |
| TPC-H 8        | 10.886                            | 3.065                                 |
| TPC-H 9        | 18.152                            | 4.882                                 |
| TPC-H 10       | 13.525                            | 4.278                                 |
| TPC-H 11       | 2.582                             | 0.611                                 |
| TPC-H 12       | 10.099                            | 1.449                                 |
| TPC-H 13       | 13.458                            | 3.342                                 |
| TPC-H 14       | 8.001                             | 1.244                                 |
| TPC-H 15       | 8.737                             | 1.356                                 |
| TPC-H 16       | 4.864                             | 0.604                                 |
| TPC-H 17       | 5.363                             | 2.446                                 |
| TPC-H 18       | 19.971                            | 2.660                                 |
| TPC-H 19       | 9.893                             | 2.014                                 |
| TPC-H 20       | 8.538                             | 2.417                                 |
| TPC-H 21       | 16.439                            | 4.977                                 |
| TPC-H 22       | 3.744                             | 0.536                                 |
| **Total Time** | **207s**                          | **52s**                               |
| **Total Cost** | **$0.23**                         | **$0.03**                             |

### 查询基准测试：热启动

![Alt text](@site/static/img/documents/tpch3.png)

| 查询       | Snowflake (总计 138s, 成本 $0.15) | Databend Cloud (总计 41s, 成本 $0.02) |
| ---------- | --------------------------------- | ------------------------------------- |
| TPC-H 1    | 8.934                             | 2.240                                 |
| TPC-H 2    | 3.018                             | 0.416                                 |
| TPC-H 3    | 6.089                             | 1.678                                 |
| TPC-H 4    | 4.914                             | 0.878                                 |
| TPC-H 5    | 5.800                             | 2.427                                 |
| TPC-H 6    | 0.891                             | 0.734                                 |
| TPC-H 7    | 5.381                             | 2.587                                 |
| TPC-H 8    | 5.724                             | 2.555                                 |
| TPC-H 9    | 10.283                            | 4.556                                 |
| TPC-H 10   | 10.368                            | 2.445                                 |
| TPC-H 11   | 1.165                             | 0.411                                 |
| TPC-H 12   | 7.052                             | 1.152                                 |
| TPC-H 13   | 12.829                            | 2.735                                 |
| TPC-H 14   | 3.288                             | 1.197                                 |
| TPC-H 15   | 3.475                             | 1.339                                 |
| TPC-H 16   | 4.094                             | 0.455                                 |
| TPC-H 17   | 4.203                             | 2.179                                 |
| TPC-H 18   | 18.583                            | 2.477                                 |
| TPC-H 19   | 3.888                             | 1.631                                 |
| TPC-H 20   | 6.379                             | 2.394                                 |
| TPC-H 21   | 10.287                            | 4.442                                 |
| TPC-H 22   | 1.573                             | 0.504                                 |
| **总时间** | **138s**                          | **41s**                               |
| **总成本** | **$0.15**                         | **$0.02**                             |

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
- 创建一个 [Databend Cloud 账户](https://app.databend.cn/register/)

### 数据加载

1. **Snowflake 数据加载**:

   - 登录您的 [Snowflake 账户](https://app.snowflake.com/)。
   - 创建与 TPC-H 模式对应的表。[SQL 脚本](https://github.com/databendlabs/benchmarks/blob/main/tpch-100/snowflake/setup.sql)。
   - 使用 `COPY INTO` 命令从 AWS S3 加载数据。[SQL 脚本](https://github.com/databendlabs/benchmarks/blob/main/tpch-100/snowflake/setup.sql)。

2. **Databend Cloud 数据加载**:
   - 登录您的 [Databend Cloud 账户](https://app.databend.com)。
   - 按照 TPC-H 模式创建必要的表。[SQL 脚本](https://github.com/databendlabs/benchmarks/blob/main/tpch-100/databend/setup.sql)。
   - 使用类似于 Snowflake 的方法从 AWS S3 加载数据。[SQL 脚本](https://github.com/databendlabs/benchmarks/blob/main/tpch-100/databend/setup.sql)。

### TPC-H 查询

1. **Snowflake 查询**:

   - 登录您的 [Snowflake 账户](https://app.snowflake.com/)。
   - 运行 TPC-H 查询。[SQL 脚本](https://github.com/databendlabs/benchmarks/blob/main/tpch-100/snowflake/queries.sql)。

2. **Databend Cloud 查询**:
   - 登录您的 [Databend Cloud 账户](https://app.databend.com)。
   - 运行 TPC-H 查询。[SQL 脚本](https://github.com/databendlabs/benchmarks/blob/main/tpch-100/databend/queries.sql)。

<SignupCard title="在 Databend Cloud 上运行您的查询" />
