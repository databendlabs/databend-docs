---
title: Vector Index
---

import FunctionDescription from '@site/src/components/FunctionDescription';

Vector indexes in Databend enable efficient similarity search on high-dimensional vector data using the HNSW (Hierarchical Navigable Small World) algorithm. They support use cases like semantic search, recommendation systems, and AI applications.

:::tip[Key Feature: Automatic Index Generation]
Vector indexes are **automatically built as data is written**. When you insert or load data into a table with a Vector index, the index is generated automatically without manual intervention. Run `REFRESH VECTOR INDEX` for existing data after you create or replace an index, or to build the current index format for legacy blocks.
:::

## Rolling Upgrades

<FunctionDescription description="Introduced or updated: Unreleased"/>

When upgrading to a build with vector TopN row pruning, upgrade all Query nodes before resuming distributed vector searches. Distributed vector queries can fail while Query nodes run versions from both sides of this change.

## Vector Index Management

| Command                                         | Description                                               |
|-------------------------------------------------|-----------------------------------------------------------|
| [CREATE VECTOR INDEX](create-vector-index.md)   | Creates a new Vector index for efficient similarity search |
| [REFRESH VECTOR INDEX](refresh-vector-index.md) | Builds missing current-version index files for existing data |
| [DROP VECTOR INDEX](drop-vector-index.md)       | Removes a Vector index                                    |
