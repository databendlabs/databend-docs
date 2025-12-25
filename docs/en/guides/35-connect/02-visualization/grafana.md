---
title: Grafana
sidebar_position: 1
---

[Grafana](https://grafana.com/) is a monitoring dashboard system, which is an open-source monitoring tool developed by Grafana Labs. It can greatly simplify the complexity of monitoring by allowing us to provide the data to be monitored, and it generates various visualizations. Additionally, it has an alarm function that sends notifications when there is an issue with the system. Databend and Databend Cloud can integrate with Grafana through the [Grafana Databend Data Source Plugin](https://github.com/databendlabs/grafana-databend-datasource).

## Tutorial: Integrating with Grafana

This tutorial guides you through the process of integrating Databend / Databend Cloud with Grafana using the Grafana Databend Data Source Plugin.

### Step 1. Set up Environment

Before you start, please refer to the official installation guide to install Grafana: [https://grafana.com/docs/grafana/latest/setup-grafana/installation](https://grafana.com/docs/grafana/latest/setup-grafana/installation).

For this tutorial, you can integrate either with Databend or Databend Cloud:

- If you choose to integrate with a local Databend instance, follow the [Deployment Guide](/guides/deploy) to deploy it if you don't have one already.
- If you prefer to integrate with Databend Cloud, make sure you can log in to your account and obtain the connection information for a warehouse. For more details, see [Connecting to a Warehouse](/guides/cloud/using-databend-cloud/warehouses#connecting).

### Step 2. Modify Grafana Configuration

Add the following lines to your `grafana.ini` file:

```ini
[plugins]
allow_loading_unsigned_plugins = databend-datasource
```

### Step 3. Install the Grafana Databend Data Source Plugin

1. Find the latest release on [GitHub Release](https://github.com/databendlabs/grafana-databend-datasource/releases).

2. Get the download URL for the plugin zip package, for example, `https://github.com/databendlabs/grafana-databend-datasource/releases/download/v1.0.2/databend-datasource-1.0.2.zip`.

3. Get the Grafana plugins folder and unzip the downloaded zip package into it.

```shell
curl -fLo /tmp/grafana-databend-datasource.zip https://github.com/databendlabs/grafana-databend-datasource/releases/download/v1.0.2/databend-datasource-1.0.2.zip
unzip /tmp/grafana-databend-datasource.zip -d /var/lib/grafana/plugins
rm /tmp/grafana-databend-datasource.zip
```

4. Restart Grafana to load the plugin.

5. Navigate to the **Plugins** page in the Grafana UI, for example, `http://localhost:3000/plugins`, and ensure the plugin is installed.

![Plugins](/img/integration/grafana-plugins.png)
![Plugin detail](/img/integration/grafana-plugin-detail.png)

### Step 3. Create Data Source

1. Goto the `Add new connection` page, for example, `http://localhost:3000/connections/add-new-connection?search=databend`, search for `databend`, and select it.

2. Click **Add new data source** on the top right corner of the page.

3. Input the `DSN` field for your Databend instance. For example, `databend://root:@localhost:8000?sslmode=disable`, or `databend://cloudapp:******@tnxxxxxxx.gw.aws-us-east-2.default.databend.com:443/default?warehouse=xsmall-fsta`.

4. Alternatively, input the `SQL User Password` field to override the default password in the `DSN` field.

5. Click **Save & test**. If the page displays "Data source is working", it indicates that the data source has been successfully created.
