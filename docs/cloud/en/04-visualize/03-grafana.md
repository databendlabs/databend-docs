---
title: Grafana
---

[Grafana](https://grafana.com/) is a monitoring dashboard system, which is an open-source monitoring tool developed by Grafana Labs. It can greatly simplify the complexity of monitoring by allowing us to provide the data to be monitored, and it generates various visualizations. Additionally, it has an alarm function that sends notifications when there is an issue with the system.

The following tutorial will guide you on how to integrate Databend Cloud with Grafana and display the data imported from the [Analyzing Anonymous Click Dataset](../01-getting-started/04-tutorials-datasets/01-tutorial1.md) tutorial on a Grafana dashboard.

## Tutorial: Integrate with Grafana

### Preparations

- Before you start, please refer to the official installation guide of Grafana to install Grafana: https://grafana.com/docs/grafana/latest/setup-grafana/installation

- Complete the [Analyzing Anonymous Click Dataset](../01-getting-started/04-tutorials-datasets/01-tutorial1.md) tutorial first and ensure that the dataset has been successfully imported into the `hits_100m_obfuscated_v1` table in the `Default` database.

### Step 1: Install Altinity plugin for ClickHouse

1. Click on the gear icon in the sidebar on the Grafana homepage, and then select **Plugins**.

2. On the **Plugins** tab, search for and install the `Altinity plugin for ClickHouse`.

### Step 2: Create a data source

1. Click on the gear icon in the sidebar on the Grafana homepage, and then select **Data sources**.

2. On the **Data sources** tab, select **Add new data source**.

3. Search for and select the data source type **Altinity plugin for ClickHouse**.

4. Configure the data source. To obtain the connection information of Databend Cloud, see [Connecting to a Warehouse](../02-using-databend-cloud/00-warehouses.md#connecting-to-a-warehouse-connecting).

 Settings       | Description
---------------|---------------------------------------------------------------------------------------------------------------------------
 URL           | The host address of the warehouse in Databend Cloud should be provided in the following format: https://tnf34b0rm--small-book.ch.aliyun-cn-beijing.default.databend.com. Please note that the address must start with "https://".
 Access        | Select **Server (default)**.                                                                                                    
 Auth          | Select **Basic auth**.                                                                                                          
 User/Password | After selecting **Basic auth**, enter the SQL username and password used to connect to the warehouse in the **Basic Auth Details**.                                                                  
 Additonal     | Select **Add CORS flag to requests**.                                                                                            

5. Click **Save & test**. If the page displays "Data source is working", it indicates that the data source has been successfully created.

### Step 3: Create a dashboard

1. On the sidebar of the Grafana homepage, click the **Dashboards** button, then select **New Dashboard** > **New Panel**.

2. Select the data source created in [Step 2](#step-2-create-a-data-source), and then select the `default` database and `hits_100m_obfuscated_v1` table in order after **FROM**.

![Alt text](@site/static/img/documents_cn/BI/create-dashboard.png)

3. Click **Go to Query**, and then copy and paste the following SQL statement:

```sql
SELECT
    eventtime as t,
    count()
FROM $table
GROUP BY t
ORDER BY t
```

4. Wait for a moment and the view should appear at the top of the page. Then click **Save** in the upper right corner.

![Alt text](@site/static/img/documents_cn/BI/table-view.png)
