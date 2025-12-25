---
title: Databend Products
slug: /
---

import DocsOverview from '@site/src/components/DocsOverview'
import Speaker from '@site/src/components/Speaker'

Welcome to the Databend (pronounced as /ˈdeɪtəˌbɛnd/)<Speaker /> documentation.

[**Databend**](https://github.com/databendlabs/databend) is an open-source, cloud-native data warehouse built in Rust and fully based on object storage, evolved from a single analytics engine into a unified multimodal database. With a unified optimizer, compute, and storage engine, it supports **BI Analytics**, **AI Vectors**, **Full-Text Search**, and **Geospatial Analysis** on one platform through Snowflake-compatible SQL, and enables real-time data ingestion, transformation, and analysis via Stream + Task.


<DocsOverview />

**Here are some entries you might want to learn about**

**Getting Started**

- **[Quick Start](/guides/self-hosted/quickstart)**: Launch Databend with Docker and load sample data fast.
- **[Databend Cloud](/guides/cloud)**: Spin up serverless warehouses and manage your organization.
- **[Connect to Databend](/guides/connect)**: Connect with various SQL clients and programming languages.
- **[SQL Reference](/sql)**: Browse Databend SQL commands, functions, and syntax.

**Data Processing**

- **[Data Loading](/guides/load-data)**: Import data from various sources into Databend.
- **[Data Unloading](/guides/unload-data)**: Export data from Databend to different formats.
- **[Semi-Structured Data](/sql/sql-functions/semi-structured-functions)**: Process JSON, arrays, and nested data with VARIANT type.

**Unified Workloads**

- **[SQL Analytics Guide](/guides/query/sql-analytics)**: Shared session tables for analytics, search, vector, and geo workloads.
- **[JSON & Search Guide](/guides/query/json-search)**: Query VARIANT payloads with inverted indexes and Elasticsearch-style `QUERY`.
- **[Vector Database Guide](/guides/query/vector-db)**: Store embeddings and run semantic similarity inside Databend.
- **[Geo Analytics Guide](/guides/query/geo-analytics)**: Map incidents with geospatial SQL for real-time insights.
- **[Lakehouse ETL Guide](/guides/query/lakehouse-etl)**: Stream object storage files into managed tables without silos.

**Performance & Scale**

- **[Performance Optimization](/guides/performance)**: Enhance query performance with various strategies.
- **[Benchmarks](/guides/benchmark)**: Compare Databend performance with other data warehouses.
- **[Data Lakehouse](/sql/sql-reference/table-engines)**: Seamless integration with Hive, Iceberg, and Delta Lake.

**Community & Support**

- **[Join Slack](https://link.databend.com/join-slack)**: Chat with the Databend community and core engineers.
- **[Docs Issues](https://github.com/databendlabs/databend-docs/issues)**: Report problems or request new coverage.
- **[Roadmap](https://github.com/databendlabs/databend/issues/14167)**: Track upcoming features and share feedback.
- **[Email Us](mailto:hi@databend.com)**: Reach the team directly when you need help.
