---
title: Deploying on Docker
---

This guide walks you through deploying Databend using Docker Compose with separate **databend-meta**, **databend-query**, and **MinIO** containers — giving you a clear picture of how the components fit together.

:::note[Non-production use only]
This setup is intended for development and local testing only. It is not suitable for production environments or performance benchmarking.
:::

### Before You Start

- [Docker](https://www.docker.com/) (v26 or later recommended) installed on your machine.
- [BendSQL](https://docs.databend.com/guides/connect/sql-clients/bendsql/#installing-bendsql) installed on your machine.

### Step 1: Create docker-compose.yml

Create a file named `docker-compose.yml` with the following content:

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
      test: ["CMD", "curl", "-f", "http://localhost:28101/v1/health"]
      interval: 5s
      timeout: 3s
      retries: 10
    entrypoint: sh -c "/databend-meta \
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
      exec /usr/bin/databend-query --config-file=/etc/databend/databend-query.toml
      "

volumes:
  minio-data:
  databend-meta-data:
  query-logs:
  query-config:
```

### Step 2: Start Databend

```shell
docker compose up -d
```

Check that all three containers are running:

```shell
docker compose ps
```

To follow the query logs:

```shell
docker compose logs -f databend-query
```

Wait until you see `Databend Query started`.

### Step 3: Connect to Databend

```shell
bendsql -u databend -p databend
```

Run a quick check:

```sql
SELECT NOW();
```

### Stop Databend

```shell
docker compose stop
```

To remove containers and volumes entirely:

```shell
docker compose down -v
```

### Advanced Configuration

To customize the configuration, you can mount your own config files instead of generating them in the entrypoint. Reference configs:

- databend-meta: https://github.com/databendlabs/databend/blob/main/scripts/ci/deploy/config/databend-meta-node-1.toml
- databend-query: https://github.com/databendlabs/databend/blob/main/scripts/ci/deploy/config/databend-query-node-1.toml

### Next Steps

- [Load data with COPY INTO](/guides/load-data/load/s3)
- [Connect with MySQL client or JDBC](/guides/connect/)
- For production deployment, see [Deploying on Kubernetes](/guides/self-hosted/deployment/production/deploying-databend-on-kubernetes)
