---
title: Pricing & Billing
---

<!-- #ifendef -->

Your costs on Databend Cloud consist of the following components: warehouses, storage, and cloud service fees. This page contains information about the pricing of each component and how the billing works.

## Databend Cloud Pricing

This section provides pricing information on warehouse, storage, and cloud service.

### Warehouse Pricing

Your warehouses incur costs when they are running (specifically, when in the Running state). The cost depends on the warehouse's size and running time. **Billing is calculated on a per-second basis**. For example, if you have a warehouse running for three seconds, you will be charged for that exact duration.

The size of a warehouse refers to the maximum number of concurrent queries it can handle, and prices vary based on the different sizes available and the Databend Cloud edition you use.

| Size   | Max. Concurrency | Hourly Cost (Personal) | Hourly Cost (Business) |
| ------ | ---------------- | ---------------------- | ---------------------- |
| XSmall | 2                | $1.00                  | $1.50                  |
| Small  | 4                | $2.00                  | $3.00                  |
| Medium | 8                | $4.00                  | $6.00                  |
| Large  | 16               | $8.00                  | $12.00                 |
| XLarge | 32               | $16.00                 | $24.00                 |

A suspended warehouse does not consume any resources. By default, Databend Cloud automatically suspends a warehouse after five minutes of inactivity to save resources and costs. You can adjust or disable this automatic suspension feature according to your preferences.

### Storage Pricing

Your data in Databend Cloud is physically stored in Amazon S3. Storage costs in Databend Cloud are based on Amazon S3's pricing. Currently, both the Personal Edition and Business Edition are priced at $23.00 per month per terabyte (TB).

| Edition          | Price per TB per Month |
| ---------------- | ---------------------- |
| Personal Edition | $23.00                 |
| Business Edition | $23.00                 |

### Cloud Service Pricing

The cloud service fee currently includes fees for the API requests. Each time you run a SQL query with Databend Cloud, a REST API request is sent to the `databend-query` through the [Databend HTTP handler](/developer/apis/http). In the Personal Edition, you are billed $1 for every 10,000 API requests, while in the Business Edition, the cost is $2 for every 10,000 API requests.

| Edition          | Cost per 10,000 API Requests |
| ---------------- | ---------------------------- |
| Personal Edition | $1.00                        |
| Business Edition | $2.00                        |

## Databend Cloud Billing

The billing period is set for every calendar month, starting from the 1st day to the last day of the month. For your first month, the billing period will begin on the day your organization was created.

To check your billing details, go to **Manage** and then click on **Billing**. From there, you can review your bills and link a credit card for payment.

When billing users, Databend Cloud applies coupons first. If multiple coupons are available, the system prioritizes deduction from the coupon with the earliest expiration date. Please ensure coupons are used before their expiration date.

<!-- #endendef -->

<!-- #ifcndef -->

您在 Databend Cloud 上的费用由以下部分组成：计算集群、存储和云服务费用。本页面包含每个组件的定价信息以及计费方式。

## Databend Cloud 定价

本节提供计算集群、存储和云服务的定价信息。

### 计算集群定价

您的计算集群在运行时（具体来说，处于 Running 状态时）会产生费用。费用取决于计算集群的大小和运行时间。**计费按秒计算**。例如，如果您有一个计算集群运行了三秒钟，您将为此精确时长付费。

计算集群的大小指的是它能够处理的最大并发查询数，价格根据不同大小和您使用的 Databend Cloud 版本而有所不同。

| 大小   | 最大并发数 | 每小时费用（基础版） | 每小时费用（商业版） |
| ------ | ---------- | -------------------- | -------------------- |
| XSmall | 2          | $1.00                | $1.50                |
| Small  | 4          | $2.00                | $3.00                |
| Medium | 8          | $4.00                | $6.00                |
| Large  | 16         | $8.00                | $12.00               |
| XLarge | 32         | $16.00               | $24.00               |

暂停的计算集群不会消耗任何资源。默认情况下，Databend Cloud 会在计算集群闲置五分钟后自动暂停，以节省资源和成本。您可以根据自己的偏好调整或禁用此自动暂停功能。

### 存储定价

您在 Databend Cloud 中的数据物理存储在 Amazon S3 上。Databend Cloud 的存储成本基于 Amazon S3 的定价。目前，和商业版的定价均为每月每 TB $23.00。

| 版本   | 每 TB 每月价格 |
| ------ | -------------- |
|        | $23.00         |
| 商业版 | $23.00         |

### 云服务定价

云服务费用目前包括 API 请求费用。每次您使用 Databend Cloud 运行 SQL 查询时，都会通过 [Databend HTTP 处理程序](/developer/apis/http) 向 `databend-query` 发送一个 REST API 请求。在基础版中，每 10,000 次 API 请求收费 $1，而在商业版中，每 10,000 次 API 请求收费 $2。

| 版本   | 每 10,000 次 API 请求费用 |
| ------ | ------------------------- |
| 基础版 | $1.00                     |
| 商业版 | $2.00                     |

## Databend Cloud 计费

计费周期设定为每个日历月，从每月的第一天到最后一天。对于您的第一个月，计费周期将从您的组织创建之日算起。

要查看您的计费详情，请前往 **管理**，然后点击 **计费**。在那里，您可以查看您的账单并关联信用卡进行支付。

在向用户计费时，Databend Cloud 首先应用优惠券。如果有多个优惠券可用，系统会优先从最早到期的优惠券中扣除。请确保在优惠券到期前使用。

<!-- #endcndef -->
