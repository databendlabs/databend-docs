---
title: Superset
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

[Superset](https://superset.apache.org/) 快速、轻量、直观，并加载了许多选项，使用户可以轻松地浏览和可视化他们的数据，从简单的折线图到高度详细的地理空间图。

Databend 通过两个 Python 库与 Superset 集成：[databend-py](https://github.com/databendcloud/databend-py) 和 [databend-sqlalchemy](https://github.com/databendcloud/databend-sqlalchemy)。为了实现这种集成，您需要基于官方 Superset Docker 镜像构建一个自定义 Docker 镜像，并将这两个库合并到其中。`databend-py` 充当 Databend 的 Python 客户端库，允许 Superset 通过其 API 与 Databend 服务器通信、执行查询和检索结果。同时，`databend-sqlalchemy` 充当 Databend 的 SQLAlchemy 适配器，使 Superset 能够使用 SQLAlchemy 框架与 Databend 集成。它有助于通过 SQLAlchemy 的接口将 Superset 生成的 SQL 查询转换为 Databend 可以理解的格式。

## 教程：与 Superset 集成

本教程将指导您完成将 Databend Cloud 与 Superset 集成的过程。

<StepsWrap>
<StepContent number="1">

### 构建 Superset 镜像

这些步骤包括创建一个具有 Databend 集成的自定义 Superset Docker 镜像：

1. 从官方 Superset Docker 镜像作为基础开始。编辑 Dockerfile，权限被提升以安装必要的包。

```shell title='Dockerfile'
FROM apache/superset
# Switching to root to install the required packages
USER root
RUN pip install databend-py 
RUN pip install databend-sqlalchemy
# Switching back to using the `superset` user
USER superset
```

2. 使用当前目录作为构建上下文，构建一个带有标签 "superset-databend:v0.0.1" 的 Docker 镜像。

```shell
docker build -t superset-databend:v0.0.1 .
```

3. 使用 "superset-databend:v0.0.1" 镜像运行 Docker 容器。

```shell
docker run -d -p 8080:8088 -e "SUPERSET_SECRET_KEY=<your_secret_key>" --name superset --platform linux/x86_64 superset-databend:v0.0.1
```

</StepContent>
<StepContent number="2">

### 设置 Superset

1. 创建一个管理员用户。

```shell
docker exec -it superset superset fab create-admin \
           --username admin \
           --firstname Superset \
           --lastname Admin \
           --email admin@superset.com \
           --password admin
```

2. 应用任何必要的数据库迁移，以确保 Superset 数据库模式是最新的。

```shell
docker exec -it superset superset db upgrade
```

3. 初始化 Superset。

```shell
docker exec -it superset superset init
```

</StepContent>
<StepContent number="3">


### 连接到 Databend Cloud

1. 导航到 [http://localhost:8080/login/]( http://localhost:8080/login/) 并使用凭据 `admin/admin` 作为用户名和密码登录。

2. 选择 **Settings** > **Data** > **Connect Database** 以打开连接向导。

![Alt text](/img/integration/superset-connect-db.png)

3. 从支持的数据库列表中选择 `Other`。

![Alt text](/img/integration/superset-select-other.png)

4. 在 **BASIC** 选项卡上，设置一个显示名称，例如 `Databend`，然后输入 URI 以连接到 Databend Cloud。URI 遵循以下格式：`databend://<host>`，其中 `<host>` 对应于您的计算集群连接信息中的 host 字段。有关如何获取连接详细信息的信息，请参阅 [连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting-to-a-warehouse)。

![Alt text](/img/integration/superset-uri.png)

5. 单击 **TEST CONNECTION**，这将导致弹出消息“Connection looks good!”。

</StepContent>
</StepsWrap>