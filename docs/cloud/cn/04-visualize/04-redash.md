---
title: Redash
---

[Redash](https://redash.io/) 允许任何人，无论技术水平如何，都能利用大小数据的力量。SQL 用户利用 Redash 探索、查询、可视化和共享来自任何数据源的数据。他们的工作反过来又使他们组织中的任何人都可以使用这些数据。每天，全球数千家组织的数百万用户使用 Redash 来开发洞察力并做出数据驱动的决策。

Databend Cloud 可作为数据源与 Redash 集成。以下教程将指导您部署 Redash 并将其与 Databend Cloud 集成。

## 教程：与 Redash 集成

在本教程中，您将使用 Docker 安装 Redash。在开始之前，请确保已安装 Docker。

### 第一步：获取连接信息

从 Databend Cloud 获取连接信息。具体操作请参考[连接到计算集群](../02-using-databend-cloud/00-warehouses.md#连接到计算集群-connecting)。

### 第二步：部署 Redash

下面的步骤描述了如何使用 Docker 部署 Redash。

1. 首先克隆 Redash 存储库，然后使用以下命令创建一个 .env 文件：

```shell
git clone https://github.com/getredash/redash.git
cd redash
touch .env && echo REDASH_COOKIE_SECRET=111 > .env
```
2. 安装依赖项并构建前端项目：

:::note
此步骤需要版本为 14.16.0 和 17.0.0 之间的 Node.js 版本。要安装 Node.js，例如版本 14.16.1：

```shell
# Install nvm
brew install nvm
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# Install and switch to Node.js 14.16.1
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

3. 在 Docker Compose 中启动 Redash 之前构建服务器并初始化数据库依赖项：

```shell
docker-compose build server
docker-compose run --rm server create_db
```

4. 启动 Redash：

```shell
docker-compose up
```

### 第三步：添加 Databend Cloud 为数据源

1. 通过在 Web 浏览器中访问 http://localhost:5000 完成初始过程来注册 Redash。

2. 从 **Settings** > **New Data Source** 的列表中选择 `Databend`。

![Alt text](@site/static/img/documents/BI/redash-select.png)

3. 配置 Databend Cloud 数据源。

    - Username: `cloudapp`.
    - Password: 复制并粘贴您在 Databend Cloud 中生成的密码。
    - Host: 复制并粘贴您在 Databend Cloud 中生成的主机地址。
    - Port: `443`
    - Database: `default`
    - Secure: 启用此选项。

![Alt text](@site/static/img/documents/BI/redash-cfg-cloud.png)

4. 点击 **Create**，然后 **Test Connection** 查看连接是否成功。

一切就绪！您现在可以编写查询并添加可视化。有关详细信息，请参阅 Redash 入门指南：https://redash.io/help/user-guide/getting-started#2-Write-A-Query