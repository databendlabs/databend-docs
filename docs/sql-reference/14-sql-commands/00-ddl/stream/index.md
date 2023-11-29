---
title: Stream
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';

### What is Stream?

A stream in Databend is a dynamic and real-time representation of changes to a table. Streams are created to capture and track modifications to the associated table, allowing continuous consumption and analysis of data changes as they occur. 

This is a quick example illustrating what a stream looks like. In the given scenario, a stream named 'my_first_st' is created for the 'test_stream' table and captures a data insertion:
 
```sql title='Example:'
CREATE TABLE test_stream(a INT);
INSERT INTO test_stream VALUES(1);
ALTER TABLE test_stream SET OPTIONS(change_tracking = TRUE);

CREATE STREAM my_first_st ON TABLE test_stream;
INSERT INTO test_stream VALUES(2);
SELECT * FROM my_first_st;

┌─────────────────┐
│        a        │
├─────────────────┤
│               2 │
└─────────────────┘
```

A Databend stream currently supports **Append-only** mode, allowing it to capture **both data insertion and deletion events**, as demonstrated in the following example:

```sql title='Example continued:'
INSERT INTO test_stream VALUES(3);
SELECT * FROM my_first_st;

┌─────────────────┐
│        a        │
├─────────────────┤
│               2 │
│               3 │
└─────────────────┘

DELETE FROM test_stream WHERE a = 2;
SELECT * FROM my_first_st;

┌─────────────────┐
│        a        │
├─────────────────┤
│               3 │
└─────────────────┘
```

### Enabling Change Tracking

Change tracking must be enabled for a table before creating a stream for it. To enable change tracking for a table, use the [ALTER TABLE OPTION](../20-table/90-alter-table-option.md) command. In the previous example, this statement enables change tracking for the table 'test_stream':

```sql
ALTER TABLE test_stream SET OPTIONS(change_tracking = TRUE);
```

A stream does NOT store any data for a table. Once change tracking is enabled, Databend adds the following hidden columns as change tracking metadata to the table for tracking the data changes of each row:

| Column                | Description                                                                                    |
|-----------------------|------------------------------------------------------------------------------------------------|
| _origin_version       | Identifies the table version in which this row was initially created.                          |
| _origin_block_id      | Identifies the block ID to which this row belonged when it was first added to the table.       |
| _origin_block_row_num | Identifies the row number within the block to which this row belonged when it was first added. |

To display the values of these columns, use the SELECT statement:

```sql title='Example continued:'
SELECT *, _origin_version, _origin_block_id, _origin_block_row_num 
FROM test_stream;

┌───────────────────────────────────────────────────────────────────────────────────────┐
│        a        │  _origin_version │     _origin_block_id     │ _origin_block_row_num │
├─────────────────┼──────────────────┼──────────────────────────┼───────────────────────┤
│               1 │             NULL │ NULL                     │                  NULL │
│               3 │             3740 │ NULL                     │                  NULL │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### Managing Streams

To manage streams in Databend, use the following commands:

<IndexOverviewList />

### Usage Examples