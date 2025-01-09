---
title: DBeaver
---

[DBeaver](https://dbeaver.com/) supports connecting to Databend using a built-in driver categorized under **Analytical**, available starting from **version 24.3.1**.

![](@site/static/img/connect/dbeaver.png)

## User Authentication

If you are connecting to a self-hosted Databend instance, you can use the admin users specified in the [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) configuration file, or you can connect using an SQL user created with the [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) command.

For connections to Databend Cloud, you can use the default `cloudapp` user or an SQL user created with the [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) command. Please note that the user account you use to log in to the [Databend Cloud console](https://app.databend.com/) cannot be used for connecting to Databend Cloud.

## Tutorials

- [Connecting to Databend using DBeaver](/tutorials/connect/connect-to-databend-dbeaver)
- [Connecting to Databend Cloud using DBeaver](/tutorials/connect/connect-to-databendcloud-dbeaver)
