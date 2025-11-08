---
title: Tracking and Transforming Data via Streams
sidebar_label: Stream
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

A stream in Databend is an always-on change table: every committed INSERT, UPDATE, or DELETE is captured until you consume it. This page stays lean—first a quick overview, then one lab with real outputs so you can see streams in action.

## Stream Overview

- Streams don’t duplicate table storage; they list the latest change for each affected row until you consume it.
- Consumption (task, INSERT ... SELECT, `WITH CONSUME`, etc.) clears the stream while keeping it ready for new data.
- `APPEND_ONLY` defaults to `true`; set `APPEND_ONLY = false` only when you must capture UPDATE/DELETE events.

| Mode | Captures | Typical use |
| --- | --- | --- |
| Standard (`APPEND_ONLY = false`) | INSERT + UPDATE + DELETE, collapsed to the latest state per row. | Slowly changing dimensions, compliance audits. |
| Append-Only (`APPEND_ONLY = true`, default) | INSERT only. | Append-only fact/event ingestion. |

## Quickstart: Append-Only vs. Standard Streams

Run the statements below in any Databend deployment (Cloud worksheet or local). Start with the default append-only experience, then see how Standard streams extend it for UPDATE/DELETE workloads.

### Append-Only Streams: Capture Inserts

<StepsWrap>
<StepContent number="1">

#### Step 1 · Create a table and an append-only stream

```sql
CREATE OR REPLACE TABLE sensor_readings (
    sensor_id INT,
    temperature DOUBLE
);

-- APPEND_ONLY defaults to true, so no extra clause is required.
CREATE OR REPLACE STREAM sensor_readings_stream
    ON TABLE sensor_readings;
```

</StepContent>
<StepContent number="2">

#### Step 2 · Insert sample rows and preview the stream

```sql
INSERT INTO sensor_readings VALUES (1, 21.5), (2, 19.7);

SELECT sensor_id, temperature, change$action, change$is_update
FROM sensor_readings_stream;
```

Output:

```
┌────────────┬───────────────┬───────────────┬──────────────────┐
│ sensor_id  │ temperature   │ change$action │ change$is_update │
├────────────┼───────────────┼───────────────┼──────────────────┤
│          1 │ 21.5          │ INSERT        │ false            │
│          2 │ 19.7          │ INSERT        │ false            │
└────────────┴───────────────┴───────────────┴──────────────────┘
```

</StepContent>
<StepContent number="3">

#### Step 3 · Consume the stream into a target table

```sql
CREATE OR REPLACE TABLE sensor_readings_latest AS
SELECT sensor_id, temperature
FROM sensor_readings_stream;

SELECT * FROM sensor_readings_stream; -- now empty
```

`SELECT * FROM sensor_readings_stream` now returns no rows, confirming that consumption drains the captured changes. Future inserts into `sensor_readings` will show up again until you consume them.

</StepContent>
</StepsWrap>

### Standard Streams: Capture Updates and Deletes

<StepsWrap>
<StepContent number="1">

#### Step 1 · Create a Standard stream on the same table

```sql
CREATE OR REPLACE STREAM sensor_readings_stream_std
    ON TABLE sensor_readings
    APPEND_ONLY = false;
```

</StepContent>
<StepContent number="2">

#### Step 2 · Mutate rows and compare both streams

```sql
UPDATE sensor_readings SET temperature = 22 WHERE sensor_id = 1;
DELETE FROM sensor_readings WHERE sensor_id = 2;

SELECT * FROM sensor_readings_stream; -- still empty (Append-Only ignores updates/deletes)

SELECT sensor_id, temperature, change$action, change$is_update
FROM sensor_readings_stream_std
ORDER BY change$row_id;
```

Output:

```
┌────────────┬───────────────┬───────────────┬──────────────────┐
│ sensor_id  │ temperature   │ change$action │ change$is_update │
├────────────┼───────────────┼───────────────┼──────────────────┤
│          1 │ 21.5          │ DELETE        │ true             │
│          1 │ 22            │ INSERT        │ true             │
│          2 │ 19.7          │ DELETE        │ false            │
└────────────┴───────────────┴───────────────┴──────────────────┘
```

Append-Only streams are perfect for insert-only pipelines, while Standard streams let you react to every mutation.

</StepContent>
</StepsWrap>
## Takeaways

- Consuming a stream drains the captured rows without disabling future tracking.
- Append-Only streams are the default and focus on INSERT workloads; switch to Standard when you must surface UPDATE or DELETE activity.
- To automate the copy step, follow the [task-based sensor pipeline demo](02-task.md#hands-on-demo-build-a-sensor-events-pipeline).

## Reference

### Transaction Rules

- Stream consumption is transactional per statement. When `INSERT INTO table SELECT * FROM stream` commits, the source stream is consumed. If the statement fails or is rolled back, the stream stays intact.
- Only one transaction can successfully consume a given stream at a time; concurrent consumers beyond the first will fail.

### Base Table Metadata Columns

When you create a stream, Databend adds hidden metadata columns to the underlying table so it can reconstruct prior versions:

| Column | Description |
| --- | --- |
| \_origin_version | Table version in which the row first appeared. |
| \_origin_block_id | Block identifier that stored the previous version of the row. |
| \_origin_block_row_num | Row number inside that previous block. |

Inspect them by querying the base table:

```sql
SELECT a, _origin_version, _origin_block_id, _origin_block_row_num
FROM t;
```

Rows that have never been updated show NULLs; once you update a row, these columns record the source version metadata.

Example output:

```
┌────────┬─────────────────┬────────────────────────────────────────┬──────────────────────────┐
│    a   │ _origin_version │            _origin_block_id            │ _origin_block_row_num    │
├────────┼─────────────────┼────────────────────────────────────────┼──────────────────────────┤
│    1   │ NULL            │ NULL                                   │ NULL                     │
│    3   │ 1024            │ 6f1a9a3b5822499c9d1f63f95501dd9f       │ 0                        │
└────────┴─────────────────┴────────────────────────────────────────┴──────────────────────────┘
```

### Stream Output Columns

Every stream exposes helper columns alongside your business columns:

| Column | Description |
| --- | --- |
| change$action | `INSERT` or `DELETE`. |
| change$is_update | `true` when the action is part of an UPDATE pair (DELETE + INSERT). |
| change$row_id | Unique identifier for the changed row. |

Query a stream directly to inspect those values:

```sql
SELECT sensor_id, temperature, change$action, change$is_update
FROM sensor_readings_stream_std;
```

In a Standard stream, updating a row repeatedly before consumption keeps a single `INSERT` entry whose values reflect the latest mutation.

Example:

```
┌────────────┬───────────────┬───────────────┬──────────────────┐
│ sensor_id  │ temperature   │ change$action │ change$is_update │
├────────────┼───────────────┼───────────────┼──────────────────┤
│          1 │ 22            │ INSERT        │ true             │
└────────────┴───────────────┴───────────────┴──────────────────┘
```

After another update to the same row (before consumption), the stream still shows a single row with the refreshed value.
