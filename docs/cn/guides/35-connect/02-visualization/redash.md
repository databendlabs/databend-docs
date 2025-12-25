---
title: Redash
sidebar_position: 8
---

[Redash](https://redash.io/) 旨在让任何技术水平的用户都能驾驭各种规模的数据力量。SQL 用户通过 Redash 探索、查询、可视化并共享来自任何数据源的数据，从而让组织中的每个人都能使用这些数据。全球数千家机构的数百万用户每天使用 Redash 获取洞察并做出数据驱动的决策。

Databend 和 Databend Cloud 均可作为数据源与 Redash 集成。以下教程将指导您完成 Redash 的部署与集成。

## 教程-1：Databend 与 Redash 集成

本教程将指导您在本地部署 Databend 并使用 Docker 安装 Redash。开始前请确保已安装 Docker。

### 步骤 1. 部署 Databend

按照 [部署指南](/guides/self-hosted) 部署本地 Databend。

### 步骤 2. 部署 Redash

以下步骤描述如何使用 Docker 部署 Redash。

1. 首先克隆 Redash 仓库，然后创建 .env 文件：

```shell
git clone https://github.com/getredash/redash.git
cd redash
touch .env && echo REDASH_COOKIE_SECRET=111 > .env
```

2. 安装依赖并构建前端项目：

:::note
此步骤需要 Node.js 版本在 14.16.0 至 17.0.0 之间。例如安装 14.16.1 版本：

```shell
# 安装 nvm
brew install nvm
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# 安装并切换至 Node.js 14.16.1
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

3. 构建服务端并初始化数据库依赖，然后通过 Docker Compose 启动 Redash：

```shell
docker-compose build server
docker-compose run --rm server create_db
```

4. 启动 Redash：

```shell
docker-compose up
```

### 步骤 3. 添加 Databend 数据源

1. 在浏览器访问 http://localhost:5000 完成 Redash 初始注册流程。

2. 在 **Settings** > **New Data Source** 中选择 `Databend`。

![Alt text](/img/integration/redash-select.png)

3. 配置 Databend 数据源：

   - 用户名：`root`（本地 Databend 实例使用 root 登录无需密码）
   - 主机：`host.docker.internal`
   - 端口：`8000`
   - 数据库：`default`
   - 安全连接：若 Databend 服务器启用了 HTTPS 则勾选此项

![Alt text](/img/integration/redash-cfg-local.png)

4. 点击 **Create**，然后 **Test Connection** 测试连接是否成功。

一切就绪！您现在可以编写查询并添加可视化图表。更多信息请参考 Redash 入门指南：https://redash.io/help/user-guide/getting-started#2-Write-A-Query

## 教程-2：Databend Cloud 与 Redash 集成

本教程将指导您使用 Docker 安装 Redash。开始前请确保已安装 Docker。

### 步骤 1. 获取连接信息

从 Databend Cloud 获取连接信息，具体操作请参考 [连接计算集群](/guides/cloud/resources/warehouses#connecting)。

### 步骤 2. 部署 Redash

以下步骤描述如何使用 Docker 部署 Redash。

1. 首先克隆 Redash 仓库，然后创建 .env 文件：

```shell
git clone https://github.com/getredash/redash.git
cd redash
touch .env && echo REDASH_COOKIE_SECRET=111 > .env
```

2. 安装依赖并构建前端项目：

:::note
此步骤需要 Node.js 版本在 14.16.0 至 17.0.0 之间。例如安装 14.16.1 版本：

```shell
# 安装 nvm
brew install nvm
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# 安装并切换至 Node.js 14.16.1
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

3. 构建服务端并初始化数据库依赖，然后通过 Docker Compose 启动 Redash：

```shell
docker-compose build server
docker-compose run --rm server create_db
```

4. 启动 Redash：

```shell
docker-compose up
```

### 步骤 3. 添加 Databend Cloud 数据源

1. 在浏览器访问 http://localhost:5000 完成 Redash 初始注册流程。

2. 在 **Settings** > **New Data Source** 中选择 `Databend`。

![Alt text](@site/static/img/documents/BI/redash-select.png)

3. 配置 Databend 数据源：

   - 用户名：`cloudapp`
   - 密码：粘贴 Databend Cloud 生成的密码
   - 主机：粘贴 Databend Cloud 生成的主机地址
   - 端口：`443`
   - 数据库：`default`
   - 安全连接：勾选此项

![Alt text](@site/static/img/documents/BI/redash-cfg-cloud.png)

4. 点击 **Create**，然后 **Test Connection** 测试连接是否成功。

一切就绪！您现在可以编写查询并添加可视化图表。更多信息请参考 Redash 入门指南：https://redash.io/help/user-guide/getting-started#2-Write-A-Query