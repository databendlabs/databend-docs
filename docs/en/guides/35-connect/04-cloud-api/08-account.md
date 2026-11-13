---
title: "Account"
sidebar_label: "Account"
description: "Get the account that owns an API token, the organizations of the account, and its pending invitations."
---

Read the [Overview](./index.md) first for authentication, request conventions, and errors.

These endpoints act on the account that owns the token, not on an organization in the path. The server signs the request for the organization in `X-DATABENDCLOUD-ORG`, or for the default organization of the account if you do not send the header. The account must be an active member of that organization.

## Get the Current Account

`GET /api/v1/account/info` · Read · Self

Returns the account that owns the token. For API tokens, the response leaves out the phone number and the IP address of the last sign-in.

Response example:

```json
{
  "success": true,
  "data": {
    "id": 7,
    "email": "alice@example.com",
    "name": "Alice",
    "state": "activated",
    "avatarURL": "",
    "defaultOrgSlug": "acme-prod",
    "lastLoginTime": "2026-11-10T09:12:00Z",
    "phoneArea": "",
    "phone": "",
    "passwordEnabled": true,
    "acceptNewsletter": false,
    "showMeeting": false,
    "currencyUnit": "USD",
    "createdAt": "2026-01-05T02:00:00Z",
    "updatedAt": "2026-11-10T09:12:00Z"
  }
}
```

## List My Organizations

`GET /api/v1/my/orgs` · Read · Self

Returns every organization in which the account is a member, with the cloud, the region, and the role of the account. Use `orgSlug` from this list in the other endpoints.

Response example. `memberKind` is `admin` or `collaborator`. `memberRole` is `account_admin` or `public`.

```json
{
  "success": true,
  "data": [
    {
      "id": 31,
      "accountID": 7,
      "accountName": "Alice",
      "accountEmail": "alice@example.com",
      "orgSlug": "acme-prod",
      "orgName": "Acme",
      "orgState": "active",
      "tenantID": "tn3ftqihs",
      "planType": "BUSINESS",
      "region": "us-east-2",
      "provider": "aws",
      "memberPermissions": [],
      "memberKind": "admin",
      "memberRole": "account_admin",
      "memberState": "active",
      "createdAt": "2026-01-05T02:00:00Z",
      "updatedAt": "2026-11-01T02:00:00Z"
    }
  ]
}
```

## List My Pending Invitations

`GET /api/v1/my/org-membership-requests` · Read · Self

Returns the organization invitations that the account has not answered. To accept or reject an invitation, use the Cloud console.

```json
{
  "success": true,
  "data": [
    { "orgName": "Globex", "orgSlug": "globex", "creator": "Bob", "accountID": 7, "state": 1, "createdAt": "2026-11-09T02:00:00Z", "updatedAt": "2026-11-09T02:00:00Z" }
  ]
}
```

`state` `1` means invited.
