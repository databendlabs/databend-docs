---
title: 使用 SQL 客户端连接到 Databend
sidebar_label: SQL 客户端
---

Databend 提供了一个 [JDBC 驱动](https://github.com/databendcloud/databend-jdbc)，使得客户端应用程序（如 [DBeaver](https://dbeaver.com/)）能够连接到 Databend。DBeaver 内置了许多预配置的驱动程序，支持 SQL、NoSQL、键值数据库、图数据库、搜索引擎等多种数据库。然而，Databend 的 JDBC 驱动目前并未预配置在 DBeaver 中，这意味着在应用程序中创建连接时无法找到并选择 Databend。尽管如此，您可以手动将该驱动添加到 DBeaver，从而以与预配置数据库相同的方式建立与 Databend 的连接。

## 将 Databend JDBC 驱动添加到 DBeaver

按照以下步骤将 Databend JDBC 驱动添加到 DBeaver：

1. 在 DBeaver 中，选择 **Database** > **Driver Manager** 以打开驱动管理器，然后点击 **New** 创建新驱动。

2. 在 **Settings** 标签页中，输入新驱动所需的信息，如下所示：

| 设置         | Databend                                                     | Databend Cloud                                               |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 驱动名称     | databend                                                     | databendcloud                                                |
| 驱动类型     | Generic                                                      | Generic                                                      |
| 类名         | com.databend.jdbc.DatabendDriver                             | com.databend.jdbc.DatabendDriver                             |
| URL 模板     | `jdbc:databend://{user}:{password}@{host}:{port}/{database}` | `jdbc:databend://{user}:{password}@{host}:{port}/{database}` |
| 默认端口     | 8000                                                         | 443                                                          |
| 默认用户     | root                                                         | cloudapp                                                     |

![Alt text](/img/integration/jdbc-new-driver.png)
![Alt text](@site/static/img/documents/develop/jdbc-new-driver.png)

3. 在 **Libraries** 标签页中，点击 **Add Artifact**，然后将以下内容复制并粘贴到 **Dependency Declaration** 文本框中：

:::tip 检查并更新到新版本
Databend 建议更新到最新版本的 Databend JDBC 驱动，以获取最新功能和增强，并解决可能遇到的问题。请在 [https://github.com/databendcloud/databend-jdbc/releases](https://github.com/databendcloud/databend-jdbc/releases) 检查可用更新并安装最新版本。
:::

```java
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.1.6</version>
</dependency>
```

4. 点击 **OK** 关闭窗口。

## 教程

- [使用 DBeaver 连接到 Databend](/tutorials/connect/connect-to-databend-dbeaver)
- [使用 DBeaver 连接到 Databend Cloud](/tutorials/connect/connect-to-databendcloud-dbeaver)