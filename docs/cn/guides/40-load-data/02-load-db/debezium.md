---
title: Debezium
---

[Debezium](https://debezium.io/) 是一组分布式服务，用于捕获数据库变更，使应用程序能够感知并响应这些变更。Debezium 在变更事件流中记录每个数据库表的所有行级变更，应用程序只需读取这些流即可按事件发生顺序查看变更。

[debezium-server-databend](https://github.com/databendcloud/debezium-server-databend) 是 Databend 基于 Debezium Engine 开发的轻量级 CDC 工具，旨在捕获关系数据库的实时变更，将其作为事件流传递并最终写入目标数据库 Databend。该工具提供简便方法监控和捕获数据库变更，将其转化为可消费事件，无需依赖 Flink、Kafka 或 Spark 等大型数据基础设施。

### 安装 debezium-server-databend

debezium-server-databend 可独立安装，无需预先安装 Debezium。安装时您有两个选项：一是通过下载源码自行构建，二是使用 Docker 进行更简便的安装。

#### 从源码安装 debezium-server-databend

开始前请确保系统已安装 JDK 11 和 Maven。

1. 克隆项目：

```bash
git clone https://github.com/databendcloud/debezium-server-databend.git
```

2. 进入项目根目录：

```bash
cd debezium-server-databend
```

3. 构建并打包 debezium 服务：

```go
mvn -Passembly -Dmaven.test.skip package
```

4. 构建完成后解压分发包：

```bash
unzip debezium-server-databend-dist/target/debezium-server-databend-dist*.zip -d databendDist
```

5. 进入解压目录：

```bash
cd databendDist
```

6. 在 _conf_ 目录创建 _application.properties_ 文件，内容参考[示例](https://github.com/databendcloud/debezium-server-databend/blob/main/debezium-server-databend-dist/src/main/resources/distro/conf/application.properties.example)，并按需修改配置。参数说明详见此[文档](https://github.com/databendcloud/debezium-server-databend/blob/main/docs/docs.md)。

```bash
nano conf/application.properties
```

7. 执行启动脚本：

```bash
bash run.sh
```

#### 使用 Docker 安装 debezium-server-databend

开始前请确保系统已安装 Docker 和 Docker Compose。

1. 在 _conf_ 目录创建 _application.properties_ 文件，内容参考[示例](https://github.com/databendcloud/debezium-server-databend/blob/main/debezium-server-databend-dist/src/main/resources/distro/conf/application.properties.example)，并按需修改配置。Databend 参数说明详见此[文档](https://github.com/databendcloud/debezium-server-databend/blob/main/docs/docs.md)。

```bash
nano conf/application.properties
```

2. 创建 _docker-compose.yml_ 文件：

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

3. 打开终端，进入含 _docker-compose.yml_ 的目录

4. 启动服务：

```bash
docker-compose up -d
```

### 教程

- [使用 Debezium 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-debezium)