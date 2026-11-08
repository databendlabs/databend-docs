---
title: HTTP Handler
sidebar_label: REST API
---

import FunctionDescription from '@site/src/components/FunctionDescription';

The Databend HTTP Handler is a REST API that enables you to send SQL queries to Databend and receive results directly via HTTP requests. This is useful for building custom integrations, automation scripts, or when you need direct programmatic access without using a driver.

:::tip[Recommended Alternatives]
For most use cases, we recommend using:
- **[BendSQL](/guides/connect/sql-clients/bendsql)** - Official command-line client for interactive queries
- **[Python Driver](/developer/drivers/python)** - For Python applications
- **[Go Driver](/developer/drivers/golang)** - For Go applications
- **[Node.js Driver](/developer/drivers/nodejs)** - For Node.js applications

The HTTP API is ideal for scenarios where you need lightweight HTTP-based integration or are building custom tooling.
:::

## Quick Start: Connecting to Databend

### Databend Cloud

When you connect to Databend Cloud, you receive a DSN (Data Source Name) like this:

```
databend://user:password@tn3ftqihs.gw.aws-us-east-2.default.databend.com:443/default?warehouse=my-warehouse
```

To use the HTTP API, extract the components as follows:

| DSN Component | Description | HTTP API Usage |
|---------------|-------------|----------------|
| `user:password` | Your credentials | Basic auth: `-u "user:password"` |
| `tn3ftqihs` | Your tenant ID | Part of the endpoint host |
| `tn3ftqihs.gw...databend.com` | Full host | Endpoint: `https://<host>/v1/query/` |
| `warehouse=my-warehouse` | Warehouse name | Header: `X-DATABEND-WAREHOUSE: my-warehouse` |
| `default` | Database name | In request body: `"session": {"database": "default"}` |

**Complete example:**

```bash
curl -u "user:password" \
  --request POST \
  'https://tn3ftqihs.gw.aws-us-east-2.default.databend.com/v1/query/' \
  --header 'Content-Type: application/json' \
  --header 'X-DATABEND-WAREHOUSE: my-warehouse' \
  --data-raw '{"sql": "SELECT 1"}'
```

### Self-Hosted Databend

For self-hosted installations, the HTTP handler runs on port 8000 by default:

```bash
curl -u root: \
  --request POST \
  'http://localhost:8000/v1/query/' \
  --header 'Content-Type: application/json' \
  --data-raw '{"sql": "SELECT 1"}'
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/query` | POST | Execute a SQL query |
| `/v1/query/<query_id>` | GET | Get query status and stats |
| `/v1/query/<query_id>/page/<page_no>` | GET | Get a specific page of results |
| `/v1/query/<query_id>/kill` | GET | Cancel a running query |
| `/v1/query/<query_id>/final` | GET | Get final results and close query |
| `/v1/upload_to_stage` | PUT | Upload a file to a stage |

---

## Execute Query

Execute a SQL statement and get results.

**Endpoint:** `POST /v1/query`

### Request

```bash
curl -u "user:password" \
  --request POST \
  'https://<endpoint>/v1/query/' \
  --header 'Content-Type: application/json' \
  --header 'X-DATABEND-WAREHOUSE: <warehouse>' \
  --data-raw '{
    "sql": "SELECT number, number * 2 AS double FROM numbers(5)",
    "pagination": {
      "wait_time_secs": 5
    }
  }'
```

### Response

```json
{
  "id": "b22c5bba-5e78-4e50-87b0-ec3855c757f5",
  "session_id": "5643627c-a900-43ac-978f-8c76026d9944",
  "session": {},
  "schema": [
    {"name": "number", "type": "UInt64"},
    {"name": "double", "type": "UInt64"}
  ],
  "data": [
    ["0", "0"],
    ["1", "2"],
    ["2", "4"],
    ["3", "6"],
    ["4", "8"]
  ],
  "state": "Succeeded",
  "error": null,
  "stats": {
    "scan_progress": {"rows": 5, "bytes": 40},
    "write_progress": {"rows": 0, "bytes": 0},
    "result_progress": {"rows": 5, "bytes": 80},
    "running_time_ms": 12.443044
  },
  "stats_uri": "/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5",
  "final_uri": "/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/final",
  "next_uri": null,
  "kill_uri": "/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/kill"
}
```

### Request Parameters

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| sql | string | Yes | - | SQL statement to execute |
| session_id | string | No | - | Reuse an existing session |
| session | object | No | - | Session configuration (see below) |
| pagination | object | No | - | Pagination settings (see below) |

**Session Object:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| database | string | "default" | Current database |
| keep_server_session_secs | int | 0 | Keep session alive for N seconds |
| settings | map | {} | Query settings (values as strings) |

