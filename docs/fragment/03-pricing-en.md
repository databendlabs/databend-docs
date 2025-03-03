Your costs on Databend Cloud consist of the following components: warehouses, storage, and cloud service fees. This page contains information about the pricing of each component and how the billing works.

## Databend Cloud Pricing

This section provides pricing information on warehouse, storage, and cloud service.

### Warehouse Pricing

Your warehouses incur costs when they are running (specifically, when in the Running state). The cost depends on the warehouse\'s size and running time. **Billing is calculated on a per-second basis**. For example, if you have a warehouse running for three seconds, you will be charged for that exact duration.

The size of a warehouse refers to the maximum number of concurrent queries it can handle, and prices vary based on the different sizes available and the Databend Cloud edition you use.

| Size   | Hourly Cost (Personal) | Hourly Cost (Business) | Per-Second Cost (Personal) | Per-Second Cost (Business) |
| ------ | ---------------------- | ---------------------- | -------------------------- | -------------------------- |
| XSmall | $1.00                  | $1.50                  | $0.000277778               | $0.000416667               |
| Small  | $2.00                  | $3.00                  | $0.000555556               | $0.000833333               |
| Medium | $4.00                  | $6.00                  | $0.001111111               | $0.001666667               |
| Large  | $8.00                  | $12.00                 | $0.002222222               | $0.003333333               |
| XLarge | $16.00                 | $24.00                 | $0.004444444               | $0.006666667               |

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
(XSmall cluster charges $0.000416667 per second, and the query duration is 5 minutes and 20 seconds)

### Storage charges:

23 / 1024 / 30 \* 100 = $0.75
(Storage price is $23 per TB/month, 1TB = 1024GB, 30 days in a month)

### Total daily cost:

Compute charges + Storage charges = $0.13 + $0.75 = $0.88

### The total cost for the month would be:

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

### The total cost for the month would be:

Assuming 24-hour continuous data import throughout the month, 56.77 \* 30 = $1703.1

## Databend Cloud Billing

The billing period is set for every calendar month, starting from the 1st day to the last day of the month. For your first month, the billing period will begin on the day your organization was created.

To check your billing details, go to **Manage** and then click on **Billing**. From there, you can review your bills and link a credit card for payment.

When billing users, Databend Cloud applies coupons first. If multiple coupons are available, the system prioritizes deduction from the coupon with the earliest expiration date. Please ensure coupons are used before their expiration date.
