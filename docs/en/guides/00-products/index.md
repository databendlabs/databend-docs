---
title: Databend Products
slug: /
---

import DocsOverview from '@site/src/components/DocsOverview'
import Speaker from '@site/src/components/Speaker'
import LanguageDocs from '@site/src/components/LanguageDocs';

Welcome to the Databend (pronounced as /ˈdeɪtəˌbɛnd/)<Speaker /> documentation.
<LanguageDocs
cn=
'

**Databend** —— ANY DATA. ANY SCALE. ONE DATABASE.

内置存储、向量、分析、搜索与地理空间引擎共享一套 Snowflake 兼容 SQL 接口，让团队可以存任何数据、查任何内容、驱动语义工作负载，并实时交付洞察而无需搬运数据。

无论是 Databend Cloud、Docker 自托管还是 `pip install databend`，统一引擎都直接运行在你的对象存储之上。

'
en=
'

**Databend** — **ANY DATA. ANY SCALE. ONE DATABASE.**

**Open-source** datastore, vector, analytics, search, and geospatial engines converge on one **Snowflake-compatible SQL surface** so teams store anything, search everything, power semantic workloads, and deliver real-time insights without moving data.

Explore the engine on [**GitHub**](https://github.com/databendlabs/databend). Launch in Databend Cloud, `docker run`, or `pip install databend`—every option runs the same unified engine on your object store.

'/>

<DocsOverview />

**Here are some entries you might want to learn about**

**Getting Started**
- **[Quick Start](/guides/deploy/quickstart)**: Launch Databend with Docker and load sample data fast.
- **[Databend Cloud](/guides/cloud)**: Spin up serverless warehouses and manage your organization.
- **[Connect to Databend](/guides/sql-clients)**: Connect with various SQL clients and programming languages.
- **[SQL Reference](/sql)**: Browse Databend SQL commands, functions, and syntax.

**Data Processing**
- **[Data Loading](/guides/load-data)**: Import data from various sources into Databend.
- **[Data Unloading](/guides/unload-data)**: Export data from Databend to different formats.
- **[Semi-Structured Data](/sql/sql-functions/semi-structured-functions)**: Process JSON, arrays, and nested data with VARIANT type.

**Unified Workloads**
- **[SQL Analytics Guide](/guides/query/sql-analytics)**: Shared session tables for analytics, search, vector, and geo workloads.
- **[JSON & Search Guide](/guides/query/json-search)**: Query VARIANT payloads with inverted indexes and Lucene-style `QUERY`.
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
