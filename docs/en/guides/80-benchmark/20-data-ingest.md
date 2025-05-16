---
title: "Databend vs. Snowflake: Data Ingestion Benchmark"
sidebar_label: "Data Ingestion Benchmark"
---

import DetailsWrap from '@site/src/components/DetailsWrap';

## Overview

We conducted four specific benchmarks to evaluate Databend Cloud versus Snowflake:

1. **TPC-H SF100 Dataset Loading**: Focuses on loading performance and cost for a large-scale dataset (100GB, ~600 million rows).
2. **ClickBench Hits Dataset Loading**: Tests efficiency in loading a wide-table dataset (76GB, ~100 million rows, 105 columns), emphasizing challenges associated with high column counts.
3. **1-Second Freshness**: Measures the platforms' ability to ingest data within a strict 1-second freshness requirement.
4. **5-Second Freshness**: Compares the platforms' data ingestion capabilities under a 5-second freshness constraint.

## Platforms

- **[Snowflake](https://snowflake.com)**: A well-known cloud data platform emphasizing scalable compute, data sharing.
- **[Databend Cloud](https://databend.com)**: A cloud-native data warehouse built on the open-source Databend project, focusing on scalability and cost-efficiency.

## Benchmark Conditions

Conducted on a `Small-Size` warehouse (16vCPU, AWS us-east-2) using data from the same S3 bucket.

## Performance and Cost Comparison

## Performance and Cost

- **TPC-H SF100 Data**: Databend Cloud offers a **67% cost reduction** over Snowflake.
- **ClickBench Hits Data**: Databend Cloud achieves a **91% cost reduction**.
- **1-Second Freshness**: Databend loads **400 times** more data than Snowflake.
- **5-Second Freshness**: Databend loads over **27 times** more data.

## Data Ingestion Benchmarks

![image](https://github.com/databendlabs/databend/assets/172204/c61d7a40-f6fe-4fb9-83e8-06ea9599aeb4)

### TPC-H SF100 Dataset

| Metric         | Snowflake | Databend Cloud | Description               |
| -------------- | --------- | -------------- | ------------------------- |
| **Total Time** | 695s      | 446s           | Time to load the dataset. |
| **Total Cost** | $0.77     | $0.25          | Cost of data loading.     |

- Data Volume: 100GB
- Rows: Approx. 600 million

### ClickBench Hits Dataset

| Metric         | Snowflake | Databend Cloud | Description               |
| -------------- | --------- | -------------- | ------------------------- |
| **Total Time** | 51m 17s   | 9m 58s         | Time to load the dataset. |
| **Total Cost** | $3.42     | $0.30          | Cost of data loading.     |

- Data Volume: 76GB
- Rows: Approx. 100 million
- Table Width: 105 columns

## Freshness Benchmarks

![image](https://github.com/databendlabs/databend/assets/172204/41b04e6a-9027-47bf-a749-49c267a7f9ec)

### 1-Second Freshness Benchmark

Evaluates the volume of data ingested within a 1-second freshness requirement.

| Metric         | Snowflake | Databend Cloud | Description                                     |
| -------------- | --------- | -------------- | ----------------------------------------------- |
| **Total Time** | 1s        | 1s             | Loading time frame.                             |
| **Total Rows** | 100 Rows  | 40,000 Rows    | Volume of data successfully ingested within 1s. |

### 5-Second Freshness Benchmark

Assesses the volume of data that can be ingested within a 5-second freshness requirement.

| Metric         | Snowflake   | Databend Cloud | Description                                     |
| -------------- | ----------- | -------------- | ----------------------------------------------- |
| **Total Time** | 5s          | 5s             | Loading time frame.                             |
| **Total Rows** | 90,000 Rows | 2,500,000 Rows | Volume of data successfully ingested within 5s. |

## Reproduce the Benchmark

You can reproduce the benchmark by following the steps below.

### Benchmark Environment

Both Snowflake and Databend Cloud was tested under similar conditions:

| Parameter      | Snowflake                                                           | Databend Cloud                            |
| -------------- | ------------------------------------------------------------------- | ----------------------------------------- |
| Warehouse Size | Small                                                               | Small                                     |
| vCPU           | 16                                                                  | 16                                        |
| Price          | [$4/hour](https://www.snowflake.com/en/pricing-options/) | [$2/hour](https://www.databend.com/plan/) |
| AWS Region     | us-east-2                                                           | us-east-2                                 |
| Storage        | AWS S3                                                              | AWS S3                                    |

- The TPC-H SF100 dataset, sourced from [Amazon Redshift](https://github.com/awslabs/amazon-redshift-utils/tree/master/src/CloudDataWarehouseBenchmark/Cloud-DWB-Derived-from-TPCH).
- The ClickBench dataset, sourced from [ClickBench](https://github.com/ClickHouse/ClickBench).

### Prerequisites

- Have a [Snowflake account](https://singup.snowflake.com)
- Create a [Databend Cloud account](https://www.databend.com/apply/).

### Data Ingestion Benchmark

The data ingestion benchmark can be reproduced using the following steps:

<DetailsWrap>

<details>
  <summary>TPC-H Data Loading</summary>

1. **Snowflake Data Load**:

   - Log into your [Snowflake account](https://app.snowflake.com/).
   - Create tables corresponding to the TPC-H schema. [SQL Script](https://github.com/databendlabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/snow/setup.sql#L1-L92).
   - Use the `COPY INTO` command to load the data from AWS S3. [SQL Script](https://github.com/databendlabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/snow/setup.sql#L95-L102).

2. **Databend Cloud Data Load**:
   - Sign in to your [Databend Cloud account](https://app.databend.com).
   - Create the necessary tables as per the TPC-H schema. [SQL Script](https://github.com/databendlabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/bend/setup.sql#L1-L92).
   - Utilize a similar method to Snowflake for loading data from AWS S3. [SQL Script](https://github.com/databendlabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/bend/setup.sql#L95-L133).

</details>

<details>
  <summary> ClickBench Hits Data Loading</summary>

1. **Snowflake Data Load**:

   - Log into your [Snowflake account](https://app.snowflake.com/).
   - Create tables corresponding to the `hits` schema. [SQL Script](https://gist.github.com/BohuTANG/2a23e5f829a8d180f7388c530526ab21?permalink_comment_id=4991762#file-hits-snowflake-schema).
   - Use the `COPY INTO` command to load the data from AWS S3. [SQL Script](https://gist.github.com/BohuTANG/2a23e5f829a8d180f7388c530526ab21?permalink_comment_id=4991762#gistcomment-4991762).

2. **Databend Cloud Data Load**:
   - Sign in to your [Databend Cloud account](https://app.databend.com).
   - Create the necessary tables as per the `hits` schema. [SQL Script](https://gist.github.com/BohuTANG/ab45d251c533dcf0b1ccd3ea1263b8a0#file-hits-databend-schema).
   - Utilize a similar method to Snowflake for loading data from AWS S3. [SQL Script](https://gist.github.com/BohuTANG/ab45d251c533dcf0b1ccd3ea1263b8a0?permalink_comment_id=4991767#gistcomment-4991767).

</details>

</DetailsWrap>

### Freshness Benchmark

Data generation and ingestion for the freshness benchmark can be reproduced using the following steps:

1. Create an [external stage](https://docs.databend.com/sql/sql-commands/ddl/stage/ddl-create-stage#example-2-create-external-stage-with-aws-access-key) in Databend Cloud

```sql
CREATE STAGE hits_unload_stage
URL = 's3://unload/files/'
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>',
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

2. Unload data to the external stage.

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

3. Load data from the external stage to the `hits` table.

```sql
COPY INTO hits
    FROM @hits_unload_stage
    PATTERN = '.*[.]tsv.gz'
    FILE_FORMAT = (TYPE = TSV,  COMPRESSION=auto);
```

4. Measure results from the dashboard.
