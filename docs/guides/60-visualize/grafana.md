---
title: Grafana
---

[Grafana](https://grafana.com/) is a monitoring dashboard system, which is an open-source monitoring tool developed by Grafana Labs. It can greatly simplify the complexity of monitoring by allowing us to provide the data to be monitored, and it generates various visualizations. Additionally, it has an alarm function that sends notifications when there is an issue with the system. Databend and Databend Cloud can integrate with Grafana through the [Altinity plugin for ClickHouse](https://grafana.com/grafana/plugins/vertamedia-clickhouse-datasource/).

## Tutorial: Integrating with Grafana

This tutorial guides you through the process of integrating Databend / Databend Cloud with Grafana using the Altinity plugin for ClickHouse. 

### Step 1. Set up Environment

Before you start, please refer to the official installation guide to install Grafana: https://grafana.com/docs/grafana/latest/setup-grafana/installation.

For this tutorial, you can integrate either with Databend or Databend Cloud:

- If you choose to integrate with a local Databend instance, follow the [Deployment Guide](/guides/deploy) to deploy it if you don't have one already.
- If you prefer to integrate with Databend Cloud, make sure you can log in to your account and obtain the connection information for a warehouse. For more details, see [Connecting to a Warehouse](/guides/cloud/using-databend-cloud/warehouses#connecting).

### Step 2. Install Altinity plugin for ClickHouse

1. Click on the gear icon in the sidebar on the Grafana homepage, and then select **Plugins**.

2. On the **Plugins** tab, search for and install the `Altinity plugin for ClickHouse`.

### Step 3. Create Data Source

1. Click on the gear icon in the sidebar on the Grafana homepage, and then select **Data sources**.

2. On the **Data sources** tab, select **Add new data source**.

3. Search for and select the data source type **Altinity plugin for ClickHouse**.

4. Configure the data source.

| Parameter | Databend                                 | Databend Cloud                     |
|-----------|------------------------------------------|------------------------------------|
| URL       | `http://localhost:8124`                  | Obtain from connection information |
| Access    | `Server (default)`                       | `Server (default)`                 |
| Auth      | `Basic auth`                             | `Basic auth`                       |
| User      | For example, `root`                      | Obtain from connection information |
| Password  | Enter your password                      | Obtain from connection information |
| Additonal | Select `Use POST method to send queries` | Select `Add CORS flag to requests` |                                                                

5. Click **Save & test**. If the page displays "Data source is working", it indicates that the data source has been successfully created.


