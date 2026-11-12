---
title: "Query API"
sidebar_label: "Query API"
---

Read the [Overview](./index.md) first for authentication, request conventions, and errors.

These endpoints run SQL. They already accept API tokens. They use the `X-DATABENDCLOUD-ORG` and `X-DATABENDCLOUD-WAREHOUSE` headers. For request and response details, see the [Query API reference](https://raw.githubusercontent.com/databendcloud/databend-cloud-skill/main/references/query-api.md).

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/query` | Run SQL. |
| `GET` | `/v1/query/{queryId}` | Get the query status. |
| `GET` | `/v1/query/{queryId}/page/{pageNum}` | Get one result page. |
| `GET` | `/v1/query/{queryId}/final` | Release the result. |
| `POST` | `/v1/query/{queryId}/kill` | Cancel the query. |

A warehouse can have more than one cluster, and a query runs on one of them. Each Query API response has an `X-DATABEND-ROUTE-HINT` header that names that cluster. Send this header back, with the value from the latest response, on every later request for the same query: status, pages, final, and kill. Without it, the request can reach another cluster and fail with `Query ID ... not found`. If you use a session, also send the header on the next `POST /v1/query` of that session, so that the query runs on the cluster that holds the session state. See [Session Endpoints](#session-endpoints).

```bash
# Start a query. The first request has no route hint.
curl -s -X POST "https://api.databend.com/v1/query" \
  -H "X-DATABENDCLOUD-TOKEN: <api-token>" \
  -H "X-DATABENDCLOUD-ORG: <organization-id>" \
  -H "X-DATABENDCLOUD-WAREHOUSE: <warehouse-name>" \
  -H "Content-Type: application/json" \
  -d '{"sql":"SELECT 1"}'

# Fetch a later page with the route hint of the latest response.
curl -s "https://api.databend.com/v1/query/<query-id>/page/1" \
  -H "X-DATABENDCLOUD-TOKEN: <api-token>" \
  -H "X-DATABENDCLOUD-ORG: <organization-id>" \
  -H "X-DATABENDCLOUD-WAREHOUSE: <warehouse-name>" \
  -H "X-DATABEND-ROUTE-HINT: <route-hint>"
```

Responses can also have `X-DATABEND-SESSION-ID`. The Cloud console uses it. Scripts and agents can ignore it.

## Request Body

`POST /v1/query` accepts the fields below. The server does not forward other fields, such as `stage_attachment` and `string_fields`. For the response format, see the [Databend HTTP API](/developer/apis/http).

| Field | Type | Required | Description |
|---|---|---|---|
| `sql` | string | Yes | The SQL statement. |
| `session` | object | No | The session state that the query runs in. See the table below. |
| `pagination` | object | No | Result paging. See the table below. |
| `params` | JSON | No | Values for the placeholders in `sql`. Databend checks them. The server does not log them. |
| `query_id` | string | No | A query ID that you choose, at most 1,024 characters. You know the ID before the first response arrives. |

`session` fields:

| Field | Type | Description |
|---|---|---|
| `database` | string | Current database. Default: `default`. |
| `role` | string | Role that runs the query. Default: the default role of your account. |
| `settings` | object | Session settings. Each value is a string, for example `{"max_threads":"4"}`. |

Each response has a `session` object with the state after the query, for example after `USE` or `SET`. To run the next query in the same state, send that object back unchanged in the next request. State that is not in this object, such as temporary tables, needs the [session endpoints](#session-endpoints).

`pagination` fields:

| Field | Type | Description |
|---|---|---|
| `wait_time_secs` | integer | Seconds that a request waits for the next page. The server changes a value below 1 to 1, and a value above 30 to 30. |
| `max_rows_per_page` | integer | Rows per page, at least 1. A page is also limited to about 4 MiB. |
| `max_rows_in_buffer` | integer | Rows that the warehouse keeps ready for the client. |

Request example:

```json
{
  "sql": "SELECT count(*) FROM orders",
  "session": { "database": "sales", "role": "analyst", "settings": { "max_threads": "4" } },
  "pagination": { "wait_time_secs": 10, "max_rows_per_page": 1000 }
}
```

## Session Endpoints

**An ordinary SQL query does not need these endpoints.** To run SQL and read the result, call `POST /v1/query`, follow `next_uri` until the result ends, and call `final`. Each query then runs in its own session.

Use the session endpoints only in a client that keeps one session across several queries, as a SQL driver such as BendSQL does. A session holds state such as the current database, settings, and temporary tables. To keep it, send `X-DATABEND-CLIENT-CAPS: session_header` on every request, and send back the `X-DATABEND-SESSION` header value from the previous response. Do not depend on cookies.

| Endpoint | When to call it | Details |
|---|---|---|
| `POST /v1/session/login` | Before the first query of the session, to check the database and role and to read the server version. | Body: a Databend login object, for example `{"database":"default","role":"analyst"}`. The server always sets `disable_session_token` to `true`, so the response has no session token. `X-DATABENDCLOUD-WAREHOUSE` is optional. The returned `version` is the version of the management service and can differ from the warehouse version. Read the warehouse version from the `X-DATABEND-VERSION` header of a query response. Login does not resume a suspended warehouse. |
| `POST /v1/session/heartbeat` | While the client still reads a result slowly, or while the session holds temporary tables. A query result expires after about 60 seconds without a request. | Body: `{"node_to_queries":{"<node-id>":["<query-id>"]}}`. Take `node_id` from the query response. A heartbeat to a suspended warehouse resumes it. |
| `POST /v1/session/logout` | When the client closes, to drop temporary tables at once. Without logout, they stay until the session times out (4 hours by default). | No body. A logout to a suspended warehouse resumes it. |

A body larger than 1 MiB returns HTTP 413. `/v1/session/refresh` is not available: it renews Databend session tokens, and this API does not issue them.

```bash
# Check the session options before the first query.
curl -s -i -X POST "https://api.databend.com/v1/session/login" \
  -H "X-DATABENDCLOUD-TOKEN: <api-token>" \
  -H "X-DATABENDCLOUD-ORG: <organization-id>" \
  -H "X-DATABEND-CLIENT-CAPS: session_header" \
  -H "Content-Type: application/json" \
  -d '{"database":"<database-name>"}'

# Keep query q1, which runs on node-1, alive.
curl -s -X POST "https://api.databend.com/v1/session/heartbeat" \
  -H "X-DATABENDCLOUD-TOKEN: <api-token>" \
  -H "X-DATABENDCLOUD-ORG: <organization-id>" \
  -H "X-DATABENDCLOUD-WAREHOUSE: <warehouse-name>" \
  -H "X-DATABEND-CLIENT-CAPS: session_header" \
  -H "X-DATABEND-SESSION: <session-header-value>" \
  -H "Content-Type: application/json" \
  -d '{"node_to_queries":{"node-1":["q1"]}}'
```
