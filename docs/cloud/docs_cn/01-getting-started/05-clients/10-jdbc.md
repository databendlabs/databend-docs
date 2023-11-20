---
title: 使用 JDBC 驱动连接
---

Databend Cloud 提供了一个 JDBC 驱动程序，可以从数据库客户端连接到 Databend Cloud，例如 [DBeaver](https://dbeaver.com/)。DBeaver 带有大量用于 SQL、NoSQL、键值数据库、图形数据库、搜索引擎等的预配置驱动程序。但是，Databend JDBC 驱动程序目前并未在 DBeaver 中预先配置，这意味着您无法在应用程序中创建连接时定位和选择 Databend Cloud。不过，您可以手动将驱动程序添加到 DBeaver，从而允许您以与预配置数据库相同的方式建立与 Databend Cloud 的连接。

下面以 DBeaver 为例，将 Datebend JDBC 驱动添加到数据库客户端，通过驱动连接 Databend Cloud。有关驱动程序的更多信息，请参阅 https://github.com/databendcloud/databend-jdbc

## 示例：使用 JDBC 驱动 从 DBeaver 连接 Databend Cloud

要使用 Databend JDBC 驱动程序从 DBeaver 连接到 Databend Cloud，您需要先将驱动程序添加到 DBeaver 的驱动程序管理器中，然后在创建连接时选择驱动程序。

### 第一步：将 Databend JDBC 驱动程序添加到 DBeaver

1. 在 DBeaver 中，选择 **Database** > **Driver Manager** 打开 Driver Manager，然后点击 **New** 创建一个新的驱动程序。

2. 在 **Settings** 选项卡上，输入新驱动程序所需的信息，如下所示：

    - **Driver**: databendcloud
    - **Driver Type**: Generic
    - **Class Name**: com.databend.jdbc.DatabendDriver
    - **URL Template**: jdbc:databend://{user}:{password}@{host}:{port}/{database}
    - **Default Port**: 443
    - **Default User**: cloudapp

![Alt text](@site/static/img/documents/develop/jdbc-new-driver.png)

3. 在 **Libraries** 选项卡上，单击 **Add Artifact**，然后将以下内容复制并粘贴到 **Dependency Declaration** 文本框：

:::tip 检查并更新到新版本
Databend 建议更新到最新版本的 Databend JDBC 驱动程序以获取最新的功能，并解决您可能遇到的任何问题。请在 https://github.com/databendcloud/databend-jdbc/releases 检查可用更新并安装最新版本。
:::

```java
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.0.7</version>
</dependency>
```

4. 单击**OK**关闭窗口。

### 第二步：创建与 Databend JDBC 驱动程序的连接

在创建与 Databend Cloud 的连接之前，您需要登录 Databend Cloud 获取连接信息。有关详细信息，请参阅[连接到计算集群](../../02-using-databend-cloud/00-warehouses.md#连接到计算集群-connecting)。

1. 在 DBeaver 中，先在**Database** > **New Database Connection**中搜索并选择`databendcloud`，然后点击**Next**。

![Alt text](@site/static/img/documents/develop/jdbc-select-driver.png)

2. 配置连接信息。
  - **Host**：复制并粘贴从 Databend Cloud 获得的主机地址，以“https://”开头。
  - **Password**：复制并粘贴从 Databend Cloud 生成的密码。
  - **Database/Schema**：default

![Alt text](@site/static/img/documents/develop/jdbc-connect.png)

3. 点击**Test Connection**，检查连接是否成功。