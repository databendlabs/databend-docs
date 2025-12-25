---
title: Metabase
sidebar_position: 4
---

[Metabase](https://www.metabase.com/) 是一个开源商业智能平台。您可以使用 Metabase 查询数据，或将其嵌入应用让客户自主探索数据。

Databend 提供了名为 [Metabase Databend Driver](https://github.com/databendcloud/metabase-databend-driver/releases/latest) 的 JDBC 驱动，支持连接 Metabase 并对 Databend/Databend Cloud 中的数据进行仪表盘展示。有关该驱动的更多信息，请参考 https://github.com/databendcloud/metabase-databend-driver

## 下载安装 Metabase Databend 驱动

下载并安装 Metabase Databend 驱动的步骤如下：

1. 在存放 **metabase.jar** 文件的目录中创建名为 **plugins** 的文件夹。

```bash
$ ls
metabase.jar
$ mkdir plugins
```

2. [下载](https://github.com/databendcloud/metabase-databend-driver/releases/latest) Metabase Databend 驱动，并将其保存到 **plugins** 文件夹。

3. 运行以下命令启动 Metabase：

```bash
java -jar metabase.jar
```

## 教程：与 Metabase 集成

本教程将指导您使用 Metabase Databend 驱动完成 Databend/Databend Cloud 与 Metabase 的集成。

### 步骤 1. 环境准备

您需要使用 Docker 安装 Metabase。开始前请确保系统已安装 Docker。

本教程可选择与本地 Databend 或 Databend Cloud 集成：

- 如选择本地 Databend 实例，请先按[部署指南](/guides/deploy)完成部署（如尚未部署）。
- 如选择 Databend Cloud，请确保可登录账户并获取计算集群的连接信息。详情参见[连接计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 2. 部署 Metabase

按以下步骤使用 Docker 安装部署 Metabase：

1. 从 Docker Hub 拉取最新版 Metabase 镜像。

```bash
docker pull metabase/metabase
```

2. 部署 Metabase。

```bash
docker run  -d -p 3000:3000 --name metabase metabase/metabase
```

3. [下载](https://github.com/databendcloud/metabase-databend-driver/releases/latest) Metabase Databend 驱动，并将其导入 Docker 中 Metabase 容器的 **plugins** 文件夹。

![Alt text](/img/integration/add2plugins.gif)

4. 重启 Metabase 容器。

### 步骤 3. 连接 Metabase

1. 打开浏览器访问 http://localhost:3000/。

2. 完成初始注册流程。在第三步选择**稍后添加数据**。

![Alt text](/img/integration/add-later.png)

3. 点击右上角**齿轮图标**，导航至**管理员设置** > **数据库** > **添加数据库**创建连接：

| 参数                      | Databend               | Databend Cloud                     |
| ------------------------- | ---------------------- | ---------------------------------- |
| 数据库类型                | `Databend`             | `Databend`                         |
| 主机地址                  | `host.docker.internal` | 从连接信息获取                     |
| 端口                      | `8000`                 | `443`                              |
| 用户名                    | 例如 `root`            | `cloudapp`                         |
| 密码                      | 输入密码               | 从连接信息获取                     |
| 使用安全连接 (SSL)        | 关闭                   | 开启                               |

4. 点击**保存更改**，然后点击**退出管理**。

完成设置！现在您可以开始创建查询并构建仪表盘。更多信息请参考 Metabase 文档：https://www.metabase.com/docs/latest/index.html

![Alt text](/img/integration/allset.png)