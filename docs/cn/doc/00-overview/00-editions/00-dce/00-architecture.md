---
title: Databend Architecture
sidebar_label: Architecture
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Databend's high-level architecture is composed of a `meta-service layer`, a `query layer`, and a `storage layer`.

![Databend Architecture](https://github.com/datafuselabs/databend/assets/172204/68b1adc6-0ec1-41d4-9e1d-37b80ce0e5ef)

<Tabs groupId="databendlay">
<TabItem value="Meta-Service Layer" label="Meta-Service Layer">

Databend efficiently supports multiple tenants through its meta-service layer, which plays a crucial role in the system:

- **Metadata Management**: Handles metadata for databases, tables, clusters, transactions, and more.
- **Security**: Manages user authentication and authorization for a secure environment.

Discover more about the meta-service layer in the [meta](https://github.com/datafuselabs/databend/tree/main/src/meta) on GitHub.

</TabItem>
<TabItem value="Query Layer" label="Query Layer">

The query layer in Databend handles query computations and is composed of multiple clusters, each containing several nodes.
Each node, a core unit in the query layer, consists of:
- **Planner**: Develops execution plans for SQL statements using elements from [relational algebra](https://en.wikipedia.org/wiki/Relational_algebra), incorporating operators like Projection, Filter, and Limit.
- **Optimizer**: A rule-based optimizer applies predefined rules, such as "predicate pushdown" and "pruning of unused columns", for optimal query execution.
- **Processors**: Constructs a query execution pipeline based on planner instructions, following a Pull&Push approach. Processors are interconnected, forming a pipeline that can be distributed across nodes for enhanced performance.

Discover more about the query layer in the [query](https://github.com/datafuselabs/databend/tree/main/src/query) directory on GitHub.

</TabItem>
<TabItem value="Storage Layer" label="Storage Layer">

Databend employs Parquet, an open-source columnar format, and introduces its own table format to boost query performance. Key features include:

- **Secondary Indexes**: Speeds up data location and access across various analysis dimensions.
 
- **Complex Data Type Indexes**: Aimed at accelerating data processing and analysis for intricate types such as semi-structured data.

- **Segments**: Databend effectively organizes data into segments, enhancing data management and retrieval efficiency.

- **Clustering**: Employs user-defined clustering keys within segments to streamline data scanning.

Discover more about the storage layer in the [storage](https://github.com/datafuselabs/databend/tree/main/src/query/storages) on GitHub.


</TabItem>
</Tabs>