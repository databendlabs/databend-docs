---
title: Changelog
sidebar_label: Changelog
description: Changes to the Databend Cloud API for Agents, newest first.
---

This page lists the changes to the endpoints in this section. The newest changes are at the top. Read this page when you update an agent, a skill, or a script that calls these endpoints.

Each entry has a date. An entry can have these parts:

| Part | Meaning |
|---|---|
| Added | New endpoints or new optional fields. Existing calls continue to work. |
| Changed | Changes to behavior, fields, or limits. |
| Deprecated | The endpoint or field continues to work, but it will be removed. The entry tells you what to use instead. |
| Removed | The endpoint or field is not available. |

A change that can cause existing calls to fail has the mark **Breaking**. The entry gives the steps to migrate.

## 2026-11-12

First release. An API token can call 79 endpoints in 14 categories:

| Category | Endpoints |
|---|---|
| [Query API](./01-query-api.md) | 5 |
| [Query results](./02-query-results.md) | 3 |
| [Query history](./03-query-history.md) | 5 |
| [Warehouses](./04-warehouses.md) | 5 |
| [Organization and metrics](./05-organization-and-metrics.md) | 2 |
| [Catalog](./06-catalog.md) | 7 |
| [SQL tasks](./07-sql-tasks.md) | 2 |
| [Account](./08-account.md) | 3 |
| [Organization](./09-organization.md) | 2 |
| [Billing](./10-billing.md) | 4 |
| [Support tickets](./11-support-tickets.md) | 7 |
| [Task flows](./12-task-flows.md) | 9 |
| [Data sources](./13-data-sources.md) | 12 |
| [Data integration tasks](./14-data-integration-tasks.md) | 13 |

The [Endpoint Index](./index.md#endpoint-index) lists each endpoint with its method, path, type, and access level.

These conventions apply to all endpoints. This page will record each change to them:

- Send the token in the `X-DATABENDCLOUD-TOKEN` header. The server rejects a request that also has an `Authorization` header or cookies. Refer to [Authentication](./index.md#authentication).
- There are two request styles. v1 endpoints have the organization ID in the path. v2 endpoints use `POST` and have `orgSlug` in the JSON body. Refer to [Request Conventions](./index.md#request-conventions).
- The token IP allowlist applies to all endpoints.
- Endpoints that are not in this section return HTTP 403.

These console functions are not open to API tokens in this release: audit log search, ticket attachments, and task flow changes. Refer to [Endpoints That API Tokens Cannot Call](./index.md#endpoints-that-api-tokens-cannot-call).
