---
title: Unified Workloads
---

CityDrive Intelligence records every dash-cam drive, splits it into frames, and stores multiple signals per `video_id`: relational metadata, JSON manifests, behaviour tags, embeddings, and GPS traces. This guide set shows how Databend keeps all those workloads in one warehouse—no copy jobs, no extra search cluster.

| Guide | What it covers |
|-------|----------------|
| [SQL Analytics](./00-sql-analytics.md) | Base tables, filters, joins, windows, aggregating indexes |
| [JSON & Search](./01-json-search.md) | Load `frame_metadata_catalog`, run Elasticsearch `QUERY()`, link bitmap tags |
| [Vector Search](./02-vector-db.md) | Persist embeddings, run cosine search, join risk metrics |
| [Geo Analytics](./03-geo-analytics.md) | Use `GEOMETRY`, distance/polygon filters, traffic-light joins |
| [Lakehouse ETL](./04-lakehouse-etl.md) | Stage once, `COPY INTO` shared tables, add streams/tasks |

Walk through them in order to see how the same identifiers flow from classic SQL to text search, vector, geo, and ETL—everything grounded in a single CityDrive scenario.
