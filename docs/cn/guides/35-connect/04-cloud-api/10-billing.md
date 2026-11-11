---
title: "账单"
sidebar_label: "账单"
---

调用前请先阅读[概览](./index.md)，了解鉴权、请求约定和错误处理。

这些接口只读取账单和用量。金额是组织结算币种下的数值。付款、确认账单或修改支付方式请在 Cloud 控制台中操作。

## 列出账单 {#list-bills}

`GET /api/v1/billing/orgs/{orgSlug}/billing-histories` · Read · Member

按从新到旧返回组织的账单。第一页的第一条是本月账单，其 `id` 为 `0`、`state` 为 `0`，金额在月底前会持续变化。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `page` | 查询 | integer | 否 | 页码。默认：1。 |
| `perPage` | 查询 | integer | 否 | 每页条数。默认：50。 |

响应示例。`state` 是[账单状态](#bill-state)。对于 API token，`invoiceInfo` 中不包含 `cardBrand` 和 `cardLast4`。

```json
{
  "success": true,
  "data": {
    "page": 1,
    "perPage": 50,
    "total": 2,
    "offlineTransferEnabled": false,
    "list": [
      { "id": 0, "state": 0, "totalAmounts": 812.4, "paymentAmounts": 812.4, "couponDeductAmounts": 0, "discountAmounts": 0, "startTime": "2026-11-01T00:00:00Z", "endTime": "2026-11-30T23:59:59Z", "orgName": "Acme" },
      { "id": 21922, "state": 4, "totalAmounts": 2310.75, "paymentAmounts": 2210.75, "couponDeductAmounts": 100, "discountAmounts": 0, "startTime": "2026-10-01T00:00:00Z", "endTime": "2026-10-31T23:59:59Z", "invoiceEmail": "billing@example.com", "orgName": "Acme", "orderNo": "DC202610001", "invoiceInfo": { "paid": true, "number": "INV-0042", "invoiceDate": "2026-11-01", "cardBrand": "", "cardLast4": "" } }
    ]
  }
}
```

## 获取账单 {#get-a-bill}

`GET /api/v1/billing/orgs/{orgSlug}/billing-histories/{billingHistoryId}` · Read · Member

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `billingHistoryId` | 路径 | integer | 是 | [列出账单](#list-bills)返回的账单 ID。 |

响应：`data` 是一张账单，字段与[列出账单](#list-bills)的单项相同。

## 获取账单明细 {#get-bill-details}

`GET /api/v1/billing/orgs/{orgSlug}/billing-histories/{billingHistoryId}/details-v2` · Read · Member

按类别和按天返回账单金额。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `billingHistoryId` | 路径 | string | 是 | 账单 ID；`0` 表示本月；也可以传 `YYYY-MM` 格式的月份。 |

响应示例。`items` 中每项的结构与[获取每日用量](#get-daily-usage)中的一天相同。

```json
{
  "success": true,
  "data": {
    "totalAmount": "2310.75",
    "couponDeductAmount": "100",
    "discountAmount": "0",
    "discountDetails": [],
    "actualAmount": "2210.75",
    "totalStorageAmount": "120.5",
    "totalWarehouseAmount": "2150.25",
    "totalCloudServiceAmount": "40",
    "totalServiceHostingAmount": "0",
    "items": []
  }
}
```

此响应中的金额是十进制字符串。

## 获取每日用量 {#get-daily-usage}

`GET /api/v1/orgs/{orgSlug}/daily-usages` · Read · Member

按计算集群、存储、云服务和托管服务返回每天的用量和金额。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `from` | 查询 | string | 是 | 开始日期，`YYYY-MM-DD`。 |
| `to` | 查询 | string | 否 | 结束日期，`YYYY-MM-DD`。默认：今天。 |
| `maxConcurrency` | 查询 | integer | 否 | 服务端同时读取的天数。对于 API token，取值为 1 到 4，默认 4。大于 4 时按 4 处理。 |

限制：对于 API token，时间范围最多 93 天，超出时返回 HTTP 400。

响应示例（一天）。金额是十进制字符串。

```json
{
  "success": true,
  "data": [
    {
      "date": "2026-11-09",
      "totalAmount": "78.42",
      "warehouseAmount": "74.1",
      "storageAmount": "4.02",
      "cloudServiceAmount": "0.3",
      "serviceHostingAmount": "0",
      "details": {
        "warehouseUsages": [
          { "warehouseName": "default", "clusterName": "default", "maxClusters": 1, "size": "Small", "seconds": 18520, "pricePerSecond": "0.004", "credits": "74.08", "tags": {} }
        ],
        "serviceHostingUsages": [],
        "storageUsages": { "totalBytes": "7340032000", "dayPricePerTB": "0.77", "storageAmount": "4.02", "readRequests": 120000, "kiloReadRequestPrice": "0", "readRequestAmount": "0", "writeRequests": 8000, "kiloWriteRequestPrice": "0", "writeRequestAmount": "0" },
        "cloudServiceUsages": { "apiRequests": "3000", "kiloApiRequestsPrice": "0.1" }
      }
    }
  ]
}
```

## 类型 {#types}

### 账单状态 {#bill-state}

| 取值 | 名称 | 含义 |
|---|---|---|
| `0` | `Preparing` | 本月账单，金额在月底前会持续变化。 |
| `1` | `Prepared` | 未使用。 |
| `2` | `Pending` | 账单已生成，等待付款或确认。 |
| `3` | `PaymentFailed` | 扣款失败。 |
| `4` | `Completed` | 已付款。 |
| `5` | `Confirmed` | 账单已确认，等待扣款。 |
