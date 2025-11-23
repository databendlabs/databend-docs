---
title: 使用 Flink CDC 迁移 MySQL
sidebar_label: 'Flink CDC'
---

> **功能**: CDC, 全量导入, 转换

在本教程中，我们将引导您完成使用 Apache Flink CDC 从 MySQL 迁移到 Databend Cloud 的过程。

## 开始之前

在开始之前，请确保您已准备好以下先决条件：

- 您的本地机器上已安装 [Docker](https://www.docker.com/)，因为它将用于启动 MySQL。
- 您的本地机器上已安装 Java 8 或 11，这是 [Flink Databend Connector](https://github.com/databendcloud/flink-connector-databend) 所必需的。
- 您的本地机器上已安装 BendSQL。有关如何使用各种包管理器安装 BendSQL 的说明，请参阅 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。

## 步骤 1：在 Docker 中启动 MySQL

1. 创建一个名为 **mysql.cnf** 的配置文件，内容如下，并将此文件保存在将映射到 MySQL 容器的本地目录中，例如 `/Users/eric/Downloads/mysql.cnf`：

```cnf
[mysqld]
# Basic settings
server-id=1
log-bin=mysql-bin
binlog_format=ROW
binlog_row_image=FULL
expire_logs_days=3

# Character set settings
character_set_server=utf8mb4
collation-server=utf8mb4_unicode_ci

# Authentication settings
default-authentication-plugin=mysql_native_password
```

2. 在您的本地机器上启动一个 MySQL 容器。以下命令启动一个名为 **mysql-server** 的 MySQL 容器，创建一个名为 **mydb** 的数据库，并将 root 密码设置为 `root`：

```bash
docker run \
  --platform linux/amd64 \
  --name mysql-server \
  -v /Users/eric/Downloads/mysql.cnf:/etc/mysql/conf.d/custom.cnf \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=mydb \
  -e MYSQL_ROOT_HOST=% \
  -p 3306:3306 \
  -d mysql:5.7
```

3. 验证 MySQL 是否正在运行：

```bash
docker ps
```

检查输出中是否有名为 **mysql-server** 的容器：

```bash
CONTAINER ID   IMAGE       COMMAND                  CREATED        STATUS        PORTS                               NAMES
aac4c28be56e   mysql:5.7   "docker-entrypoint.s…"   17 hours ago   Up 17 hours   0.0.0.0:3306->3306/tcp, 33060/tcp   mysql-server
```

## 步骤 2：使用示例数据填充 MySQL

1. 登录到 MySQL 容器，并在出现提示时输入密码 `root`：

```bash
docker exec -it mysql-server mysql -u root -p
```

```
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 71
Server version: 5.7.44-log MySQL Community Server (GPL)

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
```

2. 切换到 **mydb** 数据库：

```bash
mysql> USE mydb;
Database changed
```

3. 复制并粘贴以下 SQL 以创建一个名为 **products** 的表并插入数据：

```sql
CREATE TABLE products (id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255) NOT NULL,description VARCHAR(512));

ALTER TABLE products AUTO_INCREMENT = 10;

INSERT INTO products VALUES (default,"scooter","Small 2-wheel scooter"),
(default,"car battery","12V car battery"),
(default,"12-pack drill bits","12-pack of drill bits with sizes ranging from #40 to #3"),
(default,"hammer","12oz carpenter's hammer"),
(default,"hammer","14oz carpenter's hammer"),
(default,"hammer","16oz carpenter's hammer"),
(default,"rocks","box of assorted rocks"),
(default,"jacket","black wind breaker"),
(default,"cloud","test for databend"),
(default,"spare tire","24 inch spare tire");
```

4. 验证数据：

```bash
mysql> select * from products;
+----+--------------------+---------------------------------------------------------+
| id | name               | description                                             |
+----+--------------------+---------------------------------------------------------+
| 10 | scooter            | Small 2-wheel scooter                                   |
| 11 | car battery        | 12V car battery                                         |
| 12 | 12-pack drill bits | 12-pack of drill bits with sizes ranging from #40 to #3 |
| 13 | hammer             | 12oz carpenter's hammer                                 |
| 14 | hammer             | 14oz carpenter's hammer                                 |
| 15 | hammer             | 16oz carpenter's hammer                                 |
| 16 | rocks              | box of assorted rocks                                   |
| 17 | jacket             | black wind breaker                                      |
| 18 | cloud              | test for databend                                       |
| 19 | spare tire         | 24 inch spare tire                                      |
+----+--------------------+---------------------------------------------------------+
10 rows in set (0.01 sec)
```

## 步骤 3：在 Databend Cloud 中设置目标

1. 使用 BendSQL 连接到 Databend Cloud。如果您不熟悉 BendSQL，请参阅本教程：[使用 BendSQL 连接到 Databend Cloud](../connect/connect-to-databendcloud-bendsql.md)。

2. 复制并粘贴以下 SQL 以创建一个名为 **products** 的目标表：

```sql
CREATE    TABLE products (
          id INT NOT NULL,
          name VARCHAR(255) NOT NULL,
          description VARCHAR(512)
          );
```

## 步骤 4：安装 Flink CDC

1. 下载并解压 Flink 1.17.1：

```bash
curl -O https://archive.apache.org/dist/flink/flink-1.17.1/flink-1.17.1-bin-scala_2.12.tgz
tar -xvzf flink-1.17.1-bin-scala_2.12.tgz
cd flink-1.17.1
```

2. 将 Databend 和 MySQL 连接器下载到 **lib** 文件夹中：

```bash
curl -Lo lib/flink-connector-databend.jar https://github.com/databendcloud/flink-connector-databend/releases/latest/download/flink-connector-databend.jar

curl -Lo lib/flink-sql-connector-mysql-cdc-2.4.1.jar https://repo1.maven.org/maven2/com/ververica/flink-sql-connector-mysql-cdc/2.4.1/flink-sql-connector-mysql-cdc-2.4.1.jar
```

3. 打开 `flink-1.17.1/conf/` 下的 **flink-conf.yaml** 文件，将 `taskmanager.memory.process.size` 更新为 `4096m`，然后保存文件。

```yaml
taskmanager.memory.process.size: 4096m
```

4. 启动一个 Flink 集群：

```shell
./bin/start-cluster.sh
```

现在，如果您在浏览器中访问 [http://localhost:8081](http://localhost:8081)，则可以打开 Apache Flink 仪表板：

![Alt text](/img/load/cdc-dashboard.png)

## 步骤 5：开始迁移

1. 启动 Flink SQL Client：

```bash
./bin/sql-client.sh
```

您将看到 Flink SQL Client 启动横幅，确认客户端已成功启动。

```bash
```

                                   ▒▓██▓██▒
                               ▓████▒▒█▓▒▓███▓▒
                            ▓███▓░░        ▒▒▒▓██▒  ▒
                          ░██▒   ▒▒▓▓█▓▓▒░      ▒████
                          ██▒         ░▒▓███▒    ▒█▒█▒
                            ░▓█            ███   ▓░▒██
                              ▓█       ▒▒▒▒▒▓██▓░▒░▓▓█
                            █░ █   ▒▒░       ███▓▓█ ▒█▒▒▒
                            ████░   ▒▓█▓      ██▒▒▒ ▓███▒
                         ░▒█▓▓██       ▓█▒    ▓█▒▓██▓ ░█░
                   ▓░▒▓████▒ ██         ▒█    █▓░▒█▒░▒█▒
                  ███▓░██▓  ▓█           █   █▓ ▒▓█▓▓█▒
                ░██▓  ░█░            █  █▒ ▒█████▓▒ ██▓░▒
               ███░ ░ █░          ▓ ░█ █████▒░░    ░█░▓  ▓░
              ██▓█ ▒▒▓▒          ▓███████▓░       ▒█▒ ▒▓ ▓██▓
           ▒██▓ ▓█ █▓█       ░▒█████▓▓▒░         ██▒▒  █ ▒  ▓█▒
           ▓█▓  ▓█ ██▓ ░▓▓▓▓▓▓▓▒              ▒██▓           ░█▒
           ▓█    █ ▓███▓▒░              ░▓▓▓███▓          ░▒░ ▓█
           ██▓    ██▒    ░▒▓▓███▓▓▓▓▓██████▓▒            ▓███  █
          ▓███▒ ███   ░▓▓▒░░   ░▓████▓░                  ░▒▓▒  █▓
          █▓▒▒▓▓██  ░▒▒░░░▒▒▒▒▓██▓░                            █▓
          ██ ▓░▒█   ▓▓▓▓▒░░  ▒█▓       ▒▓▓██▓    ▓▒          ▒▒▓
          ▓█▓ ▓▒█  █▓░  ░▒▓▓██▒            ░▓█▒   ▒▒▒░▒▒▓█████▒
          ██░ ▓█▒█▒  ▒▓▓▒  ▓█                █░      ░░░░   ░█▒
           ▓█   ▒█▓   ░     █░                ▒█              █▓
            █▓   ██         █░                 ▓▓        ▒█▓▓▓▒█░
             █▓ ░▓██░       ▓▒                  ▓█▓▒░░░▒▓█░    ▒█
              ██   ▓█▓░      ▒                    ░▒█▒██▒      ▓▓
               ▓█▒   ▒█▓▒░                         ▒▒ █▒█▓▒▒░░▒██
                ░██▒    ▒▓▓▒                     ▓██▓▒█▒ ░▓▓▓▓▒█▓
                  ░▓██▒                          ▓░  ▒█▓█  ░░▒▒▒
                      ▒▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░▓▓  ▓░▒█░

    ______ _ _       _       _____  ____  _         _____ _ _            _  BETA
   |  ____| (_)     | |     / ____|/ __ \| |       / ____| (_)          | |
   | |__  | |_ _ __ | | __ | (___ | |  | | |      | |    | |_  ___ _ __ | |_
   |  __| | | | '_ \| |/ /  \___ \| |  | | |      | |    | | |/ _ \ '_ \| __|
   | |    | | | | | |   <   ____) | |__| | |____  | |____| | |  __/ | | | |_
   |_|    |_|_|_| |_|_|\_\ |_____/ \___\_\______|  \_____|_|_|\___|_| |_|\__|

        Welcome! Enter 'HELP;' to list all available commands. 'QUIT;' to exit.
```

2. 将检查点间隔设置为 3 秒。

```bash
Flink SQL> SET execution.checkpointing.interval = 3s;
```

3. 在 Flink SQL Client 中使用 MySQL 和 Databend 连接器创建相应的表（将占位符替换为您的实际值）：

```sql
CREATE TABLE mysql_products (id INT,name STRING,description STRING,PRIMARY KEY (id) NOT ENFORCED)
WITH ('connector' = 'mysql-cdc',
'hostname' = '127.0.0.1',
'port' = '3306',
'username' = 'root',
'password' = 'root',
'database-name' = 'mydb',
'table-name' = 'products',
'server-time-zone' = 'UTC'
);

CREATE TABLE databend_products (id INT,name String,description String, PRIMARY KEY (`id`) NOT ENFORCED)
WITH ('connector' = 'databend',
'url'='databend://cloudapp:{password}@{host}:443/{database}?warehouse={warehouse_name}&ssl=true',
'database-name'='{database}',
'table-name'='products',
'sink.batch-size' = '1',
'sink.flush-interval' = '1000',
'sink.ignore-delete' = 'false',
'sink.max-retries' = '3');
```

4. 在 Flink SQL Client 中，将数据从 mysql_products 表同步到 databend_products 表：

```sql
Flink SQL> INSERT INTO databend_products SELECT * FROM mysql_products;
>
[INFO] Submitting SQL update statement to the cluster...
[INFO] SQL update statement has been successfully submitted to the cluster:
Job ID: 5b505d752b7c211cbdcb5566175b9182
```

现在您可以在 Apache Flink Dashboard 中看到一个正在运行的作业：

![Alt text](/img/load/cdc-job.png)

一切就绪！如果您返回到 BendSQL 终端并查询 Databend Cloud 中的 **products** 表，您将看到 MySQL 中的数据已成功同步：

```sql
SELECT * FROM products;

┌──────────────────────────────────────────────────────────────────────────────────────┐
│   id  │        name        │                       description                       │
│ Int32 │       String       │                     Nullable(String)                    │
├───────┼────────────────────┼─────────────────────────────────────────────────────────┤
│    18 │ cloud              │ test for databend                                       │
│    19 │ spare tire         │ 24 inch spare tire                                      │
│    16 │ rocks              │ box of assorted rocks                                   │
│    17 │ jacket             │ black wind breaker                                      │
│    14 │ hammer             │ 14oz carpenter's hammer                                 │
│    15 │ hammer             │ 16oz carpenter's hammer                                 │
│    12 │ 12-pack drill bits │ 12-pack of drill bits with sizes ranging from #40 to #3 │
│    13 │ hammer             │ 12oz carpenter's hammer                                 │
│    10 │ scooter            │ Small 2-wheel scooter                                   │
│    11 │ car battery        │ 12V car battery                                         │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

5. 返回到 MySQL 终端并插入一个新产品：

```sql
INSERT INTO products VALUES (default, "bicycle", "Lightweight road bicycle");
```

接下来，在 BendSQL 终端中，再次查询 **products** 表以验证新产品是否已同步：

```sql
SELECT * FROM products;
```

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│   id  │        name        │                       description                       │
│ Int32 │       String       │                     Nullable(String)                    │
├───────┼────────────────────┼─────────────────────────────────────────────────────────┤
│    12 │ 12-pack drill bits │ 12-pack of drill bits with sizes ranging from #40 to #3 │
│    11 │ car battery        │ 12V car battery                                         │
│    14 │ hammer             │ 14oz carpenter's hammer                                 │
│    13 │ hammer             │ 12oz carpenter's hammer                                 │
│    10 │ scooter            │ Small 2-wheel scooter                                   │
│    20 │ bicycle            │ Lightweight road bicycle                                │
│    19 │ spare tire         │ 24 inch spare tire                                      │
│    16 │ rocks              │ box of assorted rocks                                   │
│    15 │ hammer             │ 16oz carpenter's hammer                                 │
│    18 │ cloud              │ test for databend                                       │
│    17 │ jacket             │ black wind breaker                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```