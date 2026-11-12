---
title: "工单"
sidebar_label: "工单"
---

调用前请先阅读[概览](./index.md)，了解鉴权、请求约定和错误处理。

账户只能看到自己在该组织中创建的工单。API token 的规则：

- 不支持附件。创建工单或评论时带 `attachments` 会返回 HTTP 400。
- 创建工单、添加评论和修改状态会通知支持团队。每个 token 可以连续发送 3 次这类请求，之后每 10 秒 1 次，超出时返回 HTTP 429。

## 列出工单类别 {/* #list-ticket-categories */}

`GET /api/v1/tickets/category-options` · Read · Self

返回[创建工单](#create-a-ticket)可用的类别，另见[工单类别](#ticket-category)。

```json
{ "success": true, "data": [{ "name": "Warehouse", "value": 1 }, { "name": "Billing", "value": 8 }] }
```

## 列出工单 {/* #list-tickets */}

`POST /api/v1/orgs/{orgSlug}/tickets/query` · Read · Creator

返回账户在该组织中创建的工单。默认按最近回复时间从新到旧排列。请求体中的字段都是可选的。要列出全部工单，传 `{}`。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `page` | integer | 否 | 页码。默认：1。 |
| `perPage` | integer | 否 | 每页条数。默认：50。 |
| `status` | string（枚举） | 否 | `new`、`open`、`pending`、`hold`、`solved` 或 `closed`。 |
| `category` | integer（枚举） | 否 | [工单类别](#ticket-category)。 |
| `subject` | string | 否 | 标题中包含的文字。 |
| `ticketNo` | string | 否 | 工单编号，精确匹配。 |
| `priority` | string（枚举） | 否 | `low`、`normal`、`high` 或 `urgent`。 |
| `createdTimeFrom`、`createdTimeTo` | string | 否 | 创建时间范围，RFC 3339 格式。 |
| `lastReplyTimeFrom`、`lastReplyTimeTo` | string | 否 | 最近回复时间范围，RFC 3339 格式。 |
| `sort` | string | 否 | `lastReplyTime`（默认）、`createdAt` 或 `updatedAt`。 |
| `direction` | string | 否 | `asc` 或 `desc`。默认：`desc`。 |

响应示例。`type` 是类别名称，`priority` 为 `low`、`normal`、`high` 或 `urgent`。

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

`lastReplyAuthorType` 为 `customer` 或 `agent`。

## 获取工单 {/* #get-a-ticket */}

`GET /api/v1/orgs/{orgSlug}/tickets/{ticketId}` · Read · Creator

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `ticketId` | 路径 | integer | 是 | 工单 ID。 |

响应：`data` 是一张工单，包含 `id`、`number`、`subject`、`description`、`status`、`type`、`priority`、`tags`、`attachments`、`orgName`、`orgSlug`、`createdAt` 和 `updatedAt`。每个附件包含 `name`、`size`、`url` 和 `fileID`。API token 不能下载附件。

## 列出工单评论 {/* #list-ticket-comments */}

`GET /api/v1/orgs/{orgSlug}/tickets/{ticketId}/comments` · Read · Creator

按从旧到新返回工单的公开评论。

```json
{
  "success": true,
  "data": [
    { "id": 8812, "authorID": 7, "authorName": "Alice", "authorAvatar": "", "authorType": "customer", "content": "It started after the resize.", "public": true, "replyTime": "2026-11-09T07:10:00Z" }
  ]
}
```

## 创建工单 {/* #create-a-ticket */}

`POST /api/v1/orgs/{orgSlug}/tickets` · Write · Member

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `category` | integer（枚举） | 否 | [工单类别](#ticket-category)。默认：`0`（Other）。 |
| `subject` | string | 是 | 标题，最多 1,000 个字符。 |
| `description` | string | 否 | 问题描述。 |

```json
{ "category": 1, "subject": "Warehouse does not resume", "description": "The default warehouse stays in Starting since 07:00 UTC." }
```

响应：

```json
{ "success": true, "data": { "id": 3051 } }
```

## 添加工单评论 {/* #add-a-ticket-comment */}

`POST /api/v1/orgs/{orgSlug}/tickets/{ticketId}/comments` · Write · Creator

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `comment` | string | 是 | 评论内容。 |

```json
{ "comment": "The warehouse resumed after a retry. You can close the ticket." }
```

响应：`{ "success": true }`。

## 修改工单状态 {/* #change-ticket-status */}

`POST /api/v1/orgs/{orgSlug}/tickets/{ticketId}/{status}` · Write · Creator

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `ticketId` | 路径 | integer | 是 | 工单 ID。 |
| `status` | 路径 | string（枚举） | 是 | `solved` 表示关闭工单，`open` 表示重新打开。其他取值返回 HTTP 400。 |

响应：`{ "success": true }`。

## 类型 {/* #types */}

### 工单类别 {/* #ticket-category */}

| 取值 | 名称 | 取值 | 名称 |
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
