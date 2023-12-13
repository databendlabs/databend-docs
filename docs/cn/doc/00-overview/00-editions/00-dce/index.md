---
title: Databend Community Edition
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import IndexOverviewList from '@site/src/components/IndexOverviewList';

Databend is an open-source, elastic, and workload-aware cloud data warehouse built in Rust, offering a cost-effective alternative to Snowflake. It's designed for complex analysis of the world's largest datasets.

<Tabs groupId="whydatabend">
<TabItem value="Performance" label="Performance">

- Blazing-fast data analytics on object storage.
- Leverages data-level parallelism and instruction-level parallelism technologies for [optimal performance](https://benchmark.clickhouse.com/).
- No indexes to build, no manual tuning, and no need to figure out partitions or shard data.

</TabItem>

<TabItem value="Data Manipulation" label="Data Manipulation">

- Supports atomic operations such as `SELECT`, `INSERT`, `DELETE`, `UPDATE`, `REPLACE`, `COPY`, and `MERGE`.
- Provides advanced features such as Time Travel and Multi Catalog (Apache Hive / Apache Iceberg).
- Supports [ingestion of semi-structured data](/doc/load-data/load) in various formats like CSV, JSON, and Parquet.
- Supports semi-structured data types such as [ARRAY, MAP, and JSON](/sql/sql-reference/data-types/).
- Supports Git-like MVCC storage for easy querying, cloning, and restoration of historical data.

</TabItem>

<TabItem value="Object Storage" label="Object Storage">

- Supports various object storage platforms. Click [here](../../../10-deploy/00-understanding-deployment-modes.md#supported-object-storage) to see a full list of supported platforms.
- Allows instant elasticity, enabling users to scale up or down based on their application needs.

</TabItem>
</Tabs>

Learn more about Databend Community Edition with the following topics:

<IndexOverviewList />