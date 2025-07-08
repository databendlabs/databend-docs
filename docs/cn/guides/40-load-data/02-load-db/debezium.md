---
title: Debezium
---

[Debezium](https://debezium.io/) 是一组分布式服务，用于捕获数据库中的变更，使应用程序能够查看并响应这些变更。Debezium 将每个数据库表的所有行级变更记录在变更事件流中，应用程序只需读取这些流，即可按事件发生的原始顺序查看变更。

[debezium-server-databend](https://github.com/databendcloud/debezium-server-databend) 是 Databend 基于 Debezium Engine 开发的轻量级 CDC 工具，用于捕获关系型数据库的实时变更，将其作为事件流传递，并最终将数据写入目标数据库 Databend。该工具提供简洁的数据库变更监控与捕获方案，无需依赖 Flink、Kafka 或 Spark 等大型数据基础设施即可将变更转换为可消费事件。

### 安装 debezium-server-databend

debezium-server-databend 可独立安装，无需预装 Debezium。安装时有两种选择：下载源代码自行构建，或通过 Docker 快速安装。

#### 从源码安装

开始前请确保系统已安装 JDK 11 和 Maven。

1. 克隆项目：

```bash
git clone https://github.com/databendcloud/debezium-server-databend.git
```

2. 进入项目根目录：

```bash
cd debezium-server-databend
```

3. 构建并打包服务：

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

6. 在 _conf_ 目录创建 _application.properties_ 文件，内容参考[此示例](https://github.com/databendcloud/debezium-server-databend/blob/main/debezium-server-databend-dist/src/main/resources/distro/conf/application.properties.example)，按需修改配置。参数说明详见此[文档](https://github.com/databendcloud/debezium-server-databend/blob/main/docs/docs.md)。

```bash
nano conf/application.properties
```

7. 通过脚本启动工具：

```bash
bash run.sh
```

#### 通过 Docker 安装

开始前请确保系统已安装 Docker 和 Docker Compose。

1. 在 _conf_ 目录创建 _application.properties_ 文件，内容参考[此示例](https://github.com/databendcloud/debezium-server-databend/blob/main/debezium-server-databend-dist/src/main/resources/distro/conf/application.properties.example)，按需修改配置。Databend 参数说明详见此[文档](https://github.com/databendcloud/debezium-server-databend/blob/main/docs/docs.md)。

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

3. 在终端中导航至 _docker-compose.yml_ 所在目录。

4. 执行启动命令：

```bash
docker-compose up -d
```

### 教程

- [使用 Debezium 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-debezium)