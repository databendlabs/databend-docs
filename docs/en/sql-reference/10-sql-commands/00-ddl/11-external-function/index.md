---
title: External Function
---

This page provides a comprehensive overview of External Function operations in Databend, organized by functionality for easy reference.

## External Function Management

| Command | Description |
|---------|-------------|
| [CREATE EXTERNAL FUNCTION](ddl-create-function.md) | Creates a new external function |
| [ALTER EXTERNAL FUNCTION](ddl-alter-function.md) | Modifies an existing external function |
| [DROP EXTERNAL FUNCTION](ddl-drop-function.md) | Removes an external function |

:::note
External Functions in Databend allow you to extend SQL with custom logic running on a remote server. The server communicates with Databend over the [Apache Arrow Flight](https://arrow.apache.org/docs/format/Flight.html) protocol. The remote handler can be written in any language — Python is the most common choice via the [databend-udf](https://pypi.org/project/databend-udf) package.
:::