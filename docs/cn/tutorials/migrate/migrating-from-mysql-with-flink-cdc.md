---
title: MySQL 实时同步 (Flink CDC)
sidebar_label: Flink CDC
---

> **能力**：CDC、全量、转换

本教程将演示如何借助 Apache Flink CDC 将 MySQL 数据迁移到 Databend Cloud。

## 开始之前

请确保：

- 本地已安装 [Docker](https://www.docker.com/)，用于启动 MySQL。
- 本地安装 Java 8 或 11，用于运行 [Flink Databend Connector](https://github.com/databendcloud/flink-connector-databend)。
- 本地安装 BendSQL，参见 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。

## 步骤 1：在 Docker 中启动 MySQL

1. 创建配置文件 **mysql.cnf**，并保存到稍后挂载到容器的目录（示例 `/Users/eric/Downloads/mysql.cnf`）：

```cnf
[mysqld]
server-id=1
log-bin=mysql-bin
binlog_format=ROW
binlog_row_image=FULL
expire_logs_days=3
character_set_server=utf8mb4
collation-server=utf8mb4_unicode_ci
default-authentication-plugin=mysql_native_password
```

2. 启动名为 **mysql-server** 的 MySQL 容器，创建 `mydb` 数据库，并把 root 密码设置为 `root`：

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

3. 通过 `docker ps` 检查容器：

```bash
CONTAINER ID   IMAGE       ...   NAMES
aac4c28be56e   mysql:5.7   ...   mysql-server
```

## 步骤 2：写入示例数据

1. 登录容器并输入密码 `root`：

```bash
docker exec -it mysql-server mysql -u root -p
```

2. 切换到 `mydb`：

```bash
mysql> USE mydb;
```

3. 创建 `products` 表并插入数据：

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

4. 查询确认：

```bash
mysql> select * from products;
```

## 步骤 3：在 Databend Cloud 创建目标表

1. 使用 BendSQL 连接 Databend Cloud，参见 [使用 BendSQL 连接 Databend Cloud](../getting-started/connect-to-databendcloud-bendsql.md)。

2. 创建 `products` 表：

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

2. 将 Databend 与 MySQL Connector 下载到 `lib` 目录：

```bash
curl -Lo lib/flink-connector-databend.jar https://github.com/databendcloud/flink-connector-databend/releases/latest/download/flink-connector-databend.jar

curl -Lo lib/flink-sql-connector-mysql-cdc-2.4.1.jar https://repo1.maven.org/maven2/com/ververica/flink-sql-connector-mysql-cdc/2.4.1/flink-sql-connector-mysql-cdc-2.4.1.jar
```

3. 编辑 `flink-1.17.1/conf/flink-conf.yaml`，将 `taskmanager.memory.process.size` 设置为 `4096m`。

4. 启动 Flink 集群：

```shell
./bin/start-cluster.sh
```

然后访问 [http://localhost:8081](http://localhost:8081) 打开 Flink Dashboard。

## 步骤 5：启动迁移

1. 启动 Flink SQL Client：

```bash
./bin/sql-client.sh
```

2. 设置 Checkpoint 间隔为 3 秒：

```bash
Flink SQL> SET execution.checkpointing.interval = 3s;
```

3. 在 Flink SQL Client 中创建 MySQL 与 Databend 表（替换占位符）：

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

4. 执行同步：

```sql
Flink SQL> INSERT INTO databend_products SELECT * FROM mysql_products;
```

Flink Dashboard 会显示运行中的任务。

完成后，在 BendSQL 中查询 `products` 表即可看到同步的数据。继续在 MySQL 中插入记录，例如：

```sql
INSERT INTO products VALUES (default, "bicycle", "Lightweight road bicycle");
```

再查询 Databend，能看到新插入的记录：

```sql
SELECT * FROM products;
```
