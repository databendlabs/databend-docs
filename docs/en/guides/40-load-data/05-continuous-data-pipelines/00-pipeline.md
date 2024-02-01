---
title: Loading Data via Pipelines
sidebar_label: Pipeline
---

A pipeline in Databend Cloud allows for automatic discovery of file updates from object storage and automatically loads them into a table. Here are some scenarios where using a pipeline is recommended:

- You have a large number of CSV or Parquet files in your bucket and want to load them to Databend Cloud in one go for further analysis.

- The object storage automatically loads data into your buckets, such as billing data, which can be automatically loaded into Databend Cloud for visualization and further analysis.

- You have a continuous stream of user behavior logs being stored into your object storage, which can be automatically loaded into Databend Cloud using pipelines for further analysis.

:::tip Pipeline Now Free
During public beta, pipeline is offered free of charge on Databend Cloud. Limit of 4 Pipelines per organization. Contact us by submitting a ticket for additional requests.
:::

## Creating a Pipeline

To create a pipeline in Databend Cloud, you must first create a table that will serve as the target for the data to be imported into. The table schema must match the structure of the data to be imported in order for the pipeline to work properly.

**To create a pipeline**:

1. On the **Data** page, navigate to and select your target table, then select the **Pipeline** tab on the right.

![Alt text](@site/static/img/documents/loading-data/pipeline-1.png)

2. Click **Configuration** to open the pipeline setup page, then follow the instructions to create a pipeline.

![Alt text](@site/static/img/documents/loading-data/pipeline-2.png)

3. Click **OK**. The data loading process will begin only if all the connection information is accurate.  After the loading is complete, you will be able to view the import logs like this on the page:

![Alt text](@site/static/img/documents/loading-data/pipeline-3.png)

## Activating or Deactivating a Pipeline

Once created successfully, a pipeline is activated by default. The pipeline will periodically detect the file changes on your object storage and automatically load them into the table in Databend Cloud until you deactivate it. 

To deactivate a pipeline, go to the **Pipeline** tab and toggle the **Active** button. 

![Alt text](@site/static/img/documents/loading-data/pipeline-4.png)