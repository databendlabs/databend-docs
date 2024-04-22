---
title: 'Connecting to Databend Cloud through SQL Clients'
sidebar_label: 'Connecting to Databend Cloud'
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

In this tutorial, we will guide you through the process of connecting to Databend Cloud through the Databend JDBC driver.

<StepsWrap>
<StepContent number="1">

### Before You Start

- Ensure you have added the Databend JDBC driver to your DBeaver. See [Adding Databend JDBC Driver to DBeaver](index.md#adding-databend-jdbc-driver-to-dbeaver) for detailed instructions.
- Ensure that you already have a Databend Cloud account and can log in successfully.

</StepContent>
<StepContent number="2">

### Create Connection

Before creating a connection to Databend Cloud, you need to log in to Databend Cloud to obtain connection information. For more information, see [Connecting to a Warehouse](../../20-cloud/10-using-databend-cloud/00-warehouses.md#connecting).

1. In DBeaver, search for and select `databendcloud` on **Database** > **New Database Connection** first, and then click **Next**.

![Alt text](@site/static/img/documents/develop/jdbc-select-driver.png)

2. Configure your connection settings.

| Setting         | Value                                                                                   |
|-----------------|-----------------------------------------------------------------------------------------|
| Host            | Copy and paste your host address obtained from Databend Cloud, starting with `https://` |
| Password        | Copy and paste your password generated from Databend Cloud                              |
| Database/Schema | For example, `default`                                                                  |

![Alt text](@site/static/img/documents/develop/jdbc-connect.png)

3. Click **Test Connection** to check if the connection is successful.

</StepContent>
</StepsWrap>