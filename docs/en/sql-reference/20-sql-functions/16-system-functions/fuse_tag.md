---
title: FUSE_TAG
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.894"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='TABLE VERSIONING'/>

Returns the snapshot tags of a table. For more information about snapshot tags, see [Snapshot Tags](../../10-sql-commands/00-ddl/21-table-versioning/index.md#snapshot-tags).

## Syntax

```sql
FUSE_TAG('<database_name>', '<table_name>')
```

## Output Columns

| Column              | Type               | Description                                                                 |
|---------------------|--------------------|-----------------------------------------------------------------------------|
| name                | STRING             | Tag name                                                                    |
| snapshot_location   | STRING             | Snapshot file the tag points to                                             |
| expire_at           | TIMESTAMP (nullable) | Expiration timestamp; set when `RETAIN` is used in CREATE SNAPSHOT TAG    |

## Examples

```sql
CREATE TABLE mytable(a INT, b INT);

INSERT INTO mytable VALUES(1, 1),(2, 2);

-- Create a snapshot tag
CREATE SNAPSHOT TAG FOR mytable TAG v1;

INSERT INTO mytable VALUES(3, 3);

-- Create another tag with expiration
CREATE SNAPSHOT TAG FOR mytable TAG temp RETAIN 2 DAYS;

SELECT * FROM FUSE_TAG('default', 'mytable');

---
| name | snapshot_location                                          | expire_at                  |
|------|------------------------------------------------------------|----------------------------|
| v1   | 1/319/_ss/a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4_v4.mpk        | NULL                       |
| temp | 1/319/_ss/f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3_v4.mpk        | 2025-06-15 10:30:00.000000 |
```
