---
title: Superset
sidebar_position: 3
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

[Superset](https://superset.apache.org/) 是一款快速、轻量级且直观的数据可视化工具，提供了丰富的选项，使得不同技术水平的用户都能轻松探索和可视化数据，从简单的折线图到高度详细的地理空间图表。

Databend 通过两个 Python 库与 Superset 集成：[databend-py](https://github.com/databendcloud/databend-py) 和 [databend-sqlalchemy](https://github.com/databendcloud/databend-sqlalchemy)。为实现这一集成，您需要基于官方 Superset Docker 镜像构建一个自定义镜像，并包含这两个库。`databend-py` 作为 Databend 的 Python 客户端库，允许 Superset 通过其 API 与 Databend 服务器通信、执行查询并获取结果。同时，`databend-sqlalchemy` 作为 Databend 的 SQLAlchemy 适配器，使 Superset 能够通过 SQLAlchemy 框架与 Databend 集成，将 Superset 生成的 SQL 查询转换为 Databend 可理解的格式。

## 教程：与 Superset 集成

本教程将指导您完成 Databend Cloud 与 Superset 的集成过程。

<StepsWrap>
<StepContent number="1">

### 构建 Superset 镜像

以下步骤将创建一个包含 Databend 集成的自定义 Superset Docker 镜像：

1. 以官方 Superset Docker 镜像为基础。编辑 Dockerfile，提升权限以安装必要的软件包。

```shell title='Dockerfile'
FROM apache/superset
# 切换到 root 用户安装所需软件包
USER root
RUN pip install databend-py 
RUN pip install databend-sqlalchemy
# 切换回使用 'superset' 用户
USER superset
```

2. 使用当前目录作为构建上下文，构建一个标签为 "superset-databend:v0.0.1" 的 Docker 镜像。

```shell
docker build -t superset-databend:v0.0.1 .
```

3. 使用 "superset-databend:v0.0.1" 镜像运行 Docker 容器。

```shell
docker run -d -p 8080:8088 -e "SUPERSET_SECRET_KEY=<your_secret_key>" --name superset --platform linux/x86_64 superset-databend:v0.0.1
```

</StepContent>
<StepContent number="2">

### 配置 Superset

1. 创建管理员用户。

```shell
docker exec -it superset superset fab create-admin \
           --username admin \
           --firstname Superset \
           --lastname Admin \
           --email admin@superset.com \
           --password admin
```

2. 应用必要的数据库迁移，确保 Superset 数据库架构是最新的。

```shell
docker exec -it superset superset db upgrade
```

3. 初始化 Superset。

```shell
docker exec -it superset superset init
```

</StepContent>
<StepContent number="3">


### 连接 Databend Cloud

1. 访问 [http://localhost:8080/login/]( http://localhost:8080/login/)，使用用户名 `admin` 和密码 `admin` 登录。

2. 选择 **Settings** > **Data** > **Connect Database** 打开连接向导。

![Alt text](/img/integration/superset-connect-db.png)

3. 从支持的数据库列表中选择 `Other`。

![Alt text](/img/integration/superset-select-other.png)

4. 在 **BASIC** 选项卡中，设置显示名称（例如 `Databend`），然后输入连接 Databend Cloud 的 URI。URI 格式为：`databend://<host>`，其中 `<host>` 对应您计算集群连接信息中的 host 字段。有关如何获取连接详情的说明，请参阅 [连接到计算集群](/guides/cloud/resources/warehouses#connecting-to-a-warehouse)。

![Alt text](/img/integration/superset-uri.png)

5. 点击 **TEST CONNECTION**，应弹出提示消息 "Connection looks good!"。

</StepContent>
</StepsWrap>