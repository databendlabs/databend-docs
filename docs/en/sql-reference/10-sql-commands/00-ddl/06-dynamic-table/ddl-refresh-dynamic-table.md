---
title: REFRESH DYNAMIC TABLE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.945"/>

Re-executes the defining query of a dynamic table and replaces its complete stored result. This command does not process only the changes since the previous refresh.

## Syntax

```sql
REFRESH DYNAMIC TABLE
  [ <catalog_name>. ][ <database_name>. ]<table_name>
```

`table_name` must identify an existing dynamic table. The command cannot refresh an ordinary table or a materialized view.

## Refresh behavior

- Reads return the last stored result until the refresh commits. Readers see either the previous result or the new result, not a partially replaced result.
- A failed refresh leaves the previous stored result available.
- If the defining query returns no rows, a successful refresh empties the dynamic table.
- A refresh can reflect source inserts, updates, and deletes because it recomputes the entire query.
- Refreshes on the same target are serialized by a target-table lock. This lock does not lock the sources against DDL.
- Refresh uses the ordinary query read contract. It does not provide a pinned, cross-table transactional snapshot.

Refresh requires `SELECT` on the dynamic table and on all sources read by the defining query.

## Source identity

Databend records source table IDs at creation. Refresh checks that the stored query still resolves to the same source IDs.

If a source is dropped, existing dynamic-table data remains readable. Refresh fails if the source no longer exists. Dropping a source and creating a new table with the same name does not repair the dependency. Recreate the dynamic table to use the new source.

## Examples

This example uses the tables from [CREATE DYNAMIC TABLE](ddl-create-dynamic-table.md#examples). Run the setup through the first `SELECT`, before the cleanup commands.

```sql
INSERT INTO orders VALUES (3, 10, 300);

-- The stored result still contains the previous totals.
SELECT customer_name, total_amount
FROM customer_totals
ORDER BY customer_name;
```

```text
┌───────────────┬──────────────┐
│ customer_name │ total_amount │
├───────────────┼──────────────┤
│ alice         │          100 │
│ bob           │          200 │
└───────────────┴──────────────┘
```

```sql
REFRESH DYNAMIC TABLE customer_totals;

SELECT customer_name, total_amount
FROM customer_totals
ORDER BY customer_name;
```

```text
┌───────────────┬──────────────┐
│ customer_name │ total_amount │
├───────────────┼──────────────┤
│ alice         │          400 │
│ bob           │          200 │
└───────────────┴──────────────┘
```

There is no built-in automatic refresh. Your application or an external scheduler must issue `REFRESH DYNAMIC TABLE` when required. Full refresh can be expensive for large source tables.
