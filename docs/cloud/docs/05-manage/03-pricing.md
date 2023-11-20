---
title: Pricing & Billing
---

Your warehouses and storage consume credits in Databend Cloud. The Trial Plan (ends in 30-days) offers 200 FREE credits. When you’re running low, you can buy more credits in **Organization** > **Billing**. Each credit costs $1.

![](@site/static/img/documents/pricing-billing/about.png)

## Warehouse Pricing

Warehouses consume credits when they are running (to be more precise, in the Running state). The number of credits consumed depends on the warehouse's size and running time. An XSmall warehouse with 8 vCPUs only consumes 1 credit per hour.

Databend Cloud charges on a per-second basis. For example, if you have a Small warehouse running for three seconds, it will charge 0.00168 (0.000556 x 3) credit. Before you run a warehouse, make sure you have enough credits. To check your credit balance or buy more credits, go to **Organization** > **Billing**.

| Size (vCPUs) | Credits / Hour | Credits / Second |
|-------------------------------|-------------------------|---------------------------|
| XSmall (8)             | $ 1                     | $ 0.000278
| Small (16)           | $ 2                       | $ 0.000556
| Medium (32)            | $ 4                       | $ 0.001111                    |
| Large (64)           | $ 8                       | $ 0.002222                    |
| XLarge (128)           | $ 16                       | $ 0.004444                    |

A suspended warehouse does not consume any credits. Databend Cloud automatically suspends a warehouse in case of no activities for five minutes to save your credits. Alternatively, you can always manually suspend a warehouse when your work is complete. For more information about how to work with warehouses, see [Working with Warehouses](../02-using-databend-cloud/00-warehouses.md)

## Storage Pricing

Your data in Databend Cloud will be physically stored in Amazon S3. You pay for your storage in Databend Cloud based on the Amazon S3 pricing plan. Databend Cloud does not charge additional fees for storage. 

For more information about the Amazon S3 pricing, see https://aws.amazon.com/s3/pricing/

:::tip
The Trial Plan (ends in 30-days) offers a FREE storage of up to 1 GB. That is, Databend Cloud will not charge you for storage if your data is not more than 1 GB.
:::

## Billing

Databend Cloud offers a wide range of billing management features that can help organizations effectively manage and control their consumption data. These features include automatic bill generation, consumption trend analysis, and detailed consumption reporting. With Databend Cloud, organizations can enjoy an efficient, convenient, and user-friendly billing management experience.

The billing period is set for every calendar month, starting from the 1st day to the last day of the month. For your first month, the billing period will begin on the day your organization was created.

To check your billing details, go to **Manage** and then click on **Billing**. From there, you can review your billing query and payment method. You'll need to bind a credit card for payment, which you can also do in the **Manage** > **Billing** section.

:::note Coupon Usage Instructions

- When charging users, Databend Cloud will first deduct the amount in the coupon.
- If there are multiple coupons, the system will automatically deduct from the coupon with the earliest expiration date.
- Coupons have an expiration date, so please use them before they expire.
:::

## FAQ

**Q1: How do I buy credits?**

A: To buy credits, log into your account in Databend Cloud, then go to **Organization** > **Billing**. For safety purposes, Databend Cloud offers multiple payment methods and does not require you to link a credit card to your account.

**Q2: Do you offer a discount?**

A: Sure. Submit a ticket in Databend Cloud to apply for a discount, and we will contact you for details.

**Q3: How do I request a refund?**

A: You can request a refund of your remaining credits (except the free credits from the Trial plan) by submitting a ticket in Databend Cloud.

**Q4: What will happen to my data after I run out of credits?**

A: In this case, Databend Cloud will keep your storage for up to six months at your cost. You cannot perform any computing tasks until you buy more credits. After six months, your data will be permanently removed from Databend Cloud.
