---
title: "Databend vs. Snowflake: Data Ingestion Benchmark"
sidebar_label: "Ingestion Benchmark"
---

## Overview

This benchmark assesses the data ingestion capabilities of Databend Cloud and Snowflake, emphasizing performance and cost-efficiency. Efficient data ingestion enables faster data loading for quicker analysis. This analysis includes loading two distinct datasets and examining their performance under 1-second and 5-second data freshness scenarios.

### Key Comparisons

- **TPC-H SF100 Dataset Ingestion**: Measures time and cost for loading the TPC-H SF100 dataset, with 100GB of data and approximately 600 million rows, into both platforms.
- **ClickBench Hits Dataset Ingestion**: Evaluates the efficiency of ingesting the ClickBench Hits dataset, containing 76GB of data, about 100 million rows, and a table width of 105 columns, into each data warehouse.
- **1-Second Data Freshness Challenge**: Compares the ability of both platforms to ingest data with a 1-second freshness requirement, focusing on the volume of data ingested within this constraint.
- **5-Second Data Freshness Challenge**: Compares the ability of both platforms to ingest data with a 5-second freshness requirement, detailing the volume of data that can be ingested within this time frame.

### Platform Overview

- **[Snowflake](https://www.snowflake.com)**: A leading cloud data platform known for scalable compute and storage separation, on-demand computing, data sharing, and cloning.
- **[Databend Cloud](https://www.databend.com)**: A cloud-native data warehouse offering functionalities similar to Snowflake, based on the open-source [Databend project](https://github.com/datafuselabs/databend), and focusing on scalability, cost-efficiency, and high-performance analytics.

:::info

Benchmarks were conducted on a `Small-Size` warehouse configuration (16vCPU) in the AWS us-east-2 region, loading data from the same S3 bucket.

:::

## Performance and Cost Comparison

- **TPC-H Data Loading Costs**: Databend Cloud achieves a **67% cost reduction** compared to Snowflake.
- **Hits Data (Width-Column) Loading Costs**: Databend Cloud achieves a **91% cost reduction** compared to Snowflake for data loading.
- **1 Second Data Freshness**: Databend Cloud significantly outperforms Snowflake, loading **400 times** more data within a 1-second freshness period.
- **5 Second Data Freshness**: Databend Cloud outperforms Snowflake by loading **over 27 times** more data within a 5-second freshness period.

## Data Ingestion Benchmarks

![image](https://github.com/datafuselabs/databend/assets/172204/530317ec-c895-492a-8403-f7b8694b02f2)

### TPC-H SF100 Dataset

| Metric           | Snowflake | Databend Cloud | Description               |
|------------------|-----------|----------------|---------------------------|
| **Total Time**   | 695s      | 446s           | Time to load the dataset. |
| **Total Cost**   | $0.77     | $0.25          | Cost of data loading.     |

- Data Volume: 100GB
- Rows: Approx. 600 million

### ClickBench Hits Dataset

| Metric           | Snowflake | Databend Cloud | Description               |
|------------------|-----------|----------------|---------------------------|
| **Total Time**   | 51m 17s   | 9m 58s         | Time to load the dataset. |
| **Total Cost**   | $3.42     | $0.30          | Cost of data loading.     |

- Data Volume: 76GB
- Rows: Approx. 100 million
- Table Width: 105 columns


## Freshness Benchmarks

![image](https://github.com/datafuselabs/databend/assets/172204/41b04e6a-9027-47bf-a749-49c267a7f9ec)

### 1-Second Freshness Benchmark

Evaluates the volume of data ingested within a 1-second freshness requirement.

| Metric         | Snowflake | Databend Cloud | Description                                      |
|----------------|-----------|----------------|--------------------------------------------------|
| **Total Time** | 1s        | 1s             | Loading time frame.                              |
| **Total Rows** | 100 Rows  | 40,000 Rows    | Volume of data successfully ingested within 1s.  |

### 5-Second Freshness Benchmark

Assesses the volume of data that can be ingested within a 5-second freshness requirement.

| Metric         | Snowflake   | Databend Cloud | Description                                     |
|----------------|-------------|----------------|-------------------------------------------------|
| **Total Time** | 5s          | 5s             | Loading time frame.                             |
| **Total Rows** | 90,000 Rows | 2,500,000 Rows | Volume of data successfully ingested within 5s. |


## Reproduce the Benchmark

You can reproduce the benchmark by following the steps below.

### Benchmark Environment

Both Snowflake and Databend Cloud was tested under similar conditions:

| Parameter      | Snowflake                                                                | Databend Cloud                            |
|----------------|--------------------------------------------------------------------------|-------------------------------------------|
| Warehouse Size | Small                                                                    | Small                                     |
| vCPU           | 16                                                                       | 16                                        |
| Price          | [$4/hour](https://www.snowflake.com/en/data-cloud/pricing-options/)      | [$2/hour](https://www.databend.com/plan/) |
| AWS Region     | us-east-2                                                                | us-east-2                                 |
| Storage        | AWS S3                                                                   | AWS S3                                    |

- The TPC-H SF100 dataset, sourced from [Amazon Redshift](https://github.com/awslabs/amazon-redshift-utils/tree/master/src/CloudDataWarehouseBenchmark/Cloud-DWB-Derived-from-TPCH), was loaded into both Databend Cloud and Snowflake without any specific tuning.

### Prerequisites

- Have a [Snowflake account](https://singup.snowflake.com)
- Create a [Databend Cloud account](https://www.databend.com/apply/).

### TPC-H Data Loading

1. **Snowflake Data Load**:
    - Log into your [Snowflake account](https://app.snowflake.com/).
    - Create tables corresponding to the TPC-H schema. [SQL Script](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/snow/setup.sql#L1-L92).
    - Use the `COPY INTO` command to load the data from AWS S3. [SQL Script](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/snow/setup.sql#L95-L102).

2. **Databend Cloud Data Load**:
    - Sign in to your [Databend Cloud account](https://app.databend.com).
    - Create the necessary tables as per the TPC-H schema. [SQL Script](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/bend/setup.sql#L1-L92).
    - Utilize a similar method to Snowflake for loading data from AWS S3. [SQL Script](https://github.com/datafuselabs/wizard/blob/ee9b72a11ac5d977f9a81d17fa34eb47a02ef2ba/benchsb/sql/bend/setup.sql#L95-L133).

### ClickBench Hits Data Loading

1. **Snowflake Data Load**:
    - Log into your [Snowflake account](https://app.snowflake.com/).
   - Create tables corresponding to the `hits` schema. [SQL Script](https://gist.github.com/BohuTANG/2a23e5f829a8d180f7388c530526ab21?permalink_comment_id=4991762#file-hits-snowflake-schema).
    - Use the `COPY INTO` command to load the data from AWS S3. [SQL Script](https://gist.github.com/BohuTANG/2a23e5f829a8d180f7388c530526ab21?permalink_comment_id=4991762#gistcomment-4991762).

2. **Databend Cloud Data Load**:
    - Sign in to your [Databend Cloud account](https://app.databend.com).
    - Create the necessary tables as per the `hits` schema. [SQL Script](https://gist.github.com/BohuTANG/ab45d251c533dcf0b1ccd3ea1263b8a0#file-hits-databend-schema).
    - Utilize a similar method to Snowflake for loading data from AWS S3. [SQL Script](https://gist.github.com/BohuTANG/ab45d251c533dcf0b1ccd3ea1263b8a0?permalink_comment_id=4991767#gistcomment-4991767).


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

