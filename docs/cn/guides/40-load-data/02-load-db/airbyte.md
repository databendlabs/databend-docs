---
title: Airbyte
---

<p align="center">
<img alt="Airbyte" src="/img/integration/integration-airbyte.png"/>
</p>

## 什么是 [Airbyte](https://airbyte.com/)？

- Airbyte 是一个开源的数据集成平台，可将数据从应用程序、API 和数据库同步到数据仓库、数据湖和数据库。
- 你可以将数据从任何 Airbyte 源加载到 Databend。

目前，我们实现了一个实验性的 Airbyte destination（目标连接器），允许你将数据从 Airbyte 源发送到 Databend。

**注意**：

目前我们只实现了 `append` 模式，这意味着 destination 只会向表中追加数据，而不会覆盖、更新或删除任何数据。
此外，我们假设你的 Databend destination 是 **S3 Compatible（与 S3 兼容）** 的，因为我们使用 presign（预签名）将数据从 Databend stage（暂存区）复制到表中。

要检查你的后端是否支持此集成，可以简单地运行以下命令：

```sql
CREATE STAGE IF NOT EXISTS airbyte_stage FILE_FORMAT = (TYPE = CSV);
PRESIGN UPLOAD @airbyte_stage/test.csv;
```

如果你收到类似 `Code: 501, Text = Presign is not supported` 的错误，则表示你无法使用此集成。
请阅读[此文档](../../20-self-hosted/02-deployment/01-non-production/00-deploying-local.md)了解如何使用 S3 作为存储后端。

## 创建 Databend 用户

使用 MySQL 客户端连接到 Databend 服务器：

```shell
mysql -h127.0.0.1 -uroot -P3307
```

创建用户：

```sql
CREATE ROLE airbyte_role;
CREATE USER user1 IDENTIFIED BY 'abc123' WITH DEFAULT_ROLE = 'airbyte_role';
```

创建数据库：

```sql
CREATE DATABASE airbyte;
```

为角色授予权限并授予给用户：

```sql
GRANT ALL PRIVILEGES ON airbyte.* TO ROLE airbyte_role;
GRANT ROLE airbyte_role TO user1;
```

## 配置 Airbyte

要将 Databend 与 Airbyte 结合使用，你需要将我们的自定义连接器添加到你的 Airbyte 实例中。
你可以在 Settings -> Destinations -> Custom Destinations -> Add a Custom Destination 页面中添加 destination。
我们的自定义 destination 镜像为 `datafuselabs/destination-databend:alpha`

<p align="center">
<img alt="配置 Airbyte" src="/img/integration/integration-airbyte-plugins.png"/>
</p>

## 设置 Databend destination

**注意**：

你需要有一个正在运行的 Databend 实例，并且可以从你的 Airbyte 实例访问它。
对于本地 Airbyte，你无法将 Docker Compose 与 localhost 网络连接。
你可以参考 [ngrok](https://ngrok.com/) 来为你的服务建立隧道（**切勿**在生产环境中暴露它）。

<p align="center">
<img alt="设置 Databend destination" src="/img/integration/integration-airbyte-destinations.png"/>
</p>

## 测试集成

你可以使用 Faker 源来测试集成。同步完成后，可以运行以下命令查看预期的上传数据。

```sql
select * from default._airbyte_raw_users limit 5;
```
