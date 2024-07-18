---
title: 使用SQL客户端连接到Databend
sidebar_label: SQL客户端
---

Databend提供了一个[JDBC驱动](https://github.com/databendcloud/databend-jdbc)，使得客户端应用程序（如[DBeaver](https://dbeaver.com/)）能够连接到Databend。DBeaver内置了许多预配置的驱动程序，支持SQL、NoSQL、键值数据库、图数据库、搜索引擎等多种数据库。然而，Databend的JDBC驱动目前并未预配置在DBeaver中，这意味着在应用程序中创建连接时无法找到并选择Databend。不过，你可以手动将该驱动添加到DBeaver中，从而以与预配置数据库相同的方式建立与Databend的连接。

## 将Databend JDBC驱动添加到DBeaver

按照以下步骤将Databend JDBC驱动添加到DBeaver：

1. 在DBeaver中，选择**数据库** > **驱动管理器**以打开驱动管理器，然后点击**新建**来创建一个新的驱动。

2. 在**设置**标签页中，输入新驱动所需的信息，如下所示：

| 设置         | Databend                                                     | Databend Cloud                                               |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 驱动名称     | databend                                                     | databendcloud                                                |
| 驱动类型     | 通用                                                         | 通用                                                         |
| 类名         | com.databend.jdbc.DatabendDriver                             | com.databend.jdbc.DatabendDriver                             |
| URL模板      | `jdbc:databend://{user}:{password}@{host}:{port}/{database}` | `jdbc:databend://{user}:{password}@{host}:{port}/{database}` |
| 默认端口     | 8000                                                         | 443                                                          |
| 默认用户     | root                                                         | cloudapp                                                     |

![Alt text](@site/docs/public/img/integration/jdbc-new-driver.png)
![Alt text](@site/static/img/documents/develop/jdbc-new-driver.png)

3. 在**库**标签页中，点击**添加构件**，然后将以下内容复制并粘贴到**依赖声明**文本框中：

:::tip 检查并更新到新版本
Databend建议更新到最新版本的Databend JDBC驱动，以获取最新的功能和改进，并解决可能遇到的问题。请在[这里](https://github.com/databendcloud/databend-jdbc/releases)检查是否有可用更新并安装最新版本。
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

- [使用DBeaver连接到Databend](/tutorials/connect/connect-to-databend-dbeaver)
- [使用DBeaver连接到Databend Cloud](/tutorials/connect/connect-to-databendcloud-dbeaver)