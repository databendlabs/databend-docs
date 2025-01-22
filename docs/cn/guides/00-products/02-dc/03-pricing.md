| Size   | Max Concurrency | Hourly Cost (Personal) | Hourly Cost (Business) | Per-Second Cost (Personal) | Per-Second Cost (Business) |
| ------ | --------------- | ---------------------- | ---------------------- | -------------------------- | -------------------------- |
| XSmall | 2               | $ 3.00                 | $ 4.50                 | $ 0.000833333              | $ 0.00125                  |
| Small  | 4               | $ 6.00                 | $ 9.00                 | $ 0.001666667              | $ 0.0025                   |
| Medium | 8               | $ 12.00                | $ 18.00                | $ 0.003333333              | $ 0.005                    |
| Large  | 16              | $ 24.00                | $ 36.00                | $ 0.006666667              | $ 0.01                     |
| XLarge | 32              | $ 48.00                | $ 72.00                | $ 0.013333333              | $ 0.02                     |

Suspended warehouses do not consume any resources. By default, Databend Cloud automatically suspends a warehouse after five minutes of inactivity to save resources and costs. You can adjust or disable this auto-suspend feature based on your preferences.

### Storage Pricing

Your data in Databend Cloud is actually stored in object storage. The storage cost of Databend Cloud is based on the pricing of object storage. Currently, the pricing for both Standard and Business editions is $160.00 per TB per month.

| Edition   | Price per TB per Month |
| --------- | ---------------------- |
| Standard  | $ 160.00               |
| Business  | $ 160.00               |

## Example 1:

A user uses a Business edition XSmall warehouse, occasionally queries data, and the query takes 5 minutes and 20 seconds. The data storage capacity is 100G. The cost for the day is:

### Warehouse Cost:

0.00125*(5*60+20)=0.4 (XSmall warehouse costs 0.00125 per second, duration 5 minutes and 20 seconds)

### Storage Cost:

160/1024/30\*100=0.52 (Storage price: $160/T/month, 1T=1024G, 30 days)

### Total Cost for the Day: Warehouse Cost + Storage Cost = 0.4 + 0.52 = 0.92

For the month, with a query frequency of once per day, the total cost is: 0.92\*30=27.6
(Note: Since the number of cloud service API calls is almost zero, no cloud service fee is incurred. A large number of frequent queries per day will incur service fees, as in Example 2)

## Example 2:

A user uses a Business edition XSmall warehouse and continuously imports data into Databend Cloud. During this period, the warehouse runs 24 hours a day, and the data storage capacity is 1T. To achieve dynamic continuous data loading, the user utilizes the Task service provided by Databend Cloud, setting the task to execute once per minute to load data into Databend Cloud. The expected number of API calls is 100,000. The cost for the day is:

### Warehouse Cost:

0.00125*3600*24=4.5\*24=108 (XSmall warehouse costs 0.00125 per second, 1 hour is 3600 seconds, 24 hours)

### Storage Cost:

160/30\*1=5.33 (Storage price: $160/T/month, 1 month is 30 days)

### Cloud Service Cost:

4.5\*10=45 ($4.5 per 10,000 API calls, 100,000 calls)

### Total Cost for the Day:

Warehouse Cost + Storage Cost + Cloud Service Cost = 108 + 5.33 + 45 = 158.33
For the month, with 24-hour continuous data import, the total cost is: 158.33\*30=4749.9

### Cloud Service Pricing

Cloud service fees currently include the cost of API requests. Each time you run a SQL query using Databend Cloud, a REST API request is sent to `databend-query` via the [Databend HTTP Handler](/developer/apis/http). In the Standard edition, the cost is $3.00 per 10,000 API requests, while in the Business edition, the cost is $4.50 per 10,000 API requests.

| Edition   | Cost per 10,000 API Requests |
| --------- | ---------------------------- |
| Standard  | $ 3.00                       |
| Business  | $ 4.50                       |

## Databend Cloud Billing

The billing cycle is set to each calendar month, from the first day to the last day of the month. For your first month, the billing cycle will start from the day your organization is created. Please note that **users who register directly on the official website and those from the Tencent Cloud Marketplace need to recharge on the official website before consumption; users from the Alibaba Cloud Marketplace pay directly through the Alibaba Cloud Marketplace.**

To view your bill, go to **Admin**, then click **Billing Center**.

