---
title: HTTP Streaming Load (Local Files)
sidebar_label: HTTP Streaming Load
sidebar_position: 30
---

This page describes **HTTP Streaming Load** for **self-hosted Databend** (Databend Query HTTP handler).

Use it to upload a local file and load it into a table **in the same request** (no staging step).

## Overview

HTTP streaming load is an HTTP endpoint that accepts a file upload (multipart) and executes an `INSERT` statement that reads from the special placeholder `@_databend_load`.

It is useful when you:

- Want to load a local file without uploading it to a stage first.
- Need to stream large files that should not be stored as a single object in object storage.

## API Usage

**Endpoint:** `PUT /v1/streaming_load`

### Request

- Auth: HTTP Basic auth (same as other HTTP handler endpoints).
- Headers:
  - `X-Databend-SQL` (required): an `INSERT` statement that reads from `@_databend_load`.
- Body:
  - `multipart/form-data` with a single file field named `upload`.

**SQL format (required):**

```sql
INSERT INTO <db>.<table>[(<col1>, <col2>, ...)]
[(VALUES (<expr_or_?>, ...))]
FROM @_databend_load
FILE_FORMAT=(type=<format> [<options>...])
```

### Specifying columns and using `VALUES`

You can:

- Specify the target columns: `INSERT INTO t(col1, col2, ...) ...`
- Provide `VALUES (...)` before `FROM`:
  - Use `?` as placeholders for fields read from the uploaded file (in order).
  - Mix `?` with constants.

Example (load two columns from a CSV file and set a constant):

```text
X-Databend-SQL: insert into demo.people(name,age,city) values (?, ?, 'BJ') from @_databend_load file_format=(type=csv skip_header=1)
```

### Column mapping rules

- **No column list, no `VALUES`**: file fields map to table columns by table definition order.
  - CSV header: `id,name,age`
  - SQL:
    ```text
    X-Databend-SQL: insert into demo.people from @_databend_load file_format=(type=csv skip_header=1)
    ```
- **With column list, no `VALUES`**: file fields map to the listed columns in order.
  - CSV header: `id,name`
  - SQL:
    ```text
    X-Databend-SQL: insert into demo.people(id,name) from @_databend_load file_format=(type=csv skip_header=1)
    ```
- **With column list and `VALUES`**:
  - Each target column gets the corresponding expression in `VALUES`.
  - Each `?` consumes one field from the uploaded file, in order.
  - CSV header: `name,age`
  - SQL:
    ```text
    X-Databend-SQL: insert into demo.people(name,age,city) values (?, ?, 'BJ') from @_databend_load file_format=(type=csv skip_header=1)
    ```
- **Columns not provided**:
  - Use column `DEFAULT` value if defined.
  - Otherwise insert `NULL` (and fail if the column is `NOT NULL`).
- **Read only part of a CSV (ignore extra fields)**:
  - By default, Databend errors if the file has more fields than the target column list.
  - To ignore extra fields, set `error_on_column_count_mismatch=false`:
    ```text
    X-Databend-SQL: insert into demo.people(id,name) from @_databend_load file_format=(type=csv skip_header=1 error_on_column_count_mismatch=false)
    ```
  - This only helps when you want the **first N fields**. Streaming load maps CSV fields by position and does not support selecting non-adjacent fields (for example, `id,name,age` → insert only `id` and `age`).
    - Workaround: preprocess the CSV to keep only the needed columns, or load via stage and project columns (for example, `SELECT $1, $3 FROM @stage/file.csv`).

**cURL template:**

```shell
curl -u "<user>:<password>" \
  -H "X-Databend-SQL: insert into <db>.<table> from @_databend_load file_format=(type=csv ...)" \
  -F "upload=@./file.csv" \
  -X PUT "http://<host>:8000/v1/streaming_load"
```

Example (CSV with header row):

```text
X-Databend-SQL: insert into demo.people from @_databend_load file_format=(type=csv skip_header=1)
```

### Response

On success, returns JSON like:

```json
{"id":"<query_id>","stats":{"rows":<rows>,"bytes":<bytes>}}
```

### Notes & Limitations

- `@_databend_load` is only valid for `PUT /v1/streaming_load`. It is not accepted by `POST /v1/query`.
- Supported formats for streaming load: **CSV**, **TSV**, **NDJSON**, **Parquet**.

## CSV FILE_FORMAT options

CSV options are specified in the `FILE_FORMAT=(...)` clause, using the same syntax as Databend file format options. See [Input & Output File Formats](/sql/sql-reference/file-format-options).

