---
title: Tableau
---

[Tableau](https://www.tableau.com/) 是一个可视化分析平台，它正在改变我们使用数据解决问题的方式，从而使人们和组织能够充分利用他们的数据。通过利用 [databend-jdbc driver](https://github.com/databendcloud/databend-jdbc)（0.3.4 或更高版本），Databend 和 Databend Cloud 都可以与 Tableau 集成，从而实现无缝数据访问和高效分析。请务必注意，为了获得最佳兼容性，建议使用 Tableau 2022.3 或更高版本，以避免潜在的兼容性问题。

目前，Databend 提供了两种与 Tableau 集成的方法。第一种方法利用 Tableau 中的 Other Databases (JDBC) 接口，适用于 Databend 和 Databend Cloud。第二种方法建议使用 [databend-tableau-connector-jdbc](https://github.com/databendcloud/databend-tableau-connector-jdbc) 连接器，该连接器是 Databend 专门开发的，用于与 Databend 进行最佳连接。

`databend-tableau-connector-jdbc` 连接器通过其 JDBC 驱动程序提供更快的性能，尤其是在创建 Extracts 时，并且更容易安装为跨平台 jar 文件，从而消除了特定于平台的编译。它允许您微调 SQL 查询以实现标准的 Tableau 功能，包括多个 JOIN 和使用 Sets，并提供用户友好的连接对话框，以实现无缝集成体验。

## 教程 1：与 Databend 集成（通过 Other Databases (JDBC) 接口）

在本教程中，您将部署本地 Databend 并将其与 [Tableau Desktop](https://www.tableau.com/products/desktop) 集成。在开始之前，请 [下载](https://www.tableau.com/products/desktop/download) Tableau Desktop 并按照屏幕上的说明完成安装。

### 步骤 1. 部署 Databend

1. 按照 [本地和 Docker 部署](../10-deploy/01-deploy/01-non-production/00-deploying-local.md) 指南部署本地 Databend。
2. 在 Databend 中创建一个 SQL 用户。您将使用此帐户在 Tableau Desktop 中连接到 Databend。

```sql
CREATE USER tableau IDENTIFIED BY 'tableau';
GRANT ALL ON *.* TO tableau;
```

### 步骤 2. 安装 databend-jdbc

1. 从 Maven Central Repository 下载 databend-jdbc 驱动程序（0.3.4 或更高版本），地址为 https://repo1.maven.org/maven2/com/databend/databend-jdbc/

2. 要安装 databend-jdbc 驱动程序，请将 jar 文件（例如，databend-jdbc-0.3.4.jar）移动到 Tableau 的驱动程序文件夹。Tableau 的驱动程序文件夹因操作系统而异：

| 操作系统 | Tableau 的驱动程序文件夹         |
| -------- | -------------------------------- |
| MacOS    | ~/Library/Tableau/Drivers        |
| Windows  | C:\Program Files\Tableau\Drivers |

### 步骤 3. 连接到 Databend

1. 启动 Tableau Desktop 并在侧边栏中选择 **Other Database (JDBC)**。这将打开一个窗口，如下所示：

![Alt text](/img/integration/tableau-1.png)

2. 在打开的窗口中，提供连接信息，然后单击 **Sign In**。

| 参数      | 描述                                                           | 本教程                                                        |
| --------- | -------------------------------------------------------------- | ------------------------------------------------------------ |
| URL       | 格式：`jdbc:databend://{user}:{password}@{host}:{port}/{database}` | `jdbc:databend://tableau:tableau@127.0.0.1:8000/default` |
| Dialect   | 选择 "MySQL" 作为 SQL 方言。                                   | MySQL                                                        |
| Username  | 用于连接到 Databend 的 SQL 用户                                | tableau                                                      |
| Password  | 用于连接到 Databend 的 SQL 用户                                | tableau                                                      |

3. 当 Tableau 工作簿打开时，选择要查询的数据库、schema 和表。对于本教程，请为 **Database** 和 **Schema** 都选择 _default_。

![Alt text](/img/integration/tableau-2.png)

一切就绪！现在，您可以将表拖到工作区以开始查询和进一步分析。

## 教程 2：与 Databend 集成（通过 databend-tableau-connector-jdbc 连接器）

在本教程中，您将部署本地 Databend 并将其与 [Tableau Desktop](https://www.tableau.com/products/desktop) 集成。在开始之前，请 [下载](https://www.tableau.com/products/desktop/download) Tableau Desktop 并按照屏幕上的说明完成安装。

### 步骤 1. 部署 Databend

1. 按照 [本地和 Docker 部署](../10-deploy/01-deploy/01-non-production/00-deploying-local.md) 指南部署本地 Databend。
2. 在 Databend 中创建一个 SQL 用户。您将使用此帐户在 Tableau Desktop 中连接到 Databend。

```sql
CREATE USER tableau IDENTIFIED BY 'tableau';
GRANT ALL ON *.* TO tableau;
```

### 步骤 2. 安装 databend-jdbc

1. 从 Maven Central Repository 下载 databend-jdbc 驱动程序（0.3.4 或更高版本），地址为 https://repo1.maven.org/maven2/com/databend/databend-jdbc/

2. 要安装 databend-jdbc 驱动程序，请将 jar 文件（例如，databend-jdbc-0.3.4.jar）移动到 Tableau 的驱动程序文件夹。Tableau 的驱动程序文件夹因操作系统而异：

| 操作系统 | Tableau 的驱动程序文件夹         |
| -------- | -------------------------------- |
| MacOS    | ~/Library/Tableau/Drivers        |
| Windows  | C:\Program Files\Tableau\Drivers |

### 步骤 3. 安装 databend-tableau-connector-jdbc 连接器

1. 从连接器的 [Releases](https://github.com/databendcloud/databend-tableau-connector-jdbc/releases) 页面下载最新的 **databend_jdbc.taco** 文件，并将其保存到 Tableau 的连接器文件夹：

| 操作系统 | Tableau 的连接器文件夹                                           |
| -------- | ------------------------------------------------------------------ |
| MacOS    | ~/Documents/My Tableau Repository/Connectors                       |
| Windows  | C:\Users\[Windows User]\Documents\My Tableau Repository\Connectors |

2. 启动 Tableau Desktop 时禁用签名验证。如果您使用的是 macOS，请打开 Terminal 并输入以下命令：

```shell
/Applications/Tableau\ Desktop\ 2023.2.app/Contents/MacOS/Tableau -DDisableVerifyConnectorPluginSignature=true
```

### 步骤 4. 连接到 Databend

1. 在 Tableau Desktop 中，在 **To a Server** > **More...** 上选择 **Databend JDBC by Databend, Inc.**。

![Alt text](/img/integration/tableau-connector-1.png)

2. 在打开的窗口中，提供连接信息，然后单击 **Sign In**。

![Alt text](/img/integration/tableau-connector-2.png)

3. 选择一个数据库，然后您可以将表拖到工作区以开始查询和进一步分析。

![Alt text](/img/integration/tableau-connector-3.png)

## 教程 3：与 Databend Cloud 集成

在本教程中，您将 Databend Cloud 与 [Tableau Desktop](https://www.tableau.com/products/desktop) 集成。在开始之前，请 [下载](https://www.tableau.com/products/desktop/download) Tableau Desktop 并按照屏幕上的说明完成安装。

### 步骤 1. 获取连接信息

从 Databend Cloud 获取连接信息。有关如何操作，请参阅 [连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 2. 安装 databend-jdbc

1. 从 Maven Central Repository 下载 databend-jdbc 驱动程序（0.3.4 或更高版本），地址为 https://repo1.maven.org/maven2/com/databend/databend-jdbc/

2. 要安装 databend-jdbc 驱动程序，请将 jar 文件（例如，databend-jdbc-0.3.4.jar）移动到 Tableau 的驱动程序文件夹。Tableau 的驱动程序文件夹因操作系统而异：

| 操作系统 | Tableau 的驱动程序文件夹         |
| -------- | -------------------------------- |
| MacOS    | ~/Library/Tableau/Drivers        |
| Windows  | C:\Program Files\Tableau\Drivers |
| Linux    | /opt/tableau/tableau_driver/jdbc |

### 步骤 3. 连接到 Databend Cloud

1. 启动 Tableau Desktop 并在侧边栏中选择 **Other Database (JDBC)**。这将打开一个窗口，如下所示：

![Alt text](@site/static/img/documents/BI/tableau-1.png)

2. 在窗口中，提供您在 [步骤 1](#step-1-obtain-connection-information) 中获得的连接信息，然后单击 **Sign In**。

| 参数      | 描述                                                           | 本教程                                                                 |
| --------- | -------------------------------------------------------------- | ---------------------------------------------------------------------- |
| URL       | 格式：`jdbc:databend://{user}:{password}@{host}:{port}/{database}` | `jdbc:databend://cloudapp:<您的密码>@https://<您的主机>:443/default` |
| Dialect   | 选择 "MySQL" 作为 SQL 方言。                                   | MySQL                                                                  |
| Username  | 用于连接到 Databend Cloud 的 SQL 用户                           | cloudapp                                                               |
| Password  | 用于连接到 Databend Cloud 的 SQL 用户                           | 您的密码                                                               |

3. 当 Tableau 工作簿打开时，选择要查询的数据库、schema 和表。对于本教程，请为 **Database** 和 **Schema** 都选择 _default_。

![Alt text](@site/static/img/documents/BI/tableau-2.png)

一切就绪！现在，您可以将表拖到工作区以开始查询和进一步分析。
