---
title: 使用SQL客户端连接到Databend
sidebar_label: SQL客户端
---

Databend提供了一个[JDBC驱动](https://github.com/databendcloud/databend-jdbc)，使得可以从客户端应用程序（如[DBeaver](https://dbeaver.com/)）连接到Databend。DBeaver自带了许多预配置的驱动程序，适用于SQL、NoSQL、键值数据库、图数据库、搜索引擎等。然而，Databend的JDBC驱动目前并未在DBeaver中预配置，这意味着在应用程序中创建连接时，您无法找到并选择Databend。不过，您可以手动将驱动程序添加到DBeaver中，从而以与预配置数据库相同的方式建立与Databend的连接。

## 将Databend JDBC驱动添加到DBeaver

按照以下步骤将Databend JDBC驱动添加到DBeaver：

1. 在DBeaver中，选择**数据库** > **驱动管理器**以打开驱动管理器，然后点击**新建**以创建一个新的驱动程序。

2. 在**设置**选项卡中，为新驱动程序输入所需信息，如下所示：

| 设置         | Databend                                                     | Databend Cloud                                               |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 驱动名称     | databend                                                     | databendcloud                                                |
| 驱动类型     | 通用                                                         | 通用                                                         |
| 类名         | com.databend.jdbc.DatabendDriver                             | com.databend.jdbc.DatabendDriver                             |
| URL模板      | `jdbc:databend://{user}:{password}@{host}:{port}/{database}` | `jdbc:databend://{user}:{password}@{host}:{port}/{database}` |
| 默认端口     | 8000                                                         | 443                                                          |
| 默认用户     | root                                                         | cloudapp                                                     |

![Alt text](/img/integration/jdbc-new-driver.png)
![Alt text](@site/static/img/documents/develop/jdbc-new-driver.png)

3. 在**库**选项卡中，点击**添加工件**，然后将以下内容复制并粘贴到**依赖声明**文本框中：

:::tip 检查并更新到新版本
Databend建议更新到最新版本的Databend JDBC驱动，以访问最新的功能和增强功能，并解决您可能遇到的任何问题。请在​https://github.com/databendcloud/databend-jdbc/releases检查可用更新并安装最新版本。
:::

```java
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.3.4</version>
</dependency>
```

4. 点击**确定**以关闭窗口。

## 用户认证

如果您连接的是自托管的Databend实例，您可以使用[databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml)配置文件中指定的管理员用户，或者使用通过[CREATE USER](/sql/sql-commands/ddl/user/user-create-user)命令创建的SQL用户进行连接。

对于连接到Databend Cloud，您可以使用默认的`cloudapp`用户或通过[CREATE USER](/sql/sql-commands/ddl/user/user-create-user)命令创建的SQL用户。请注意，您用于登录[Databend Cloud控制台](https://app.databend.com/)的用户账户不能用于连接到Databend Cloud。

## 教程

- [使用DBeaver连接到Databend](/tutorials/connect/connect-to-databend-dbeaver)
- [使用DBeaver连接到Databend Cloud](/tutorials/connect/connect-to-databendcloud-dbeaver)