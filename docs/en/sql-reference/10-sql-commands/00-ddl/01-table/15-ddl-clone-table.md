---
title: CREATE TABLE ... CLONE
sidebar_label: CREATE TABLE ... CLONE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

Creates an independent table that initially shares immutable data files with a source table. The new table has its own identity, metadata, ownership, and grants. Later writes to either table do not change the other table.

:::caution[Experimental feature: upgrade all relevant nodes first]
Creation is disabled by default. Enable `enable_experimental_clone_table` only after all relevant query, Meta, and maintenance nodes support the clone-aware protocol. Data integrity and safety are not guaranteed in mixed-version deployments. Disabling creation later does not remove existing clones or disable their clone-aware garbage collection.
:::

## Syntax

```sql
SET enable_experimental_clone_table = 1;

CREATE [ OR REPLACE ] TABLE [ IF NOT EXISTS ] [ <database>. ]<target>
CLONE [ <database>. ]<source>
[ AT (
    SNAPSHOT => <snapshot_id_expr>
  | TIMESTAMP => <timestamp_expr>
  | OFFSET => <offset_seconds_expr>
  | TAG => <tag_name>
) ];
```

`OR REPLACE` and `IF NOT EXISTS` are mutually exclusive. Without `AT`, the clone uses the source's current state. `OFFSET` is a non-positive number of seconds relative to the time resolved during binding. `TAG` takes an identifier, not a string literal. `STREAM` and `BEFORE` navigation are not supported.

## Requirements and Limits

- Source and target must be in the same tenant and catalog. Cross-database cloning is supported within the default catalog.
- The source must be a managed Fuse table. External, attached, read-only, and temporary source tables are not supported.
- Do not add column definitions, `ENGINE`, `LOCATION`, `PARTITION BY`, `CLUSTER BY`, table options, `PROPERTIES`, `TTL`, `AS SELECT`, `TRANSIENT`, or `TEMPORARY` to the clone statement. The clone inherits source attributes. A managed transient source is supported; its transient behavior is inherited.
- The clone uses the source's managed storage, not the target database's default storage connection or path. New files use the target's own storage prefix.
- Empty tables and clones of clones are supported. Dropping the source does not invalidate an existing clone.

## Access Control and Policies

The caller needs `CREATE` on the target database and `SELECT` access to the source table. The clone is a new securable object. Source table grants are not copied; manage grants on the target separately.

Cloning is not `CREATE TABLE AS SELECT`. It shares stored data rather than copying only a query's visible result. Current masking and row access policy bindings are inherited and validated. Queries against the clone still apply those policies. Removing a policy binding from the source does not remove the clone's binding.

## Example

```sql
SET enable_experimental_clone_table = 1;

CREATE TABLE clone_source (id INT, payload STRING);
INSERT INTO clone_source VALUES (1, 'original');

CREATE TABLE clone_target CLONE clone_source;

INSERT INTO clone_source VALUES (2, 'source only');
INSERT INTO clone_target VALUES (3, 'clone only');

SELECT id FROM clone_source ORDER BY id;
-- 1
-- 2

SELECT id FROM clone_target ORDER BY id;
-- 1
-- 3
```

The shared files are not a full data copy. Subsequent writes and retained history can still consume additional storage.

## Clone a Historical Snapshot

```sql
SET VARIABLE selected_snapshot = (
    SELECT snapshot_id
    FROM fuse_snapshot('default', 'clone_source')
    ORDER BY timestamp DESC
    LIMIT 1
);

CREATE TABLE clone_history CLONE clone_source
AT (SNAPSHOT => $selected_snapshot);

UNSET VARIABLE selected_snapshot;
```

Historical clones use the selected snapshot's schema, clustering, and data. Current semantic metadata that is not versioned with snapshots, such as constraints and security policies, must be compatible with that structure. Incompatible metadata causes creation to fail instead of silently removing protection. Legacy name-based security policies are rejected by CLONE.

A requested historical point must still be available. A missing or expired historical point fails; it does not produce an empty clone. A tag does not bypass the source's least visible time (LVT) boundary. LVT is the lower bound used to protect visibility while garbage collection advances.

## Retention and Garbage Collection

Clone-aware `VACUUM`, purge operations, and dropped-table cleanup protect data still referenced by clones and respect their retention policies. Do not delete shared objects directly in object storage.

Keep these limits in mind:

- Historical CLONE cannot publish a snapshot below the source's LVT. FLASHBACK on a clone-group member, including the source, also enforces that member's LVT boundary. A tag does not bypass the boundary, even if tagged data remains readable.
- Joining a clone group also enables an LVT fence on source writes. Concurrent zero-retention VACUUM can reject long-running writes with `TableSnapshotExpired`. Review retention and concurrent maintenance before retrying.
- Dropped-table cleanup conservatively retains a dropped ancestor's entire directory while descendant clone bindings exist. Space might not be reclaimed even after descendants stop referencing its files.

See [VACUUM TABLE](91-vacuum-table.md) and [FLASHBACK TABLE](70-flashback-table.md) for related maintenance commands.
