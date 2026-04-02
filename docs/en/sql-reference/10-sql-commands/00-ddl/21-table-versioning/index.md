---
title: Table Versioning
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='TABLE VERSIONING'/>

Table versioning lets you create named references to specific snapshots of a FUSE table. These references survive automatic retention cleanup, giving you stable, human-readable pointers to historical table states.

:::note
Table versioning is an experimental feature. Enable it before use:

```sql
SET enable_experimental_table_ref = 1;
```
:::

## Snapshot Tags

A snapshot tag pins a specific point-in-time state of a table by name. You can query the tagged state at any time using the [AT](../../20-query-syntax/03-query-at.md) clause, without needing to track snapshot IDs or timestamps.

| Command | Description |
|---------|-------------|
| [CREATE SNAPSHOT TAG](01-create-snapshot-tag.md) | Create a named tag on a table snapshot |
| [DROP SNAPSHOT TAG](02-drop-snapshot-tag.md) | Remove a snapshot tag |
