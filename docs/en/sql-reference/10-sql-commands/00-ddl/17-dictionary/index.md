---
title: Dictionary
---

This page provides a comprehensive overview of Dictionary operations in Databend, organized by functionality for easy reference.

## Dictionary Management

| Command | Description |
|---------|-------------|
| [CREATE DICTIONARY](create-dictionary.md) | Creates a new dictionary for accessing external data sources |
| [DROP DICTIONARY](drop-dictionary.md) | Removes a dictionary |

## Dictionary Information

| Command | Description |
|---------|-------------|
| [SHOW DICTIONARIES](show-dictionaries.md) | Lists all dictionaries in the current database |
| [SHOW CREATE DICTIONARY](show-create-dictionary.md) | Displays the CREATE statement for an existing dictionary |

:::note
Dictionaries in Databend allow you to directly query data from external sources (like MySQL, Redis) in real-time without ETL processes. This helps solve data consistency issues, improves query performance, and simplifies data management. You can query external data using the `dict_get` function.
:::