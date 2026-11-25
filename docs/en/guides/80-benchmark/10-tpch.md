---
title: "TPC-H Benchmark: Databend Cloud vs. Snowflake"
sidebar_label: "TPC-H SF100 Benchmark"
toc_max_heading_level: 2
benchmark_card:
  title: Databend vs. Snowflake
  views:
    - tab: Time
      headline: 3.97×
      summary: faster cold run
      context: 22 queries · 100 GB · Small
      unit: s
      groups:
        - label: Cold run
          rows:
            - { label: Databend, value: 52, highlight: true }
            - { label: Snowflake, value: 207 }
        - label: Hot run
          rows:
            - { label: Databend, value: 41, highlight: true }
            - { label: Snowflake, value: 138 }
      note: Lower is better
    - tab: Cost
      headline: ~87%
      summary: lower query cost
      context: 22 queries · 100 GB · Small
      prefix: $
      decimals: 2
      groups:
        - label: Cold run
          rows:
            - { label: Databend, value: 0.03, highlight: true }
            - { label: Snowflake, value: 0.23 }
        - label: Hot run
          rows:
            - { label: Databend, value: 0.02, highlight: true }
            - { label: Snowflake, value: 0.15 }
        - label: Data loading
          rows:
            - { label: Databend, value: 0.25, highlight: true }
            - { label: Snowflake, value: 0.77 }
      note: Lower is better
---

import SignupCard from '@site/src/components/SignupCard';

## Quick Overview

### TPC-H

The TPC-H benchmark is a standard for evaluating decision support systems, focusing on complex queries and data maintenance. In this analysis, we compare Databend Cloud with Snowflake using the TPC-H SF100(SF1 = 6 Million Rows) dataset, encompassing 100GB of data and approximately 600 million rows across 22 queries.

