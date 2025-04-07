---
title: DBeaver
---

[DBeaver](https://dbeaver.com/) 支持使用内置驱动连接到 Databend，该驱动归类于 **Analytical** 下，从 **version 24.3.1** 开始可用。

![](@site/static/img/connect/dbeaver.png)

## 用户身份验证

如果您连接到私有化部署的 Databend 实例，您可以使用 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中指定的管理员用户，或者您可以使用使用 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 命令创建的 SQL 用户进行连接。

对于与 Databend Cloud 的连接，您可以使用默认的 `cloudapp` 用户或使用 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 命令创建的 SQL 用户。请注意，您用于登录 [Databend Cloud 控制台](https://app.databend.com/) 的用户帐户不能用于连接到 Databend Cloud。

## 教程

- [使用 DBeaver 连接到 Databend](/tutorials/connect/connect-to-databend-dbeaver)
- [使用 DBeaver 连接到 Databend Cloud](/tutorials/connect/connect-to-databendcloud-dbeaver)