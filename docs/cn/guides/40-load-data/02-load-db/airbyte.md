---
title: Airbyte
---

<p align="center">
<img src="/img/integration/integration-airbyte.png"/>
</p>

## 什么是 [Airbyte](https://airbyte.com/)?

* Airbyte 是一个开源数据集成平台，能够将应用程序、API 和数据库中的数据同步到数据仓库、数据湖和数据库中。
* 您可以将任何 Airbyte 源的数据加载到 Databend。

目前我们实现了一个实验性的 Airbyte 目标连接器，允许您将 Airbyte 源数据发送到 Databend。

**注意**： 

当前我们仅实现了 `append` 模式，这意味着目标连接器只会向表中追加数据，而不会覆盖、更新或删除任何现有数据。
此外，我们假设您的 Databend 目标存储是 **S3 兼容** 的，因为我们使用了预签名 URL 来将数据从 Databend stage 复制到表中。

要检查您的后端是否支持此集成，可以运行以下命令：

```sql
CREATE STAGE IF NOT EXISTS airbyte_stage FILE_FORMAT = (TYPE = CSV);
PRESIGN UPLOAD @airbyte_stage/test.csv;
```

如果出现类似 `Code: 501, Text = Presign is not supported` 的错误，则表示您无法使用此集成。
请阅读 [本文](../../10-deploy/01-deploy/01-non-production/00-deploying-local.md) 了解如何使用 S3 作为存储后端。

## 创建 Databend 用户

使用 MySQL 客户端连接 Databend 服务器：
```shell
mysql -h127.0.0.1 -uroot33073307 
```

创建用户：
```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
```

创建数据库：
```sql
CREATE DATABASE airbyte;
```

为用户授予权限：
```sql
GRANT ALL PRIVILEGES ON airbyte.* TO user1;
```

## 配置 Airbyte

要在 Airbyte 中使用 Databend，您需要将我们定制的连接器添加到您的 Airbyte 实例中。
您可以在 Settings -> Destinations -> Custom Destinations -> Add a Custom Destination 页面添加目标连接器。
我们的自定义目标连接器镜像为 `datafuselabs/destination-databend:alpha`
<p align="center">
<img src="/img/integration/integration-airbyte-plugins.png"/>
</p>

## 设置 Databend 目标连接器
**注意**： 

您需要有一个正在运行且可从 Airbyte 实例访问的 Databend 实例。
对于本地 Airbyte 实例，您无法通过 docker compose 连接到 localhost 网络。
您可以参考 [ngrok](https://ngrok.com/) 来建立服务隧道（**切勿**在生产环境中暴露此服务）。

<p align="center">
<img src="/img/integration/integration-airbyte-destinations.png"/>
</p>

## 测试集成
您可以使用 Faker 源来测试集成，同步完成后，可以运行以下命令查看预期的上传数据。

```sql
select * from default._airbyte_raw_users limit 5;
```