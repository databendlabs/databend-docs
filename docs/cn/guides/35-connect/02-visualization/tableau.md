---
title: Tableau
sidebar_position: 2
---

[Tableau](https://www.tableau.com/) 是一个可视化分析平台，它改变了我们利用数据解决问题的方式，赋能个人和组织最大化数据价值。通过使用 [databend-jdbc 驱动](https://github.com/databendcloud/databend-jdbc) (0.3.4 或更高版本)，Databend 和 Databend Cloud 都能与 Tableau 集成，实现无缝数据访问和高效分析。需要注意的是，为确保最佳兼容性，建议使用 Tableau 2022.3 或更高版本以避免潜在的兼容性问题。

Databend 目前提供两种与 Tableau 的集成方式。第一种方法通过 Tableau 中的 Other Databases (JDBC) 接口实现，适用于 Databend 和 Databend Cloud。第二种方法推荐使用 Databend 专门开发的 [databend-tableau-connector-jdbc](https://github.com/databendcloud/databend-tableau-connector-jdbc) 连接器，以获得与 Databend 的最佳连接效果。

`databend-tableau-connector-jdbc` 连接器通过其 JDBC 驱动提供更快的性能，特别是在创建 Extracts 时，且作为跨平台 jar 文件更易于安装，无需平台特定编译。它允许您针对标准 Tableau 功能（包括多表 JOIN 和集合操作）微调 SQL 查询，并提供用户友好的连接对话框，实现无缝集成体验。

## 教程-1：与 Databend 集成（通过 Other Databases (JDBC) 接口）

本教程将指导您在本地部署 Databend 并与 [Tableau Desktop](https://www.tableau.com/products/desktop) 集成。开始前，请先[下载](https://www.tableau.com/products/desktop/download) Tableau Desktop 并按屏幕指引完成安装。

### 步骤 1. 部署 Databend

1. 参照[本地与 Docker 部署](../../20-self-hosted/02-deployment/01-non-production/00-deploying-local.md)指南部署本地 Databend。
2. 在 Databend 中创建 SQL 用户，该账户将用于在 Tableau Desktop 中连接 Databend。

```sql
CREATE USER tableau IDENTIFIED BY 'tableau';
GRANT ALL ON *.* TO tableau;
```

### 步骤 2. 安装 databend-jdbc

1. 从 Maven 中央仓库 https://repo1.maven.org/maven2/com/databend/databend-jdbc/ 下载 databend-jdbc 驱动（0.3.4 或更高版本）。

2. 将 jar 文件（例如 databend-jdbc-0.3.4.jar）移动至 Tableau 的驱动文件夹完成安装。Tableau 驱动文件夹路径因操作系统而异：

| 操作系统 | Tableau 驱动文件夹路径          |
| ---------------- | -------------------------------- |
| MacOS            | ~/Library/Tableau/Drivers        |
| Windows          | C:\Program Files\Tableau\Drivers |

### 步骤 3. 连接 Databend

1. 启动 Tableau Desktop，在侧边栏选择 **Other Database (JDBC)**，将打开如下窗口：

![Alt text](/img/integration/tableau-1.png)

2. 在打开的窗口中填写连接信息，点击 **Sign In**。

| 参数 | 描述                                                          | 本教程示例                                        |
| --------- | -------------------------------------------------------------------- | -------------------------------------------------------- |
| URL       | 格式：`jdbc:databend://{user}:{password}@{host}:{port}/{database}` | `jdbc:databend://tableau:tableau@127.0.0.1:8000/default` |
| Dialect   | 选择 SQL 方言为 "MySQL"。                                      | MySQL                                                    |
| Username  | 连接 Databend 的 SQL 用户                                  | tableau                                                  |
| Password  | 连接 Databend 的 SQL 用户密码                                  | tableau                                                  |

3. 当 Tableau 工作簿打开后，选择要查询的数据库、模式和表。本教程中，**Database** 和 **Schema** 均选择 _default_。

![Alt text](/img/integration/tableau-2.png)

一切就绪！现在您可以将表拖至工作区开始查询和进一步分析。

## 教程-2：与 Databend 集成（通过 databend-tableau-connector-jdbc 连接器）

本教程将指导您在本地部署 Databend 并与 [Tableau Desktop](https://www.tableau.com/products/desktop) 集成。开始前，请先[下载](https://www.tableau.com/products/desktop/download) Tableau Desktop 并按屏幕指引完成安装。

### 步骤 1. 部署 Databend

1. 参照[本地与 Docker 部署](../../20-self-hosted/02-deployment/01-non-production/00-deploying-local.md)指南部署本地 Databend。
2. 在 Databend 中创建 SQL 用户，该账户将用于在 Tableau Desktop 中连接 Databend。

```sql
CREATE USER tableau IDENTIFIED BY 'tableau';
GRANT ALL ON *.* TO tableau;
```

### 步骤 2. 安装 databend-jdbc

1. 从 Maven 中央仓库 https://repo1.maven.org/maven2/com/databend/databend-jdbc/ 下载 databend-jdbc 驱动（0.3.4 或更高版本）。

2. 将 jar 文件（例如 databend-jdbc-0.3.4.jar）移动至 Tableau 的驱动文件夹完成安装。Tableau 驱动文件夹路径因操作系统而异：

| 操作系统 | Tableau 驱动文件夹路径          |
| ---------------- | -------------------------------- |
| MacOS            | ~/Library/Tableau/Drivers        |
| Windows          | C:\Program Files\Tableau\Drivers |

### 步骤 3. 安装 databend-tableau-connector-jdbc 连接器

1. 从连接器的 [Releases](https://github.com/databendcloud/databend-tableau-connector-jdbc/releases) 页面下载最新的 **databend_jdbc.taco** 文件，保存至 Tableau 的连接器文件夹：

| 操作系统 | Tableau 连接器文件夹路径                                         |
| ---------------- | ------------------------------------------------------------------ |
| MacOS            | ~/Documents/My Tableau Repository/Connectors                       |
| Windows          | C:\Users\[Windows User]\Documents\My Tableau Repository\Connectors |

2. 禁用签名验证启动 Tableau Desktop。若使用 macOS，在终端输入以下命令：

```shell
/Applications/Tableau\ Desktop\ 2023.2.app/Contents/MacOS/Tableau -DDisableVerifyConnectorPluginSignature=true
```

### 步骤 4. 连接 Databend

1. 在 Tableau Desktop 中，选择 **To a Server** > **More...** 下的 **Databend JDBC by Databend, Inc.**。

![Alt text](/img/integration/tableau-connector-1.png)

2. 在打开的窗口中填写连接信息，点击 **Sign In**。

![Alt text](/img/integration/tableau-connector-2.png)

3. 选择数据库后，即可将表拖至工作区开始查询和进一步分析。

![Alt text](/img/integration/tableau-connector-3.png)

## 教程 3：与 Databend Cloud 集成

本教程将指导您将 Databend Cloud 与 [Tableau Desktop](https://www.tableau.com/products/desktop) 集成。开始前，请先[下载](https://www.tableau.com/products/desktop/download) Tableau Desktop 并按屏幕指引完成安装。

### 步骤 1. 获取连接信息

从 Databend Cloud 获取连接信息，具体操作请参考[连接计算集群](/guides/cloud/resources/warehouses#connecting)。

### 步骤 2. 安装 databend-jdbc

1. 从 Maven 中央仓库 https://repo1.maven.org/maven2/com/databend/databend-jdbc/ 下载 databend-jdbc 驱动（0.3.4 或更高版本）。

2. 将 jar 文件（例如 databend-jdbc-0.3.4.jar）移动至 Tableau 的驱动文件夹完成安装。Tableau 驱动文件夹路径因操作系统而异：

| 操作系统 | Tableau 驱动文件夹路径          |
| ---------------- | -------------------------------- |
| MacOS            | ~/Library/Tableau/Drivers        |
| Windows          | C:\Program Files\Tableau\Drivers |
| Linux            | /opt/tableau/tableau_driver/jdbc |

### 步骤 3. 连接 Databend Cloud

1. 启动 Tableau Desktop，在侧边栏选择 **Other Database (JDBC)**，将打开如下窗口：

![Alt text](@site/static/img/documents/BI/tableau-1.png)

2. 在窗口中填写[步骤 1](#step-1-obtain-connection-information) 获取的连接信息，点击 **Sign In**。

| 参数 | 描述                                                          | 本教程示例                                                          |
| --------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| URL       | 格式：`jdbc:databend://{user}:{password}@{host}:{port}/{database}` | `jdbc:databend://cloudapp:<your-password>@https://<your-host>:443/default` |
| Dialect   | 选择 SQL 方言为 "MySQL"。                                      | MySQL                                                                      |
| Username  | 连接 Databend Cloud 的 SQL 用户                            | cloudapp                                                                   |
| Password  | 连接 Databend Cloud 的 SQL 用户密码                            | 您的密码                                                              |

3. 当 Tableau 工作簿打开后，选择要查询的数据库、模式和表。本教程中，**Database** 和 **Schema** 均选择 _default_。

![Alt text](@site/static/img/documents/BI/tableau-2.png)

一切就绪！现在您可以将表拖至工作区开始查询和进一步分析。