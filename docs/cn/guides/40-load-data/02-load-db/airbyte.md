---
title: Airbyte
---

<p align="center">
<img src="/img/integration/integration-airbyte.png"/>
</p>

## 什么是 [Airbyte](https://airbyte.com/)？

*   Airbyte 是一个开源的数据集成平台，可将数据从应用程序、API 和数据库同步到数据仓库（Data Warehouse）、数据湖和数据库。
*   你可以将数据从任何 Airbyte 源加载到 Databend。

目前，我们实现了一个实验性的 Airbyte 目标端（Destination），允许你将数据从 Airbyte 源发送到 Databend。

**注意**：

目前我们只实现了 `append` 模式，这意味着目标端只会将数据追加到表中，不会覆盖、更新或删除任何数据。
此外，我们假设你的 Databend 存储后端与 **S3 兼容**，因为我们使用预签名（Presign）将数据从 Databend 暂存区（Stage）复制到表中。

要检查你的后端是否支持此集成，可以运行以下命令：

```sql
CREATE STAGE IF NOT EXISTS airbyte_stage FILE_FORMAT = (TYPE = CSV);
PRESIGN UPLOAD @airbyte_stage/test.csv;
```

如果收到类似 `Code: 501, Text = Presign is not supported` 的错误，则无法使用此集成。
请阅读[此文档](../../10-deploy/01-deploy/01-non-production/00-deploying-local.md)了解如何使用 S3 作为存储后端。

## 创建 Databend 用户

使用 MySQL 客户端连接 Databend 服务器：
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

为用户授予权限：
```sql
GRANT ALL PRIVILEGES ON airbyte.* TO user1;
```

## 配置 Airbyte

要将 Databend 与 Airbyte 结合使用，需将自定义连接器添加到 Airbyte 实例。
可在 Settings -> Destinations -> Custom Destinations -> Add a Custom Destination 页面添加目标端。
自定义目标端镜像是 `datafuselabs/destination-databend:alpha`
<p align="center">
<img src="/img/integration/integration-airbyte-plugins.png"/>
</p>

## 设置 Databend 目标端
**注意**：

需确保存在可访问的 Databend 运行实例。
对于本地运行的 Airbyte，Docker Compose 网络默认无法与本地主机（localhost）网络通信。
可考虑使用 [ngrok](https://ngrok.com/) 建立服务隧道（**切勿**在生产环境暴露）。

<p align="center">
<img src="/img/integration/integration-airbyte-destinations.png"/>
</p>

## 测试集成
可使用 Faker 源测试集成。同步完成后，运行以下命令查看预期上传数据：

```sql
select * from default._airbyte_raw_users limit 5;
```