---
title: 使用 SQL 客户端连接 Databend
sidebar_label: SQL 客户端
---

Databend 提供了一个[JDBC 驱动](https://github.com/databendcloud/databend-jdbc)，使得从客户端应用程序（如[DBeaver](https://dbeaver.com/)）连接到 Databend 成为可能。DBeaver 预配置了多种 SQL、NoSQL、键值数据库、图形数据库、搜索引擎等的驱动。然而，Databend 的 JDBC 驱动目前在 DBeaver 中并未预配置，这意味着在应用程序中创建连接时，您无法找到并选择 Databend。不过，您可以手动将驱动添加到 DBeaver 中，这样就可以像使用预配置数据库一样建立与 Databend 的连接。

## 在 DBeaver 中添加 Databend JDBC 驱动

按照以下步骤将 Databend JDBC 驱动添加到 DBeaver 中：

1. 在 DBeaver 中，选择**数据库** > **驱动管理器**以打开驱动管理器，然后点击**新建**创建一个新的驱动。

2. 在**设置**标签页中，按照以下信息填写新驱动所需的设置：

| 设置     | Databend                                                     | Databend Cloud                                               |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 驱动名称 | databend                                                     | databendcloud                                                |
| 驱动类型 | Generic                                                      | Generic                                                      |
| 类名     | com.databend.jdbc.DatabendDriver                             | com.databend.jdbc.DatabendDriver                             |
| URL 模板 | `jdbc:databend://{user}:{password}@{host}:{port}/{database}` | `jdbc:databend://{user}:{password}@{host}:{port}/{database}` |
| 默认端口 | 8000                                                         | 443                                                          |
| 默认用户 | root                                                         | cloudapp                                                     |

![Alt text](@site/docs/public/img/integration/jdbc-new-driver.png)
![Alt text](@site/static/img/documents/develop/jdbc-new-driver.png)

3. 在**库**标签页中，点击**添加构件**，然后在**依赖声明**文本框中复制并粘贴以下内容：

:::tip 检查并更新到新版本
Databend 建议更新到最新版本的 Databend JDBC 驱动，以访问最新功能和改进，并解决您可能遇到的任何问题。请在[https://github.com/databendcloud/databend-jdbc/releases](https://github.com/databendcloud/databend-jdbc/releases)检查可用更新并安装最新版本。
:::

```java
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.1.6</version>
</dependency>
```

4. 点击**确定**关闭窗口。

## 教程

- [使用 DBeaver 连接到 Databend](/tutorials/connect/connect-to-databend-dbeaver)
- [使用 DBeaver 连接到 Databend Cloud](/tutorials/connect/connect-to-databendcloud-dbeaver)
