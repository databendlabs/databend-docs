---
title: "账户"
sidebar_label: "账户"
description: "获取 API token 所属的账户、该账户所在的组织，以及待处理的邀请。"
---

调用前请先阅读[概览](./index.md)，了解鉴权、请求约定和错误处理。

这些接口作用于 token 所属的账户，而不是路径中的某个组织。服务端为 `X-DATABENDCLOUD-ORG` 指定的组织签发请求；不传该请求头时，使用账户的默认组织。账户必须是该组织的有效成员。

## 获取当前账户 {/* #get-the-current-account */}

`GET /api/v1/account/info` · Read · Self

返回 token 所属的账户。对于 API token，响应中不包含手机号和最近一次登录的 IP 地址。

响应示例：

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

## 列出我的组织 {/* #list-my-organizations */}

`GET /api/v1/my/orgs` · Read · Self

返回账户所在的所有组织，包括云厂商、地域和账户在组织中的角色。其他接口中的 `orgSlug` 可以从这里获取。

响应示例。`memberKind` 为 `admin` 或 `collaborator`，`memberRole` 为 `account_admin` 或 `public`。

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

## 列出我待处理的邀请 {/* #list-my-pending-invitations */}

`GET /api/v1/my/org-membership-requests` · Read · Self

返回账户尚未处理的组织邀请。接受或拒绝邀请请在 Cloud 控制台中操作。

```json
{
  "success": true,
  "data": [
    { "orgName": "Globex", "orgSlug": "globex", "creator": "Bob", "accountID": 7, "state": 1, "createdAt": "2026-11-09T02:00:00Z", "updatedAt": "2026-11-09T02:00:00Z" }
  ]
}
```

`state` 为 `1` 表示已邀请。
