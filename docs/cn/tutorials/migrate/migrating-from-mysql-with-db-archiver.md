<think>
好的，我需要把用户提供的关于使用db-archiver从MySQL迁移到Databend Cloud的教程翻译成简体中文。首先，我要仔细阅读整个文档，理解每个步骤和代码块的作用。用户给了一些具体的翻译规则，比如保留Markdown结构，不改变代码块，保留换行和空行，不删除任何内容，还有特定术语的翻译要求，比如“time travel”要翻译成“时间回溯”，“warehouse”翻译成“计算集群”等。

首先，标题部分要翻译，但保持结构不变。然后检查每个章节，确保步骤描述准确。例如，“Before You Start”要翻译成“准备工作”，里面的列表项要保留原格式。代码块里的命令和输出结果不能改动，所以需要特别注意不要误删或修改任何代码。

在翻译配置文件和命令时，比如conf.json文件，里面的注释需要翻译，但键名和URL要保持原样。例如，注释中的“Replace the placeholders with your actual values:”要翻译成“将占位符替换为实际值：”，但键如“sourceHost”不翻译。

遇到特定术语时，比如“Databend Cloud”、“Vector”、“Stage”保持不译，而“Self-Hosted”翻译成“私有化部署”。此外，注意用户提到的“Personal”计划要翻译成“基础版”。

在翻译过程中，还要确保不改变任何链接和HTML标签，比如<Notes>标签要保留原样。同时，保持原有的换行和段落结构，避免添加或删除空行。

最后，检查整个翻译后的文档，确保技术术语准确，语句通顺，符合技术文档的规范。特别是验证步骤中的SQL查询结果，确保表格的格式正确，数据与原文一致。确认所有步骤编号正确，代码块和命令行输出无误。完成后，再通读一遍，确保没有遗漏任何用户的特定要求，比如保留permalink和HTML标签的结构。
</think>

---
title: 使用 db-archiver 从 MySQL 迁移
---

在本教程中，我们将指导您使用 db-archiver 从 MySQL 迁移到 Databend Cloud。

## 准备工作 {#before-you-start}

开始前，请确保已满足以下先决条件：

- 本地机器已安装 [Docker](https://www.docker.com/)，用于启动 MySQL。
- 本地机器已安装 [Go](https://go.dev/dl/)，用于安装 db-archiver。
- 本地机器已安装 BendSQL。有关使用不同包管理器安装 BendSQL 的说明，请参阅 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。

## 步骤 1：在 Docker 中启动 MySQL {#step-1-launch-mysql-in-docker}

1. 在本地机器上启动 MySQL 容器。以下命令将启动名为 **mysql-server** 的 MySQL 容器，创建名为 **mydb** 的数据库，并将 root 密码设置为 `root`：

```bash
docker run \
  --name mysql-server \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=mydb \
  -p 3306:3306 \
  -d mysql:8
```

2. 验证 MySQL 是否运行：

```bash
docker ps
```

检查输出中是否存在名为 **mysql-server** 的容器：

```bash 
CONTAINER ID   IMAGE                          COMMAND                  CREATED        STATUS             PORTS                                                                                            NAMES
1a8f8d7d0e1a   mysql:8                        "docker-entrypoint.s…"   10 hours ago   Up About an hour   0.0.0.0:3306->3306/tcp, 33060/tcp                                                                mysql-server
```

## 步骤 2：向 MySQL 填充示例数据 {#step-2-populate-mysql-with-sample-data}

1. 登录 MySQL 容器，提示输入密码时输入 `root`：

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

3. 复制并粘贴以下 SQL 以创建名为 **my_table** 的表并插入数据：

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

## 步骤 3：在 Databend Cloud 中设置目标 {#step-3-set-up-target-in-databend-cloud}

1. 使用 BendSQL 连接 Databend Cloud。如果不熟悉 BendSQL，请参考本教程：[使用 BendSQL 连接 Databend Cloud](../connect/connect-to-databendcloud-bendsql.md)。
2. 复制并粘贴以下 SQL 以创建名为 **my_table** 的目标表：

```sql
CREATE TABLE my_table (
    id INT NOT NULL,
    name VARCHAR(255),
    value INT
);
```

## 步骤 4：安装 db-archiver {#step-4-install-db-archiver}

使用 `go install` 命令安装 db-archiver：

```bash
go install github.com/databend/db-archiver@latest
```

## 步骤 5：配置并运行 db-archiver {#step-5-configure--run-db-archiver}

1. 在本地机器上创建名为 **conf.json** 的文件，内容如下：

```json
{
    // 将占位符替换为实际值：
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

2. 在 **conf.json** 文件所在目录运行以下命令以开始迁移：

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

3. 返回 BendSQL 会话并验证迁移：

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