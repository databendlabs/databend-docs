---
title: Airbyte
---

<p align="center">
<img src="/img/integration/integration-airbyte.png"/>
</p>

## 什么是 [Airbyte](https://airbyte.com/)?

* Airbyte 是一个开源的数据集成平台，可以将数据从应用程序、API 和数据库同步到数仓、数据湖和数据库中。
* 您可以将任何 Airbyte 源的数据加载到 Databend 中。

目前我们实现了一个实验性的 Airbyte 目标端，允许您将数据从 Airbyte 源发送到 Databend。

**注意**: 

目前我们仅实现了 `append` 模式，这意味着目标端只会将数据追加到表中，而不会覆盖、更新或删除任何数据。
此外，我们假设您的 Databend 目标端是 **S3 兼容** 的，因为我们使用了预签名 URL 将数据从 Databend 阶段复制到表中。

要检查您的后端是否支持集成，您可以简单地运行以下命令：

```sql
CREATE STAGE IF NOT EXISTS airbyte_stage FILE_FORMAT = (TYPE = CSV);
PRESIGN UPLOAD @airbyte_stage/test.csv;
```

如果您遇到类似 `Code: 501, Text = Presign is not supported` 的错误，那么您无法使用该集成。
请阅读 [此文档](../../10-deploy/01-deploy/01-non-production/00-deploying-local.md) 了解如何使用 S3 作为存储后端。

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

要使用 Databend 与 Airbyte，您应该将我们自定义的连接器添加到您的 Airbyte 实例中。
您可以在设置 -> 目标端 -> 自定义目标端 -> 添加自定义目标端页面中添加目标端。
我们的自定义目标端镜像是 `datafuselabs/destination-databend:alpha`
<p align="center">
<img src="/img/integration/integration-airbyte-plugins.png"/>
</p>

## 设置 Databend 目标端
**注意**: 

您应该有一个正在运行且可从您的 Airbyte 实例访问的 Databend 实例。
对于本地的 Airbyte，您无法将 Docker Compose 与您的本地网络连接。
您可以查看 [ngrok](https://ngrok.com/) 来隧道化您的服务（**切勿** 在生产环境中暴露它）。

<p align="center">
<img src="/img/integration/integration-airbyte-destinations.png"/>
</p>

## 测试您的集成
您可以使用 Faker 源来测试您的集成，同步完成后，您可以运行以下命令查看预期的上传数据。

```sql
select * from default._airbyte_raw_users limit 5;
```