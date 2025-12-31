---
title: Warehouse
sidebar_position: 0
---

Warehouse-related SQL commands for Databend Cloud.

## General Rules

- **Warehouse naming**: 3–63 characters, `A-Z`, `a-z`, `0-9`, and `-` only.
- **Identifiers**: Bare identifiers may omit quotes when they contain no spaces or special characters; otherwise enclose with single quotes.
- **Numeric parameters**: Accept integers or `NULL`. Supplying `NULL` resets the value to default (e.g., `AUTO_SUSPEND = NULL` equals `0`).
- **Boolean parameters**: Only `TRUE`/`FALSE` are accepted.
- **`WITH` keyword**: May appear before the entire option list or ahead of each option. Options are whitespace-separated.

## Warehouse Management

| Command | Description |
|---------|-------------|
| [CREATE WAREHOUSE](create-warehouse.md) | Creates a new warehouse |
| [USE WAREHOUSE](use-warehouse.md) | Sets the current warehouse for the session |
| [SHOW WAREHOUSES](show-warehouses.md) | Lists all warehouses with optional filtering |
| [ALTER WAREHOUSE](alter-warehouse.md) | Suspends, resumes, or modifies warehouse settings |
| [DROP WAREHOUSE](drop-warehouse.md) | Removes a warehouse |
| [REPLACE WAREHOUSE](replace-warehouse.md) | Recreates a warehouse with new configuration |
| [QUERY_HISTORY](query-history.md) | Inspects query logs for a warehouse |

:::note
A warehouse represents compute resources used to run queries in Databend Cloud.
:::
