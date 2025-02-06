---
title: 使用 Flink CDC 从 MySQL 迁移
---

在本教程中，我们将引导您使用 Apache Flink CDC 从 MySQL 迁移到 Databend Cloud。

## 开始之前

在开始之前，请确保您已具备以下先决条件：

- 本地机器上已安装 [Docker](https://www.docker.com/)，因为它将用于启动 MySQL。
- 本地机器上已安装 Java 8 或 11，因为 [Flink Databend Connector](https://github.com/databendcloud/flink-connector-databend) 需要它。
- 本地机器上已安装 BendSQL。有关如何使用各种包管理器安装 BendSQL 的说明，请参阅 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。

## 步骤 1：在 Docker 中启动 MySQL

1. 创建一个名为 **mysql.cnf** 的配置文件，内容如下，并将此文件保存到将映射到 MySQL 容器的本地目录中，例如 `/Users/eric/Downloads/mysql.cnf`：

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

2. 在本地机器上启动一个 MySQL 容器。以下命令启动一个名为 **mysql-server** 的 MySQL 容器，创建一个名为 **mydb** 的数据库，并将 root 密码设置为 `root`：

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

检查输出中是否有一个名为 **mysql-server** 的容器：

```bash 
CONTAINER ID   IMAGE       COMMAND                  CREATED        STATUS        PORTS                               NAMES
aac4c28be56e   mysql:5.7   "docker-entrypoint.s…"   17 hours ago   Up 17 hours   0.0.0.0:3306->3306/tcp, 33060/tcp   mysql-server
```

## 步骤 2：向 MySQL 中填充示例数据

1. 登录到 MySQL 容器，并在提示时输入密码 `root`：

```bash
docker exec -it mysql-server mysql -u root -p
```

```
输入密码：
欢迎使用 MySQL 监视器。命令以 ; 或 \g 结尾。
您的 MySQL 连接 ID 是 71
服务器版本：5.7.44-log MySQL Community Server (GPL)

版权所有 (c) 2000, 2023, Oracle 和/或其附属公司。

Oracle 是 Oracle Corporation 和/或其附属公司的注册商标。其他名称可能是其各自所有者的商标。

输入 'help;' 或 '\h' 获取帮助。输入 '\c' 清除当前输入语句。
```

2. 切换到 **mydb** 数据库：

```bash
mysql> USE mydb;
数据库已更改
```

3. 复制并粘贴以下 SQL 以创建一个名为 **products** 的表并插入数据：

```sql
CREATE TABLE products (id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255) NOT NULL,description VARCHAR(512));

ALTER TABLE products AUTO_INCREMENT = 10;

INSERT INTO products VALUES (default,"scooter","小型两轮滑板车"),
(default,"car battery","12V 汽车电池"),
(default,"12-pack drill bits","12 个钻头，尺寸从 #40 到 #3"),
(default,"hammer","12 盎司木工锤"),
(default,"hammer","14 盎司木工锤"),
(default,"hammer","16 盎司木工锤"),
(default,"rocks","一盒各种石头"),
(default,"jacket","黑色防风夹克"),
(default,"cloud","databend 测试"),
(default,"spare tire","24 英寸备用轮胎");
```

4. 验证数据：

```bash
mysql> select * from products;
+----+--------------------+---------------------------------------------------------+
| id | name               | description                                             |
+----+--------------------+---------------------------------------------------------+
| 10 | scooter            | 小型两轮滑板车                                          |
| 11 | car battery        | 12V 汽车电池                                            |
| 12 | 12-pack drill bits | 12 个钻头，尺寸从 #40 到 #3                             |
| 13 | hammer             | 12 盎司木工锤                                           |
| 14 | hammer             | 14 盎司木工锤                                           |
| 15 | hammer             | 16 盎司木工锤                                           |
| 16 | rocks              | 一盒各种石头                                            |
| 17 | jacket             | 黑色防风夹克                                            |
| 18 | cloud              | databend 测试                                           |
| 19 | spare tire         | 24 英寸备用轮胎                                         |
+----+--------------------+---------------------------------------------------------+
10 行记录 (0.01 秒)
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

4. 启动 Flink 集群：

```shell
./bin/start-cluster.sh
```

现在，如果您在浏览器中访问 [http://localhost:8081](http://localhost:8081)，可以打开 Apache Flink Dashboard：

![Alt text](/img/load/cdc-dashboard.png)

## 步骤 5：开始迁移

1. 启动 Flink SQL 客户端：

```bash
./bin/sql-client.sh
```

您将看到 Flink SQL 客户端启动横幅，确认客户端已成功启动。

```bash

```sql
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
│    20 │ bicycle            │ Lightweight road bicycle                                │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

6. 返回 MySQL 终端并删除一个产品：

```sql
DELETE FROM products WHERE id = 20;
```

接下来，在 BendSQL 终端中再次查询 **products** 表以验证产品已被删除：

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

7. 返回 MySQL 终端并更新一个产品：

```sql
UPDATE products SET description = "14oz carpenter's hammer with ergonomic grip" WHERE id = 14;
```

接下来，在 BendSQL 终端中再次查询 **products** 表以验证产品描述已更新：

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
│    14 │ hammer             │ 14oz carpenter's hammer with ergonomic grip             │
│    15 │ hammer             │ 16oz carpenter's hammer                                 │
│    12 │ 12-pack drill bits │ 12-pack of drill bits with sizes ranging from #40 to #3 │
│    13 │ hammer             │ 12oz carpenter's hammer                                 │
│    10 │ scooter            │ Small 2-wheel scooter                                   │
│    11 │ car battery        │ 12V car battery                                         │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

8. 在 Flink SQL Client 中停止同步作业：

```sql
Flink SQL> STOP JOB '5b505d752b7c211cbdcb5566175b9182';
```

9. 在 Flink SQL Client 中删除表：

```sql
Flink SQL> DROP TABLE mysql_products;
Flink SQL> DROP TABLE databend_products;
```

10. 在 MySQL 终端中删除表：

```sql
DROP TABLE products;
```

11. 在 BendSQL 终端中删除表：

```sql
DROP TABLE products;
```

12. 退出 BendSQL 终端：

```sql
QUIT;
```

13. 退出 Flink SQL Client：

```sql
QUIT;
```

14. 退出 MySQL 终端：

```sql
QUIT;
```

15. 停止 Flink 集群：

```bash
./bin/stop-cluster.sh
```

16. 停止 MySQL 服务器：

```bash
sudo service mysql stop
```

17. 停止 Databend Cloud 服务：

```bash
databend-cloud stop
```

18. 停止 BendSQL 服务：

```bash
bendsql stop
```

19. 停止所有 Docker 容器：

```bash
docker stop $(docker ps -a -q)
```

20. 删除所有 Docker 容器：

```bash
docker rm $(docker ps -a -q)
```

21. 删除所有 Docker 镜像：

```bash
docker rmi $(docker images -q)
```

22. 删除所有 Docker 网络：

```bash
docker network prune
```

23. 删除所有 Docker 卷：

```bash
docker volume prune
```

24. 删除所有 Docker 系统资源：

```bash
docker system prune
```

25. 删除所有 Docker 资源：

```bash
docker system prune -a
```

26. 删除所有 Docker 资源并强制删除：

```bash
docker system prune -a --force
```

27. 删除所有 Docker 资源并强制删除所有镜像：

```bash
docker system prune -a --force --volumes
```

28. 删除所有 Docker 资源并强制删除所有镜像和卷：

```bash
docker system prune -a --force --volumes --filter "until=24h"
```

29. 删除所有 Docker 资源并强制删除所有镜像、卷和网络：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep"
```

30. 删除所有 Docker 资源并强制删除所有镜像、卷、网络和容器：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2"
```

31. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器和构建缓存：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2" --filter "label!=keep3"
```

32. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器、构建缓存和未使用的镜像：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2" --filter "label!=keep3" --filter "label!=keep4"
```

33. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器、构建缓存、未使用的镜像和未使用的卷：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2" --filter "label!=keep3" --filter "label!=keep4" --filter "label!=keep5"
```

34. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器、构建缓存、未使用的镜像、未使用的卷和未使用的网络：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2" --filter "label!=keep3" --filter "label!=keep4" --filter "label!=keep5" --filter "label!=keep6"
```

35. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器、构建缓存、未使用的镜像、未使用的卷、未使用的网络和未使用的容器：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2" --filter "label!=keep3" --filter "label!=keep4" --filter "label!=keep5" --filter "label!=keep6" --filter "label!=keep7"
```

36. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器、构建缓存、未使用的镜像、未使用的卷、未使用的网络、未使用的容器和未使用的构建缓存：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2" --filter "label!=keep3" --filter "label!=keep4" --filter "label!=keep5" --filter "label!=keep6" --filter "label!=keep7" --filter "label!=keep8"
```

37. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器、构建缓存、未使用的镜像、未使用的卷、未使用的网络、未使用的容器、未使用的构建缓存和未使用的镜像层：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2" --filter "label!=keep3" --filter "label!=keep4" --filter "label!=keep5" --filter "label!=keep6" --filter "label!=keep7" --filter "label!=keep8" --filter "label!=keep9"
```

38. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器、构建缓存、未使用的镜像、未使用的卷、未使用的网络、未使用的容器、未使用的构建缓存、未使用的镜像层和未使用的卷层：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2" --filter "label!=keep3" --filter "label!=keep4" --filter "label!=keep5" --filter "label!=keep6" --filter "label!=keep7" --filter "label!=keep8" --filter "label!=keep9" --filter "label!=keep10"
```

39. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器、构建缓存、未使用的镜像、未使用的卷、未使用的网络、未使用的容器、未使用的构建缓存、未使用的镜像层、未使用的卷层和未使用的网络层：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2" --filter "label!=keep3" --filter "label!=keep4" --filter "label!=keep5" --filter "label!=keep6" --filter "label!=keep7" --filter "label!=keep8" --filter "label!=keep9" --filter "label!=keep10" --filter "label!=keep11"
```

40. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器、构建缓存、未使用的镜像、未使用的卷、未使用的网络、未使用的容器、未使用的构建缓存、未使用的镜像层、未使用的卷层、未使用的网络层和未使用的容器层：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2" --filter "label!=keep3" --filter "label!=keep4" --filter "label!=keep5" --filter "label!=keep6" --filter "label!=keep7" --filter "label!=keep8" --filter "label!=keep9" --filter "label!=keep10" --filter "label!=keep11" --filter "label!=keep12"
```

41. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器、构建缓存、未使用的镜像、未使用的卷、未使用的网络、未使用的容器、未使用的构建缓存、未使用的镜像层、未使用的卷层、未使用的网络层、未使用的容器层和未使用的构建缓存层：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2" --filter "label!=keep3" --filter "label!=keep4" --filter "label!=keep5" --filter "label!=keep6" --filter "label!=keep7" --filter "label!=keep8" --filter "label!=keep9" --filter "label!=keep10" --filter "label!=keep11" --filter "label!=keep12" --filter "label!=keep13"
```

42. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器、构建缓存、未使用的镜像、未使用的卷、未使用的网络、未使用的容器、未使用的构建缓存、未使用的镜像层、未使用的卷层、未使用的网络层、未使用的容器层、未使用的构建缓存层和未使用的镜像层：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2" --filter "label!=keep3" --filter "label!=keep4" --filter "label!=keep5" --filter "label!=keep6" --filter "label!=keep7" --filter "label!=keep8" --filter "label!=keep9" --filter "label!=keep10" --filter "label!=keep11" --filter "label!=keep12" --filter "label!=keep13" --filter "label!=keep14"
```

43. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器、构建缓存、未使用的镜像、未使用的卷、未使用的网络、未使用的容器、未使用的构建缓存、未使用的镜像层、未使用的卷层、未使用的网络层、未使用的容器层、未使用的构建缓存层、未使用的镜像层和未使用的卷层：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2" --filter "label!=keep3" --filter "label!=keep4" --filter "label!=keep5" --filter "label!=keep6" --filter "label!=keep7" --filter "label!=keep8" --filter "label!=keep9" --filter "label!=keep10" --filter "label!=keep11" --filter "label!=keep12" --filter "label!=keep13" --filter "label!=keep14" --filter "label!=keep15"
```

44. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器、构建缓存、未使用的镜像、未使用的卷、未使用的网络、未使用的容器、未使用的构建缓存、未使用的镜像层、未使用的卷层、未使用的网络层、未使用的容器层、未使用的构建缓存层、未使用的镜像层、未使用的卷层和未使用的网络层：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2" --filter "label!=keep3" --filter "label!=keep4" --filter "label!=keep5" --filter "label!=keep6" --filter "label!=keep7" --filter "label!=keep8" --filter "label!=keep9" --filter "label!=keep10" --filter "label!=keep11" --filter "label!=keep12" --filter "label!=keep13" --filter "label!=keep14" --filter "label!=keep15" --filter "label!=keep16"
```

45. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器、构建缓存、未使用的镜像、未使用的卷、未使用的网络、未使用的容器、未使用的构建缓存、未使用的镜像层、未使用的卷层、未使用的网络层、未使用的容器层、未使用的构建缓存层、未使用的镜像层、未使用的卷层、未使用的网络层和未使用的容器层：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2" --filter "label!=keep3" --filter "label!=keep4" --filter "label!=keep5" --filter "label!=keep6" --filter "label!=keep7" --filter "label!=keep8" --filter "label!=keep9" --filter "label!=keep10" --filter "label!=keep11" --filter "label!=keep12" --filter "label!=keep13" --filter "label!=keep14" --filter "label!=keep15" --filter "label!=keep16" --filter "label!=keep17"
```

46. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器、构建缓存、未使用的镜像、未使用的卷、未使用的网络、未使用的容器、未使用的构建缓存、未使用的镜像层、未使用的卷层、未使用的网络层、未使用的容器层、未使用的构建缓存层、未使用的镜像层、未使用的卷层、未使用的网络层、未使用的容器层和未使用的构建缓存层：

```bash
docker system prune -a --force --volumes --filter "until=24h" --filter "label!=keep" --filter "label!=keep2" --filter "label!=keep3" --filter "label!=keep4" --filter "label!=keep5" --filter "label!=keep6" --filter "label!=keep7" --filter "label!=keep8" --filter "label!=keep9" --filter "label!=keep10" --filter "label!=keep11" --filter "label!=keep12" --filter "label!=keep13" --filter "label!=keep14" --filter "label!=keep15" --filter "label!=keep16" --filter "label!=keep17" --filter "label!=keep18"
```

47. 删除所有 Docker 资源并强制删除所有镜像、卷、网络、容器、构建缓存、未使用的镜像、未使用的卷、未使用的网络、未使用的容器、未使用的构建缓存、未使用的镜像层、未使用的卷

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