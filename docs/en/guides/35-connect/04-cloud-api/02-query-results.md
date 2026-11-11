---
title: "Query Results"
sidebar_label: "Query Results"
---

Read the [Overview](./index.md) first for authentication, request conventions, and errors.

## Download a Query Result as CSV

`GET /api/v1/orgs/{orgSlug}/query/{queryId}/download` · Read · Export

Downloads the cached result of a query as a CSV file. The query must have run through the Query API, and it must be complete.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `queryId` | path | string | Yes | Query ID from the Query API response. |
| `dryRun` | query | string | No | Set to `1` to check the export permission only. The server does not return a file. |

Limits:

- The file has a header row and 10,000 data rows or less.
- The server rejects a failed query or a query whose result is not complete with HTTP 400.

Example:

```bash
curl --location 'https://api.databend.com/api/v1/orgs/<organization-id>/query/<query-id>/download' \
  --header 'X-DATABENDCLOUD-TOKEN: <api-token>' \
  --output result.csv
```

Response: the file body, with `Content-Disposition: attachment; filename="<query-id>.csv"`. With `dryRun=1`, the response is:

```json
{ "success": true }
```

## Download a Query Result as Excel

`GET /api/v1/orgs/{orgSlug}/query/{queryId}/download-excel` · Read · Export

Same as [Download a Query Result as CSV](#download-a-query-result-as-csv). The file format is `.xlsx` and the content type is `application/vnd.ms-excel`.

## Get a Cached Query Result

`GET /api/v1/query/orgs/{orgSlug}/worksheet-query-results/{queryId}` · Read · Member

Returns the cached result of a query as JSON. The server joins the cached result pages and stops after about 10,000 rows.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `queryId` | path | string | Yes | Query ID. |

Response example. Values are strings. A SQL `NULL` is `null`.

```json
{
  "success": true,
  "data": {
    "schema": [
      { "name": "id", "type": "Int32" },
      { "name": "name", "type": "Nullable(String)" }
    ],
    "data": [["1", "alice"], ["2", null]]
  }
}
```
