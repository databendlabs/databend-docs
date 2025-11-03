---
title: Tracking and Transforming Data via Streams
sidebar_label: Stream
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

A stream in Databend is a dynamic and real-time representation of changes to a table. Streams are created to capture and track modifications to the associated table, allowing continuous consumption and analysis of data changes as they occur.

### How Stream Works

A stream can operate in two modes: **Standard** and **Append-Only**. Specify a mode using the `APPEND_ONLY` parameter (defaults to `true`) when you [CREATE STREAM](/sql/sql-commands/ddl/stream/create-stream).

- **Standard**: Captures all types of data changes, including insertions, updates, and deletions.
- **Append-Only**: In this mode, the stream exclusively contains data insertion records; data updates or deletions are not captured.

The design philosophy of Databend streams is to focus on capturing the final state of the data. For instance, if you insert a value and then update it multiple times, the stream only keeps the most recent state of the value before it is consumed. The following example illustrates what a stream looks like and how it works in both modes.

<StepsWrap>
<StepContent number="1">

#### Create streams to capture changes

Let's create two tables first, and then create a stream for each table with different modes to capture changes to the tables.

```sql
-- Create a table and insert a value
CREATE TABLE t_standard(a INT);
CREATE TABLE t_append_only(a INT);

-- Create two streams with different modes: Standard and Append_Only
CREATE STREAM s_standard ON TABLE t_standard APPEND_ONLY=false;
CREATE STREAM s_append_only ON TABLE t_append_only APPEND_ONLY=true;
```

You can view the created streams and their mode using the [SHOW FULL STREAMS](/sql/sql-commands/ddl/stream/show-streams) command:

```sql
SHOW FULL STREAMS;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│         created_on         │      name     │ database │ catalog │        table_on       │       owner      │ comment │     mode    │ invalid_reason │
├────────────────────────────┼───────────────┼──────────┼─────────┼───────────────────────┼──────────────────┼─────────┼─────────────┼────────────────┤
│ 2024-02-18 16:39:58.996763 │ s_append_only │ default  │ default │ default.t_append_only │ NULL             │         │ append_only │                │
│ 2024-02-18 16:39:58.966942 │ s_standard    │ default  │ default │ default.t_standard    │ NULL             │         │ standard    │                │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

Now, let's insert two values into each table and observe what the streams capture:

```sql
-- Insert two new values
INSERT INTO t_standard VALUES(2), (3);
INSERT INTO t_append_only VALUES(2), (3);

SELECT * FROM s_standard;

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │   change$action  │              change$row_id             │ change$is_update │
├─────────────────┼──────────────────┼────────────────────────────────────────┼──────────────────┤
│               2 │ INSERT           │ 8cd000827f8140d9921f897016e5a88e000000 │ false            │
│               3 │ INSERT           │ 8cd000827f8140d9921f897016e5a88e000001 │ false            │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

SELECT * FROM s_append_only;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               2 │ INSERT        │ false            │ 63dc9b84fe0a43528808c3304969b317000000 │
│               3 │ INSERT        │ false            │ 63dc9b84fe0a43528808c3304969b317000001 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

