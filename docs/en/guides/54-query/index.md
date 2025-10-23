---
title: Unified Workloads
---

Databend now serves as a unified engine for SQL analytics, multimodal search, vector similarity, geospatial analysis, and continuous ETL. This mini-series uses the **EverDrive Smart Vision** scenario (session IDs such as `SES-20240801-SEA01`, frame IDs such as `FRAME-0001`) to show how one dataset flows through every workload without copying data between systems.

| Guide | What it covers |
|-------|----------------|
| [SQL Analytics](./00-sql-analytics.md) | Build shared tables, slice sessions, add window/aggregate speedups |
| [JSON & Search](./01-json-search.md) | Store detection payloads and `QUERY` risky scenes |
| [Vector Search](./02-vector-db.md) | Keep frame embeddings and find semantic neighbors |
| [Geo Analytics](./03-geo-analytics.md) | Map incidents with `HAVERSINE`, polygons, H3 |
| [Lakehouse ETL](./04-lakehouse-etl.md) | Stage files, `COPY INTO` tables, optional stream/task |

Work through them in sequence to see how Databend’s single optimizer powers analytics, search, vector, geo, and loading pipelines on the same fleet data.
