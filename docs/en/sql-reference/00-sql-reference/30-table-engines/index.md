---
title: Table Engines
---

Databend provides several table engines so that you can balance performance and interoperability needs without moving data. Each engine is optimized for a specific scenario—ranging from Databend’s native Fuse storage to external data lake formats.

## Available Engines

| Engine | Best For | Highlights |
| ------ | -------- | ---------- |
| [Fuse Engine Tables](fuse) | Native Databend tables | Snapshot-based storage, automatic clustering, change tracking |
| [Apache Iceberg™ Tables](iceberg) | Lakehouse catalogs | Time-travel, schema evolution, REST/Hive/Storage catalogs |
| [Apache Hive Tables](hive) | Hive metastore data | Query Hive-managed data stores through external tables |
| [Delta Lake Engine](delta) | Delta Lake datasets | Read Delta tables in object storage with ACID guarantees |

## Choosing an Engine

- Use **Fuse** when you manage data directly inside Databend and want the best storage and query performance.
- Choose **Iceberg** when you already manage datasets through Iceberg catalogs and need tight lakehouse integration.
- Configure **Hive** when you rely on an existing Hive Metastore but want Databend’s query engine.
- Select **Delta** to analyse Delta Lake tables in place without ingesting them into Fuse.