**Pagination Object:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| wait_time_secs | int | 1 | Max seconds to wait for results |

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique query ID |
| session_id | string | Session ID for reuse |
| state | string | `Running`, `Succeeded`, or `Failed` |
| schema | array | Column definitions |
| data | array | Result rows as string arrays |
| error | object | Error details (null if successful) |
| stats | object | Execution statistics |
| next_uri | string | URL for next page (null if complete) |
| final_uri | string | URL to finalize and close query |
| kill_uri | string | URL to cancel the query |

---

## Get Query Status

Get the current status and statistics of a query without fetching more data.

**Endpoint:** `GET /v1/query/<query_id>`

### Request

```bash
curl -u "user:password" \
  'https://<endpoint>/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5' \
  --header 'X-DATABEND-WAREHOUSE: <warehouse>'
```

### Response

```json
{
  "id": "b22c5bba-5e78-4e50-87b0-ec3855c757f5",
  "session_id": "5643627c-a900-43ac-978f-8c76026d9944",
  "session": {},
  "schema": [],
  "data": [],
  "state": "Succeeded",
  "error": null,
  "stats": {
    "scan_progress": {"rows": 5, "bytes": 40},
    "write_progress": {"rows": 0, "bytes": 0},
    "result_progress": {"rows": 5, "bytes": 80},
    "running_time_ms": 12.443044
  },
  "next_uri": null
}
```

---

## Get Next Page

Fetch the next page of results for a running or completed query.

**Endpoint:** `GET /v1/query/<query_id>/page/<page_no>`

### Request

```bash
curl -u "user:password" \
  'https://<endpoint>/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/page/1' \
  --header 'X-DATABEND-WAREHOUSE: <warehouse>'
```

### Response

```json
{
  "id": "b22c5bba-5e78-4e50-87b0-ec3855c757f5",
  "session_id": "5643627c-a900-43ac-978f-8c76026d9944",
  "schema": [
    {"name": "number", "type": "UInt64"}
  ],
  "data": [
    ["5"],
    ["6"],
    ["7"],
    ["8"],
    ["9"]
  ],
  "state": "Succeeded",
  "next_uri": "/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/page/2"
}
```

---

## Cancel Query

Terminate a running query.

**Endpoint:** `GET /v1/query/<query_id>/kill`

### Request

```bash
curl -u "user:password" \
  'https://<endpoint>/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/kill' \
  --header 'X-DATABEND-WAREHOUSE: <warehouse>'
```

### Response

Returns an empty body with status code 200 on success.

---

## Finalize Query

Close the query and release server resources. This also returns the final result page if any.

**Endpoint:** `GET /v1/query/<query_id>/final`

### Request

```bash
curl -u "user:password" \
  'https://<endpoint>/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/final' \
  --header 'X-DATABEND-WAREHOUSE: <warehouse>'
```

### Response

```json
{
  "id": "b22c5bba-5e78-4e50-87b0-ec3855c757f5",
  "state": "Succeeded",
  "data": [],
  "error": null,
  "stats": {
    "running_time_ms": 12.443044
  }
}
```

---

## Upload to Stage

Upload a file to an internal or external stage.

**Endpoint:** `PUT /v1/upload_to_stage`

### Request

```bash
curl -u "user:password" \
  -H "stage_name:my_stage" \
  -F "upload=@./data.csv" \
  -XPUT 'https://<endpoint>/v1/upload_to_stage'
```

### Response

```json
{
  "id": "bf44e659-7d2b-4c0f-ae09-693e77258183",
  "stage_name": "my_stage",
  "state": "SUCCESS",
  "files": ["data.csv"]
}
```

---

## Insert from Stage

Insert data from a staged file into a table using stage attachment.

**Endpoint:** `POST /v1/query`

### Request

```bash
curl -u "user:password" \
  --request POST \
  'https://<endpoint>/v1/query/' \
  --header 'Content-Type: application/json' \
  --header 'X-DATABEND-WAREHOUSE: <warehouse>' \
  --data-raw '{
    "sql": "INSERT INTO my_table (id, name, value) VALUES",
    "stage_attachment": {
      "location": "@my_stage/data.csv",
      "file_format_options": {
        "type": "CSV",
        "skip_header": "1"
      },
      "copy_options": {
        "purge": "true"
      }
    }
  }'
```

### Response

```json
{
  "id": "92182fc6-11b9-461b-8fbd-f82ecaa637ef",
  "session_id": "f5caf18a-5dc8-422d-80b7-719a6da76039",
  "schema": [],
  "data": [],
  "state": "Succeeded",
  "error": null,
  "stats": {
    "scan_progress": {"rows": 100, "bytes": 2560},
    "write_progress": {"rows": 100, "bytes": 2560},
    "running_time_ms": 143.632441
  }
}
```

:::tip
Use the same [FILE_FORMAT](/sql/sql-commands/dml/dml-copy-into-table) and [COPY_OPTIONS](/sql/sql-commands/dml/dml-copy-into-table) available in COPY INTO. Set `purge: true` to delete the source file after successful insert.
:::

---

## Session Examples

### Using Session Settings

**Request:**

