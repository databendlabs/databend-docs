---
title: Airbyte
---

<p align="center">
<img src="/img/integration/integration-airbyte.png"/>
</p>

## 什么是 [Airbyte](https://airbyte.com/)？

* Airbyte 是一个开源数据集成平台，可将应用程序、API 和数据库（Database）中的数据同步到数据仓库（Data Warehouse）、数据湖和数据库
* 您可以将任何 Airbyte 数据源的数据加载到 Databend

目前我们实现了实验性的 Airbyte 目标连接器，支持将 Airbyte 数据源的数据发送到 Databend

**注意**：

当前仅实现 `append` 模式，目标连接器只会向表追加数据，不会覆盖、更新或删除现有数据
同时，我们假设您的 Databend 目标支持 **S3 兼容**存储，因为使用预签名方式将数据从 Databend 暂存区（Stage）复制到表

要验证后端是否支持此集成，请运行以下命令：

```sql
CREATE STAGE IF NOT EXISTS airbyte_stage FILE_FORMAT = (TYPE = CSV);
PRESIGN UPLOAD @airbyte_stage/test.csv;
```

若返回类似 `Code: 501, Text = Presign is not supported` 的错误，则无法使用此集成
请阅读[此文档](../../10-deploy/01-deploy/01-non-production/00-deploying-local.md)了解如何配置 S3 存储后端

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

授予用户权限：
```sql
GRANT ALL PRIVILEGES ON airbyte.* TO user1;
```

## 配置 Airbyte

在 Airbyte 中使用 Databend 时，需将自定义连接器添加到 Airbyte 实例
通过设置 -> 目标连接器 -> 自定义目标连接器 -> 添加自定义目标连接器页面完成添加
自定义目标连接器镜像为 `datafuselabs/destination-databend:alpha`
<p align="center">
<img src="/img/integration/integration-airbyte-plugins.png"/>
</p>

## 设置 Databend 目标连接器
**注意**：

需确保存在可被 Airbyte 实例访问的 Databend 实例
本地部署的 Airbyte 无法直接连接 localhost 网络
可参考 [ngrok](https://ngrok.com/) 建立服务隧道（**切勿**在生产环境暴露服务）

<p align="center">
<img src="/img/integration/integration-airbyte-destinations.png"/>
</p>

## 测试集成
可使用 Faker 数据源测试集成，同步完成后运行以下命令查看预期上传数据：

```sql
select * from default._airbyte_raw_users limit 5;
```