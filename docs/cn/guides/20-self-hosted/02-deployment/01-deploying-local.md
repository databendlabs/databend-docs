---
title: 在 Docker 上部署
---

本指南使用 Docker Compose 分别启动 **databend-meta**、**databend-query** 和 **MinIO** 三个容器，帮助你理解 Databend 各组件的关系。

:::note[仅用于非生产环境]
本方案仅适用于开发和本地测试，不适合生产环境或性能测试。
:::

### 开始之前

- 已安装 [Docker](https://www.docker.com/)（推荐 v26 及以上版本）。
- 已安装 [BendSQL](https://docs.databend.com/guides/connect/sql-clients/bendsql/#installing-bendsql)。

### 第一步：创建 docker-compose.yml

创建文件 `docker-compose.yml`，内容如下：

:::tip[国内用户]
如果拉取 Docker Hub 镜像较慢，可将以下镜像替换为国内镜像源：
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
      - databend-meta-data:/data/
    healthcheck:
      test: ["CMD", "databend-metactl", "--grpc-api-address", "0.0.0.0:9191", "status"]
      interval: 5s
      timeout: 3s
      retries: 10
    entrypoint: sh -c "databend-meta \
        --log-file-level='warn' \
        --log-file-format='text' \
        --log-file-dir='/data/logs/' \
        --log-file-limit=24 \
        --admin-api-address='0.0.0.0:28101' \
        --grpc-api-address='0.0.0.0:9191' \
        --grpc-api-advertise-host='0.0.0.0' \
        --raft-listen-host='0.0.0.0' \
        --raft-api-port='28103' \
        --raft-dir='/data/metadata' \
        --id=1 \
        --single"

  databend-query:
    image: datafuselabs/databend-query:latest
    network_mode: "host"
    depends_on:
      databend-meta:
        condition: service_healthy
    volumes:
      - query-logs:/var/log/databend/
      - query-config:/etc/databend/
    environment:
      RUST_BACKTRACE: 1
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7070/metrics"]
      interval: 10s
      timeout: 5s
      retries: 10
    entrypoint: |
      sh -c "
      cat <<'EOF' > /etc/databend/databend-query.toml
      [query]
      max_active_sessions = 256
      shutdown_wait_timeout_ms = 5000
      flight_api_address = '0.0.0.0:9090'
      metric_api_address = '0.0.0.0:7070'
      tenant_id = 'default'
      cluster_id = 'c01'

      [[query.users]]
      name = 'databend'
      auth_type = 'double_sha1_password'
      # password: databend
      auth_string = '3081f32caef285c232d066033c89a96d542d09d7'

      [log]
      [log.file]
      level = 'WARN'
      format = 'text'
      dir = '/var/log/databend'

      [meta]
      endpoints = ['0.0.0.0:9191']
      username = 'root'
      password = 'root'
      client_timeout_in_second = 30
      auto_sync_interval = 30

      [storage]
      type = 's3'
      [storage.s3]
      endpoint_url = 'http://127.0.0.1:9000'
      region = 'us-east-1'
      access_key_id = 'minioadmin'
      secret_access_key = 'minioadmin'
      bucket = 'databend'
      EOF
      exec databend-query --config-file=/etc/databend/databend-query.toml
      "

volumes:
  minio-data:
  databend-meta-data:
  query-logs:
  query-config:
```

### 第二步：启动 Databend

```shell
docker compose up -d
```

检查三个容器是否正常运行：

```shell
docker compose ps
```

查看 query 日志：

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

### 进阶配置

如需自定义配置，可以在外部准备好配置文件再 mount 到容器中，参考官方配置模板：

- databend-meta 配置：https://github.com/databendlabs/databend/blob/main/scripts/ci/deploy/config/databend-meta-node-1.toml
- databend-query 配置：https://github.com/databendlabs/databend/blob/main/scripts/ci/deploy/config/databend-query-node-1.toml

### 下一步

- [使用 COPY INTO 加载数据](/guides/load-data/load/s3)
- [通过 MySQL 客户端或 JDBC 连接](/guides/connect/)
- 生产环境部署请参考 [在 Kubernetes 上部署](/guides/self-hosted/deployment/production/deploying-databend-on-kubernetes)
