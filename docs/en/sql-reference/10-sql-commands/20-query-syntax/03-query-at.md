---
title: AT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.395"/>

The AT clause allows you to query previous versions of your data based on a specific snapshot ID, timestamp, or at the time when a stream was created.

Databend automatically creates snapshots when data updates occur, so a snapshot can be considered as a view of your data at a time point in the past. You can access a snapshot by the snapshot ID or the timestamp at which the snapshot was created. For how to obtain the snapshot ID and timestamp, see [Obtaining Snapshot ID and Timestamp](#obtaining-snapshot-id-and-timestamp).

This is part of the Databend's Time Travel feature that allows you to query, back up, and restore from a previous version of your data within the retention period (24 hours by default).

## Syntax

```sql    
SELECT ...
FROM ...
AT ( { 
       SNAPSHOT => '<snapshot_id>' |
       TIMESTAMP => <timestamp> | 
       (STREAM => <stream_name>) 
   } )   
```

## Obtaining Snapshot ID and Timestamp

To return the snapshot IDs and timestamps of all the snapshots of a table, use the [FUSE_SNAPSHOT](../../20-sql-functions/16-system-functions/fuse_snapshot.md) function:

```sql
SELECT snapshot_id, 
       timestamp 
FROM   fuse_snapshot('<database_name>', '<table_name>'); 
```

## Examples

This example demonstrates the AT clause, allowing retrieval of previous data versions based on a snapshot ID, timestamp, and stream:

1. Create a table named `t` with a single column `a`, and insert two rows with values 1 and 2 into the table.

```sql
CREATE TABLE t(a INT);

INSERT INTO t VALUES(1);
INSERT INTO t VALUES(2);
```

2. Create a stream named `s` on the table `t`, and add an additional row with value 3 into the table.

```sql
CREATE STREAM s ON TABLE t;

INSERT INTO t VALUES(3);
```

3. Run time travel queries to retrieve previous data versions. 

```sql
-- Return snapshot IDs and corresponding timestamps for table 't'
SELECT snapshot_id, timestamp FROM FUSE_SNAPSHOT('default', 't');
┌───────────────────────────────────────────────────────────────┐
│            snapshot_id           │          timestamp         │
├──────────────────────────────────┼────────────────────────────┤
│ 296349da841d4fa8820bbf8e228d75f3 │ 2024-04-02 15:25:21.456574 │
│ aaa4857c5935401790db2c9f0f2818be │ 2024-04-02 15:19:02.484304 │
│ e66ad2bc3f21416e87903dc9cd0388a3 │ 2024-04-02 15:18:40.766361 │
└───────────────────────────────────────────────────────────────┘

-- These queries retrieve the same data but using different methods:
-- by snapshot_id:
SELECT * FROM t AT (SNAPSHOT => 'aaa4857c5935401790db2c9f0f2818be');
-- by timestamp:
SELECT * FROM t AT (TIMESTAMP => '2024-04-02 15:19:02.484304'::TIMESTAMP);
-- by stream:
SELECT * FROM t AT (STREAM => s);

┌─────────────────┐
│        a        │
├─────────────────┤
│               1 │
│               2 │
└─────────────────┘
```