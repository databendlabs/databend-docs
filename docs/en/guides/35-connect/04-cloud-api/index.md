---
title: Databend Cloud API for Agents
sidebar_label: Cloud API for Agents
description: Call Databend Cloud console APIs with an account API token to manage data sources and data integration tasks, and to read task flows, query history, warehouses, catalog metadata, and billing, and to work with support tickets.
---

These pages list the Databend Cloud console APIs that an account API token can call. Use these APIs to build agents and scripts that manage data sources and data integration tasks, read task flows, query history, warehouses, catalog metadata, and billing, and work with support tickets.

These pages are for people and for AI agents. All endpoints use the same layout: method and path, access level, parameters, and examples. If the endpoints of a page use enums or objects, the page ends with a Types section that describes them.

This API is for **Databend Cloud only**. It does not apply to self-hosted Databend.

The [Changelog](./16-changelog.md) lists the changes to these endpoints. Read it when you update an agent, a skill, or a script that calls them.

## Before You Start

You need these values:

| Value | Where to find it | Example |
|---|---|---|
| API origin | Use `https://api.databend.com` for the global site. Use `https://api.databend.cn` for the China site. | `https://api.databend.com` |
| API token | Cloud console → **Account API Tokens → Access Tokens → Generate New Token**. | `dbc_xxxxxxxxxxxx` |
| Organization ID | Cloud console → **Admin → Organization Profile**, or [List My Organizations](./08-account.md#list-my-organizations). The API calls this value `orgSlug`. | `acme-prod` |
| Warehouse | The warehouse that runs SQL. Only the Query API needs it. | `default` |

## Authentication

Send the token in the `X-DATABENDCLOUD-TOKEN` header on every request.

| Header | Required | Description |
|---|---|---|
| `X-DATABENDCLOUD-TOKEN` | Yes | The account API token. |
| `X-DATABENDCLOUD-ORG` | No | The Organization ID. If you send it, it must be equal to the organization in the path or in the body. For [account endpoints](./08-account.md), it selects the organization that the request acts in. Default: the default organization of your account. |
| `X-DATABENDCLOUD-WAREHOUSE` | Query API only | The warehouse name. Default: `default`. |
| `Content-Type` | Requests with a body | `application/json` |

Rules:

- Do not send an `Authorization` header or cookies with the token. The server rejects a request that has two credentials.
- The token acts as your account. It uses your current role in the organization. A role change applies to the next request.
- You can access only organizations in which your account is an active member.
- The token IP allowlist applies to all endpoints in this section.
- The server rejects endpoints that are not in this section with HTTP 403.

Example request:

```bash
curl --request POST 'https://api.databend.com/api/v2/data-integration/datasources' \
  --header 'X-DATABENDCLOUD-TOKEN: <api-token>' \
  --header 'Content-Type: application/json' \
  --data '{"orgSlug":"<organization-id>","page":1,"perPage":20}'
```

## Request Conventions

The API has two styles:

| Style | Path prefix | Organization ID | Parameters |
|---|---|---|---|
| v1 | `/api/v1/...` | In the path, as `{orgSlug}`. | Path, query string, or JSON body. |
| v2 | `/api/v2/...` | In the JSON body, as `orgSlug`. This field is required. | JSON body. All v2 endpoints use `POST`. Some v2 endpoints also have path parameters. |

### v2 JSON Rules

- Field names use lowerCamelCase.
- Enums: send the number. The name is also accepted. Responses always return the number.
- 64-bit integers (`int64`, `uint64`) are JSON strings in responses, for example `"orgId": "1024"`. Requests accept a string or a number.
- Responses omit fields that have a zero value (`0`, `false`, `""`, or an empty list). Treat a missing field as its zero value.
- Timestamps are RFC 3339 strings in UTC, for example `"2026-11-09T08:00:00Z"`.
- Do not send unknown fields. The server rejects them with HTTP 400.
- If a field is a path parameter, do not also send it in the body. The path value has priority.

### v1 JSON Rules

- Field names are as documented for each endpoint. Some task run responses use snake_case.
- Timestamps are RFC 3339 strings.

### Pagination

| Style | Request fields | Response fields | Used by |
|---|---|---|---|
| Page number | `page` (starts at 1, default 1), `perPage` (default 20) | `total`, `page`, `perPage`, `list` | Most v2 lists |
| Cursor | `size`, `cursors` | `total`, `cursors`, `list` | Query history |
| Page token | `nextPageToken`, `previousPageToken` | `nextPageToken`, `previousPageToken` | Task runs, task flow run history |

Use a page size of 100 or less. For page tokens, a missing `nextPageToken` in the response means that there is no next page. Send page tokens as strings.

## Responses and Errors

A successful response has HTTP 200 and `"success": true`. Most endpoints put the result in `data`. Some v2 endpoints put fields at the top level, for example `id`, `tables`, or `objects`. The response example of each endpoint shows the shape.

Credential fields in responses never contain a secret in clear text. The server replaces each secret value with `******`. SQL text is not masked. See [Credential Masking](./13-data-sources.md#credential-masking).

Error shapes:

```json title="v1 error"
{ "error": "PermissionDenied", "message": "auth: client ip 203.0.113.10 is not in the allowlist of this API token" }
```

```json title="v2 error"
{ "success": false, "message": "[CLIENT-5001] param err: check request failed: param [orgSlug, datasourceId, name] required" }
```

v2 messages start with `[<KIND>-<CODE>]`. `CLIENT-5001` is a parameter error (HTTP 400). `SERVER-*` and `THIRDPARTY-*` codes use HTTP 500.

| HTTP status | Meaning | Retry |
|---|---|---|
| 400 | A parameter is missing or not valid. | No. Fix the request. |
| 401 | The token is not valid, is disabled, or was deleted. | No. |
| 403 | The client IP is not in the token allowlist, the account is not an active member, the role is not sufficient, or the endpoint is not open to API tokens. | No. |
| 404 | The resource does not exist. | No. |
| 429 | The request exceeds a rate limit or a quota. | Yes, with backoff. |
| 500 | A server error. Some v2 business errors also use 500, for example `[SERVER-6000] server err: name orders_sync exists` or `[SERVER-6000] server err: datasource 12 not found`. | Read `message` first. Retry only if the cause is temporary. |
| 503, 504 | A dependency is not available, or the request timed out. | Yes, with backoff. |

## Access Levels

Each endpoint has an access level. The server checks it on every request.

| Level | Who can call |
|---|---|
| Self | The account that owns the token. The endpoint returns only the data of that account. |
| Member | Any active member of the organization. |
| Creator | The account that created the resource. |
| Creator or Admin | The account that created the resource, or an organization admin. |
| Export | A member who has the export permission. |

Catalog and warehouse endpoints also apply the SQL privileges of your account. A member can see only the objects that the member's SQL role can see.

## Endpoint Index

Type `Read` does not change any resource. Type `Write` creates, changes, starts, stops, or deletes a resource. Type `Probe` connects to an external system from Databend Cloud.

| Category | Method | Path | Type | Access |
|---|---|---|---|---|
| [Query API](./01-query-api.md) | `POST` | `/v1/query` | Write | Member |
| | `GET` | `/v1/query/{queryId}` | Read | Member |
| | `GET` | `/v1/query/{queryId}/page/{pageNum}` | Read | Member |
| | `GET` | `/v1/query/{queryId}/final` | Read | Member |
| | `POST` | `/v1/query/{queryId}/kill` | Write | Member |
| [Query results](./02-query-results.md) | `GET` | `/api/v1/query/orgs/{orgSlug}/worksheet-query-results/{queryId}` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/query/{queryId}/download` | Read | Export |
| | `GET` | `/api/v1/orgs/{orgSlug}/query/{queryId}/download-excel` | Read | Export |
| [Query history](./03-query-history.md) | `POST` | `/api/v1/query/orgs/{orgSlug}/query-history/query` | Read | Member |
| | `POST` | `/api/v1/query/orgs/{orgSlug}/query-history/count` | Read | Member |
| | `GET` | `/api/v1/query/orgs/{orgSlug}/query-history/{queryId}/detail` | Read | Member |
| | `GET` | `/api/v1/query/orgs/{orgSlug}/query-history/{queryId}/profile` | Read | Member |
| | `GET` | `/api/v1/query/orgs/{orgSlug}/query-history/sql-users` | Read | Member |
| [Warehouses](./04-warehouses.md) | `GET` | `/api/v1/orgs/{orgSlug}/tenant/warehouses` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/warehouses/{warehouseName}` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/warehouses/{warehouseName}/processes` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/warehouse-history/{warehouseName}` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/warehouse-sizes` | Read | Member |
| [Organization and metrics](./05-organization-and-metrics.md) | `GET` | `/api/v1/orgs/{orgSlug}/tenant` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/metrics/{queryType}` | Read | Member |
| [Catalog](./06-catalog.md) | `GET` | `/api/v1/orgs/{orgSlug}/tenant/databases` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/databases/{database}/tables` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/databases/{database}/tables/{table}` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/databases/{database}/tables/{table}/fields` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/databases/{database}/tables/{table}/config` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/databases/{database}/streams` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/database-objects` | Read | Member |
| [SQL tasks](./07-sql-tasks.md) | `GET` | `/api/v1/orgs/{orgSlug}/tenant/tasks/{taskName}` | Read | Member |
| | `POST` | `/api/v1/orgs/{orgSlug}/tenant/tasks-runs/query` | Read | Member |
| [Account](./08-account.md) | `GET` | `/api/v1/account/info` | Read | Self |
| | `GET` | `/api/v1/my/orgs` | Read | Self |
| | `GET` | `/api/v1/my/org-membership-requests` | Read | Self |
| [Organization](./09-organization.md) | `GET` | `/api/v1/orgs/{orgSlug}` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/members` | Read | Member |
| [Billing](./10-billing.md) | `GET` | `/api/v1/billing/orgs/{orgSlug}/billing-histories` | Read | Member |
| | `GET` | `/api/v1/billing/orgs/{orgSlug}/billing-histories/{billingHistoryId}` | Read | Member |
| | `GET` | `/api/v1/billing/orgs/{orgSlug}/billing-histories/{billingHistoryId}/details-v2` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/daily-usages` | Read | Member |
| [Support tickets](./11-support-tickets.md) | `GET` | `/api/v1/tickets/category-options` | Read | Self |
| | `POST` | `/api/v1/orgs/{orgSlug}/tickets/query` | Read | Creator |
| | `GET` | `/api/v1/orgs/{orgSlug}/tickets/{ticketId}` | Read | Creator |
| | `GET` | `/api/v1/orgs/{orgSlug}/tickets/{ticketId}/comments` | Read | Creator |
| | `POST` | `/api/v1/orgs/{orgSlug}/tickets` | Write | Member |
| | `POST` | `/api/v1/orgs/{orgSlug}/tickets/{ticketId}/comments` | Write | Creator |
| | `POST` | `/api/v1/orgs/{orgSlug}/tickets/{ticketId}/{status}` | Write | Creator |

| Category | Method | Path | Type | Access |
|---|---|---|---|---|
| [Task flows](./12-task-flows.md) | `POST` | `/api/v2/taskflow` | Read | Member |
| | `POST` | `/api/v2/taskflow/names` | Read | Member |
| | `POST` | `/api/v2/taskflow/dag` | Read | Member |
| | `POST` | `/api/v2/taskflow/{taskflowId}/info` | Read | Member |
| | `POST` | `/api/v2/taskflow/versions` | Read | Member |
| | `POST` | `/api/v2/taskflow/versions/{taskflowId}` | Read | Member |
| | `POST` | `/api/v2/taskflow/versions/{taskflowId}/{version}` | Read | Member |
| | `POST` | `/api/v2/taskflow/histories` | Read | Member |
| | `POST` | `/api/v2/taskflow/histories/{taskflowId}` | Read | Member |
| [Data sources](./13-data-sources.md) | `POST` | `/api/v2/data-integration/datasources` | Read | Member |
| | `POST` | `/api/v2/data-integration/datasource/{datasourceId}/info` | Read | Member |
| | `POST` | `/api/v2/data-integration/datasource/test` | Probe | Member |
| | `POST` | `/api/v2/data-integration/datasource/create` | Write | Member |
| | `POST` | `/api/v2/data-integration/datasource/{datasourceId}/update` | Write | Member |
| | `POST` | `/api/v2/data-integration/datasource/delete` | Write | Member |
| | `POST` | `/api/v2/data-integration/datasource/{datasourceId}/mysql/tables` | Probe | Member |
| | `POST` | `/api/v2/data-integration/datasource/{datasourceId}/postgres/tables` | Probe | Member |
| | `POST` | `/api/v2/data-integration/datasource/{datasourceId}/mysql/preview-objects` | Probe | Member |
| | `POST` | `/api/v2/data-integration/datasource/{datasourceId}/tidb/preview-objects` | Probe | Member |
| | `POST` | `/api/v2/data-integration/aws-sqs-s3/setup-info` | Read | Member |
| | `POST` | `/api/v2/data-integration/tidb/setup-info` | Read | Member |
| [Data integration tasks](./14-data-integration-tasks.md) | `POST` | `/api/v2/data-integration/tasks` | Read | Member |
| | `POST` | `/api/v2/data-integration/task/{taskId}/info` | Read | Member |
| | `POST` | `/api/v2/data-integration/service/preview` | Probe | Member |
| | `POST` | `/api/v2/data-integration/runtime-units` | Read | Member |
| | `POST` | `/api/v2/data-integration/task/create` | Write | Member |
| | `POST` | `/api/v2/data-integration/task/{taskId}/update` | Write | Creator or Admin |
| | `POST` | `/api/v2/data-integration/task/operate` | Write | Creator or Admin |
| | `POST` | `/api/v2/data-integration/task/runs` | Read | Member |
| | `POST` | `/api/v2/data-integration/task/runs/{executeId}` | Read | Member |
| | `POST` | `/api/v2/data-integration/task/runs/{executeId}/mysql/snapshot/tables` | Read | Member |
| | `POST` | `/api/v2/data-integration/task/runs/{executeId}/tidb/full-sync/tables` | Read | Member |
| | `POST` | `/api/v2/data-integration/task/{taskId}/metrics` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/metrics/{TiDBSync\|MySQLSync}` | Read | Member |

[`POST /v1/query`](./01-query-api.md) has type `Write` because the SQL that you send can change data. See [Agent Skills](../03-agent-skills.md).

## Endpoints That API Tokens Cannot Call

API tokens cannot call other console endpoints. These are some examples:

| Area | Examples | Reason |
|---|---|---|
| Account | Sign-in, password, profile changes, sessions, OAuth grants, account deletion | They change the account, not organization data. |
| Credentials | API token management, SQL user password reset, connection information, organization switch, token renewal | A leaked token must not be able to create or read credentials. |
| Members and roles | Invite, accept or reject an invitation, grant, change role, remove member | Privilege changes. |
| Billing and payment | Payment methods, payment links, bill confirmation, coupons, spend limits, cloud marketplace | Money operations. |
| Audit logs | Audit log search | Not open in this version. |
| Ticket attachments | Upload, download | Not open in this version. |
| AI features | Cloud Agent sessions, skills, and model calls | Cost and quota. |
| Warehouse changes | Create, resize, resume, suspend, rename, drop | Use warehouse management SQL through the Query API. |
| Task flow changes | Create, update, start, suspend, delete | Not open in this version. |

## Security

- Every endpoint in this section acts with your account and your current role. Use a dedicated account with a small role for agents.
- Set a token IP allowlist. Allow the outbound IP of the agent environment.
- Endpoints with type `Probe` connect from Databend Cloud to the host that you give. Use only hosts that you own.
- Responses mask all credentials, as described in [Credential Masking](./13-data-sources.md#credential-masking). They still show hosts, user names, access key IDs, and bucket names. Query results, SQL text, history, and logs can enter the context of the agent model. Follow your data policy.
- [List Organization Members](./09-organization.md#list-organization-members) returns the names and emails of other people, and tickets contain free text. Treat them as personal data.
- Ticket writes reach the support team. Ask the user to confirm a ticket before an agent creates it.
- Disable or delete a token in the Cloud console to revoke it at once.
