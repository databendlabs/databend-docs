---
title: Debezium
---

[Debezium](https://debezium.io/) 是一组分布式服务，用于捕获数据库中的更改，以便应用程序可以查看这些更改并对其做出响应。Debezium 以更改事件流的形式记录每个数据库表中的所有行级更改，应用程序只需读取这些流即可按照更改发生的相同顺序查看更改事件。

[debezium-server-databend](https://github.com/databendcloud/debezium-server-databend) 是 Databend 基于 Debezium Engine 开发的轻量级 CDC 工具。其目的是捕获关系型数据库的实时更改，并将其作为事件流传输，最终将数据写入目标数据库 Databend。该工具提供了一种简单的方法来监控和捕获数据库更改，将其转换为可消费的事件，而无需 Flink、Kafka 或 Spark 等大型数据基础设施。

### 安装 debezium-server-databend

debezium-server-databend 可以独立安装，无需预先安装 Debezium。一旦您决定安装 debezium-server-databend，您有两种选择。第一种是通过下载源代码并自行构建来从源代码安装。或者，您也可以选择使用 Docker 进行更直接的安装。

#### 从源代码安装 debezium-server-databend

在开始之前，请确保您的系统上已安装 JDK 11 和 Maven。

1. 克隆项目：

```bash
git clone https://github.com/databendcloud/debezium-server-databend.git
```

2. 进入项目根目录：

```bash
cd debezium-server-databend
```

3. 构建并打包 Debezium Server：

```go
mvn -Passembly -Dmaven.test.skip package
```

4. 构建完成后，解压服务器分发包：

```bash
unzip debezium-server-databend-dist/target/debezium-server-databend-dist*.zip -d databendDist
```

5. 进入解压后的文件夹：

```bash
cd databendDist
```

6. 在 _conf_ 文件夹中创建一个名为 _application.properties_ 的文件，其内容可参考[此处](https://github.com/databendcloud/debezium-server-databend/blob/main/debezium-server-databend-dist/src/main/resources/distro/conf/application.properties.example)的示例，并根据您的具体要求修改配置。有关可用参数的说明，请参阅此[页面](https://github.com/databendcloud/debezium-server-databend/blob/main/docs/docs.md)。

```bash
nano conf/application.properties
```

7. 使用提供的脚本启动工具：

```bash
bash run.sh
```

#### 使用 Docker 安装 debezium-server-databend

在开始之前，请确保您的系统上已安装 Docker 和 Docker Compose。

1. 在 _conf_ 文件夹中创建一个名为 _application.properties_ 的文件，其内容可参考[此处](https://github.com/databendcloud/debezium-server-databend/blob/main/debezium-server-databend-dist/src/main/resources/distro/conf/application.properties.example)的示例，并根据您的具体要求修改配置。有关可用 Databend 参数的说明，请参阅此[页面](https://github.com/databendcloud/debezium-server-databend/blob/main/docs/docs.md)。

```bash
nano conf/application.properties
```

2. 创建一个名为 _docker-compose.yml_ 的文件，其内容如下：

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

4. 使用以下命令启动工具：

```bash
docker-compose up -d
```

### 教程

- [使用 Debezium 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-debezium)
