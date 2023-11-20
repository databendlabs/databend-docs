---
title: Connecting with JDBC
---

Databend Cloud provides a JDBC driver that enables connection to Databend Cloud from a client application, such as [DBeaver](https://dbeaver.com/). DBeaver comes with numerous pre-configured drivers for SQL, NoSQL, key-value databases, graph databases, search engines, and more. However, the Databend JDBC driver is not currently pre-configured in DBeaver, which means that you cannot locate and select Databend Cloud while creating a connection in the application. Nevertheless, you can manually add the driver to DBeaver, allowing you to establish a connection to Databend Cloud in the same way you would with a pre-configured database.

The following shows how to add the Datebend JDBC driver to a client application and connect to Databend Cloud via the driver, using DBeaver as an example. For more information about the driver, refer to https://github.com/databendcloud/databend-jdbc

## Example: Connect from DBeaver with JDBC

To connect to Databend Cloud from DBeaver with the Databend JDBC driver, you need to add the driver to DBeaver's Driver Manager first, and then select the driver when you create a connection.

### Step 1. Add Databend JDBC Driver to DBeaver

1. In DBeaver, select **Database** > **Driver Manager** to open the Driver Manager, then click **New** to create a new driver.

2. On the **Settings** tab, enter the required information for the new driver as follows:

    - **Driver**: databendcloud
    - **Driver Type**: Generic
    - **Class Name**: com.databend.jdbc.DatabendDriver
    - **URL Template**: jdbc:databend://{user}:{password}@{host}:{port}/{database}
    - **Default Port**: 443
    - **Default User**: cloudapp

![Alt text](@site/static/img/documents/develop/jdbc-new-driver.png)

3. On the **Libraries** tab, click **Add Artifact**, then copy and paste the following to the **Dependency Declaration** textbox:

:::tip CHECK FOR AND UPDATE TO NEW VERSION
Databend recommends updating to the latest version of the Databend JDBC driver to access the latest features and enhancements, and to resolve any issues you may encounter. Please check for available updates at ​https://github.com/databendcloud/databend-jdbc/releases and install the latest version.
:::

```java
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.0.7</version>
</dependency>
```

4. Click **OK** to close the windows.

### Step 2. Create a Connection with Databend JDBC Driver

Before creating a connection to Databend Cloud, you need to log in to Databend Cloud to obtain connection information. For more information, see [Connecting to a Warehouse](../../02-using-databend-cloud/00-warehouses.md#connecting-to-a-warehouse-connecting).

1. In DBeaver, search for and select `databendcloud` on **Database** > **New Database Connection** first, and then click **Next**.

![Alt text](@site/static/img/documents/develop/jdbc-select-driver.png)

2. Set your connection settings.
  - **Host**: Copy and paste your host address obtained from Databend Cloud, starting with `https://`.
  - **Password**: Copy and paste your password generated from Databend Cloud.
  - **Database/Schema**: default

![Alt text](@site/static/img/documents/develop/jdbc-connect.png)

3. Click **Test Connection** to check if the connection is successful.