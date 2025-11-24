---
title: 使用 db-archiver 离线迁移 MySQL
sidebar_label: 'db-archiver 离线迁移 MySQL'
---

> **能力**：全量、增量  
> **✅ 推荐**：批量迁移历史数据

本教程将演示如何通过 db-archiver 将 MySQL 迁移到 Databend Cloud。

## 开始之前

请准备以下环境：

- 本地安装 [Docker](https://www.docker.com/)，用于启动 MySQL。
- 本地安装 [Go](https://go.dev/dl/)，用于安装 db-archiver。
- 本地安装 BendSQL，参见 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。

## 步骤 1：在 Docker 中启动 MySQL

1. 运行以下命令启动名为 **mysql-server** 的 MySQL 容器，创建 `mydb` 数据库，root 密码为 `root`：

```bash
docker run \
  --name mysql-server \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=mydb \
  -p 3306:3306 \
  -d mysql:8
```

2. 验证容器运行状态：

```bash
docker ps
```

输出中应包含 **mysql-server**：

```bash
CONTAINER ID   IMAGE    ...   NAMES
1a8f8d7d0e1a   mysql:8  ...   mysql-server
```

## 步骤 2：写入示例数据

1. 登录 MySQL，密码为 `root`：

```bash
docker exec -it mysql-server mysql -u root -p
```

2. 切换到 `mydb`：

```bash
mysql> USE mydb;
```

3. 创建表 `my_table` 并插入数据：

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

4. 查询确认：

```bash
mysql> SELECT * FROM my_table;
+----+---------+-------+
| id | name    | value |
+----+---------+-------+
|  1 | Alice   |    10 |
|  2 | Bob     |    20 |
|  3 | Charlie |    30 |
+----+---------+-------+
```

5. 输入 `quit` 退出。

## 步骤 3：在 Databend Cloud 创建目标表

1. 使用 BendSQL 连接 Databend Cloud，参考 [使用 BendSQL 连接 Databend Cloud](../getting-started/connect-to-databendcloud-bendsql.md)。
2. 创建目标表 `my_table`：

```sql
CREATE TABLE my_table (
    id INT NOT NULL,
    name VARCHAR(255),
    value INT
);
```

## 步骤 4：安装 db-archiver

从 [Releases](https://github.com/databendcloud/db-archiver/releases/) 下载适合你架构的版本。

## 步骤 5：配置并运行 db-archiver

1. 新建本地文件 **conf.json**：

```json
{
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
    "maxThread": 1,
    "copyPurge": false,
    "copyForce": false,
    "disableVariantCheck": false,
    "deleteAfterSync": false,
    "maxThread": 10
}
```

2. 在 conf.json 所在目录运行：

```bash
db-archiver -f conf.json
```

控制台将显示迁移进度：

```bash
start time: 2025-01-22 21:45:33
...
INFO[0001] Worker dbarchiver finished and data correct, source data count is 6, target data count is 6
end time: 2025-01-22 21:45:34
total time: 1.269478875s
```
