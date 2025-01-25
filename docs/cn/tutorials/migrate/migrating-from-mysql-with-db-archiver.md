---
title: 使用 db-archiver 从 MySQL 迁移
---

在本教程中，我们将指导您如何使用 db-archiver 从 MySQL 迁移到 Databend Cloud。

## 开始之前

在开始之前，请确保您已准备好以下先决条件：

- 本地机器上已安装 [Docker](https://www.docker.com/)，因为它将用于启动 MySQL。
- 本地机器上已安装 [Go](https://go.dev/dl/)，因为它是安装 db-archiver 所必需的。
- 本地机器上已安装 BendSQL。有关如何使用各种包管理器安装 BendSQL 的说明，请参阅 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。

## 第一步：在 Docker 中启动 MySQL

1. 在本地机器上启动一个 MySQL 容器。以下命令启动一个名为 **mysql-server** 的 MySQL 容器，创建一个名为 **mydb** 的数据库，并将 root 密码设置为 `root`：

```bash
docker run \
  --name mysql-server \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=mydb \
  -p 3306:3306 \
  -d mysql:8
```

2. 验证 MySQL 是否正在运行：

```bash
docker ps
```

检查输出中是否有一个名为 **mysql-server** 的容器：

```bash 
CONTAINER ID   IMAGE                          COMMAND                  CREATED        STATUS             PORTS                                                                                            NAMES
1a8f8d7d0e1a   mysql:8                        "docker-entrypoint.s…"   10 hours ago   Up About an hour   0.0.0.0:3306->3306/tcp, 33060/tcp                                                                mysql-server
```

## 第二步：向 MySQL 中填充示例数据

1. 登录到 MySQL 容器，并在提示时输入密码 `root`：

```bash
docker exec -it mysql-server mysql -u root -p
```

```
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 8.4.4 MySQL Community Server - GPL

Copyright (c) 2000, 2025, Oracle and/or its affiliates.

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

3. 复制并粘贴以下 SQL 以创建一个名为 **my_table** 的表并插入数据：

```sql
CREATE TABLE my_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    value INT
);
INSERT INTO my_table (name, value) VALUES
    ('Alice', 10),
    ('Bob', 20),
    ('Charlie', 30);
```

4. 验证数据：

```bash
mysql> SELECT * FROM my_table;
+----+---------+-------+
| id | name    | value |
+----+---------+-------+
|  1 | Alice   |    10 |
|  2 | Bob     |    20 |
|  3 | Charlie |    30 |
+----+---------+-------+
3 rows in set (0.00 sec)
```

5. 退出 MySQL 容器：

```bash
mysql> quit
Bye
```

## 第三步：在 Databend Cloud 中设置目标

1. 使用 BendSQL 连接到 Databend Cloud。如果您不熟悉 BendSQL，请参考本教程：[使用 BendSQL 连接到 Databend Cloud](../connect/connect-to-databendcloud-bendsql.md)。
2. 复制并粘贴以下 SQL 以创建一个名为 **my_table** 的目标表：

```sql
CREATE TABLE my_table (
    id INT NOT NULL,
    name VARCHAR(255),
    value INT
);
```

## 第四步：安装 db-archiver

使用 `go install` 命令安装 db-archiver：

```bash
go install github.com/databend/db-archiver@latest
```

## 第五步：配置并运行 db-archiver

1. 在本地机器上创建一个名为 **conf.json** 的文件，内容如下：

```json
{
    // 将占位符替换为您的实际值：
    "sourceHost": "127.0.0.1",
    "sourcePort": 3306,
    "sourceUser": "root",
    "sourcePass": "root",
    "sourceDB": "mydb",
    "sourceTable": "my_table",
    "sourceQuery": "select * from mydb.my_table",
    "sourceSplitKey": "id",
    "sourceWhereCondition": "id < 100",
    "databendDSN": "https://cloudapp:{password}@{host}:443?warehouse={warehouse_name}",
    "databendTable": "{database}.my_table",
    "batchSize": 2,
    "batchMaxInterval": 30,
    "workers": 1,
    "copyPurge": false,
    "copyForce": false,
    "disableVariantCheck": false,
    "deleteAfterSync": false,
    "maxThread": 10
}
```

2. 在 **conf.json** 文件所在的目录中运行以下命令以开始迁移：

```bash
db-archiver -f conf.json
```

迁移将按如下方式开始：

```bash
start time: 2025-01-22 21:45:33
sourcedatabase pattern ^mydb$
not match db:  information_schema
sourcedatabase pattern ^mydb$
match db:  mydb
sourcedatabase pattern ^mydb$
not match db:  mysql
sourcedatabase pattern ^mydb$
not match db:  performance_schema
sourcedatabase pattern ^mydb$
not match db:  sys
INFO[0000] Start worker mydb.my_table
INFO[0000] Worker mydb.my_table checking before start
INFO[0000] Starting worker mydb.my_table
INFO[0000] db.table is mydb.my_table, minSplitKey: 1, maxSplitKey : 6
2025/01/22 21:45:33 thread-1: extract 2 rows (1.997771 rows/s)
2025/01/22 21:45:33 thread-1: extract 0 rows (1.999639 rows/s)
2025/01/22 21:45:33 thread-1: extract 2 rows (1.999887 rows/s)
2025/01/22 21:45:33 thread-1: extract 2 rows (1.999786 rows/s)
INFO[0000] get presigned url cost: 126 ms
INFO[0000] get presigned url cost: 140 ms
INFO[0000] get presigned url cost: 159 ms
INFO[0000] upload by presigned url cost: 194 ms
INFO[0000] upload by presigned url cost: 218 ms
INFO[0000] upload by presigned url cost: 230 ms
INFO[0000] thread-1: copy into cost: 364 ms              ingest_databend=IngestData
2025/01/22 21:45:34 thread-1: ingest 2 rows (2.777579 rows/s), 68 bytes (94.437695 bytes/s)
2025/01/22 21:45:34 Globla speed: total ingested 2 rows (2.777143 rows/s), 29 bytes (40.268568 bytes/s)
INFO[0001] thread-1: copy into cost: 407 ms              ingest_databend=IngestData
2025/01/22 21:45:34 thread-1: ingest 2 rows (2.603310 rows/s), 72 bytes (88.512532 bytes/s)
2025/01/22 21:45:34 Globla speed: total ingested 4 rows (2.603103 rows/s), 62 bytes (37.744993 bytes/s)
INFO[0001] thread-1: copy into cost: 475 ms              ingest_databend=IngestData
2025/01/22 21:45:34 thread-1: ingest 2 rows (2.401148 rows/s), 70 bytes (81.639015 bytes/s)
2025/01/22 21:45:34 Globla speed: total ingested 6 rows (2.400957 rows/s), 93 bytes (34.813873 bytes/s)
INFO[0001] Worker dbarchiver finished and data correct, source data count is 6, target data count is 6
end time: 2025-01-22 21:45:34
total time: 1.269478875s
```

3. 返回到您的 BendSQL 会话并验证迁移：

```sql
SELECT * FROM my_table;

┌────────────────────────────────────────────┐
│   id  │       name       │      value      │
├───────┼──────────────────┼─────────────────┤
│     3 │ Charlie          │              30 │
│     1 │ Alice            │              10 │
│     2 │ Bob              │              20 │
└────────────────────────────────────────────┘
```