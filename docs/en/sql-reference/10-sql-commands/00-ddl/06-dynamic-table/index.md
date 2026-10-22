---
title: Dynamic Table
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.945"/>

A dynamic table stores the result of a query in Fuse storage. The query can join multiple source tables and aggregate their data. Creation populates the table. Later changes to source tables become visible only after an explicit full refresh.

:::note
Dynamic tables support manual full refresh. Run `REFRESH DYNAMIC TABLE` to update the stored result after source data changes. For periodic refresh, issue this command from your application or an external scheduler. Between refreshes, queries return the last stored result.
:::

## Commands

| Command | Description |
|---------|-------------|
| [CREATE DYNAMIC TABLE](ddl-create-dynamic-table.md) | Defines a dynamic table and populates its initial result. |
| [REFRESH DYNAMIC TABLE](ddl-refresh-dynamic-table.md) | Rebuilds the complete stored result from the source tables. |
| [SHOW CREATE TABLE](../01-table/show-create-table.md) | Shows the re-executable `CREATE DYNAMIC TABLE` statement. |
| [DESCRIBE](../01-table/50-describe-table.md) | Shows the output columns. |
| [DROP TABLE](../01-table/20-ddl-drop-table.md) | Removes a dynamic table. |

Query a dynamic table by name with `SELECT`. Use `SHOW TABLES` to list tables. In `system.tables`, its `table_type` is `DYNAMIC TABLE`.

## Choose a derived object

| Object | Data returned by a query | Maintenance |
|--------|--------------------------|-------------|
| [View](../05-view/ddl-create-view.md) | Evaluates the stored query against its sources. | No stored result to refresh. |
| [Materialized view](../05-view/materialized-view.md) | Returns current results with read-time correction for unrefreshed source changes. | Supports incremental refresh for append-only changes on one source table. |
| Dynamic table | Returns the result stored by creation or the last successful refresh, even if sources have changed. | Requires an explicit full refresh. Supports joins across source tables. |

The optimizer does not substitute a dynamic table for a query against its sources. Reference the dynamic table directly.

For a complete example, see [Dynamic Tables](/guides/load-data/continuous-data-pipelines/dynamic-table).
