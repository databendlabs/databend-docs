---
title: 在 Docker 上部署
---

本指南使用 Docker Compose 分别启动 **databend-meta**、**databend-query** 和 **MinIO** 三个容器，帮助你理解 Databend 各组件的关系。

:::note 仅用于非生产环境
本方案仅适用于开发和本地测试，不适合生产环境或性能测试。
:::

### 开始之前

- 已安装 [Docker](https://www.docker.com/)（推荐 v26 及以上版本）。
- 已安装 [BendSQL](https://docs.databend.com/guides/connect/sql-clients/bendsql/#installing-bendsql)。

### 第一步：创建 docker-compose.yml

创建文件 `docker-compose.yml`，内容如下：

:::tip 国内用户
如果拉取 Docker Hub 镜像较慢，可将镜像替换为国内镜像源：
- `minio/minio:latest` → 保持不变（MinIO 官方镜像）
- `datafuselabs/databend-meta:latest` → `registry.databend.cn/public/databend-meta:latest`
- `datafuselabs/databend-query:latest` → `registry.databend.cn/public/databend-query:latest`
:::

```yaml
services:
  minio:
    image: minio/minio:latest
    network_mode: "host"
    environment:
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
    volumes:
      - minio-data:/data
    entrypoint: |
      sh -c "
      minio server --address :9000 /data &
      until mc alias set myminio http://localhost:9000 minioadmin minioadmin; do
        echo 'Waiting for MinIO...';
        sleep 1;
      done;
      if ! mc ls myminio/databend > /dev/null 2>&1; then
        mc mb myminio/databend;
      fi;
      wait;
      "

  databend-meta:
    image: datafuselabs/databend-meta:latest
    network_mode: "host"
    depends_on:
      - minio
    volumes:
      - databend-meta-data:/var/lib/databend/meta
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:28101/v1/health"]
      interval: 5s
      timeout: 3s
      retries: 10
    command: >
      --log-file-level=warn
      --log-file-dir=/var/log/databend
      --admin-api-address=0.0.0.0:28101
      --grpc-api-address=0.0.0.0:9191
      --raft-listen-host=0.0.0.0
      --raft-api-port=28103
      --raft-dir=/var/lib/databend/meta
      --id=1
      --single

  databend-query:
    image: datafuselabs/databend-query:latest
    network_mode: "host"
    depends_on:
      databend-meta:
        condition: service_healthy
    environment:
      QUERY_DEFAULT_USER: databend
      QUERY_DEFAULT_PASSWORD: databend
      QUERY_STORAGE_TYPE: s3
      AWS_S3_ENDPOINT: http://127.0.0.1:9000
      AWS_S3_BUCKET: databend
      AWS_ACCESS_KEY_ID: minioadmin
      AWS_SECRET_ACCESS_KEY: minioadmin
      META_ENDPOINTS: 0.0.0.0:9191
    volumes:
      - query-logs:/var/log/databend

volumes:
  minio-data:
  databend-meta-data:
  query-logs:
```

### 第二步：启动 Databend

```shell
docker compose up -d
```

检查三个容器是否正常运行：

```shell
docker compose ps
```

`minio`、`databend-meta`、`databend-query` 均应处于运行状态。查看日志：

```shell
docker compose logs -f databend-query
```

看到 `Databend Query started` 即表示启动成功。

### 第三步：连接到 Databend

```shell
bendsql -u databend -p databend
```

执行一条简单查询验证：

```sql
SELECT NOW();
```

### 停止 Databend

```shell
docker compose stop
```

彻底删除容器和数据卷：

```shell
docker compose down -v
```

### 下一步

- [使用 COPY INTO 加载数据](/guides/load-data/load/s3)
- [通过 MySQL 客户端或 JDBC 连接](/guides/connect/)
- 生产环境部署请参考 [在 Kubernetes 上部署](/guides/deploy/deploy/production/deploying-databend-on-kubernetes)
