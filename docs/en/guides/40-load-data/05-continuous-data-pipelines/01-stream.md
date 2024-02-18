---
title: Tracking and Transforming Data via Streams
sidebar_label: Stream
---

A stream in Databend is a dynamic and real-time representation of changes to a table. Streams are created to capture and track modifications to the associated table, allowing continuous consumption and analysis of data changes as they occur.

### How Stream Works

This section provides a quick example illustrating what a stream looks like and how it works. Let's say we have a table named 't' and we create a stream to capture the table changes. Once created, the stream starts to capture data changes to the table:

![Alt text](@site/static/public/img/sql/stream-insert.png)

**A Databend stream currently operates in an Append-only mode**. In this mode, the stream exclusively contains data insertion records, reflecting the latest changes to the table. Although data updates and deletions are not directly recorded, they are still taken into account. 

For example, if a row is added and later updated with new values, the stream records the insertion along with the updated values. Similarly, if a row is added and subsequently deleted, the stream reflects these changes accordingly:

![Alt text](@site/static/public/img/sql/stream-update.png)

**A stream can be consumed by DML (Data Manipulation Language) operations**. After consumption, the stream contains no data but can continue to capture new changes, if any.

![Alt text](@site/static/public/img/sql/stream-consume.png)

### Transactional Support for Stream Consumption

In Databend, stream consumption is transactional within single-statement transactions. This means:

**Successful Transaction**: If a transaction is committed, the stream is consumed. For instance:
```sql
INSERT INTO table SELECT * FROM stream;
```
If this `INSERT` transaction commits, the stream is consumed.

**Failed Transaction**: If the transaction fails, the stream remains unchanged and available for future consumption.

**Concurrent Access**: *Only one transaction can successfully consume a stream at a time*. If multiple transactions attempt to consume the same stream, only the first committed transaction succeeds, others fail.

### Table Metadata for Stream

**A stream does not store any data for a table**. After creating a stream for a table, Databend introduces specific hidden metadata columns to the table for change tracking purposes. These columns include:

| Column                | Description                                                                       |
|-----------------------|-----------------------------------------------------------------------------------|
| _origin_version       | Identifies the table version in which this row was initially created.             |
| _origin_block_id      | Identifies the block ID to which this row belonged previously.                    |
| _origin_block_row_num | Identifies the row number within the block to which this row belonged previously. |
| _row_version          | Identifies the row version, starting at 0 and incrementing by 1 with each update. |

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
  _origin_block_row_num,
  _row_version
FROM
  t;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │  _origin_version │     _origin_block_id     │ _origin_block_row_num │ _row_version │
├─────────────────┼──────────────────┼──────────────────────────┼───────────────────────┼──────────────┤
│               1 │             NULL │ NULL                     │                  NULL │            0 │
│               2 │             NULL │ NULL                     │                  NULL │            0 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────┘

UPDATE t SET a = 3 WHERE a = 2;
SELECT
  *,
  _origin_version,
  _origin_block_id,
  _origin_block_row_num,
  _row_version
FROM
  t;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │  _origin_version │             _origin_block_id            │ _origin_block_row_num │ _row_version │
├─────────────────┼──────────────────┼─────────────────────────────────────────┼───────────────────────┼──────────────┤
│               3 │             2317 │ 132795849016460663684755265365603707394 │                     0 │            1 │
│               1 │             NULL │ NULL                                    │                  NULL │            0 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Stream Columns

You can use the SELECT statement to directly query a stream and retrieve the tracked changes. When querying a stream, consider incorporating these hidden columns for additional details about the changes:

| Column           | Description                                                                                                                                                                       |
|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| change$action    | Type of change: INSERT or DELETE.                                                                                                                                                 |
| change$is_update | Indicates whether the `change$action` is part of an UPDATE. In a stream, an UPDATE is represented by a combination of DELETE and INSERT operations, with this field set to  `true`. |
| change$row_id    | Unique identifier for each row to track changes.                                                                                                                                  |

```sql title='Example:'
CREATE TABLE t(a int);
INSERT INTO t VALUES (1);
CREATE STREAM s ON TABLE t;
INSERT INTO t VALUES (2);

SELECT a, change$action, change$is_update, change$row_id 
FROM s;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               2 │ INSERT        │ false            │ a577745c6a404f3384fa95791eb43f22000000 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

-- If you add a new row and then update it, 
-- the stream considers the changes as an INSERT with your updated value.
UPDATE t SET a = 3 WHERE a = 2;
SELECT a, change$action, change$is_update, change$row_id 
FROM s;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               3 │ INSERT        │ false            │ a577745c6a404f3384fa95791eb43f22000000 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Managing Streams

To manage streams in Databend, use the following commands:

<IndexOverviewList />

### Example: Tracking and Transforming Data in Real-Time

The following example demonstrates how to use streams to capture and track user activities in real-time.

#### 1. Creating Tables

The example uses three tables: 
* `user_activities` table records user activities.
* `user_profiles` table stores user profiles.
* `user_activity_profiles` table is a combined view of the two tables.

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
WHEN system$stream_has_data('activities_stream') AS 
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

:::tip Task in Private Preview
The `TASK` command is currently in private preview, so the synatx and usage may change in the future.
:::