```bash
curl -u "user:password" \
  --request POST \
  'https://<endpoint>/v1/query/' \
  --header 'Content-Type: application/json' \
  --header 'X-DATABEND-WAREHOUSE: <warehouse>' \
  --data-raw '{
    "sql": "SELECT * FROM my_table",
    "session": {
      "database": "production",
      "settings": {
        "max_threads": "4",
        "max_memory_usage": "10737418240"
      }
    }
  }'
```

### SET Statement

**Request:**

```json
{
  "sql": "SET max_threads = 8",
  "session": {
    "database": "default",
    "settings": {"max_threads": "4"}
  }
}
```

**Response:**

```json
{
  "id": "abc123",
  "state": "Succeeded",
  "session": {
    "database": "default",
    "settings": {"max_threads": "8"}
  },
  "affect": {
    "type": "ChangeSetting",
    "key": "max_threads",
    "value": "8",
    "is_global": false
  }
}
```

### USE Statement

**Request:**

```json
{
  "sql": "USE production",
  "session": {
    "database": "default"
  }
}
```

**Response:**

```json
{
  "id": "abc123",
  "state": "Succeeded",
  "session": {
    "database": "production"
  },
  "affect": {
    "type": "UseDB",
    "name": "production"
  }
}
```

---

<h2 id="session-recovery">Session Recovery</h2>

<FunctionDescription description="Introduced or updated: Unreleased"/>

A materialized CTE alone does not require sticky routing. User-created temporary tables and active transactions still require the same node.

Custom HTTP clients must inspect `error.code`, including in HTTP 400 responses:

| Error code | Meaning | Client action |
|------------|---------|---------------|
| `5110` (`SessionTimeout`) | The server checked for the claimed temporary tables and found none. | Use the returned session state. The response clears the stale temporary-table and sticky-routing flags. |
| `5111` (`SessionLost`) | The request can have reached the wrong node. The original node can still hold the session state. | Do not discard sticky state based on this code alone. |
| `5113` (`SessionNodeLost`) | The sticky node is no longer in the cluster. Its temporary tables and transaction state are lost. | Discard the stale sticky routing. Use the corrected session when the response includes one. |

For `5113`, HTTP status remains 400. The error message still starts with `Sticky session state lost`. Do not match this case as `BadArguments` or code `1006`. Earlier responses wrapped this error and exposed HTTP code `400` in `error.code`.

When the server can read the request session, `POST /v1/query` returns a corrected `session`. It preserves the database, role, settings, and variables. It clears `need_sticky`, `need_keep_alive`, and `internal.has_temp_table`. An active transaction becomes `Fail`. The recovery path reads at most 1 MiB of the request body. If it cannot read the session, the response contains no corrected session.

Page and final requests return `session: null` for `5113`. Logout, heartbeat, and catalog requests return only the error object. Do not resume a lost transaction or retry statements blindly. Check your driver's recovery behavior. This server change does not guarantee that existing drivers apply session state from HTTP 400 responses.

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success (check `error` field for query-level errors) |
| 400 | Invalid request format or lost sticky node; inspect `error.code` |
| 404 | Query or page not found |

---

## Client Implementations

- **Official CLI**: [BendSQL](https://github.com/databendlabs/bendsql) - Built on this HTTP handler
- **Reference Implementation**: [sqllogictest client](https://github.com/databendlabs/databend/blob/main/tests/sqllogictests/src/client/http_client.rs)

---

## Admin API: Procedure Management

The following admin API endpoints are available for managing stored procedures. These endpoints are served on the admin API address (configured via `admin_api_address`) and require management mode.

### List All Procedures

```
GET /v1/tenants/<tenant>/procedures
```

Returns a JSON array of all procedures for the given tenant. The response format aligns with the [SHOW PROCEDURES](/sql/sql-commands/ddl/procedure/show-procedures) SQL command.

**Response fields:**

| Field        | Description                                |
| ------------ | ------------------------------------------ |
| name         | The procedure name                         |
| procedure_id | The unique procedure ID                    |
| arguments    | The procedure signature with return types  |
| comment      | User-provided comment                      |
| description  | Description (e.g., "user-defined procedure") |
| created_on   | Creation timestamp (UTC)                   |

### Get Procedure by ID

```
GET /v1/tenants/<tenant>/procedures/<procedure_id>
```

Returns the details of a specific procedure by its numeric ID. Returns `404` if not found.

### Get Procedure by Name

```
GET /v1/tenants/<tenant>/procedures/<name>?args=<arg_types>
```

Returns the details of a procedure by name. The `args` query parameter is a comma-separated list of argument types (e.g., `INT32,STRING`). Omit `args` for procedures that take no arguments.

**Response fields:**

| Field     | Description                          |
| --------- | ------------------------------------ |
| signature | The full procedure signature         |
| returns   | The return type                      |
| language  | The procedure language (e.g., SQL)   |
| body      | The procedure body                   |
