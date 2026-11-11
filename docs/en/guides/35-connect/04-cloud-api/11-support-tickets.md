---
title: "Support Tickets"
sidebar_label: "Support Tickets"
---

Read the [Overview](./index.md) first for authentication, request conventions, and errors.

An account sees only the tickets that it created in the organization. Rules for API tokens:

- Attachments are not available. A create or comment request with `attachments` returns HTTP 400.
- Creating a ticket, adding a comment, and changing the status notify the support team. Each token can send 3 of these requests at once, then one every 10 seconds. More requests return HTTP 429.

## List Ticket Categories

`GET /api/v1/tickets/category-options` · Read · Self

Returns the categories for [Create a Ticket](#create-a-ticket). See also [Ticket Category](#ticket-category).

```json
{ "success": true, "data": [{ "name": "Warehouse", "value": 1 }, { "name": "Billing", "value": 8 }] }
```

## List Tickets

`POST /api/v1/orgs/{orgSlug}/tickets/query` · Read · Creator

Returns the tickets that the account created in the organization, by the time of the last reply, newest first.

| Field | Type | Required | Description |
|---|---|---|---|
| `page` | integer | No | Page number. Default: 1. |
| `perPage` | integer | No | Rows per page. Default: 50. |
| `status` | string (enum) | No | `new`, `open`, `pending`, `hold`, `solved`, or `closed`. |
| `category` | integer (enum) | No | [Ticket category](#ticket-category). |
| `subject` | string | No | Text that the subject contains. |
| `ticketNo` | string | No | Ticket number. |

Response example. `type` is the category name. `priority` is `low`, `normal`, `high`, or `urgent`.

```json
{
  "success": true,
  "data": {
    "page": 1,
    "perPage": 50,
    "total": 1,
    "list": [
      {
        "id": 3051,
        "number": "T202611090001",
        "subject": "Warehouse does not resume",
        "description": "The default warehouse stays in Starting.",
        "status": "open",
        "type": "Warehouse",
        "priority": "normal",
        "tags": [],
        "lastReplyAuthorType": "agent",
        "lastReplyTime": "2026-11-09T08:30:00Z",
        "lastRepliedBy": null,
        "lastRepliedByAvatar": null,
        "repliesCount": 2,
        "orgName": "Acme",
        "orgSlug": "acme-prod",
        "createdAt": "2026-11-09T07:00:00Z",
        "updatedAt": "2026-11-09T08:30:00Z"
      }
    ]
  }
}
```

`lastReplyAuthorType` is `customer` or `agent`.

## Get a Ticket

`GET /api/v1/orgs/{orgSlug}/tickets/{ticketId}` · Read · Creator

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `ticketId` | path | integer | Yes | Ticket ID. |

Response: `data` is one ticket with `id`, `number`, `subject`, `description`, `status`, `type`, `priority`, `tags`, `attachments`, `orgName`, `orgSlug`, `createdAt`, and `updatedAt`. Each attachment has `name`, `size`, `url`, and `fileID`. API tokens cannot download attachments.

## List Ticket Comments

`GET /api/v1/orgs/{orgSlug}/tickets/{ticketId}/comments` · Read · Creator

Returns the public comments of a ticket, from the oldest.

```json
{
  "success": true,
  "data": [
    { "id": 8812, "authorID": 7, "authorName": "Alice", "authorAvatar": "", "authorType": "customer", "content": "It started after the resize.", "public": true, "replyTime": "2026-11-09T07:10:00Z" }
  ]
}
```

## Create a Ticket

`POST /api/v1/orgs/{orgSlug}/tickets` · Write · Member

| Field | Type | Required | Description |
|---|---|---|---|
| `category` | integer (enum) | Yes | [Ticket category](#ticket-category). |
| `subject` | string | Yes | Subject, at most 1,000 characters. |
| `description` | string | No | Description of the problem. |

```json
{ "category": 1, "subject": "Warehouse does not resume", "description": "The default warehouse stays in Starting since 07:00 UTC." }
```

Response:

```json
{ "success": true, "data": { "id": 3051 } }
```

## Add a Ticket Comment

`POST /api/v1/orgs/{orgSlug}/tickets/{ticketId}/comments` · Write · Creator

| Field | Type | Required | Description |
|---|---|---|---|
| `comment` | string | Yes | Text of the comment. |

```json
{ "comment": "The warehouse resumed after a retry. You can close the ticket." }
```

Response: `{ "success": true }`.

## Change Ticket Status

`POST /api/v1/orgs/{orgSlug}/tickets/{ticketId}/{status}` · Write · Creator

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `ticketId` | path | integer | Yes | Ticket ID. |
| `status` | path | string (enum) | Yes | `solved` to close the ticket, or `open` to open it again. Other values return HTTP 400. |

Response: `{ "success": true }`.

## Types

### Ticket Category

| Value | Name | Value | Name |
|---|---|---|---|
| `0` | Other | `11` | Dashboard |
| `1` | Warehouse | `12` | Pipeline |
| `2` | Worksheet | `13` | SQLHistory |
| `3` | Load Data | `14` | Task |
| `4` | Database | `15` | Data Sources |
| `5` | Integrations | `16` | Data Integrations |
| `6` | Activity | `17` | SQLRunning |
| `7` | Metrics | `18` | AuditLogs |
| `8` | Billing | `19` | Documentation |
| `9` | Invite Member | `20` | Features |
| `10` | Business | | |
