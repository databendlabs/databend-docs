---
title: "组织"
sidebar_label: "组织"
description: "使用账户 API token 获取组织的基本信息，并列出组织成员。"
---

调用前请先阅读[概览](./index.md)，了解鉴权、请求约定和错误处理。

## 获取组织 {/* #get-an-organization */}

`GET /api/v1/orgs/{orgSlug}` · Read · Member

返回组织的基本信息：名称、套餐、存储、消费上限设置和功能开关。如需查看租户所在的云厂商和地域，请调用[获取组织租户信息](./05-organization-and-metrics.md#get-organization-tenant-information)。

响应示例（省略了部分字段）：

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

## 列出组织成员 {/* #list-organization-members */}

`GET /api/v1/orgs/{orgSlug}/members` · Read · Member

返回组织成员的姓名、邮箱、角色、权限和最近登录时间。这些是其他人的个人信息。邀请、修改或移除成员请在 Cloud 控制台中操作。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `memberState` | 查询 | string（枚举） | 否 | `active`、`invited`、`rejected` 或 `expired`。默认：全部。 |

响应：`data` 是列表，每项包含[列出我的组织](./08-account.md#list-my-organizations)单项的字段，另外多一个 `lastLoginTime`。
