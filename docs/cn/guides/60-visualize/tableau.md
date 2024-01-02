---
title: Tableau
---

[Tableau](https://www.tableau.com/) 是一个可视化分析平台，它改变了我们使用数据解决问题的方式——赋予人们和组织充分利用他们的数据的能力。通过使用 [databend-jdbc 驱动](https://github.com/databendcloud/databend-jdbc)（版本 0.0.8 或更高），Databend 和 Databend Cloud 都可以与 Tableau 集成，实现无缝的数据访问和高效的分析。需要注意的是，为了最佳兼容性，建议使用 2022.3 或更高版本的 Tableau，以避免潜在的兼容性问题。

Databend 目前提供了两种与 Tableau 集成的方法。第一种方法是通过 Tableau 中的其他数据库（JDBC）接口，适用于 Databend 和 Databend Cloud。第二种方法推荐使用由 Databend 开发的专门针对 Databend 的 [databend-tableau-connector-jdbc](https://github.com/databendcloud/databend-tableau-connector-jdbc) 连接器，以实现最佳的连接性。

`databend-tableau-connector-jdbc` 连接器通过其 JDBC 驱动程序提供更快的性能，特别是在创建提取时，并且作为跨平台 jar 文件更容易安装，无需针对特定平台的编译。它允许您为标准 Tableau 功能（包括多个 JOIN 和使用集合）微调 SQL 查询，并提供用户友好的连接对话框，以实现无缝集成体验。

## 教程-1：通过其他数据库（JDBC）接口与 Databend 集成 {#examples}

在本教程中，您将部署并将本地 Databend 与 [Tableau Desktop](https://www.tableau.com/products/desktop) 集成。在开始之前，请[下载](https://www.tableau.com/products/desktop/download) Tableau Desktop 并按照屏幕上的指示完成安装。

### 步骤 1. 部署 Databend

1. 遵循[本地和 Docker 部署](../10-deploy/03-deploying-local.md)指南来部署本地 Databend。
2. 在 Databend 中创建一个 SQL 用户。您将使用此帐户在 Tableau Desktop 中连接到 Databend。

```sql
CREATE USER tableau IDENTIFIED BY 'tableau';
GRANT ALL ON *.* TO tableau;
```

### 步骤 2. 安装 databend-jdbc

1. 从 Maven 中央仓库 https://repo1.maven.org/maven2/com/databend/databend-jdbc/ 下载 databend-jdbc 驱动程序（版本 0.0.8 或更高）。

2. 要安装 databend-jdbc 驱动程序，请将 jar 文件（例如，databend-jdbc-0.0.8.jar）移动到 Tableau 的驱动程序文件夹。Tableau 的驱动程序文件夹根据操作系统的不同而不同：

| 操作系统         | Tableau 的驱动程序文件夹          |
|------------------|----------------------------------|
| MacOS            | ~/Library/Tableau/Drivers        |
| Windows          | C:\Program Files\Tableau\Drivers |

### 步骤 3. 连接到 Databend

1. 启动 Tableau Desktop 并在侧边栏中选择 **其他数据库（JDBC）**。这将打开如下窗口：

![Alt text](@site/docs/public/img/integration/tableau-1.png)

2. 在打开的窗口中，提供连接信息并点击 **登录**。

| 参数        | 描述                                                           | 本教程中的示例                                         |
|-------------|--------------------------------------------------------------|-------------------------------------------------------|
| URL         | 格式：jdbc:databend://{user}:{password}@{host}:{port}/{database} | jdbc:databend://tableau:tableau@127.0.0.1:8000/default |
| Dialect     | 选择 SQL 方言 "MySQL"。                                       | MySQL                                                  |
| Username    | 用于连接到 Databend 的 SQL 用户                               | tableau                                                |
| Password    | 用于连接到 Databend 的 SQL 用户密码                               | tableau                                                |

3. 当 Tableau 工作簿打开时，选择您想要查询的数据库、模式和表。对于本教程，**数据库** 和 **模式** 都选择 *default*。

![Alt text](@site/docs/public/img/integration/tableau-2.png)

您已经准备好了！现在您可以将表拖到工作区开始查询和进一步分析。

## 教程-2：通过 databend-tableau-connector-jdbc 连接器与 Databend 集成 {#examples}

在本教程中，您将部署并将本地 Databend 与 [Tableau Desktop](https://www.tableau.com/products/desktop) 集成。在开始之前，请[下载](https://www.tableau.com/products/desktop/download) Tableau Desktop 并按照屏幕上的指示完成安装。

### 步骤 1. 部署 Databend

1. 遵循[本地和 Docker 部署](../10-deploy/03-deploying-local.md)指南来部署本地 Databend。
2. 在 Databend 中创建一个 SQL 用户。您将使用此帐户在 Tableau Desktop 中连接到 Databend。

```sql
CREATE USER tableau IDENTIFIED BY 'tableau';
GRANT ALL ON *.* TO tableau;
```

### 步骤 2. 安装 databend-jdbc

1. 从 Maven 中央仓库 https://repo1.maven.org/maven2/com/databend/databend-jdbc/ 下载 databend-jdbc 驱动程序（版本 0.0.8 或更高）。

2. 要安装 databend-jdbc 驱动程序，请将 jar 文件（例如，databend-jdbc-0.0.8.jar）移动到 Tableau 的驱动程序文件夹。Tableau 的驱动程序文件夹根据操作系统的不同而不同：

| 操作系统         | Tableau 的驱动程序文件夹          |
|------------------|----------------------------------|
| MacOS            | ~/Library/Tableau/Drivers        |
| Windows          | C:\Program Files\Tableau\Drivers |

### 步骤 3. 安装 databend-tableau-connector-jdbc 连接器

1. 从连接器的 [发布](https://github.com/databendcloud/databend-tableau-connector-jdbc/releases) 页面下载最新的 **databend_jdbc.taco** 文件，并将其保存到 Tableau 的连接器文件夹：

| 操作系统          | Tableau的连接器文件夹                                                |
|------------------ |-------------------------------------------------------------------- |
| MacOS             | ~/Documents/My Tableau Repository/Connectors                        |
| Windows           | C:\Users\[Windows User]\Documents\My Tableau Repository\Connectors  |

2. 启动Tableau Desktop并禁用签名验证。如果您使用的是macOS，请打开终端并输入以下命令：

```shell
/Applications/Tableau\ Desktop\ 2023.2.app/Contents/MacOS/Tableau -DDisableVerifyConnectorPluginSignature=true
 ```

### 步骤 4. 连接到Databend

1. 在Tableau Desktop中，选择 **To a Server** > **More...** 下的 **Databend JDBC by Databend, Inc.**。

![Alt text](@site/docs/public/img/integration/tableau-connector-1.png)

2. 在打开的窗口中，提供连接信息并点击 **Sign In**。

![Alt text](@site/docs/public/img/integration/tableau-connector-2.png)

3. 选择一个数据库，然后您可以将表拖动到工作区开始查询和进一步分析。

![Alt text](@site/docs/public/img/integration/tableau-connector-3.png)

## 教程 3: 与Databend Cloud集成

在本教程中，您将把Databend Cloud与 [Tableau Desktop](https://www.tableau.com/products/desktop) 集成。开始之前，请[下载](https://www.tableau.com/products/desktop/download) Tableau Desktop并按照屏幕上的指示完成安装。

### 步骤 1. 获取连接信息

从Databend Cloud获取连接信息。关于如何做到这一点，请参考 [连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 2. 安装 databend-jdbc

1. 从Maven Central Repository下载databend-jdbc驱动程序（版本0.0.8或更高）：https://repo1.maven.org/maven2/com/databend/databend-jdbc/

2. 要安装databend-jdbc驱动程序，请将jar文件（例如，databend-jdbc-0.0.8.jar）移动到Tableau的驱动程序文件夹。Tableau的驱动程序文件夹根据操作系统的不同而不同：

| 操作系统          | Tableau的驱动程序文件夹                  |
|------------------ |------------------------------------------ |
| MacOS             | ~/Library/Tableau/Drivers                 |
| Windows           | C:\Program Files\Tableau\Drivers          |
| Linux             | /opt/tableau/tableau_driver/jdbc          |

### 步骤 3. 连接到Databend Cloud

1. 启动Tableau Desktop并在侧边栏中选择 **Other Database (JDBC)**。这将打开如下窗口：

![Alt text](@site/static/img/documents/BI/tableau-1.png)

2. 在窗口中，提供您在[步骤 1](#step-1-obtain-connection-information)中获取的连接信息并点击 **Sign In**。

| 参数        | 描述                                                           | 本教程使用                                          |
|----------- |-------------------------------------------------------------- |---------------------------------------------------- |
| URL        | 格式：jdbc:databend://{user}:{password}@{host}:{port}/{database} | `jdbc:databend://cloudapp:<your-password>@https://<your-host>:443/default` |
| Dialect    | 选择"MySQL"作为SQL方言。                                       | MySQL                                               |
| Username   | 用于连接到Databend Cloud的SQL用户                                  | cloudapp                                            |
| Password   | 用于连接到Databend Cloud的SQL用户密码                               | 您的密码                                            |

3. 当Tableau工作簿打开时，选择您想要查询的数据库、模式和表。对于本教程，**Database** 和 **Schema** 都选择 *default*。

![Alt text](@site/static/img/documents/BI/tableau-2.png)

您已经准备好了！现在您可以将表拖动到工作区开始查询和进一步分析。