Common CSV options:

- `skip_header=1`: Skip the first header row.
- `field_delimiter=','`: Use a custom delimiter (default is `,`).
- `quote='\"'`: Quote character.
- `record_delimiter='\n'`: Line delimiter.
- `error_on_column_count_mismatch=false`: Allow column count mismatch and ignore extra fields.

Examples:

```text
X-Databend-SQL: insert into demo.people from @_databend_load file_format=(type=csv skip_header=1)
```

```text
X-Databend-SQL: insert into demo.people from @_databend_load file_format=(type=csv field_delimiter='|' quote='\"' skip_header=1)
```

## Tutorial

This tutorial uses a local CSV file and loads it into a table on a self-hosted Databend.

### Before You Start

- A running self-hosted `databend-query` with the HTTP handler enabled (default port `8000`).
- `curl` installed.

### Step 1. Start Databend with Docker (Quick Test)

:::note
`PUT /v1/streaming_load` is available in recent nightly builds. If you use a stable Docker tag and get `404 Not Found`, try the `:nightly` image (or build Databend from source).
:::

```shell
docker run -d --name databend-streaming-load \
  -p 8000:8000 \
  -e MINIO_ENABLED=true \
  -e QUERY_DEFAULT_USER=databend \
  -e QUERY_DEFAULT_PASSWORD=databend \
  --restart unless-stopped \
  datafuselabs/databend:nightly
```

Wait until it is ready:

```shell
docker logs -f databend-streaming-load
```

### Step 2. Create a Table

Create a table with an extra `city` column (used later in the optional step):

```shell
curl -sS -u databend:databend \
  -H 'Content-Type: application/json' \
  -d '{"sql":"create database if not exists demo"}' \
  http://localhost:8000/v1/query/ >/dev/null

curl -sS -u databend:databend \
  -H 'Content-Type: application/json' \
  -d '{"sql":"create or replace table demo.people (id int, name string, age int, city string)"}' \
  http://localhost:8000/v1/query/ >/dev/null
```

### Step 3. Prepare a Local CSV File

This tutorial uses a CSV file with:

- A header row (`id,name,age`)
- Comma delimiter (`,`)

```shell
cat > people.csv << 'EOF'
id,name,age
1,Alice,30
2,Bob,41
EOF
```

### Step 4. Upload and Load with HTTP Streaming Load

Send a `PUT /v1/streaming_load` request:

- The SQL must be provided in header `X-Databend-SQL`.
- The file must be uploaded as `multipart/form-data` with field name `upload`.

```shell
curl -sS -u databend:databend \
  -H "X-Databend-SQL: insert into demo.people(id,name,age) from @_databend_load file_format=(type=csv field_delimiter=',' skip_header=1)" \
  -F "upload=@./people.csv" \
  -X PUT "http://localhost:8000/v1/streaming_load"
```

### Step 5. Verify the Data

```shell
curl -sS -u databend:databend \
  -H 'Content-Type: application/json' \
  -d '{"sql":"select * from demo.people order by id"}' \
  http://localhost:8000/v1/query/
```

### (Optional) Step 6. Load into selected columns with `VALUES`

This step shows how to load only some columns from the uploaded file, and fill the rest with constants.

1. Prepare a CSV file that contains only `name` and `age`:

```shell
cat > people_name_age.csv << 'EOF'
name,age
Carol,25
Dave,52
EOF
```

2. Load the file into `demo.people`, set `city` to a constant:

```shell
curl -sS -u databend:databend \
  -H "X-Databend-SQL: insert into demo.people(name,age,city) values (?, ?, 'BJ') from @_databend_load file_format=(type=csv skip_header=1)" \
  -F "upload=@./people_name_age.csv" \
  -X PUT "http://localhost:8000/v1/streaming_load"
```

3. Verify:

```shell
curl -sS -u databend:databend \
  -H 'Content-Type: application/json' \
  -d '{"sql":"select id,name,age,city from demo.people order by name"}' \
  http://localhost:8000/v1/query/
```

## Troubleshooting

- `404 Not Found` on `/v1/streaming_load`: use `datafuselabs/databend:nightly` (or build Databend from source).
- `415 Unsupported Media Type`: send `multipart/form-data` and include exactly one file field named `upload`.
- `400 Missing required header X-Databend-SQL`: add the `X-Databend-SQL` header and make sure it contains `FROM @_databend_load`.
