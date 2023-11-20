---
title: Flink CDC
---

[Apache Flink](https://github.com/apache/flink) CDC (更改数据捕获) 是指 Apache Flink 使用基于 SQL 的查询获取和处理来自各种来源的实时数据变化的能力。CDC 允许您监视和捕获数据修改 (插入、更新、更新) 在数据库或流媒体系统中发生，并对这些变化作出实时反应。您可以使用 [Flink SQL 连接器为 Databend](https://github.com/databendcloud/flink-connector-databend) 实时将其他数据库的数据加载到 Databend。Databend 的 Flink SQL 连接器提供一个连接器，与 Databend 集成 Flink 的流处理能力。通过配置此连接器，您可以实时捕获来自不同数据库的数据更改作为流，并将其加载到数据端以供处理和分析。

## 下载 & 安装连接器

要下载并安装 Flink SQL 连接器数据包，请遵循以下步骤：

1. 下载并设置 Flink: 在安装 Flink SQL 数据连接器之前，请确保您已经下载并在您的系统上设置 Flink。您可以从官方网站下载链接：https://flink.apache.org/downloads/

2. 下载连接器：访问 Flink SQL 连接器的 GitHub: https://github.com/databbendcloud/flink-connector-databend/releases. 下载最新版本的连接器 (例如，flink-connector-databend-0.0.2.jar)。

    请注意，您也可以从源代码编译 Flink SQL 连接器：

    ```shell
    git clone https://github.com/databendcloud/flink-connector-databend
    cd flink-connector-databend
    mvn clean install -DskipTests
    ```

3. 移动 JAR 文件：一旦您下载了连接器，请将 JAR 文件移动到您的 Flink 安装目录中的 lib 文件夹。例如，如果您安装了 Flink 版本 1.16.0，请将 JAR 文件移动到 flink-1.16.0/lib/directory.

## 教程：从 MySQL 载入实时数据

在本教程中，您将使用 Flink SQL 连接器设置一个从 MySQL 到 Databend 的实时数据加载。在您开始之前，请确保您已经成功地在您的环境中设置 Databend 和 MySQL。

1. 在 MySQL 中创建一个表，并用样本数据填充它。然后，在 Databend 中创建相应的目标表。

```sql title='In MySQL:'
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

```sql title='In Databend:'
CREATE TABLE products (id INT NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(512) );
```

2. 下载 [Flink](https://flink.apache.org/downloads/) 和下面的 SQL 连接器到您的系统：
    - Flink SQL connector for Databend: https://github.com/databendcloud/flink-connector-databend/releases
    - MySQL 的 SQL 连接器：https://repo1.maven.org/maven2/com/verica/flink-sql-connector-mysql-cdc/2.3.0/flink-sql-connector-mysql-cdc-2.3.0.jar
3. 移动两个连接器 JAR 文件到您的 Flink 安装目录中的 *lib* 文件夹。
4. 开始 Flink：

```shell
cd flink-16.0
./bin/start-cluster.sh
```

您现在可以打开 Apache Flink 仪表盘，如果您在浏览器中访问 http://localhost:8081：

![备用文本](/img/load/cdc-dashboard.png)

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

6. 设置校验时间为 3 秒，并在 Flink SQL 客户端中使用 MySQL 和 Databend 连接器创建相应的表。关于可用的连接参数，见 https://github.com/dabendcloud/flink-connector-databend#connector-options:

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

7. 在 Flink SQL 客户端中，将从 *mysql_products* 表中的数据同步到 *databend_products* 表：

```sql
Flink SQL> INSERT INTO databend_products SELECT * FROM mysql_products;
[INFO] Submitting SQL update statement to the cluster...
[INFO] SQL update statement has been successfully submitted to the cluster:
Job ID: b14645f34937c7cf3672ffba35733734
```
您现在可以在 Apache Flink 仪表盘中看到一个运行中的作业：

![备用文本](/img/load/cdc-job.png)

你都已设置了！如果您在 Databend 中查询 *产品* 表，您将看到 MySQL 的数据已成功同步。请随时在 MySQL 中执行插入、更新或删除，您也将观察相应的 Databend 中反映的更改。