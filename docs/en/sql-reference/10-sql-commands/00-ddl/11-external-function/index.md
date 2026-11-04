---
title: External Function
---

This page provides a comprehensive overview of External Function operations in Databend, organized by functionality for easy reference.

## External Function Management

| Command | Description |
|---------|-------------|
| [CREATE FUNCTION](ddl-create-function.md) | Creates a new external function |
| [ALTER FUNCTION](ddl-alter-function.md) | Modifies an existing external function |
| [DROP FUNCTION](ddl-drop-function.md) | Removes an external function |

## SQL-Managed Destinations

Use [External Access Integrations](/guides/security/external-access-integration) to bind remote scalar UDFs to host/port rules. A nonempty operator allow list remains an upper limit. SQL policies do not grant network access to inline script UDFs.

:::note
External Functions in Databend allow you to extend SQL with custom logic running on a remote server. The server communicates with Databend over the [Apache Arrow Flight](https://arrow.apache.org/docs/format/Flight.html) protocol. The remote handler can be written in any language — Python is the most common choice via the [databend-udf](https://pypi.org/project/databend-udf) package.
:::