When deducting fees, Databend Cloud first uses coupons. If multiple coupons are available, the system will deduct from the coupon with the earliest expiration date first. Please make sure to use your coupons before they expire.

"
/>

| 大小   | 最大并发数 | 每小时成本（基础版） | 每小时成本（商业版） | 每秒成本（基础版） | 每秒成本（商业版） |
| ------ | ---------- | -------------------- | -------------------- | ------------------ | ------------------ |
| XSmall | 2          | $1.00                | $1.50                | $0.000277778       | $0.000416667       |
| Small  | 4          | $2.00                | $3.00                | $0.000555556       | $0.000833333       |
| Medium | 8          | $4.00                | $6.00                | $0.001111111       | $0.001666667       |
| Large  | 16         | $8.00                | $12.00               | $0.002222222       | $0.003333333       |
| XLarge | 32         | $16.00               | $24.00               | $0.004444444       | $0.006666667       |

暂停的计算集群不会消耗任何资源。默认情况下，Databend Cloud 会在计算集群闲置五分钟后自动暂停，以节省资源和成本。您可以根据自己的偏好调整或禁用此自动暂停功能。

### 存储定价

您在 Databend Cloud 中的数据实际存储在 Amazon S3 中。Databend Cloud 的存储成本基于 Amazon S3 的定价。目前，基础版和商业版的存储价格均为每月每 TB $23.00。

| 版本          | 每 TB 每月价格 |
| ------------- | -------------- |
| 基础版        | $23.00         |
| 商业版        | $23.00         |

## 示例-1：

一位用户正在使用 XSmall 计算集群（商业版）并偶尔查询数据。此特定查询耗时 5 分钟 20 秒，数据存储大小为 100GB。当天的费用如下：

### 计算费用：

0.000416667 \* (5 \* 60 + 20) = $0.13
（XSmall 计算集群每秒收费 0.00125 元，查询时长为 5 分钟 20 秒）

### 存储费用：

23 / 1024 / 30 \* 100 = $0.75
（存储价格为每月每 TB $23，1TB = 1024GB，一个月 30 天）

### 每日总成本：

计算费用 + 存储费用 = $0.13 + $0.75 = $0.88
假设每天进行一次查询，一个月的总成本为：
0.88 \* 30 = $26.4
（注意：由于 API 调用不频繁，云服务费用可以忽略不计。只有频繁查询才会产生云服务费用，如示例 2 所示。）

## 示例-2：

一位用户正在使用 XSmall 计算集群（商业版）将数据持续导入 Databend Cloud。计算集群每天运行 24 小时，数据存储为 1TB。为了方便持续数据加载，用户设置了一个每分钟运行的任务，将数据加载到 Databend Cloud。预计 API 调用次数为 100,000 次。当天的费用如下：

### 计算费用：

1.50 \* 24 = $36
（XSmall 计算集群每小时收费 $1.50）

### 存储费用：

23 / 30 = $0.77
（存储价格为每月每 TB $23，1TB = 1024GB，一个月 30 天）

### 云服务费用：

2 \* 10 = $20
（每 10,000 次 API 调用收费 $2）

### 每日总成本：

计算费用 + 存储费用 + 云服务费用 = 36 + 0.77 + 20 = $56.77
假设整个月都在 24 小时持续导入数据，一个月的总成本为：
56.77 \* 30 = $1703.1

### 云服务定价

当前的云服务费用包括 API 请求的费用。每次使用 Databend Cloud 运行 SQL 查询时，都会通过 [Databend HTTP 处理程序](/developer/apis/http) 向 `databend-query` 发送 REST API 请求。在基础版中，每 10,000 次 API 请求收费 $1，而在商业版中，每 10,000 次 API 请求收费 $2。

| 版本          | 每 10,000 次 API 请求费用 |
| ------------- | ------------------------- |
| 基础版        | $1.00                     |
| 商业版        | $2.00                     |

## Databend Cloud 计费

计费周期为每个自然月，从每月的第一天到最后一天。对于您的第一个月，计费周期将从您的组织创建之日开始。

要查看您的账单详情，请转到 **管理**，然后点击 **计费**。在那里，您可以查看您的账单并绑定信用卡进行支付。

在向用户计费时，Databend Cloud 会优先使用优惠券。如果有多个优惠券可用，系统会优先扣除最早到期的优惠券。请确保在优惠券到期前使用。