---
title: Flink CDC
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本：v1.1.70"/>

[Apache Flink](https://github.com/apache/flink) CDC（变更数据捕获）指的是Apache Flink使用基于SQL的查询捕获和处理来自各种源的实时数据变化的能力。CDC允许您监控和捕获数据库或流处理系统中发生的数据修改（插入、更新和删除），并实时响应这些变化。您可以使用[Databend的Flink SQL连接器](https://github.com/databendcloud/flink-connector-databend)实时从其他数据库加载数据到Databend。Databend的Flink SQL连接器提供了一个连接器，将Flink的流处理能力与Databend集成。通过配置这个连接器，您可以将各种数据库的数据变化作为流捕获，并实时加载到Databend中进行处理和分析。

## 下载与安装连接器

要下载并安装Databend的Flink SQL连接器，请按照以下步骤操作：

1. 下载并设置Flink：在安装Databend的Flink SQL连接器之前，请确保您已经在系统上下载并设置了Flink。您可以从官方网站下载Flink：https://flink.apache.org/downloads/

2. 下载连接器：访问GitHub上Databend的Flink SQL连接器的发布页面：https://github.com/databendcloud/flink-connector-databend/releases。下载连接器的最新版本（例如，flink-connector-databend-0.0.2.jar）。

    请注意，您也可以从源代码编译Databend的Flink SQL连接器：

    ```shell
    git clone https://github.com/databendcloud/flink-connector-databend
    cd flink-connector-databend
    mvn clean install -DskipTests
    ```

3. 移动JAR文件：下载连接器后，将JAR文件移动到Flink安装目录中的lib文件夹。例如，如果您安装了Flink版本1.16.0，请将JAR文件移动到flink-1.16.0/lib/目录。

## 教程：实时从MySQL加载数据

在本教程中，您将使用Databend的Flink SQL连接器从MySQL到Databend设置实时数据加载。在开始之前，请确保您已经在环境中成功设置了Databend和MySQL。

1. 在MySQL中创建一个表并用示例数据填充它。然后，在Databend中创建一个对应的目标表。

```sql title='在MySQL中:'
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

```sql title='在Databend中:'
CREATE TABLE products (id INT NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(512) );
```

2. 下载[Flink](https://flink.apache.org/downloads/)和以下SQL连接器到您的系统：
    - Databend的Flink SQL连接器：https://github.com/databendcloud/flink-connector-databend/releases
    - MySQL的Flink SQL连接器：https://repo1.maven.org/maven2/com/ververica/flink-sql-connector-mysql-cdc/2.3.0/flink-sql-connector-mysql-cdc-2.3.0.jar
3. 将两个连接器JAR文件移动到Flink安装目录中的*lib*文件夹。
4. 启动Flink：

```shell
cd flink-16.0
./bin/start-cluster.sh
```

现在，如果您在浏览器中访问http://localhost:8081，可以打开Apache Flink仪表板：

![Alt text](@site/docs/public/img/load/cdc-dashboard.png)

5. 启动Flink SQL客户端：

```shell
./bin/sql-client.sh

```

```markdown
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
                      ▒▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░▓▓  ▓░▒█░
          
    ______ _ _       _       _____  ____  _         _____ _ _            _  BETA   
   |  ____| (_)     | |     / ____|/ __ \| |       / ____| (_)          | |  
   | |__  | |_ _ __ | | __ | (___ | |  | | |      | |    | |_  ___ _ __ | |_ 
   |  __| | | | '_ \| |/ /  \___ \| |  | | |      | |    | | |/ _ \ '_ \| __|
   | |    | | | | | |   <   ____) | |__| | |____  | |____| | |  __/ | | | |_ 
   |_|    |_|_|_| |_|_|\_\ |_____/ \___\_\______|  \_____|_|_|\___|_| |_|\__|
          
        欢迎！输入 'HELP;' 列出所有可用命令。输入 'QUIT;' 退出。
```

6. 将检查点间隔设置为3秒，并在Flink SQL客户端中使用MySQL和Databend连接器创建相应的表。有关可用连接参数，请参见 https://github.com/databendcloud/flink-connector-databend#connector-options:

```sql       
Flink SQL> SET execution.checkpointing.interval = 3s;
[INFO] 会话属性已设置。

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
[INFO] 执行语句成功。

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
[INFO] 执行语句成功。
```

7. 在Flink SQL客户端中，将*mysql_products*表中的数据同步到*databend_products*表中：

```sql
Flink SQL> INSERT INTO databend_products SELECT * FROM mysql_products;
[INFO] 正在向集群提交SQL更新语句...
[INFO] SQL更新语句已成功提交到集群：
作业ID: b14645f34937c7cf3672ffba35733734
```
现在您可以在Apache Flink Dashboard中看到一个正在运行的作业：

![Alt text](@site/docs/public/img/load/cdc-job.png)

一切就绪！如果您在Databend中查询*products*表，您会看到来自MySQL的数据已成功同步。随意在MySQL中执行插入、更新或删除操作，您将观察到在Databend中反映出相应的变化。