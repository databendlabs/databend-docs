---
title: "Organization"
sidebar_label: "Organization"
description: "Get the profile of an organization and list its members with an account API token."
---

Read the [Overview](./index.md) first for authentication, request conventions, and errors.

## Get an Organization

`GET /api/v1/orgs/{orgSlug}` · Read · Member

Returns the profile of the organization: name, plan, storage, spend limit settings, and features. To read the cloud and the region of the tenant, call [Get Organization Tenant Information](./05-organization-and-metrics.md#get-organization-tenant-information).

Response example (some fields are left out):

```json
{
  "success": true,
  "data": {
    "id": 1024,
    "name": "Acme",
    "slug": "acme-prod",
    "company": "Acme Inc.",
    "memberCount": 12,
    "tenantID": "tn3ftqihs",
    "state": "active",
    "planInfo": { "name": "Business", "type": "BUSINESS", "warehouseLimit": 20, "memberLimit": 100 },
    "storageInfo": { "provider": "aws", "region": "us-east-2", "storageUsed": 7340032000 },
    "spendLimit": { "state": 0, "limitPolicy": 0 },
    "aiSettings": { "enabled": true },
    "creator": "Alice",
    "creatorEmail": "alice@example.com",
    "createdAt": "2026-01-05T02:00:00Z",
    "updatedAt": "2026-11-01T02:00:00Z"
  }
}
```

## List Organization Members

`GET /api/v1/orgs/{orgSlug}/members` · Read · Member

Returns the members of the organization with their name, email, role, permissions, and last sign-in time. This is personal data of other people. To invite, change, or remove a member, use the Cloud console.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `memberState` | query | string (enum) | No | `active`, `invited`, `rejected`, or `expired`. Default: all. |

Response: `data` is a list. Each item has the fields of one item of [List My Organizations](./08-account.md#list-my-organizations), plus `lastLoginTime`.
