---
title: Pricing & Billing
---

import LanguageDocs from '@site/src/components/LanguageDocs';

<LanguageDocs
cn=
"

您在 Databend Cloud 上的费用由以下几个部分组成：计算集群、存储和云服务费。本页面包含各部分的价格信息以及账单的说明。

## Databend Cloud 定价

本节提供有关 Databend Cloud 计算集群、存储和云服务的价格信息。

### 计算集群价格

您的计算集群在运行时（具体来说，处于运行状态时）会产生费用。费用取决于计算集群的大小和运行时间。**计算集群按秒计算**。例如，如果您有一个计算集群运行了三秒钟，您将只为此段时间付费。

计算集群的大小指的是它能够处理的并发查询的最大数量，价格根据不同的大小和所使用的 Databend Cloud 版本而有所不同。

| 大小   | 最大并发 | 每小时费用 (基础版) | 每小时费用 (商业版) | 每秒费用 (基础版) | 每秒费用 (商业版) |
| ------ | -------- | ------------------- | ------------------- | ----------------- | ----------------- |
| XSmall | 2        | ￥ 3.00             | ￥ 4.50             | ￥ 0.000833333    | ￥ 0.00125        |
| Small  | 4        | ￥ 6.00             | ￥ 9.00             | ￥ 0.001666667    | ￥ 0.0025         |
| Medium | 8        | ￥ 12.00            | ￥ 18.00            | ￥ 0.003333333    | ￥ 0.005          |
| Large  | 16       | ￥ 24.00            | ￥ 36.00            | ￥ 0.006666667    | ￥ 0.01           |
| XLarge | 32       | ￥ 48.00            | ￥ 72.00            | ￥ 0.013333333    | ￥ 0.02           |

暂停的计算集群不会消耗任何资源。默认情况下，Databend Cloud 会在五分钟不活动后自动暂停计算集群以节省资源和成本。您可以根据自己的偏好调整或禁用此自动暂停功能。

### 存储定价

您在 Databend Cloud 中的数据实际上存放在对象存储中。Databend Cloud 的存储成本基于对象存储的定价。目前，标准版和商业版的定价均为每月每 TB 160.00 元。

| 版本   | 每 TB 每月价格 |
| ------ | -------------- |
| 标准版 | ￥ 160.00      |
| 商业版 | ￥ 160.00      |

### 云服务定价

云服务费目前包括 API 请求的费用。每次您使用 Databend Cloud 运行 SQL 查询时，都会通过 [Databend HTTP 处理器](/developer/apis/http) 向 `databend-query` 发送一个 REST API 请求。在标准版中，每 10,000 次 API 请求收费 3 元，而在商业版中，每 10,000 次 API 请求收费 4.5 元。

| 版本   | 每 10,000 次 API 请求费用 |
| ------ | ------------------------- |
| 标准版 | ￥ 3.00                   |
| 商业版 | ￥ 4.50                   |

## 例子 1：

某用户使用商业版 XSmall 集群，偶尔查询一次数据，此次查询耗时 5 分 20 秒，数据存储容量为 100G，当天的费用是:

### 计算费用：

0.00125*(5*60+20)=0.4 元（XSmall 集群 1 秒计费为 0.00125，时长 5 分 20 秒）

### 存储费用：

160/1024/30\*100=0.52 元(存储单价:160 元/T/月，1T=1024G，30 天)

### 该天总费用：

计算费用+存储费用=0.4+0.52=0.92 元

### 总费用为：

该月按照每天一次的查询频率，0.92\*30=27.6 元
（注：因云服务 API 调用次数太少，几乎为 0，所以不产生云服务费，每天有大量频繁查询才会产生服务费，如例子 2）

## 例子 2：

某用户使用商业版 XSmall 集群，将数据持续导入 Dataend Cloud。期间，计算集群 24 小时不间断运行，存储数据量为 1T。为实现数据的动态持续加载，该用户运用了 Databend Cloud 提供的 Task 服务，设置任务为每分钟执行一次，将数据加载至 Databend Cloud 中，预计调用 API 次数为 10 万次。当天产生的费用是:

### 计算费用：

0.00125*3600*24=4.5\*24=108 元（XSmall 集群 1 秒计费为 0.00125，1 小时为 3600 秒，24 小时）

### 存储费用：

160/30\*1=5.33 元 (存储单价:160 元/T/月，1 个月为 30 天)

### 云服务费用：

4.5\*10=45 元（4.5 元/1 万次 API 调用，10 万次）

