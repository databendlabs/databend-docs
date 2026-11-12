---
title: "Billing"
sidebar_label: "Billing"
---

Read the [Overview](./index.md) first for authentication, request conventions, and errors.

These endpoints only read bills and usage. Amounts are numbers in the billing currency of the organization. To pay, confirm a bill, or change the payment method, use the Cloud console.

## List Bills

`GET /api/v1/billing/orgs/{orgSlug}/billing-histories` · Read · Member

Returns the bills of the organization, from the newest. The first page starts with the bill of the current month. That bill has `id` `0` and `state` `0`, and its amounts change until the month ends.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `page` | query | integer | No | Page number. Default: 1. |
| `perPage` | query | integer | No | Rows per page. Default: 50. |

Response example. `state` is a [bill state](#bill-state). For API tokens, `invoiceInfo` leaves out `cardBrand` and `cardLast4`.

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

## Get a Bill

`GET /api/v1/billing/orgs/{orgSlug}/billing-histories/{billingHistoryId}` · Read · Member

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `billingHistoryId` | path | integer | Yes | Bill ID from [List Bills](#list-bills). |

Response: `data` is one bill with the same fields as one item of [List Bills](#list-bills).

## Get Bill Details

`GET /api/v1/billing/orgs/{orgSlug}/billing-histories/{billingHistoryId}/details-v2` · Read · Member

Returns the amounts of a bill by category and by day.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `billingHistoryId` | path | string | Yes | A bill ID, `0` for the current month, or a month as `YYYY-MM`. |

Response example. Each item of `items` has the shape of one day of [Get Daily Usage](#get-daily-usage).

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

Amounts in this response are decimal strings.

## Get Daily Usage

`GET /api/v1/orgs/{orgSlug}/daily-usages` · Read · Member

Returns the usage and the amount of each day, by warehouse, storage, cloud services, and hosted services.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `from` | query | string | Yes | First day, `YYYY-MM-DD`. |
| `to` | query | string | No | Last day, `YYYY-MM-DD`. Default: today. |

Limits: for API tokens, the range can have at most 93 days. A longer range returns HTTP 400.

Response example (one day). Amounts are decimal strings.

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

## Types

### Bill State

| Value | Name | Meaning |
|---|---|---|
| `0` | `Preparing` | The bill of the current month. The amounts change until the month ends. |
| `1` | `Prepared` | Not used. |
| `2` | `Pending` | The bill is final and waits for payment or for confirmation. |
| `3` | `PaymentFailed` | The payment failed. |
| `4` | `Completed` | The bill is paid. |
| `5` | `Confirmed` | The bill is confirmed and waits for payment. |
