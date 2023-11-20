---
title: Tableau
---

[Tableau](https://www.tableau.com/) 是一个可视化分析平台，它改变了我们使用数据解决问题的方式——使个人和组织能够充分利用他们的数据。通过利用 [databend-jdbc 驱动程序](https://github.com/databendcloud/databend-jdbc)（0.0.8 或更高版本），Databend Cloud 能够与 Tableau 无缝集成，实现无缝数据访问和高效分析。需要注意的是，为了获得最佳兼容性，建议使用 Tableau 版本 2023.1.0 或更高版本以避免潜在的兼容性问题。

在以下教程中，您将找到有关部署 Tableau Desktop 并将其与 Databend Cloud 集成的详细分步指导。

## 教程：与 Tableau Desktop 集成

在本教程中，您会将 Databend Cloud 与 [Tableau Desktop](https://www.tableau.com/products/desktop) 集成。在开始之前，[下载](https://www.tableau.com/products/desktop/download) Tableau Desktop 并按照屏幕上的指引完成安装。

### 第一步：获取连接信息

从 Databend Cloud 获取连接信息。具体操作请参考[连接到计算集群](../02-using-databend-cloud/00-warehouses.md#连接到计算集群-connecting)。

### 第二步：安装 databend-jdbc

1. 从位于 https://repo1.maven.org/maven2/com/databend/databend-jdbc/ 的 Maven 中央存储库下载 databend-jdbc 驱动程序（版本 0.0.8 或更高版本）。

2. 安装 databend-jdbc 驱动程序。请将 jar 文件（例如，databend-jdbc-0.0.8.jar）移动到 Tableau 的驱动程序文件夹。Tableau 的驱动程序文件夹因操作系统而异：

| 操作系统 	| Tableau 驱动程序文件夹          	|
|------------------	|----------------------------------	|
| MacOS             | ~/Library/Tableau/Drivers        	|
| Windows          	| C:\Program Files\Tableau\Drivers 	|
| Linux            	| /opt/tableau/tableau_driver/jdbc 	|

### 第三步：连接 Databend Cloud

1. 启动 Tableau Desktop 并在边栏中选择 **Other Database (JDBC)** 打开如下窗口：

![Alt text](@site/static/img/documents/BI/tableau-1.png)

2. 在打开的窗口中，提供您在[第一步](#step-1-obtain-connection-information)中获得的连接信息，然后点击 **Sign In**。

| 参数 	| 描述                                                        	| 对于本教程                                         	|
|-----------	|--------------------------------------------------------------------	|----------------------------------------------------------	|
| URL       	| 格式：jdbc:databend://{user}:{password}@{host}:{port}/{database} 	| `jdbc:databend://cloudapp:<your-password>@https://<your-host>:443/default` 	|
| Dialect   	| 选择“MySQL”作为 SQL 方言。                                    	| MySQL                                                    	|
| Username  	| 用于连接 Databend Cloud 的 SQL 用户                               	| cloudapp                                                  	|
| Password  	| 用于连接 Databend Cloud 的 SQL 用户                                	| 您的密码                                                  	|

3. 当 Tableau 工作簿打开时，选择要查询的数据库、架构和表。对于本教程，**Database** 和 **Schema** 都选择 *default*。

![Alt text](@site/static/img/documents/BI/tableau-2.png)

一切就绪！您现在可以将表格拖到工作区开始查询和进一步分析。