### 该天总费用：

计算费用+存储费用+云服务费用=108+5.33+45=158.33 元
该月按照 24 小时持续数据导入，总费用为：158.33\*30=4749.9 元

## Databend Cloud 计费

计费周期设定为每个自然月，从每月的第一天到最后一天。对于您的第一个月，计费周期将从您的组织创建的那一天开始。需要注意的是，**在官网直接注册和腾讯云市场的用户需要在官网充值后消费；阿里云市场的用户直接通过阿里云市场付费。**

要查看您的账单，请前往 **管理**，然后点击 **费用中心**。

在进行扣费时，Databend Cloud 首先使用优惠券。如果有多个优惠券可用，系统会优先从到期日期最早的优惠券中扣除。请确保在优惠券到期前使用。

"
en=
"

Your costs on Databend Cloud consist of the following components: warehouses, storage, and cloud service fees. This page contains information about the pricing of each component and how the billing works.

## Databend Cloud Pricing

This section provides pricing information on warehouse, storage, and cloud service.

### Warehouse Pricing

Your warehouses incur costs when they are running (specifically, when in the Running state). The cost depends on the warehouse\'s size and running time. **Billing is calculated on a per-second basis**. For example, if you have a warehouse running for three seconds, you will be charged for that exact duration.

The size of a warehouse refers to the maximum number of concurrent queries it can handle, and prices vary based on the different sizes available and the Databend Cloud edition you use.

| Size   | Max. Concurrency | Hourly Cost (Personal) | Hourly Cost (Business) | Per-Second Cost (Personal) | Per-Second Cost (Business) |
| ------ | ---------------- | ---------------------- | ---------------------- | -------------------------- | -------------------------- |
| XSmall | 2                | $1.00                  | $1.50                  | $0.000277778               | $0.000416667               |
| Small  | 4                | $2.00                  | $3.00                  | $0.000555556               | $0.000833333               |
| Medium | 8                | $4.00                  | $6.00                  | $0.001111111               | $0.001666667               |
| Large  | 16               | $8.00                  | $12.00                 | $0.002222222               | $0.003333333               |
| XLarge | 32               | $16.00                 | $24.00                 | $0.004444444               | $0.006666667               |

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

## Example-1:

A user is using an XSmall warehouse (Business) and occasionally queries data. This specific query took 5 minutes and 20 seconds, and the data storage size is 100GB. The charges for the day are as follows:

### Compute charges:

0.000416667 \* (5 \* 60 + 20) = $0.13
(XSmall cluster charges 0.00125 RMB per second, and the query duration is 5 minutes and 20 seconds)

### Storage charges:

23 / 1024 / 30 \* 100 = $0.75
(Storage price is $23 per TB/month, 1TB = 1024GB, 30 days in a month)

### Total daily cost:

Compute charges + Storage charges = $0.13 + $0.75 = $0.88

### the total cost for the month would be:

Assuming one query per day, 0.88 \* 30 = $26.4
(Note: Because the API calls are infrequent, the cloud service fee is negligible. Only frequent queries will generate cloud service fees, as shown in Example 2.)

## Example-2:

A user is using an XSmall warehouse (Business) to continuously import data into Databend Cloud. The warehouse runs 24 hours a day, and the data storage is 1TB. To facilitate continuous data loading, the user has set up a task to run every minute, loading data into Databend Cloud. The estimated number of API calls is 100,000. The charges for the day are as follows:

### Compute charges:

1.50 \* 24 = $36
(XSmall cluster charges $1.50 per hour)

### Storage charges:

23 / 30 = $0.77
(Storage price is $23 per TB/month, 1TB = 1024GB, 30 days in a month)

### Cloud service charges:

2 \* 10 = $20
($2 per 10,000 API calls)

### Total daily cost:

Compute charges + Storage charges + Cloud service charges = 36 + 0.77 + 20 = $56.77

### the total cost for the month would be:

Assuming 24-hour continuous data import throughout the month, 56.77 \* 30 = $1703.1

## Databend Cloud Billing

The billing period is set for every calendar month, starting from the 1st day to the last day of the month. For your first month, the billing period will begin on the day your organization was created.

To check your billing details, go to **Manage** and then click on **Billing**. From there, you can review your bills and link a credit card for payment.

When billing users, Databend Cloud applies coupons first. If multiple coupons are available, the system prioritizes deduction from the coupon with the earliest expiration date. Please ensure coupons are used before their expiration date.

"/>
