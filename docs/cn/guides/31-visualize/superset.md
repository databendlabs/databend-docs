---
title: Superset
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

[Superset](https://superset.apache.org/) 是一个快速、轻量、直观且功能丰富的工具，使得各种技能水平的用户都能轻松地探索和可视化他们的数据，从简单的折线图到高度详细的地理空间图表。

Databend 通过两个 Python 库与 Superset 集成：[databend-py](https://github.com/databendcloud/databend-py) 和 [databend-sqlalchemy](https://github.com/databendcloud/databend-sqlalchemy)。为了实现这一集成，您需要基于官方的 Superset Docker 镜像构建一个自定义的 Docker 镜像，并集成这两个库。`databend-py` 作为 Databend 的 Python 客户端库，允许 Superset 通过其 API 与 Databend 服务器通信、执行查询和检索结果。同时，`databend-sqlalchemy` 作为 Databend 的 SQLAlchemy 适配器，使得 Superset 能够使用 SQLAlchemy 框架与 Databend 集成。它促进了由 Superset 生成的 SQL 查询转换为 Databend 通过 SQLAlchemy 接口能够理解的格式。

## 教程：与 Superset 集成

本教程指导您完成将 Databend Cloud 与 Superset 集成的过程。

<StepsWrap>
<StepContent number="1" title="构建 Superset 镜像">

这些步骤涉及创建一个集成了 Databend 的自定义 Superset Docker 镜像：

1. 以官方 Superset Docker 镜像为基础开始。编辑 Dockerfile，权限提升以安装必要的包。

```shell title='Dockerfile'
FROM apache/superset
# 切换到 root 用户以安装所需的包
USER root
RUN pip install databend-py 
RUN pip install databend-sqlalchemy
# 切换回 `superset` 用户
USER superset
```

2. 使用当前目录作为构建上下文，构建标签为 "superset-databend:v0.0.1" 的 Docker 镜像。

```shell
docker build -t superset-databend:v0.0.1 .
```

3. 使用 "superset-databend:v0.0.1" 镜像运行一个 Docker 容器。

```shell
docker run -d -p 8080:8088 -e "SUPERSET_SECRET_KEY=<your_secret_key>" --name superset --platform linux/x86_64 superset-databend:v0.0.1
```

</StepContent>
<StepContent number="2" title="设置 Superset">

1. 创建一个管理员用户。

```shell
docker exec -it superset superset fab create-admin \
           --username admin \
           --firstname Superset \
           --lastname Admin \
           --email admin@superset.com \
           --password admin
```

2. 应用任何必要的数据库迁移，以确保 Superset 数据库架构是最新的。

```shell
docker exec -it superset superset db upgrade
```

3. 初始化 Superset。

```shell
docker exec -it superset superset init
```

</StepContent>
<StepContent number="3" title="连接到 Databend Cloud">

1. 导航到 [http://localhost:8080/login/]( http://localhost:8080/login/) 并使用 `admin/admin` 作为用户名和密码登录。

2. 选择 **设置** > **数据** > **连接数据库** 打开连接向导。

![Alt text](/img/integration/superset-connect-db.png)

3. 从支持的数据库列表中选择 `其他`。

![Alt text](/img/integration/superset-select-other.png)

4. 在 **基础** 标签页上，设置一个显示名称，例如 `Databend`，然后输入连接到 Databend Cloud 的 URI。URI 遵循格式：`databend://<host>`，其中 `<host>` 对应于您仓库连接信息中的 host 字段。有关如何获取连接详细信息，请参考 [连接到仓库](/guides/cloud/using-databend-cloud/warehouses#connecting-to-a-warehouse)。

![Alt text](/img/integration/superset-uri.png)

5. 点击 **测试连接**，应该会弹出一个消息框，显示 "连接看起来不错！"。

</StepContent>
</StepsWrap>