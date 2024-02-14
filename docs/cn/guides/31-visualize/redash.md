---
title: Redash
---

[Redash](https://redash.io/) 设计用于使任何人，无论技术水平如何，都能够利用大大小小的数据的力量。SQL 用户利用 Redash 来探索、查询、可视化和共享来自任何数据源的数据。他们的工作反过来使组织中的任何人都能使用数据。每天，全球数千家组织的数百万用户使用 Redash 来开发洞察力并做出数据驱动的决策。

Databend 和 Databend Cloud 都可以作为数据源与 Redash 集成。以下教程将指导您部署和集成 Redash。

## 教程-1：将 Databend 与 Redash 集成

在本教程中，您将部署本地 Databend 并使用 Docker 安装 Redash。开始之前，请确保您已安装 Docker。

### 步骤 1. 部署 Databend

按照[部署指南](/guides/deploy)来部署本地 Databend。

### 步骤 2. 部署 Redash

以下步骤描述了如何使用 Docker 部署 Redash。

1. 首先克隆 Redash 仓库，然后使用以下命令创建一个 .env 文件：

```shell
git clone https://github.com/getredash/redash.git
cd redash
touch .env && echo REDASH_COOKIE_SECRET=111 > .env
```
2. 安装依赖并构建前端项目：

:::note
这需要 Node.js 版本在 14.16.0 到 17.0.0 之间。例如，安装 Node.js 版本 14.16.1：

```shell
# 安装 nvm
brew install nvm
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# 安装并切换到 Node.js 14.16.1
nvm install 14.16.1
nvm use 14.16.1
```
:::

```shell
cd viz-lib & yarn install
cd ..
yarn install 
yarn build
```

3. 在 Docker Compose 中启动 Redash 之前，构建服务器并初始化数据库依赖项：

```shell
docker-compose build server
docker-compose run --rm server create_db
```

4. 启动 Redash：

```shell
docker-compose up
```

### 步骤 3. 添加 Databend 作为数据源

1. 通过在您的网络浏览器中访问 http://localhost:5000 完成 Redash 的初始过程来注册。

2. 在 **Settings** > **New Data Source** 列表中选择 `Databend`。

![Alt text](@site/docs/public/img/integration/redash-select.png)

3. 配置您的 Databend 数据源。

    - Username: `root`。如果您以 `root` 登录本地实例的 Databend，则无需密码。
    - Host: `host.docker.internal`
    - Port: `8000`
    - Database: `default`
    - Secure: 如果您在 Databend 服务器上启用了 HTTPS，请启用此选项。

![Alt text](@site/docs/public/img/integration/redash-cfg-local.png)

4. 点击 **Create**，然后 **Test Connection** 来检查连接是否成功。

您已经准备好了！您现在可以编写查询并添加可视化。有关更多信息，请参考 Redash 入门指南：https://redash.io/help/user-guide/getting-started#2-Write-A-Query

## 教程-2：将 Databend Cloud 与 Redash 集成

在本教程中，您将使用 Docker 安装 Redash。开始之前，请确保您已安装 Docker。

### 步骤 1. 获取连接信息

从 Databend Cloud 获取连接信息。有关如何操作，请参考[连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 2. 部署 Redash

以下步骤描述了如何使用 Docker 部署 Redash。

1. 首先克隆 Redash 仓库，然后使用以下命令创建一个 .env 文件：

```shell
git clone https://github.com/getredash/redash.git
cd redash
touch .env && echo REDASH_COOKIE_SECRET=111 > .env
```
2. 安装依赖并构建前端项目：

:::note
这需要 Node.js 版本在 14.16.0 到 17.0.0 之间。例如，安装 Node.js 版本 14.16.1：

```shell
# 安装 nvm
brew install nvm
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# 安装并切换到 Node.js 14.16.1
nvm install 14.16.1
nvm use 14.16.1
```
:::

```shell
cd viz-lib & yarn install
cd ..
yarn install 
yarn build
```

3. 在 Docker Compose 中启动 Redash 之前，构建服务器并初始化数据库依赖项：

```shell
docker-compose build server
docker-compose run --rm server create_db
```

4. 启动 Redash：

```shell
docker-compose up
```

### 步骤 3. 添加 Databend Cloud 作为数据源

1. 通过在您的网络浏览器中访问 http://localhost:5000 完成 Redash 的初始过程来注册。

2. 在 **Settings** > **New Data Source** 列表中选择 `Databend`。

![Alt text](@site/static/img/documents/BI/redash-select.png)

3. 配置您的 Databend 数据源。

    - Username: `cloudapp`。
    - Password: 复制并粘贴您在 Databend Cloud 中生成的密码。
    - Host: 复制并粘贴您在 Databend Cloud 中生成的主机地址。
    - Port: `443`
    - Database: `default`
    - Secure: 启用此选项。

![Alt text](@site/static/img/documents/BI/redash-cfg-cloud.png)

4. 点击 **Create**，然后 **Test Connection** 来检查连接是否成功。

您已经准备好了！您现在可以编写查询并添加可视化。有关更多信息，请参考 Redash 入门指南：https://redash.io/help/user-guide/getting-started#2-Write-A-Query