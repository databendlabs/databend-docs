---
title: Databend for Data Lakehouse
---

Databend integrates with popular data lake technologies to provide a unified lakehouse architecture that combines data lake flexibility with data warehouse performance.

| Technology | Integration Type | Key Features | Documentation |
|------------|-----------------|--------------|---------------|
| Apache Hive | Catalog-level | Legacy data lake support, schema registry | [Apache Hive Catalog](01-hive.md) |
| Apache Iceberg™ | Catalog-level | ACID transactions, schema evolution, time travel | [Apache Iceberg™ Catalog](02-iceberg.md) |
| Delta Lake | Table engine-level | ACID transactions, data versioning, schema enforcement | [Delta Lake Table Engine](03-delta.md) |

These integrations enable Databend users to efficiently query, analyze, and manage diverse datasets across both data lake and data warehouse environments without data duplication.