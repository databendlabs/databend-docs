---
title: Metabase
---

[Metabase](https://www.metabase.com/) 是一个开源商业智能平台。您可以使用 Metabase 来询问有关您的数据的问题，或将 Metabase 嵌入您的应用程序中，让您的客户自行探索他们的数据。Databend Cloud 提供了一个名为 [Metabase Databend](https://github.com/databendcloud/metabase-databend-driver/releases/latest) 的 JDBC 驱动程序，使您能够连接到 Metabase 并在 Databend Cloud 中显示数据。有关 Metabase Databend 驱动程序的更多信息，请参阅 https://github.com/databendcloud/metabase-databend-driver

## 下载和安装 Metabase Databend 驱动程序

请按照以下步骤下载并安装 Metabase Databend 驱动程序：

1. 在存储文件“metabase.jar”的目录中创建一个名为“plugins”的文件夹。

```bash
$ ls
metabase.jar
$ mkdir plugins
```
2. [下载](https://github.com/databendcloud/metabase-databend-driver/releases/latest) Metabase Databend Driver，然后保存在“plugins”文件夹中。

3. 要启动 Metabase，请运行以下命令：

```bash
java -jar metabase.jar
```

## 教程：与 Metabase 集成

本教程将向您展示如何通过 Metabase Databend Driver 将 Databend Cloud 与 Metabase 集成。在本教程中，您将使用 Docker 安装 Metabase。在开始之前，请确保已安装 Docker。

### 第一步：获取连接信息

从 Databend Cloud 获取连接信息。具体操作请参考[连接到计算集群](../02-using-databend-cloud/00-warehouses.md#连接到计算集群-connecting)。

### 第二步：安装 Metabase

以下步骤描述了如何使用 Docker 安装和部署 Metabase。

1. 从 Docker Hub 拉取 Metabase 的最新 Docker 映像。

```bash
docker pull metabase/metabase
```

2. 安装 Metabase.

```bash
docker run  -d -p 3000:3000 --name metabase metabase/metabase
```
3. [下载](https://github.com/databendcloud/metabase-databend-driver/releases/latest) Metabase Databend 驱动程序，然后导入到 Docker 中 Metabase 容器的“plugins”文件夹中。

![Alt text](@site/static/img/documents/BI/add2plugins.gif)

4. 重启 Metabase 容器。

### 第三步：将 Databend Cloud 连接到 Metabase

1. 打开您的 Web 浏览器，然后转到 http://localhost:3000/。

2. 完成初始注册过程。在第 3 步中选择“I'll add my data later”。

![Alt text](@site/static/img/documents/BI/add-later.png)

3. 在 Metabase 主页上选择“Add your own data”，建立与 Databend 的连接：

  - Database type: `Databend`
  - Host: 复制并粘贴您在 Databend Cloud 中生成的主机地址，以`https://`开头。
  - Port: `443`
  - Username: `cloudapp`
  - Password: 复制并粘贴您在 Databend Cloud 中生成的密码。
  - Use a secure connection (SSL): 启用此设置。

4. 单击“Save changes”，然后单击“Exit admin”.

一切就绪！您现在可以开始对 Databend 创建查询并构建仪表板。更多信息请参考 Metabase 文档：https://www.metabase.com/docs/latest/index.html

![Alt text](@site/static/img/documents/BI/allset.png)