:::info[Disclaimer]
The TPC Benchmark™ and TPC-H™ are trademarks of the Transaction Processing Performance Council ([TPC](http://www.tpc.org)). Our benchmark, while inspired by TPC-H, is not directly comparable to official TPC-H results.
:::

### Snowflake and Databend Cloud

- **[Snowflake](https://www.snowflake.com)**: Snowflake is renowned for its advanced features such as separating storage and compute, scalable computing on demand, data sharing, and cloning capabilities.

- **[Databend Cloud](https://www.databend.com)**: Databend Cloud offers [similar functionalities](https://github.com/databendlabs/databend/issues/13059) to Snowflake, being a cloud-native data warehouse that also separates storage from computing and provides scalable computing as needed.
  It is developed from the open-source [Databend project](https://github.com/databendlabs/databend), positioning itself as a modern, cost-effective alternative to Snowflake, especially for large-scale analytics.

## Performance and Cost Comparison

- **Data Loading Costs**: Databend achieves a **67% cost reduction** in data loading compared to Snowflake.
- **Query Execution Costs**: Databend approximately **87% less expensive** for query execution than Snowflake.

:::info[Note]

For this benchmark, no special tuning was applied. Both Snowflake and Databend Cloud were used with their default settings.
And remember, **don't just take our word for it — you're encouraged to run and verify these results yourself.**
:::

### Data Loading Benchmark

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

### Query Benchmark: Cold Run

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

### Query Benchmark: Hot Run

![Alt text](@site/static/img/documents/tpch3.png)

| Query          | Snowflake (Total 138s, Cost $0.15) | Databend Cloud (Total 41s, Cost $0.02) |
| -------------- | ---------------------------------- | -------------------------------------- |
| TPC-H 1        | 8.934                              | 2.240                                  |
| TPC-H 2        | 3.018                              | 0.416                                  |
| TPC-H 3        | 6.089                              | 1.678                                  |
| TPC-H 4        | 4.914                              | 0.878                                  |
| TPC-H 5        | 5.800                              | 2.427                                  |
| TPC-H 6        | 0.891                              | 0.734                                  |
| TPC-H 7        | 5.381                              | 2.587                                  |
| TPC-H 8        | 5.724                              | 2.555                                  |
| TPC-H 9        | 10.283                             | 4.556                                  |
| TPC-H 10       | 10.368                             | 2.445                                  |
| TPC-H 11       | 1.165                              | 0.411                                  |
| TPC-H 12       | 7.052                              | 1.152                                  |
| TPC-H 13       | 12.829                             | 2.735                                  |
| TPC-H 14       | 3.288                              | 1.197                                  |
| TPC-H 15       | 3.475                              | 1.339                                  |
| TPC-H 16       | 4.094                              | 0.455                                  |
| TPC-H 17       | 4.203                              | 2.179                                  |
| TPC-H 18       | 18.583                             | 2.477                                  |
| TPC-H 19       | 3.888                              | 1.631                                  |
| TPC-H 20       | 6.379                              | 2.394                                  |
| TPC-H 21       | 10.287                             | 4.442                                  |
| TPC-H 22       | 1.573                              | 0.504                                  |
| **Total Time** | **138s**                           | **41s**                                |
| **Total Cost** | **$0.15**                          | **$0.02**                              |

## Reproduce the Benchmark

You can reproduce the benchmark by following the steps below.

### Benchmark Environment

Both Snowflake and Databend Cloud was tested under similar conditions:

| Parameter      | Snowflake                                                | Databend Cloud                            |
| -------------- | -------------------------------------------------------- | ----------------------------------------- |
| Warehouse Size | Small                                                    | Small                                     |
| Price          | [$4/hour](https://www.snowflake.com/en/pricing-options/) | [$2/hour](https://www.databend.com/plan/) |
| AWS Region     | us-east-2                                                | us-east-2                                 |
| Storage        | AWS S3                                                   | AWS S3                                    |

- The TPC-H SF100 dataset, sourced from [Amazon Redshift](https://github.com/awslabs/amazon-redshift-utils/tree/master/src/CloudDataWarehouseBenchmark/Cloud-DWB-Derived-from-TPCH), was loaded into both Databend Cloud and Snowflake without any specific tuning.

### Benchmark Methodology

We conducted both Cold and Hot runs for query execution:

1. **Cold Run**: The data warehouse was suspended and resumed before executing the queries.
2. **Hot Run**: The data warehouse is not suspended, local disk cache is used.

### Prerequisites

- Have a [Snowflake account](https://singup.snowflake.com)
- Create a [Databend Cloud account](https://app.databend.com/register/)

### Data Loading

1. **Snowflake Data Load**:

   - Log into your [Snowflake account](https://app.snowflake.com/).
   - Create tables corresponding to the TPC-H schema. [SQL Script](https://github.com/databendlabs/benchmarks/blob/main/tpch-100/snowflake/setup.sql).
   - Use the `COPY INTO` command to load the data from AWS S3. [SQL Script](https://github.com/databendlabs/benchmarks/blob/main/tpch-100/snowflake/setup.sql).

2. **Databend Cloud Data Load**:
   - Sign in to your [Databend Cloud account](https://app.databend.com).
   - Create the necessary tables as per the TPC-H schema. [SQL Script](https://github.com/databendlabs/benchmarks/blob/main/tpch-100/databend/setup.sql).
   - Utilize a similar method to Snowflake for loading data from AWS S3. [SQL Script](https://github.com/databendlabs/benchmarks/blob/main/tpch-100/databend/setup.sql).

### TPC-H Queries

1. **Snowflake Queries**:

   - Log into your [Snowflake account](https://app.snowflake.com/).
   - Run the TPC-H queries. [SQL Script](https://github.com/databendlabs/benchmarks/blob/main/tpch-100/snowflake/queries.sql).

2. **Databend Cloud Queries**:
   - Sign in to your [Databend Cloud account](https://app.databend.com).
   - Run the TPC-H queries. [SQL Script](https://github.com/databendlabs/benchmarks/blob/main/tpch-100/databend/queries.sql).

<SignupCard title="Run your queries on Databend Cloud" />