The results above indicate that both streams have successfully captured the new insertions. See [Stream Columns](#stream-columns) for details on the stream columns in the results. Now, let's update and then delete a newly inserted value and examine whether there are differences in the streams' captures.

```sql
UPDATE t_standard SET a = 4 WHERE a = 2;
UPDATE t_append_only SET a = 4 WHERE a = 2;

SELECT * FROM s_standard;

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │   change$action  │              change$row_id             │ change$is_update │
│ Nullable(Int32) │ Nullable(String) │            Nullable(String)            │      Boolean     │
├─────────────────┼──────────────────┼────────────────────────────────────────┼──────────────────┤
|               4 │ INSERT           │ 1dd5cab0b1b64328a112db89d602ca04000000 │ false            |
│               3 │ INSERT           │ 1dd5cab0b1b64328a112db89d602ca04000001 │ false            │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

SELECT * FROM s_append_only;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               4 │ INSERT        │ false            │ 63dc9b84fe0a43528808c3304969b317000000 │
│               3 │ INSERT        │ false            │ 63dc9b84fe0a43528808c3304969b317000001 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

DELETE FROM t_standard WHERE a = 4;
DELETE FROM t_append_only WHERE a = 4;

SELECT * FROM s_standard;

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │   change$action  │              change$row_id             │ change$is_update │
│ Nullable(Int32) │ Nullable(String) │            Nullable(String)            │      Boolean     │
├─────────────────┼──────────────────┼────────────────────────────────────────┼──────────────────┤
│               3 │ INSERT           │ 1dd5cab0b1b64328a112db89d602ca04000001 │ false            │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

SELECT * FROM s_append_only;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               3 │ INSERT        │ false            │ bfed6c91f3e4402fa477b6853a2d2b58000001 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

Up to this point, we haven't noticed any significant differences between the two modes as we haven't processed the streams yet. All changes have been consolidated and manifested as INSERT actions. **A stream can be consumed by a task, a DML (Data Manipulation Language) operation, or a query with [WITH CONSUME](/sql/sql-commands/query-syntax/with-consume) or [WITH Stream Hints](/sql/sql-commands/query-syntax/with-stream-hints)**. After consumption, the stream contains no data but can continue to capture new changes, if any. To further analyze the distinctions, let's proceed with consuming the streams and examining the output.

</StepContent>
<StepContent number="2">

#### Consume streams

Let's create two new tables and insert into them what the streams have captured.

```sql
CREATE TABLE t_consume_standard(b INT);
CREATE TABLE t_consume_append_only(b INT);

INSERT INTO t_consume_standard SELECT a FROM s_standard;
INSERT INTO t_consume_append_only SELECT a FROM s_append_only;

SELECT * FROM t_consume_standard;

┌─────────────────┐
│        b        │
├─────────────────┤
│               3 │
└─────────────────┘

SELECT * FROM t_consume_append_only;

┌─────────────────┐
│        b        │
├─────────────────┤
│               3 │
└─────────────────┘
```

If you query the streams now, you'll find them empty because they have been consumed.

```sql
-- empty results
SELECT * FROM s_standard;

-- empty results
SELECT * FROM s_append_only;
```

</StepContent>
<StepContent number="3">

#### Capture new changes

Now, let's update the value from `3` to `4` in each table, and subsequently, check their streams again:

```sql
UPDATE t_standard SET a = 4 WHERE a = 3;
UPDATE t_append_only SET a = 4 WHERE a = 3;


SELECT * FROM s_standard;

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │   change$action  │              change$row_id             │ change$is_update │
│ Nullable(Int32) │ Nullable(String) │            Nullable(String)            │      Boolean     │
├─────────────────┼──────────────────┼────────────────────────────────────────┼──────────────────┤
│               3 │ DELETE           │ 1dd5cab0b1b64328a112db89d602ca04000001 │ true             │
│               4 │ INSERT           │ 1dd5cab0b1b64328a112db89d602ca04000001 │ true             │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

-- empty results
SELECT * FROM s_append_only;
```

The results above show that the Standard stream processes the UPDATE operation as a combination of two actions: a DELETE action that removes the old value (`3`) and an INSERT action that adds the new value (`4`). When updating `3` to `4`, the existing value `3` must first be deleted because it no longer exists in the final state, followed by the insertion of the new value `4`. This behavior reflects how the Standard stream captures only the final changes, representing updates as a sequence of a deletion (removing the old value) and an insertion (adding the new value) for the same row. 

On the other hand, the Append_Only stream does not capture anything because it is designed to log only new data additions (INSERT) and ignores updates or deletions.

If we delete the value `4` now, we can obtain the following results:

```sql
DELETE FROM t_standard WHERE a = 4;
DELETE FROM t_append_only WHERE a = 4;

SELECT * FROM s_standard;

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │   change$action  │              change$row_id             │ change$is_update │
│ Nullable(Int32) │ Nullable(String) │            Nullable(String)            │      Boolean     │
├─────────────────┼──────────────────┼────────────────────────────────────────┼──────────────────┤
│               3 │ DELETE           │ 1dd5cab0b1b64328a112db89d602ca04000001 │ false            │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

-- empty results
SELECT * FROM s_append_only;
```

We can see that both stream modes have the capability to capture insertions, along with any subsequent updates and deletions made to the inserted values before the streams are consumed. However, after consumption, if there are updates or deletions to the previously inserted data, only the standard stream is able to capture these changes, recording them as DELETE and INSERT actions.

</StepContent>
</StepsWrap>

### Transactional Support for Stream Consumption

In Databend, stream consumption is transactional within single-statement transactions. This means:

**Successful Transaction**: If a transaction is committed, the stream is consumed. For instance:

```sql
INSERT INTO table SELECT * FROM stream;
```

If this `INSERT` transaction commits, the stream is consumed.

**Failed Transaction**: If the transaction fails, the stream remains unchanged and available for future consumption.

**Concurrent Access**: _Only one transaction can successfully consume a stream at a time_. If multiple transactions attempt to consume the same stream, only the first committed transaction succeeds, others fail.

### Table Metadata for Stream

**A stream does not store any data for a table**. After creating a stream for a table, Databend introduces specific hidden metadata columns to the table for change tracking purposes. These columns include:

| Column                 | Description                                                                       |
| ---------------------- | --------------------------------------------------------------------------------- |
| \_origin_version       | Identifies the table version in which this row was initially created.             |
| \_origin_block_id      | Identifies the block ID to which this row belonged previously.                    |
| \_origin_block_row_num | Identifies the row number within the block to which this row belonged previously. |

The previously documented hidden column `_row_version` has been removed and is no longer available.

To display the values of these columns, use the SELECT statement:

```sql title='Example:'
CREATE TABLE t(a int);
INSERT INTO t VALUES (1);
CREATE STREAM s ON TABLE t;
INSERT INTO t VALUES (2);
SELECT
  *,
  _origin_version,
  _origin_block_id,
  _origin_block_row_num
FROM
  t;

┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │  _origin_version │     _origin_block_id     │ _origin_block_row_num │
├─────────────────┼──────────────────┼──────────────────────────┼───────────────────────┤
│               1 │             NULL │ NULL                     │                  NULL │
│               2 │             NULL │ NULL                     │                  NULL │
└──────────────────────────────────────────────────────────────────────────────────────────────┘

UPDATE t SET a = 3 WHERE a = 2;
SELECT
  *,
  _origin_version,
  _origin_block_id,
  _origin_block_row_num
FROM
  t;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │  _origin_version │             _origin_block_id            │ _origin_block_row_num │
├─────────────────┼──────────────────┼─────────────────────────────────────────┼───────────────────────┤
│               3 │             2317 │ 132795849016460663684755265365603707394 │                     0 │
│               1 │             NULL │ NULL                                    │                  NULL │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Stream Columns

You can use the SELECT statement to directly query a stream and retrieve the tracked changes. When querying a stream, consider incorporating these hidden columns for additional details about the changes:

| Column           | Description                                                                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| change$action    | Type of change: INSERT or DELETE.                                                                                                                                                  |
| change$is_update | Indicates whether the `change$action` is part of an UPDATE. In a stream, an UPDATE is represented by a combination of DELETE and INSERT operations, with this field set to `true`. |
| change$row_id    | Unique identifier for each row to track changes.                                                                                                                                   |

```sql title='Example:'
CREATE TABLE t(a int);
INSERT INTO t VALUES (1);
CREATE STREAM s ON TABLE t;
INSERT INTO t VALUES (2);

SELECT * FROM s;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               2 │ INSERT        │ false            │ a577745c6a404f3384fa95791eb43f22000000 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

-- If you add a new row and then update it,
-- the stream consolidates the changes as an INSERT with your updated value.
UPDATE t SET a = 3 WHERE a = 2;
SELECT * FROM s;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               3 │ INSERT        │ false            │ a577745c6a404f3384fa95791eb43f22000000 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Example: Tracking and Transforming Data in Real-Time

The following example demonstrates how to use streams to capture and track user activities in real-time.

#### 1. Creating Tables

The example uses three tables:

- `user_activities` table records user activities.
- `user_profiles` table stores user profiles.
- `user_activity_profiles` table is a combined view of the two tables.

The `activities_stream` table is created as a stream to capture real-time changes to the `user_activities` table. The stream is then consumed by a query to update the` user_activity_profiles` table with the latest data.

```sql
-- Create a table to record user activities
CREATE TABLE user_activities (
    user_id INT,
    activity VARCHAR,
    timestamp TIMESTAMP
);

-- Create a table to store user profiles
CREATE TABLE user_profiles (
    user_id INT,
    username VARCHAR,
    location VARCHAR
);

-- Insert data into the user_profiles table
INSERT INTO user_profiles VALUES (101, 'Alice', 'New York');
INSERT INTO user_profiles VALUES (102, 'Bob', 'San Francisco');
INSERT INTO user_profiles VALUES (103, 'Charlie', 'Los Angeles');
INSERT INTO user_profiles VALUES (104, 'Dana', 'Chicago');

-- Create a table for the combined view of user activities and profiles
CREATE TABLE user_activity_profiles (
    user_id INT,
    username VARCHAR,
    location VARCHAR,
    activity VARCHAR,
    activity_timestamp TIMESTAMP
);
```

#### 2. Creating a Stream

Create a stream on the `user_activities` table to capture real-time changes:

```sql
CREATE STREAM activities_stream ON TABLE user_activities;
```

#### 3. Inserting Data into the Source Table

Insert data into the `user_activities` table to make some changes:

```sql
INSERT INTO user_activities VALUES (102, 'logout', '2023-12-19 09:00:00');
INSERT INTO user_activities VALUES (103, 'view_profile', '2023-12-19 09:15:00');
INSERT INTO user_activities VALUES (104, 'edit_profile', '2023-12-19 10:00:00');
INSERT INTO user_activities VALUES (101, 'purchase', '2023-12-19 10:30:00');
INSERT INTO user_activities VALUES (102, 'login', '2023-12-19 11:00:00');
```

#### 4. Consuming the Stream to Update the Target Table

Consume the stream to update the `user_activity_profiles` table:

```sql
-- Inserting data into the user_activity_profiles table
INSERT INTO user_activity_profiles
SELECT
    a.user_id, p.username, p.location, a.activity, a.timestamp
FROM
    -- Source table for changed data
    activities_stream AS a
JOIN
    -- Joining with user profile data
    user_profiles AS p
ON
    a.user_id = p.user_id

-- a.change$action is a column indicating the type of change (Databend only supports INSERT for now)
WHERE a.change$action = 'INSERT';
```

Then, check the updated `user_activity_profiles` table:

```sql
SELECT
  *
FROM
  user_activity_profiles

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│     user_id     │     username     │     location     │     activity     │  activity_timestamp │
├─────────────────┼──────────────────┼──────────────────┼──────────────────┼─────────────────────┤
│             103 │ Charlie          │ Los Angeles      │ view_profile     │ 2023-12-19 09:15:00 │
│             104 │ Dana             │ Chicago          │ edit_profile     │ 2023-12-19 10:00:00 │
│             101 │ Alice            │ New York         │ purchase         │ 2023-12-19 10:30:00 │
│             102 │ Bob              │ San Francisco    │ login            │ 2023-12-19 11:00:00 │
│             102 │ Bob              │ San Francisco    │ logout           │ 2023-12-19 09:00:00 │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 5. Task Update for Real-Time Data Processing

To keep the `user_activity_profiles` table current, it's important to periodically synchronize it with data from the `activities_stream`. This synchronization should be aligned with the update intervals of the `user_activities` table, ensuring that the user_activity_profiles accurately reflects the latest user activities and profiles for real-time data analysis.

The Databend `TASK` command(currently in private preview), can be utilized to define a task that updates the `user_activity_profiles` table every minute or seconds.

```sql
-- Define a task in Databend
CREATE TASK user_activity_task
WAREHOUSE = 'default'
SCHEDULE = 1 MINUTE
-- Trigger task when new data arrives in activities_stream
WHEN stream_status('activities_stream') AS
    -- Insert new records into user_activity_profiles
    INSERT INTO user_activity_profiles
    SELECT
        -- Join activities_stream with user_profiles based on user_id
        a.user_id, p.username, p.location, a.activity, a.timestamp
    FROM
        activities_stream AS a
        JOIN user_profiles AS p
            ON a.user_id = p.user_id
    -- Include only rows where the action is 'INSERT'
    WHERE a.change$action = 'INSERT';
```
