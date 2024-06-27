---
title: Connecting to Databend with SQL Clients
sidebar_label: SQL Clients
---

Databend provides a [JDBC driver](https://github.com/databendcloud/databend-jdbc) that enables connection to Databend from a client application, such as [DBeaver](https://dbeaver.com/). DBeaver comes with numerous pre-configured drivers for SQL, NoSQL, key-value databases, graph databases, search engines, and more. However, the Databend JDBC driver is not currently pre-configured in DBeaver, which means that you cannot locate and select Databend while creating a connection in the application. Nevertheless, you can manually add the driver to DBeaver, allowing you to establish a connection to Databend in the same way you would with a pre-configured database.

## Adding Databend JDBC Driver to DBeaver

Follow these steps to add the Databend JDBC driver to DBeaver:

1. In DBeaver, select **Database** > **Driver Manager** to open the Driver Manager, then click **New** to create a new driver.

2. On the **Settings** tab, enter the required information for the new driver as follows:

| Setting      | Databend                                                   | Databend Cloud                                             |
|--------------|------------------------------------------------------------|------------------------------------------------------------|
| Driver Name  | databend                                                   | databendcloud                                              |
| Driver Type  | Generic                                                    | Generic                                                    |
| Class Name   | com.databend.jdbc.DatabendDriver                           | com.databend.jdbc.DatabendDriver                           |
| URL Template | jdbc:databend://{user}:{password}@{host}:{port}/{database} | jdbc:databend://{user}:{password}@{host}:{port}/{database} |
| Default Port | 8000                                                       | 443                                                        |
| Default User | root                                                       | cloudapp                                                   |

![Alt text](@site/docs/public/img/integration/jdbc-new-driver.png)
![Alt text](@site/static/img/documents/develop/jdbc-new-driver.png)

3. On the **Libraries** tab, click **Add Artifact**, then copy and paste the following to the **Dependency Declaration** textbox:

:::tip Check for and Update to New Version 
Databend recommends updating to the latest version of the Databend JDBC driver to access the latest features and enhancements, and to resolve any issues you may encounter. Please check for available updates at ​https://github.com/databendcloud/databend-jdbc/releases and install the latest version.
:::

```java
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.1.6</version>
</dependency>
```

4. Click **OK** to close the windows.

## Tutorials

- [Connecting to Databend using DBeaver](/tutorials/connect/connect-to-databend-dbeaver)
- [Connecting to Databend Cloud using DBeaver](/tutorials/connect/connect-to-databendcloud-dbeaver)