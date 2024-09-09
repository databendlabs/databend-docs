---
title: Flink CDC
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.1.70"/>

[Apache Flink](https://github.com/apache/flink) CDC (Change Data Capture) 指的是 Apache Flink 通过基于 SQL 的查询捕获和处理来自各种来源的实时数据变化的能力。CDC 允许您监控和捕获数据库或流系统中发生的数据修改（插入、更新和删除），并实时响应这些变化。您可以利用 [Flink SQL connector for Databend](https://github.com/databendcloud/flink-connector-databend) 将其他数据库中的数据实时加载到 Databend 中。Flink SQL connector for Databend 提供了一个连接器，将 Flink 的流处理能力与 Databend 集成在一起。通过配置此连接器，您可以将来自各种数据库的数据变化捕获为流，并将其加载到 Databend 中进行实时处理和分析。

## 下载与安装连接器

要下载和安装 Flink SQL connector for Databend，请按照以下步骤操作：

1. 下载并设置 Flink：在安装 Flink SQL connector for Databend 之前，请确保您已经在系统上下载并设置了 Flink。您可以从官方网站下载 Flink：https://flink.apache.org/downloads/

2. 下载连接器：访问 Flink SQL connector for Databend 在 GitHub 上的发布页面：[https://github.com/databendcloud/flink-connector-databend/releases](https://github.com/databendcloud/flink-connector-databend/releases)。下载最新版本的连接器（例如，flink-connector-databend-0.0.2.jar）。

   请注意，您也可以从源代码编译 Flink SQL connector for Databend：

   ```shell
   git clone https://github.com/databendcloud/flink-connector-databend
   cd flink-connector-databend
   mvn clean install -DskipTests
   ```

3. 移动 JAR 文件：下载连接器后，将 JAR 文件移动到 Flink 安装目录中的 lib 文件夹。例如，如果您安装了 Flink 1.16.0 版本，请将 JAR 文件移动到 flink-1.16.0/lib/ 目录。

## 教程：从 MySQL 实时加载数据

在本教程中，您将使用 Flink SQL connector for Databend 设置从 MySQL 到 Databend 的实时数据加载。在开始之前，请确保您已经在环境中成功设置了 Databend 和 MySQL。

1. 在 MySQL 中创建一个表并填充示例数据。然后，在 Databend 中创建相应的目标表。

```sql title='在 MySQL 中:'
CREATE DATABASE mydb;
USE mydb;

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

```sql title='在 Databend 中:'
CREATE TABLE products (id INT NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(512) );
```

2. 下载 [Flink](https://flink.apache.org/downloads/) 和以下 SQL 连接器到您的系统：
   - Flink SQL connector for Databend: [https://github.com/databendcloud/flink-connector-databend/releases](https://github.com/databendcloud/flink-connector-databend/releases)
   - Flink SQL connector for MySQL: [https://repo1.maven.org/maven2/com/ververica/flink-sql-connector-mysql-cdc/2.3.0/flink-sql-connector-mysql-cdc-2.3.0.jar](https://repo1.maven.org/maven2/com/ververica/flink-sql-connector-mysql-cdc/2.3.0/flink-sql-connector-mysql-cdc-2.3.0.jar)
3. 将两个连接器 JAR 文件移动到 Flink 安装目录中的 _lib_ 文件夹。
4. 启动 Flink：

```shell
cd flink-16.0
./bin/start-cluster.sh
```

如果您在浏览器中访问 [http://localhost:8081](http://localhost:8081)，现在可以打开 Apache Flink 仪表板：

![Alt text](/img/load/cdc-dashboard.png)

5. 启动 Flink SQL 客户端：

```shell
./bin/sql-client.sh

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

6. 将检查点间隔设置为 3 秒，并在 Flink SQL 客户端中使用 MySQL 和 Databend 连接器创建相应的表。有关可用的连接参数，请参见 [https://github.com/databendcloud/flink-connector-databend#connector-options](https://github.com/databendcloud/flink-connector-databend#connector-options)：

```sql
Flink SQL> SET execution.checkpointing.interval = 3s;
[INFO] Session property has been set.

Flink SQL> CREATE TABLE mysql_products (id INT,name STRING,description STRING,PRIMARY KEY (id) NOT ENFORCED)
WITH ('connector' = 'mysql-cdc',
'hostname' = 'localhost',
'port' = '3306',
'username' = 'root',
'password' = '123456',
'database-name' = 'mydb',
'table-name' = 'products',
'server-time-zone' = 'UTC'
);
[INFO] Execute statement succeed.

Flink SQL> CREATE TABLE databend_products (id INT,name String,description String, PRIMARY KEY (`id`) NOT ENFORCED)
WITH ('connector' = 'databend',
'url'='databend://localhost:8000',
'username'='databend',
'password'='databend',
'database-name'='default',
'table-name'='products',
'sink.batch-size' = '5',
'sink.flush-interval' = '1000',
'sink.ignore-delete' = 'false',
'sink.max-retries' = '3');
[INFO] Execute statement succeed.
```

7. 在 Flink SQL 客户端中，将数据从 _mysql_products_ 表同步到 _databend_products_ 表：

```sql
Flink SQL> INSERT INTO databend_products SELECT * FROM mysql_products;
[INFO] Submitting SQL update statement to the cluster...
[INFO] SQL update statement has been successfully submitted to the cluster:
Job ID: b14645f34937c7cf3672ffba35733734
```

现在，您可以在 Apache Flink 仪表板中看到一个正在运行的作业：

![Alt text](/img/load/cdc-job.png)

您已经准备就绪！如果您查询 Databend 中的 _products_ 表，您将看到 MySQL 中的数据已成功同步。您可以自由地在 MySQL 中执行插入、更新或删除操作，您将观察到相应的更改也会反映在 Databend 中。