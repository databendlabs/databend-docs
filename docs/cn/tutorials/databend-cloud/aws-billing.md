---
title: 分析 AWS 账单
---

在本教程中，我们将介绍如何导入 AWS 账单数据并使用 SQL 进行成本分析。你将学习如何将 AWS 账单数据加载到 Databend Cloud 中，查询它以查找关键的成本驱动因素，并深入了解你的 AWS 使用情况。

AWS 账单数据提供了你的云服务使用情况和相关成本的全面细分，可以直接从 AWS Billing Console 中的 AWS Cost and Usage Reports (CUR) 服务中以 Parquet 格式导出。在本教程中，我们将使用 Parquet 格式的示例数据集，该数据集可在 [https://datasets.databend.com/aws-billing.parquet](https://datasets.databend.com/aws-billing.parquet) 获得。该数据集遵循 CUR 标准，其中包括服务名称、使用类型和定价详细信息等字段。有关完整的架构参考，你可以参考 [AWS Cost and Usage Report Data Dictionary](https://docs.aws.amazon.com/cur/latest/userguide/data-dictionary.html)。

## Step 1: 创建目标表

打开一个 worksheet，创建一个名为 `doc` 的数据库，然后创建一个名为 `aws_billing` 的表：

```sql
CREATE DATABASE doc;

CREATE TABLE aws_billing (
    identity_line_item_id STRING,
    identity_time_interval STRING,
    bill_invoice_id STRING,
    bill_invoicing_entity STRING,
    bill_billing_entity STRING,
    bill_bill_type STRING,
    bill_payer_account_id STRING,
    bill_billing_period_start_date TIMESTAMP,
    bill_billing_period_end_date TIMESTAMP,
    line_item_usage_account_id STRING,
    line_item_line_item_type STRING,
    line_item_usage_start_date TIMESTAMP,
    line_item_usage_end_date TIMESTAMP,
    line_item_product_code STRING,
    line_item_usage_type STRING,
    line_item_operation STRING,
    line_item_availability_zone STRING,
    line_item_usage_amount DOUBLE,
    line_item_normalization_factor DOUBLE,
    line_item_normalized_usage_amount DOUBLE,
    line_item_currency_code STRING,
    line_item_unblended_rate STRING,
    line_item_unblended_cost DOUBLE,
    line_item_blended_rate STRING,
    line_item_blended_cost DOUBLE,
    line_item_line_item_description STRING,
    line_item_tax_type STRING,
    line_item_legal_entity STRING,
    product_product_name STRING,
    product_purchase_option STRING,
    product_availability STRING,
    product_availability_zone STRING,
    product_capacitystatus STRING,
    product_classicnetworkingsupport STRING,
    product_clock_speed STRING,
    product_content_type STRING,
    product_cputype STRING,
    product_current_generation STRING,
    product_database_engine STRING,
    product_dedicated_ebs_throughput STRING,
    product_deployment_option STRING,
    product_description STRING,
    product_durability STRING,
    product_ecu STRING,
    product_endpoint_type STRING,
    product_engine_code STRING,
    product_enhanced_networking_supported STRING,
    product_equivalentondemandsku STRING,
    product_fee_code STRING,
    product_fee_description STRING,
    product_from_location STRING,
    product_from_location_type STRING,
    product_from_region_code STRING,
    product_gpu STRING,
    product_gpu_memory STRING,
    product_group STRING,
    product_group_description STRING,
    product_instance_family STRING,
    product_instance_type STRING,
    product_instance_type_family STRING,
    product_intel_avx2_available STRING,
    product_intel_avx_available STRING,
    product_intel_turbo_available STRING,
    product_license_model STRING,
    product_location STRING,
    product_location_type STRING,
    product_logs_destination STRING,
    product_marketoption STRING,
    product_max_iops_burst_performance STRING,
    product_max_iopsvolume STRING,
    product_max_throughputvolume STRING,
    product_max_volume_size STRING,
    product_memory STRING,
    product_memory_gib STRING,
    product_memorytype STRING,
    product_message_delivery_frequency STRING,
    product_message_delivery_order STRING,
    product_min_volume_size STRING,
    product_network_performance STRING,
    product_normalization_size_factor STRING,
    product_operating_system STRING,
    product_operation STRING,
    product_origin STRING,
    product_physical_processor STRING,
    product_pre_installed_sw STRING,
    product_pricingplan STRING,
    product_processor_architecture STRING,
    product_processor_features STRING,
    product_product_family STRING,
    product_provider STRING,
    product_purchaseterm STRING,
    product_queue_type STRING,
    product_recipient STRING,
    product_region STRING,
    product_region_code STRING,
    product_request_type STRING,
    product_servicecode STRING,
    product_servicename STRING,
    product_sku STRING,
    product_snapshotarchivefeetype STRING,
    product_storage STRING,
    product_storage_class STRING,
    product_storage_media STRING,
    product_storage_type STRING,
    product_subservice STRING,
    product_tenancy STRING,
    product_tiertype STRING,
    product_to_location STRING,
    product_to_location_type STRING,
    product_to_region_code STRING,
    product_transfer_type STRING,
    product_type STRING,
    product_usagetype STRING,
    product_vcpu STRING,
    product_version STRING,
    product_volume_api_name STRING,
    product_volume_type STRING,
    product_vpcnetworkingsupport STRING,
    pricing_lease_contract_length STRING,
    pricing_offering_class STRING,
    pricing_purchase_option STRING,
    pricing_rate_code STRING,
    pricing_rate_id STRING,
    pricing_currency STRING,
    pricing_public_on_demand_cost DOUBLE,
    pricing_public_on_demand_rate STRING,
    pricing_term STRING,
    pricing_unit STRING,
    reservation_amortized_upfront_cost_for_usage DOUBLE,
    reservation_amortized_upfront_fee_for_billing_period DOUBLE,
    reservation_effective_cost DOUBLE,
    reservation_end_time STRING,
    reservation_modification_status STRING,
    reservation_normalized_units_per_reservation STRING,
    reservation_number_of_reservations STRING,
    reservation_recurring_fee_for_usage DOUBLE,
    reservation_start_time STRING,
    reservation_subscription_id STRING,
    reservation_total_reserved_normalized_units STRING,
    reservation_total_reserved_units STRING,
    reservation_units_per_reservation STRING,
    reservation_unused_amortized_upfront_fee_for_billing_period DOUBLE,
    reservation_unused_normalized_unit_quantity DOUBLE,
    reservation_unused_quantity DOUBLE,
    reservation_unused_recurring_fee DOUBLE,
    reservation_upfront_value DOUBLE,
    savings_plan_total_commitment_to_date DOUBLE,
    savings_plan_savings_plan_a_r_n STRING,
    savings_plan_savings_plan_rate DOUBLE,
    savings_plan_used_commitment DOUBLE,
    savings_plan_savings_plan_effective_cost DOUBLE,
    savings_plan_amortized_upfront_commitment_for_billing_period DOUBLE,
    savings_plan_recurring_commitment_for_billing_period DOUBLE,
    savings_plan_start_time STRING,
    savings_plan_end_time STRING,
    savings_plan_offering_type STRING,
    savings_plan_payment_option STRING,
    savings_plan_purchase_term STRING,
    savings_plan_region STRING
);
```

## Step 2: 加载 AWS 账单数据集

在此步骤中，你只需点击几下即可将 AWS 账单数据集加载到 Databend Cloud 中。

1. 在 Databend Cloud 中，选择 **Overview** > **Load Data** 以启动数据加载向导。

2. 选择将数据加载到 **An existing table**，然后选择 **Load from a URL** 并输入数据集 URL：`https://datasets.databend.com/aws-billing.parquet`。

![alt text](../../../../static/img/documents/tutorials/aws-billing-1.png)

3. 选择你创建的数据库和表，然后选择一个计算集群。

![alt text](../../../../static/img/documents/tutorials/aws-billing-2.png)

4. 单击 **Confirm** 开始数据加载。

## Step 3: 使用 SQL 分析成本

现在你的账单数据已就绪，你可以使用 SQL 查询来分析 AWS 账单信息。此步骤提供了一些示例，可以帮助你了解支出并发现关键见解。

以下查询标识了你使用过的最昂贵的服务：

```sql
SELECT
    product_servicename AS Service,
    SUM(line_item_blended_cost) AS Total_Cost
FROM aws_billing
WHERE
    line_item_blended_cost IS NOT NULL
    AND product_servicename != ''
GROUP BY product_servicename
ORDER BY Total_Cost DESC
LIMIT 25;
```

以下查询标识了最昂贵的 AWS EC2 资源：

```sql
SELECT
    line_item_line_item_description,
    SUM(line_item_blended_cost) AS Total_Cost
FROM aws_billing
WHERE
    product_servicename = 'Amazon Elastic Compute Cloud'
    AND line_item_blended_cost IS NOT NULL
    AND identity_line_item_id != ''
GROUP BY line_item_line_item_description
ORDER BY Total_Cost DESC
LIMIT 25;
```

以下查询标识了最昂贵的 S3 存储桶：

```sql
SELECT
    line_item_line_item_description,
    SUM(line_item_blended_cost) AS Cost    
FROM aws_billing
WHERE
    line_item_product_code = 'AmazonS3'
    AND line_item_line_item_description != ''
GROUP BY line_item_line_item_description
ORDER BY Cost DESC
LIMIT 25;
```

以下查询根据混合成本标识了前 25 个最昂贵的区域：

```sql
SELECT
    product_region AS Region,
    SUM(line_item_blended_cost) AS Total_Cost
FROM aws_billing
WHERE
    line_item_blended_cost IS NOT NULL
    AND product_region IS NOT NULL
GROUP BY product_region
ORDER BY Total_Cost DESC
LIMIT 25;
```

以下查询将你的成本分为预留实例和按需实例，以帮助你了解每种类型对总支出的贡献：

```sql
SELECT
    CASE
        WHEN reservation_amortized_upfront_cost_for_usage IS NOT NULL THEN 'Reserved Instances'
        ELSE 'On-Demand'
    END AS Instance_Type,
    SUM(line_item_blended_cost) AS Total_Cost
FROM aws_billing
WHERE
    line_item_blended_cost IS NOT NULL
GROUP BY Instance_Type
ORDER BY Total_Cost DESC;
```