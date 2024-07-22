---
title: Metabase
---

[Metabase](https://www.metabase.com/) 是一个开源的商业智能平台。您可以使用 Metabase 来询问有关您的数据的问题，或者将 Metabase 嵌入到您的应用中，让您的客户自行探索他们的数据。

Databend 提供了一个名为 [Metabase Databend Driver](https://github.com/databendcloud/metabase-databend-driver/releases/latest) 的 JDBC 驱动程序，使您能够连接到 Metabase 并在 Databend / Databend Cloud 中展示您的数据。有关 Metabase Databend Driver 的更多信息，请参阅 https://github.com/databendcloud/metabase-databend-driver

## 下载与安装 Metabase Databend Driver

要下载和安装 Metabase Databend Driver：

1. 在存储 **metabase.jar** 文件的目录中创建一个名为 **plugins** 的文件夹。

```bash
$ ls
metabase.jar
$ mkdir plugins
```

2. [下载](https://github.com/databendcloud/metabase-databend-driver/releases/latest) Metabase Databend Driver，然后将其保存到 **plugins** 文件夹中。

3. 要启动 Metabase，请运行以下命令：

```bash
java -jar metabase.jar
```

## 教程：与 Metabase 集成

本教程将指导您使用 Metabase Databend Driver 将 Databend / Databend Cloud 与 Metabase 集成。

### 步骤 1. 设置环境

要跟随本教程，您需要使用 Docker 安装 Metabase。在开始之前，请确保您的系统上已安装 Docker。

在本教程中，您可以选择与 Databend 或 Databend Cloud 集成：

- 如果您选择与本地 Databend 实例集成，请按照 [部署指南](/guides/deploy) 进行部署（如果您还没有部署的话）。
- 如果您更喜欢与 Databend Cloud 集成，请确保您可以登录到您的账户并获取仓库的连接信息。更多详情，请参阅 [连接到仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 2. 部署 Metabase

按照以下步骤使用 Docker 安装和部署 Metabase：

1. 从 Docker Hub 注册表中拉取最新的 Metabase Docker 镜像。

```bash
docker pull metabase/metabase
```

2. 部署 Metabase。

```bash
docker run  -d -p 3000:3000 --name metabase metabase/metabase
```

3. [下载](https://github.com/databendcloud/metabase-databend-driver/releases/latest) Metabase Databend Driver，然后将其导入到 Docker 中 Metabase 容器的 **plugins** 文件夹中。

![Alt text](/img/integration/add2plugins.gif)

4. 重启 Metabase 容器。

### 步骤 3. 连接到 Metabase

1. 打开您的网络浏览器，并访问 http://localhost:3000/。

2. 完成初始注册过程。在步骤 3 中选择 **I'll add my data later**。

![Alt text](/img/integration/add-later.png)

3. 点击右上角的 **齿轮** 图标，导航到 **Admin settings** > **Databases** > **Add a database** 以创建连接：

| 参数                          | Databend               | Databend Cloud                     |
| ----------------------------- | ---------------------- | ---------------------------------- |
| Database type                 | `Databend`             | `Databend`                         |
| Host                          | `host.docker.internal` | 从连接信息中获取                   |
| Port                          | `8000`                 | `443`                              |
| Username                      | 例如，`root`           | `cloudapp`                         |
| Password                      | 输入您的密码           | 从连接信息中获取                   |
| Use a secure connection (SSL) | 关闭                   | 开启                               |

4. 点击 **Save changes**，然后点击 **Exit admin**。

您已全部设置完毕！现在您可以开始创建查询并构建仪表板。更多信息，请参阅 Metabase 文档：https://www.metabase.com/docs/latest/index.html

![Alt text](/img/integration/allset.png)