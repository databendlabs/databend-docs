---
title: Debezium
---

[Debezium](https://debezium.io/) 是一组分布式服务，用于捕获数据库中的更改，以便应用程序可以查看这些更改并对其做出响应。Debezium 记录每个数据库表中所有行级别的更改到一个变更事件流中，应用程序只需读取这些流，即可按更改发生的相同顺序查看变更事件。

[debezium-server-databend](https://github.com/databendcloud/debezium-server-databend) 是由 Databend 基于 Debezium Engine 开发的轻量级 CDC 工具。其目的是捕获关系数据库中的实时更改，并将它们作为事件流传递，最终将数据写入目标数据库 Databend。此工具提供了一种简单的方法来监控和捕获数据库更改，将其转换为可使用的事件，而无需像 Flink、Kafka 或 Spark 这样的大型数据基础设施。

### 安装 debezium-server-databend

debezium-server-databend 可以独立安装，无需预先安装 Debezium。一旦您决定安装 debezium-server-databend，您有两个选择。第一种是从源代码安装，通过下载源代码并自行构建。或者，您可以选择使用 Docker 进行更直接的安装过程。

#### 从源代码安装 debezium-server-databend

在开始之前，请确保您的系统上已安装 JDK 11 和 Maven。

1. 克隆项目：

```bash
git clone https://github.com/databendcloud/debezium-server-databend.git
```

2. 切换到项目的根目录：

```bash
cd debezium-server-databend
```

3. 构建并打包 debezium server：

```go
mvn -Passembly -Dmaven.test.skip package
```

4. 构建完成后，解压 server 分发包：

```bash
unzip debezium-server-databend-dist/target/debezium-server-databend-dist*.zip -d databendDist
```

5. 进入解压后的文件夹：

```bash
cd databendDist
```

6. 在 _conf_ 文件夹中创建一个名为 _application.properties_ 的文件，内容为示例 [here](https://github.com/databendcloud/debezium-server-databend/blob/main/debezium-server-databend-dist/src/main/resources/distro/conf/application.properties.example)，并根据您的具体要求修改配置。有关可用参数的描述，请参见此 [page](https://github.com/databendcloud/debezium-server-databend/blob/main/docs/docs.md)。

```bash
nano conf/application.properties
```

7. 使用提供的脚本启动该工具：

```bash
bash run.sh
```

#### 使用 Docker 安装 debezium-server-databend

在开始之前，请确保您的系统上已安装 Docker 和 Docker Compose。

1. 在 _conf_ 文件夹中创建一个名为 _application.properties_ 的文件，内容为示例 [here](https://github.com/databendcloud/debezium-server-databend/blob/main/debezium-server-databend-dist/src/main/resources/distro/conf/application.properties.example)，并根据您的具体要求修改配置。有关可用 Databend 参数的描述，请参见此 [page](https://github.com/databendcloud/debezium-server-databend/blob/main/docs/docs.md)。

```bash
nano conf/application.properties
```

2. 创建一个名为 _docker-compose.yml_ 的文件，内容如下：

```dockerfile
version: '2.1'
services:
  debezium:
    image: ghcr.io/databendcloud/debezium-server-databend:pr-2
    ports:
      - "8080:8080"
      - "8083:8083"
    volumes:
      - $PWD/conf:/app/conf
      - $PWD/data:/app/data
```

3. 打开终端或命令行界面，并导航到包含 _docker-compose.yml_ 文件的目录。

4. 使用以下命令启动该工具：

```bash
docker-compose up -d
```

### 教程

- [使用 Debezium 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-debezium)
