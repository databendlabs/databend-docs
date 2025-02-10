---
title: 使用 Flink CDC 从 MySQL 迁移
---

在本教程中，我们将指导您使用 Apache Flink CDC 从 MySQL 迁移到 Databend Cloud。

## 开始前准备

开始前，请确保已满足以下前提条件：

- 本地机器已安装 [Docker](https://www.docker.com/)，用于启动 MySQL。
- 本地机器已安装 Java 8 或 11，因为 [Flink Databend Connector](https://github.com/databendcloud/flink-connector-databend) 需要 Java 环境。
- 本地机器已安装 BendSQL。有关使用不同包管理器安装 BendSQL 的说明，请参阅 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。

## 步骤 1：在 Docker 中启动 MySQL

1. 创建名为 **mysql.cnf** 的配置文件，内容如下，并将此文件保存到将映射到 MySQL 容器的本地目录中，例如 `/Users/eric/Downloads/mysql.cnf`：

```cnf
[mysqld]
# 基本设置
server-id=1
log-bin=mysql-bin
binlog_format=ROW
binlog_row_image=FULL
expire_logs_days=3

# 字符集设置
character_set_server=utf8mb4
collation-server=utf8mb4_unicode_ci

# 认证设置
default-authentication-plugin=mysql_native_password
```

2. 在本地机器上启动 MySQL 容器。以下命令启动名为 **mysql-server** 的 MySQL 容器，创建名为 **mydb** 的数据库，并将 root 密码设置为 `root`：

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

3. 验证 MySQL 是否运行：

```bash
docker ps
```

检查输出中是否存在名为 **mysql-server** 的容器：

```bash
CONTAINER ID   IMAGE       COMMAND                  CREATED        STATUS        PORTS                               NAMES
aac4c28be56e   mysql:5.7   "docker-entrypoint.s…"   17 hours ago   Up 17 hours   0.0.0.0:3306->3306/tcp, 33060/tcp   mysql-server
```

## 步骤 2：向 MySQL 填充示例数据

1. 登录 MySQL 容器，提示输入密码时输入 `root`：

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

3. 复制并粘贴以下 SQL 以创建名为 **products** 的表并插入数据：

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

1. 使用 BendSQL 连接 Databend Cloud。如果不熟悉 BendSQL，请参考本教程：[使用 BendSQL 连接 Databend Cloud](../connect/connect-to-databendcloud-bendsql.md)。

2. 复制并粘贴以下 SQL 以创建名为 **products** 的目标表：

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

2. 将 Databend 和 MySQL 连接器下载到 **lib** 文件夹：

```bash
curl -Lo lib/flink-connector-databend.jar https://github.com/databendcloud/flink-connector-databend/releases/latest/download/flink-connector-databend.jar

curl -Lo lib/flink-sql-connector-mysql-cdc-2.4.1.jar https://repo1.maven.org/maven2/com/ververica/flink-sql-connector-mysql-cdc/2.4.1/flink-sql-connector-mysql-cdc-2.4.1.jar
```

3. 打开 `flink-1.17.1/conf/` 下的 **flink-conf.yaml** 文件，将 `taskmanager.memory.process.size` 更新为 `4096m` 并保存文件。

```yaml
taskmanager.memory.process.size: 4096m
```

4. 启动 Flink 集群：

```shell
./bin/start-cluster.sh
```

现在您可以在浏览器中访问 [http://localhost:8081](http://localhost:8081) 打开 Apache Flink 仪表盘：

![Alt text](/img/load/cdc-dashboard.png)

## 步骤 5：开始迁移

1. 启动 Flink SQL 客户端：

```bash
./bin/sql-client.sh
```

您将看到 Flink SQL 客户端启动横幅，确认客户端已成功启动。

````bash

```markdown
```bash
BendSQL 1.0.52-1a7c9d6(rust-1.70.0-nightly-2023-04-15T11:13:06.006226000Z)
欢迎使用 BendSQL。提示：使用上下键浏览历史记录。
已连接到 Databend Cloud v0.9.37-nightly-76e6d15e(rust-1.70.0-nightly-2023-04-15T11:13:06.006226000Z)

连接信息：版本：8.0.27，驱动：DatabendSQL 0.2.0

类型 'help' 获取帮助。

root@localhost:8000/default> CREATE TABLE products (id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255),description TEXT);

0 行写入于 0.029 秒。已处理 0 行，0 B (0 行/秒，0 B/秒)

root@localhost:8000/default> INSERT INTO products (name, description) VALUES
                            -> ('hammer', '14oz carpenter''s hammer'),
                            -> ('hammer', '16oz carpenter''s hammer'),
                            -> ('rocks', 'box of assorted rocks'),
                            -> ('jacket', 'black wind breaker'),
                            -> ('cloud', 'test for databend'),
                            -> ('12-pack drill bits', '12-pack of drill bits with sizes ranging from #40 to #3'),
                            -> ('hammer', '12oz carpenter''s hammer'),
                            -> ('scooter', 'Small 2-wheel scooter'),
                            -> ('car battery', '12V car battery'),
                            -> ('spare tire', '24 inch spare tire');

10 行写入于 0.113 秒。已处理 10 行，1.02 KiB (88.50 行/秒，9.00 KiB/秒)
````

2. 将检查点间隔设置为 3 秒。

```bash
Flink SQL> SET execution.checkpointing.interval = 3s;
```

3. 在 Flink SQL Client 中创建 MySQL 和 Databend 连接器对应的表（请将占位符替换为实际值）：

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

4. 在 Flink SQL Client 中将 mysql_products 表数据同步到 databend_products 表：

```sql
Flink SQL> INSERT INTO databend_products SELECT * FROM mysql_products;
>
[INFO] Submitting SQL update statement to the cluster...
[INFO] SQL update statement has been successfully submitted to the cluster:
Job ID: 5b505d752b7c211cbdcb5566175b9182
```

此时可以在 Apache Flink Dashboard 中看到运行中的作业：

![Alt text](/img/load/cdc-job.png)

完成！返回 BendSQL 终端查询 Databend Cloud 中的 **products** 表，可以看到 MySQL 数据已成功同步：

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

5. 返回 MySQL 终端插入新商品：

```sql
INSERT INTO products VALUES (default, "bicycle", "Lightweight road bicycle");
```

然后在 BendSQL 终端再次查询 **products** 表验证新商品已同步：

```sql
SELECT * FROM products;
```

┌──────────────────────────────────────────────────────────────────────────────────────┐
│ id │ name │ description │
│ Int32 │ String │ Nullable(String) │
├───────┼────────────────────┼─────────────────────────────────────────────────────────┤
│ 12 │ 12 件套钻头 │ 包含从#40 到#3 尺寸的 12 件套钻头 │
│ 11 │ 汽车电池 │ 12V 汽车电池 │
│ 14 │ 锤子 │ 14 盎司木工锤 │
│ 13 │ 锤子 │ 12 盎司木工锤 │
│ 10 │ 滑板车 │ 小型两轮滑板车 │
│ 20 │ 自行车 │ 轻便公路自行车 │
│ 19 │ 备用轮胎 │ 24 英寸备用轮胎 │
│ 16 │ 岩石 │ 混合岩石盒装 │
│ 15 │ 锤子 │ 16 盎司木工锤 │
│ 18 │ 云 │ 用于 Databend 的测试 │
│ 17 │ 夹克 │ 黑色防风外套 │
└──────────────────────────────────────────────────────────────────────────────────────┘
