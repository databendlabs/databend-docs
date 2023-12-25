---
title: 使用 JDBC 连接到 Databend
sidebar_label: 使用 JDBC 连接
description:
  使用 JDBC 连接到 Databend
---

Databend 提供了一个 [JDBC 驱动程序](https://github.com/databendcloud/databend-jdbc)，可以从客户端应用程序（如 [DBeaver](https://dbeaver.com/)）连接到 Databend。DBeaver 预配置了许多用于 SQL、NoSQL、键值数据库、图数据库、搜索引擎等的驱动程序。然而，Databend JDBC 驱动程序目前尚未在 DBeaver 中预配置，这意味着在应用程序中创建连接时，您无法找到并选择 Databend。尽管如此，您可以手动将驱动程序添加到 DBeaver 中，使您能够像使用预配置数据库一样建立到 Databend 的连接。

## 将 Databend JDBC 驱动程序添加到 DBeaver

按照以下步骤将 Databend JDBC 驱动程序添加到 DBeaver：

1. 在 DBeaver 中，选择 **数据库** > **驱动程序管理器** 打开驱动程序管理器，然后点击 **新建** 创建一个新的驱动程序。

2. 在 **设置** 标签页中，输入新驱动程序所需的信息，如下所示：

| 设置          | Databend                                                   | Databend Cloud                                             |
|--------------|------------------------------------------------------------|------------------------------------------------------------|
| 驱动程序名称  | databend                                                   | databendcloud                                              |
| 驱动程序类型  | 通用                                                       | 通用                                                       |
| 类名          | com.databend.jdbc.DatabendDriver                           | com.databend.jdbc.DatabendDriver                           |
| URL 模板     | jdbc:databend://{user}:{password}@{host}:{port}/{database} | jdbc:databend://{user}:{password}@{host}:{port}/{database} |
| 默认端口      | 8000                                                       | 443                                                        |
| 默认用户      | root                                                       | cloudapp                                                   |

![Alt text](@site/docs/public/img/integration/jdbc-new-driver.png)
![Alt text](@site/static/img/documents/develop/jdbc-new-driver.png)

3. 在 **库** 标签页中，点击 **添加构件**，然后将以下内容复制并粘贴到 **依赖声明** 文本框中：

:::tip 检查并更新到新版本 
Databend 建议更新到最新版本的 Databend JDBC 驱动程序，以访问最新功能和增强功能，并解决您可能遇到的任何问题。请在 ​https://github.com/databendcloud/databend-jdbc/releases 检查可用的更新，并安装最新版本。
:::

```java
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.0.8</version>
</dependency>
```

4. 点击 **确定** 关闭窗口。

## 连接到 Databend

- [教程-1：通过 JDBC 连接到 Databend](00-connect-to-databend.md)
- [教程-2：通过 JDBC 连接到 Databend Cloud](01-connect-to-databend-cloud.md)

**相关视频：**

<iframe width="853" height="505" className="iframe-video" src="https://www.youtube.com/embed/3cFmGvtU-ws" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>