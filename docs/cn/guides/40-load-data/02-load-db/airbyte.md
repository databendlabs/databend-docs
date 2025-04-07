```md
---
title: Airbyte
---

<p align="center">
<img src="/img/integration/integration-airbyte.png"/>
</p>

## What is [Airbyte](https://airbyte.com/)?


* Airbyte 是一个开源数据集成平台，可以将应用程序、API 和数据库中的数据同步到数仓、数据湖和数据库。
* 您可以将任何 airbyte 源中的数据加载到 Databend。

目前，我们实现了一个实验性的 airbyte destination，允许您将数据从 airbyte 源发送到 databend

**注意**: 

目前我们只实现了 `append` 模式，这意味着 destination 只会将数据追加到表中，而不会覆盖、更新或删除任何数据。
此外，我们假设您的 databend destination 是 **S3 Compatible**，因为我们使用 presign 将数据从 databend Stage 复制到表。

要检查您的后端是否支持集成，您可以简单地运行以下命令

```sql
CREATE STAGE IF NOT EXISTS airbyte_stage FILE_FORMAT = (TYPE = CSV);
PRESIGN UPLOAD @airbyte_stage/test.csv;
```

如果您收到类似 `Code: 501, Text = Presign is not supported` 的错误，则您无法使用此集成。
请阅读 [this](../../10-deploy/01-deploy/01-non-production/00-deploying-local.md) 了解如何使用 S3 作为存储后端。

## 创建 Databend 用户

使用 MySQL 客户端连接到 Databend 服务器：
```shell
mysql -h127.0.0.1 -uroot -P3307 
```

创建用户：
```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
```

创建数据库：
```sql
CREATE DATABASE airbyte;
```

授予用户权限：
```sql
GRANT ALL PRIVILEGES ON airbyte.* TO user1;
```

## 配置 Airbyte

要将 Databend 与 Airbyte 结合使用，您应该将我们自定义的连接器添加到您的 Airbyte 实例。
您可以在 Settings -> Destinations -> Custom Destinations -> Add a Custom Destination 页面中添加 destination。
我们的自定义 destination 镜像为 `datafuselabs/destination-databend:alpha`
<p align="center">
<img src="/img/integration/integration-airbyte-plugins.png"/>
</p>

## 设置 Databend destination
**注意**: 

您应该有一个正在运行且可从您的 airbyte 实例访问的 databend 实例。
对于本地 airbyte，您无法将 docker compose 与您的 localhost 网络连接。
您可以查看 [ngrok](https://ngrok.com/) 以隧道传输您的服务（**切勿**在您的生产环境中公开它）。

<p align="center">
<img src="/img/integration/integration-airbyte-destinations.png"/>
</p>

## 测试您的集成
您可以使用 Faker 源来测试您的集成，同步完成后，您可以运行以下命令来查看预期的上传数据。

```sql
select * from default._airbyte_raw_users limit 5;
```
