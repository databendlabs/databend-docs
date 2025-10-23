---
title: Lakehouse ETL
---

> **Scenario:** EverDrive Smart Vision’s data engineering team ships every road-test batch as Parquet files so the unified workloads can load, query, and enrich the same telemetry inside Databend.

EverDrive’s ingest loop is straightforward:

```
Object-store export (Parquet for example) → Stage → COPY INTO → (optional) Stream & Task
```

Adjust bucket paths/credentials (and swap Parquet for your actual format if different), then paste the commands below. All syntax mirrors the official [Load Data guides](/guides/load-data/).

---

## 1. Stage
EverDrive’s data engineering team exports four files per batch—sessions, frame events, detection payloads (with nested JSON fields), and frame embeddings—to an S3 bucket. This guide uses Parquet as the example format, but you can plug in CSV, JSON, or other supported formats by adjusting the `FILE_FORMAT` clause. Create a named connection once, then reuse it across stages.

```sql
CREATE OR REPLACE CONNECTION everdrive_s3
  STORAGE_TYPE = 's3'
  ACCESS_KEY_ID = '<AWS_ACCESS_KEY_ID>'
  SECRET_ACCESS_KEY = '<AWS_SECRET_ACCESS_KEY>';

CREATE OR REPLACE STAGE drive_stage
  URL = 's3://everdrive-lakehouse/raw/'
  CONNECTION = (CONNECTION_NAME = 'everdrive_s3')
  FILE_FORMAT = (TYPE = 'PARQUET');
```

See [Create Stage](/sql/sql-commands/ddl/stage/ddl-create-stage) for additional options.

List the export folders (Parquet in this walkthrough) to confirm they are visible:

```sql
LIST @drive_stage/sessions/;
LIST @drive_stage/frame-events/;
LIST @drive_stage/payloads/;
LIST @drive_stage/embeddings/;
```

---

## 2. Preview
Before loading anything, peek inside the Parquet files to validate the schema and sample records.

```sql
SELECT *
FROM @drive_stage/sessions/session_2024_08_16.parquet
LIMIT 5;

SELECT *
FROM @drive_stage/frame-events/frame_events_2024_08_16.parquet
LIMIT 5;
```

Repeat the preview for payloads and embeddings as needed. Databend automatically uses the file format specified on the stage.

---

## 3. COPY INTO
Load each file into the tables used throughout the guides. Use inline casts to map incoming columns to table columns; the projections below assume Parquet but the same shape applies to other formats.

### Sessions
```sql
COPY INTO drive_sessions (session_id, vehicle_id, route_name, start_time, end_time, weather, camera_setup)
FROM (
  SELECT session_id::STRING,
         vehicle_id::STRING,
         route_name::STRING,
         start_time::TIMESTAMP,
         end_time::TIMESTAMP,
         weather::STRING,
         camera_setup::STRING
  FROM @drive_stage/sessions/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### Frame Events
```sql
COPY INTO frame_events (frame_id, session_id, frame_index, captured_at, event_type, risk_score)
FROM (
  SELECT frame_id::STRING,
         session_id::STRING,
         frame_index::INT,
         captured_at::TIMESTAMP,
         event_type::STRING,
         risk_score::DOUBLE
  FROM @drive_stage/frame-events/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### Detection Payloads
The payload files include nested columns (`payload` column is a JSON object). Use the same projection to copy them into the `frame_payloads` table.

```sql
COPY INTO frame_payloads (frame_id, run_stage, payload, logged_at)
FROM (
  SELECT frame_id::STRING,
         run_stage::STRING,
         payload,
         logged_at::TIMESTAMP
  FROM @drive_stage/payloads/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### Frame Embeddings
```sql
COPY INTO frame_embeddings (frame_id, session_id, embedding, model_version, created_at)
FROM (
  SELECT frame_id::STRING,
         session_id::STRING,
         embedding::VECTOR(4),     -- Replace 4 with your actual embedding dimension
         model_version::STRING,
         created_at::TIMESTAMP
  FROM @drive_stage/embeddings/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

All downstream guides (analytics/search/vector/geo) now see this batch.

---

## 4. Stream (Optional)
If you want downstream jobs to react to new rows after each `COPY INTO`, create a stream on the key tables (for example `frame_events`). Stream usage follows the [Continuous Pipeline → Streams](/guides/load-data/continuous-data-pipelines/stream) guide.

```sql
CREATE OR REPLACE STREAM frame_events_stream ON TABLE frame_events;

SELECT * FROM frame_events_stream;  -- Shows new rows since the last consumption
```

After processing the stream, call `CONSUME STREAM frame_events_stream;` (or insert the rows into another table) to advance the offset.

---

## 5. Task (Optional)
Tasks execute **one SQL statement** on a schedule. Create a small task for each table (or call a stored procedure if you prefer a single entry point).

```sql
CREATE OR REPLACE TASK task_load_sessions
  WAREHOUSE = 'default'
  SCHEDULE = 5 MINUTE
AS
  COPY INTO drive_sessions (session_id, vehicle_id, route_name, start_time, end_time, weather, camera_setup)
  FROM (
    SELECT session_id::STRING,
           vehicle_id::STRING,
           route_name::STRING,
           start_time::TIMESTAMP,
           end_time::TIMESTAMP,
           weather::STRING,
           camera_setup::STRING
    FROM @drive_stage/sessions/
  )
  FILE_FORMAT = (TYPE = 'PARQUET');

ALTER TASK task_load_sessions RESUME;

CREATE OR REPLACE TASK task_load_frame_events
  WAREHOUSE = 'default'
  SCHEDULE = 5 MINUTE
AS
  COPY INTO frame_events (frame_id, session_id, frame_index, captured_at, event_type, risk_score)
  FROM (
    SELECT frame_id::STRING,
           session_id::STRING,
           frame_index::INT,
           captured_at::TIMESTAMP,
           event_type::STRING,
           risk_score::DOUBLE
    FROM @drive_stage/frame-events/
  )
  FILE_FORMAT = (TYPE = 'PARQUET');

ALTER TASK task_load_frame_events RESUME;

-- Repeat for frame_payloads and frame_embeddings
```

See [Continuous Pipeline → Tasks](/guides/load-data/continuous-data-pipelines/task) for cron syntax, dependencies, and error handling.
