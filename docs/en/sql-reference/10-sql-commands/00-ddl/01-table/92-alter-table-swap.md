---
title: ALTER TABLE SWAP WITH
sidebar_position: 5
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.821"/>

Swaps all table metadata and data between two tables atomically in a single transaction. This operation exchanges the table schemas, including all columns, constraints, and data, effectively making each table take on the identity of the other.

## Syntax

```sql
ALTER TABLE [ IF EXISTS ] <source_table_name> SWAP WITH <target_table_name>
```

| Parameter            | Description                                    |
|----------------------|------------------------------------------------|
| `source_table_name`  | The name of the first table to swap            |
| `target_table_name`  | The name of the second table to swap with      |

## Usage Notes

- **Engine Support**: Only available for Fuse Engine tables. External tables, system tables, and other non-Fuse tables are not supported.
- **Table Type**: Temporary tables cannot be swapped with permanent or transient tables.
- **Permissions**: The current role must be the owner of both tables to perform the swap operation.
- **Database Scope**: Both tables must be in the same database. Cross-database swapping is not supported.
- **Atomicity**: The swap operation is atomic. Either both tables are swapped successfully, or neither is changed.
- **Data Preservation**: All data and metadata are preserved during the swap. No data is lost or modified.

## Examples

```sql
-- Create two tables with different schemas
CREATE OR REPLACE TABLE t1(a1 INT, a2 VARCHAR, a3 DATE);
CREATE OR REPLACE TABLE t2(b1 VARCHAR);

-- Check table schemas before swap
DESC t1;
DESC t2;

-- Swap the tables
ALTER TABLE t1 SWAP WITH t2;

-- After swapping, t1 now has t2's schema, and t2 has t1's schema
DESC t1;
DESC t2;
```
