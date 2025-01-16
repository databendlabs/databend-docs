---
title: Snowflake
---

This guide provides a high-level overview of the process to migrate your data from Snowflake to Databend. The migration involves exporting data from Snowflake to an Amazon S3 bucket and then loading it into Databend. The process is broken down into three main steps:

![alt text](@site/static/img/load/snowflake-databend.png)

## Step 1: Configuring Snowflake Storage Integration for Amazon S3

Before exporting your data, you need to establish a connection between Snowflake and Amazon S3. This is achieved by configuring a storage integration that allows Snowflake to securely access and interact with the S3 bucket where your data will be staged.

1. Create IAM Role & Policy: Start by creating an AWS IAM role with permissions to read from and write to your S3 bucket. This role ensures that Snowflake can interact with the S3 bucket securely.

2. Snowflake Storage Integration: In Snowflake, you will configure a storage integration using the IAM role. This integration will allow Snowflake to securely access the designated S3 bucket and perform data export operations.

3. Update Trust Relationships: After creating the storage integration, you will update the Trust Relationships of the IAM role in AWS to ensure that Snowflake can assume the IAM role and gain the necessary permissions for data access.

## Step 2: Preparing & Exporting Data to Amazon S3

Once the integration is set up, the next step is to prepare the data within Snowflake and export it to the S3 bucket.

1. Create Stage: You need to create an external stage in Snowflake that points to the S3 bucket. This stage will serve as a temporary location for the data before it's transferred to Databend.

2. Prepare Data: Create the necessary tables and populate them with data in Snowflake. Once the data is ready, you can export it to the S3 bucket in a desired format, such as Parquet.

3. Export Data: Use Snowflake’s COPY INTO command to export the data from Snowflake tables into the S3 bucket, specifying the file format and location. This process will save the data in the S3 bucket, making it ready for the next step.

## Step 3: Loading Data into Databend

Now that your data is exported to an S3 bucket, the final step is to load it into Databend.

1. Create Target Table: In Databend, create a target table that matches the structure of the data you exported from Snowflake.

2. Load Data: Use the COPY INTO command in Databend to load the data from the S3 bucket into the target table. Provide your AWS credentials to ensure Databend can access the S3 bucket. You can also define the file format (such as Parquet) to match the format of the exported data.

3. Verify Data: After loading the data, perform a simple query in Databend to verify that the data has been successfully imported and is available for further processing.

## Tutorials

- [Migrating from Snowflake](/tutorials/migrate/migrating-from-snowflake)