---
title: Deploying on Docker
---

This guide walks you through deploying Databend using Docker Compose with separate **databend-meta**, **databend-query**, and **MinIO** containers — giving you a clear picture of how the components fit together.

:::note Non-production use only
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

### Step 2: Start Databend

```shell
docker compose up -d
```

Check that all three containers are running:

```shell
docker compose ps
```

You should see `minio`, `databend-meta`, and `databend-query` all in a running state. To follow the logs:

```shell
docker compose logs -f databend-query
```

Wait until you see a line like `Databend Query started`.

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

### Next Steps

- [Load data with COPY INTO](/guides/load-data/load/s3)
- [Connect with MySQL client or JDBC](/guides/connect/)
- For production deployment, see [Deploying on Kubernetes](/guides/deploy/deploy/production/deploying-databend-on-kubernetes)
