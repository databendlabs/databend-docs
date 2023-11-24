---
title: Release Notes
sidebar_position: 1
sidebar_label: Databend Cloud
slug: '/'
---

This page provides information about recent features, enhancements, and bug fixes for [Databend Cloud](https://app.databend.com/).

## Oct 30, 2023

### New Features

- Upgraded databend-query to v1.2.184-nightly:
  - MERGE INTO now supports automatic reclustering and compaction.
  - SQLsmith now covers DELETE, UPDATE, ALTER TABLE, CAST, and MERGE INTO.
  - Added a new system function FUSE_ENCODING.
  - Added semi-structured data processing functions JSON_EACH and JSON_ARRAY_ELEMENTS.
  - Added date & time functions TO_WEEK_OF_YEAR and DATE_PART.
- Added support for User-Defined Functions (UDFs).

## Sep 13, 2023

### New Features

- Upgraded databend-query to v1.2.109-nightly:
  - Added support for GROUP BY ALL.
  - Introduced masking policies.
  - Added support for distributed REPLACE INTO.
  - Added support for Hash Join spill.
  - Added initial support for the DAC privilege model.
  - Improved performance of Inner Join.
  - Improved Common Table Expressions (CTEs) performance through materialization.
  - Columns in Databend are now nullable by default.
- Databend Cloud is now on [AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-6dvshjlbds7b6).
- Introduced [databend-kafka-connect](https://github.com/databendcloud/databend-kafka-connect) for seamless data ingestion from Kafka.

## July 25, 2023

### New Features

- Upgraded databend-query to v1.2.31-nightly:
  - Added support for creating Bloom Indexes for specified columns.
  - Added basic read support for Iceberg table.
  - Added support for distributed COPY INTO.
  - Enhanced system.query_profile with additional execution information, facilitating query profiling.
- Introduced [debezium-server-databend](https://github.com/databendcloud/debezium-server-databend), enabling CDC stream ingestion from RDBMS like MySQL/Postgres into Databend.

## Jun 30, 2023

### New Features

- Upgraded databend-query to v1.2.0-nightly:
  - You can now utilize the Flink CDC connector to load data from other databases in real-time.
  - Added support for renaming a column with `ALTER TABLE [ IF EXISTS ] <name> RENAME COLUMN <col_name> TO <new_col_name>`.
  - Added support for using column position when querying CSV and TSV files.
  - Added HTTP query deduplication via `X-DATABEND-DEDUPLICATE-LABEL` header.
  - Added support for distributed deletion.

### Bug Fixes

- Fixed stability issues with storage usage statistics.

## Jun 6, 2023

### New Features

- Upgraded databend-query to v1.1.54-nightly:
  - Added support for Virtual Columns.
  - Added support for adding expressions to a window function.
  - Added support for setting a deduplicate_label in INSERT, UPDATE, and REPLACE operaitons.
  - Added support for setting optimization hints in COPY INTO.
  - Added native support for COS.
  - Added support for IEJoin.
- Enhanced SQL hints in worksheet using the Azure OpenAI service.

## May 23, 2023

### New Features

- Upgraded databend-query to v1.1.40-nightly:
  - Introduced the VACUUM TABLE command to optimize system performance by freeing up storage space and permanently removing historical data files from a table.
  - Added support for Computed Columns generated through scalar expressions from other columns.
  - Added support for replacing with stage attachment.
  - Introduced new bitmap functions: `bitmap_contains`, `bitmap_has_all`, `bitmap_has_any`, `bitmap_or`, `bitmap_and`, `bitmap_xor`, and more.
- Added the ability to integrate with Tableau.
- Added support for filtering files using regex patterns when creating a pipe.
- Added support for modifying the size and auto-suspend time of a warehouse.

## May 15, 2023

### New Features

- Upgraded databend-query to v1.1.30-nightly:
  - Added bitmap functions: bitmap_count and build_bitmap.
  - Optimizer now supports constant folding.
  - Improved Hash Join performance with a new Hash table design.
- Now the worksheets can be viewed and managed as tabs.

## April 25, 2023

### New Features

- Upgraded databend-query to v1.1.7-nightly:
  - REPLACE INTO can now handle tables that have a cluster key.
  - Introduced the array_aggregate function and other array aggregate functions like std, median.
  - Introduced the window function percent_rank.
- Upgraded BendSQL to provide improved SQL keyword highlights and auto completion.

### Bug Fixes

- Fixed an issue where the default database was not available on the data loading page .

## April 12, 2023

### New Features

- Upgraded databend-query to v1.0.60-nightly:
  - Introduced Eager Aggregation to improve data grouping and joining performance.
  - Passed ALL TPC-DS queries.
  - New aggregation functions: QUANTILE_DISC, KURTOSIS, SKEWNESS.
- New Integrations:
  - Automatic data loading via Apache DolphinScheduler.

## April 04, 2023

### New Features

- Upgraded databend-query to v1.0.43-nightly:
  - New query syntax: PIVOT, UNPIVOT, GROUP BY CUBE, and ROLLUP.
  - Introduced [AI functions](/sql/sql-functions/ai-functions/): Turns Databend Cloud into an intelligent data store, allowing you to unlock deeper insights and extract more value from your data.
  - Introduced window functions.
- New Integrations:
  - [DBeaver](/doc/sql-clients/jdbc): Enables you to connect to Databend Cloud using the desktop application for a more seamless experience.
  - [Redash](/doc/visualize/redash): Enables you to produce beautiful visualizations of your data, facilitating analysis and presentation.

### Bug Fixes

- Improved the stability of warehouse auto-suspending: Warehouses can now be suspended as intended.

## March 21, 2023

### New Features

- Introduced a native [integration with Metabase](https://github.com/databendcloud/metabase-databend-driver): You can now connect to Metabase and create beautiful data visualizations or reports.
- Upgraded databend-query to 1.0.26-nightly:
  - Allowed data transformation when loading data with COPY INTO.
  - Introduced the function ai_to_sql() that converts your natural language instructions to SQL queries.

### Enhancements

- Added a `purge` option for creating a pipeline, allowing automatic purging of ingested files.
- Enhanced the ability to collect real-time data on the usage of warehouses and the size of table storage.
- Optimized the UI prompts for expired plans.

## March 14, 2023

### New Features

- Upgraded databend-query to v1.0.15-nightly:
  - Improved COPY performance when dealing with large amounts of data files.
  - Added support for REPLACE statement which allows for more efficient data manipulation.
  - Added support for Map type with built-in BloomFilter index which allows for more efficient data retrieval and querying.
- Added AWS us-west-2 region.

### Enhancement

- Enlarge the member limit of organization to 5 by default.
- Improved the billing page for better usability.

## March 07, 2023

### New Features

- Introduced new tools:
  - [Flink databend connector](https://github.com/databendcloud/flink-connector-databend): allows Databend to be connected to Flink applications.
  - [bend-ingest-kafka](https://github.com/databendcloud/bend-ingest-kafka) enables ingestion of data from Kafka.
- Upgraded databend-query to v1.0.4-nightly:
  - Added support for the decimal data type.
  - Added support for data block cache and query result cache.
  - Optimized memory usage for GROUP BY.
  - Performance improvements.

### Enhancements

- Pipe now includes a region option and supports regular full-turn polling reset.

### Bug Fixes

- No longer starts a warehouse automatically when a new tenant is created.
