---
title: Databend Community
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
- Supports [ingestion of semi-structured data](/guides/load-data/load) in various formats like CSV, JSON, and Parquet.
- Supports semi-structured data types such as [ARRAY, MAP, and JSON](/sql/sql-reference/data-types/).
- Supports Git-like MVCC storage for easy querying, cloning, and restoration of historical data.

</TabItem>

<TabItem value="Object Storage" label="Object Storage">

- Supports various object storage platforms. Click [here](../../10-deploy/01-deploy/00-understanding-deployment-modes.md#supported-object-storage) to see a full list of supported platforms.
- Allows instant elasticity, enabling users to scale up or down based on their application needs.

</TabItem>
</Tabs>

Databend's high-level architecture is composed of a `meta-service layer`, a `query layer`, and a `storage layer`.

![Databend Architecture](https://github.com/databendlabs/databend/assets/172204/68b1adc6-0ec1-41d4-9e1d-37b80ce0e5ef)

<Tabs groupId="databendlay">
<TabItem value="Meta-Service Layer" label="Meta-Service Layer">

Databend efficiently supports multiple tenants through its meta-service layer, which plays a crucial role in the system:

- **Metadata Management**: Handles metadata for databases, tables, clusters, transactions, and more.
- **Security**: Manages user authentication and authorization for a secure environment.

Discover more about the meta-service layer in the [meta](https://github.com/databendlabs/databend/tree/main/src/meta) on GitHub.

</TabItem>
<TabItem value="Query Layer" label="Query Layer">

The query layer in Databend handles query computations and is composed of multiple clusters, each containing several nodes.
Each node, a core unit in the query layer, consists of:

- **Planner**: Develops execution plans for SQL statements using elements from [relational algebra](https://en.wikipedia.org/wiki/Relational_algebra), incorporating operators like Projection, Filter, and Limit.
- **Optimizer**: A rule-based optimizer applies predefined rules, such as "predicate pushdown" and "pruning of unused columns", for optimal query execution.
- **Processors**: Constructs a query execution pipeline based on planner instructions, following a Pull&Push approach. Processors are interconnected, forming a pipeline that can be distributed across nodes for enhanced performance.

Discover more about the query layer in the [query](https://github.com/databendlabs/databend/tree/main/src/query) directory on GitHub.

</TabItem>
<TabItem value="Storage Layer" label="Storage Layer">

Databend employs Parquet, an open-source columnar format, and introduces its own table format to boost query performance. Key features include:

- **Secondary Indexes**: Speeds up data location and access across various analysis dimensions.

- **Complex Data Type Indexes**: Aimed at accelerating data processing and analysis for intricate types such as semi-structured data.

- **Segments**: Databend effectively organizes data into segments, enhancing data management and retrieval efficiency.

- **Clustering**: Employs user-defined clustering keys within segments to streamline data scanning.

Discover more about the storage layer in the [storage](https://github.com/databendlabs/databend/tree/main/src/query/storages) on GitHub.

</TabItem>
</Tabs>
