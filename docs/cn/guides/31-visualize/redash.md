---
title: Redash
---

[Redash](https://redash.io/) 旨在让任何技术水平的人都能利用大数据和小数据的力量。SQL 用户利用 Redash 从任何数据源探索、查询、可视化和共享数据。他们的工作反过来使组织中的任何人都能使用数据。每天，全球成千上万的组织的数百万用户使用 Redash 来开发洞察力并做出数据驱动的决策。

Databend 和 Databend Cloud 都可以作为数据源与 Redash 集成。以下教程将指导您如何部署和集成 Redash。

## 教程-1：将 Databend 与 Redash 集成

在本教程中，您将部署一个本地 Databend 并通过 Docker 安装 Redash。在开始之前，请确保已安装 Docker。

### 步骤 1. 部署 Databend

按照 [部署指南](/guides/deploy) 部署本地 Databend。

### 步骤 2. 部署 Redash

以下步骤描述如何通过 Docker 部署 Redash。

1. 首先克隆 Redash 仓库，然后创建一个 .env 文件，使用以下命令：

```shell
git clone https://github.com/getredash/redash.git
cd redash
touch .env && echo REDASH_COOKIE_SECRET=111 > .env
```

2. 安装依赖并构建前端项目：

:::note
这需要 Node.js 版本在 14.16.0 和 17.0.0 之间。例如，安装 Node.js 14.16.1：

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

3. 在启动 Redash 之前，构建服务器并初始化数据库依赖：

```shell
docker-compose build server
docker-compose run --rm server create_db
```

4. 启动 Redash：

```shell
docker-compose up
```

### 步骤 3. 将 Databend 添加为数据源

1. 在浏览器中访问 http://localhost:5000 完成初始流程，注册 Redash。

2. 在 **设置** > **新建数据源** 中选择 `Databend`。

![Alt text](/img/integration/redash-select.png)

3. 配置您的 Databend 数据源。

   - 用户名：`root`。如果您以 `root` 登录本地 Databend 实例，则无需密码。
   - 主机：`host.docker.internal`
   - 端口：`8000`
   - 数据库：`default`
   - 安全：如果您在 Databend 服务器上启用了 HTTPS，请启用此选项。

![Alt text](/img/integration/redash-cfg-local.png)

4. 点击 **创建**，然后点击 **测试连接** 检查连接是否成功。

一切就绪！您现在可以编写查询并添加可视化。更多信息，请参考 Redash 入门指南：https://redash.io/help/user-guide/getting-started#2-Write-A-Query

## 教程-2：将 Databend Cloud 与 Redash 集成

在本教程中，您将通过 Docker 安装 Redash。在开始之前，请确保已安装 Docker。

### 步骤 1. 获取连接信息

从 Databend Cloud 获取连接信息。具体方法请参考 [连接到仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 2. 部署 Redash

以下步骤描述如何通过 Docker 部署 Redash。

1. 首先克隆 Redash 仓库，然后创建一个 .env 文件，使用以下命令：

```shell
git clone https://github.com/getredash/redash.git
cd redash
touch .env && echo REDASH_COOKIE_SECRET=111 > .env
```

2. 安装依赖并构建前端项目：

:::note
这需要 Node.js 版本在 14.16.0 和 17.0.0 之间。例如，安装 Node.js 14.16.1：

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

3. 在启动 Redash 之前，构建服务器并初始化数据库依赖：

```shell
docker-compose build server
docker-compose run --rm server create_db
```

4. 启动 Redash：

```shell
docker-compose up
```

### 步骤 3. 将 Databend Cloud 添加为数据源

1. 在浏览器中访问 http://localhost:5000 完成初始流程，注册 Redash。

2. 在 **设置** > **新建数据源** 中选择 `Databend`。

![Alt text](@site/static/img/documents/BI/redash-select.png)

3. 配置您的 Databend 数据源。

   - 用户名：`cloudapp`。
   - 密码：复制并粘贴在 Databend Cloud 中生成的密码。
   - 主机：复制并粘贴在 Databend Cloud 中生成的主机地址。
   - 端口：`443`
   - 数据库：`default`
   - 安全：启用此选项。

![Alt text](@site/static/img/documents/BI/redash-cfg-cloud.png)

4. 点击 **创建**，然后点击 **测试连接** 检查连接是否成功。

一切就绪！您现在可以编写查询并添加可视化。更多信息，请参考 Redash 入门指南：https://redash.io/help/user-guide/getting-started#2-Write-A-Query