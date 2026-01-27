Your costs on Databend Cloud consist of the following components: warehouses, storage, and cloud service fees. This page contains information about the pricing of each component and how the billing works.

## Databend Cloud Pricing

This section provides pricing information on warehouse, storage, and cloud service.

### Warehouse Pricing

Your warehouses incur costs when they are running (specifically, when in the Running state). The cost depends on the warehouse\'s size and running time. **Billing is calculated on a per-second basis**. For example, if you have a warehouse running for three seconds, you will be charged for that exact duration.

The size of a warehouse refers to the maximum number of concurrent queries it can handle, and prices vary based on the different sizes available and the Databend Cloud edition you use.

| Size    | Hourly Cost (Personal) | Hourly Cost (Business) | Per-Second Cost (Personal) | Per-Second Cost (Business) |
| ------- | ---------------------- | ---------------------- | -------------------------- | -------------------------- |
| XSmall  | $1.00                  | $1.50                  | $0.000277778               | $0.000416667               |
| Small   | $2.00                  | $3.00                  | $0.000555556               | $0.000833333               |
| Medium  | $4.00                  | $6.00                  | $0.001111111               | $0.001666667               |
| Large   | $8.00                  | $12.00                 | $0.002222222               | $0.003333333               |
| XLarge  | $16.00                 | $24.00                 | $0.004444444               | $0.006666667               |
| 2XLarge | $32.00                 | $48.00                 | $0.008888889               | $0.013333333               |
| 3XLarge | $64.00                 | $96.00                 | $0.017777778               | $0.026666667               |
| 4XLarge | $128.00                | $192.00                | $0.035555556               | $0.053333333               |
| 5XLarge | $256.00                | $384.00                | $0.071111111               | $0.106666667               |
| 6XLarge | $512.00                | $768.00                | $0.142222222               | $0.213333333               |

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

import BillingExample from '@site/src/components/BillingExample';

<BillingExample example={1} />

## Example-2:

<BillingExample example={2} />

## Databend Cloud Billing

The billing period is set for every calendar month, starting from the 1st day to the last day of the month. For your first month, the billing period will begin on the day your organization was created.

To check your billing details, go to **Manage** and then click on **Billing**. From there, you can review your bills and link a credit card for payment.

When billing users, Databend Cloud applies vouchers first. If multiple vouchers are available, the system prioritizes deduction from the voucher with the earliest expiration date. Please ensure vouchers are used before their expiration date.
