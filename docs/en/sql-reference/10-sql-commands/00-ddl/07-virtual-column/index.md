---
title: Virtual Column
---
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

This page provides a comprehensive overview of virtual column operations in Databend, organized by functionality for easy reference.

## Virtual Column Management

| Command | Description |
|---------|-------------|
| [REFRESH VIRTUAL COLUMN](refresh-virtual-column.md) | Updates virtual columns with the latest data |
| [SHOW VIRTUAL COLUMNS](show-virtual-columns.md) | Lists all virtual columns in a table |

## Related Topics

- [Virtual Column](/guides/performance/virtual-column)

:::note
Virtual columns in Databend are derived columns that are computed from other columns in the table. They are not physically stored but calculated on-demand during query execution.
:::