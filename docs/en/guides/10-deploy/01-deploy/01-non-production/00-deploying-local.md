---
title: Deploying on Docker
---

<!-- import LanguageFileParse from '@site/src/components/LanguageDocs/file-parse'
import VideoCN from '@site/docs/fragment/01-deploying-local-cnvideo.md' -->

This guide walks you through deploying Databend with [MinIO](https://min.io/) using [Docker](https://www.docker.com/) for a fully containerized setup on your local machine.

:::note non-production use only
The MinIO deployment covered in this guide is only suitable for development and demonstration. Due to the limited resources in a single-machine environment, it is not recommended for production environments or performance testing.
:::

### Before You Start

Before you start, ensure you have the following prerequisites in place:

- Ensure that [Docker](https://www.docker.com/) is installed on your local machine.
- Ensure that BendSQL is installed on your machine. See [Installing BendSQL](/guides/sql-clients/bendsql/#installing-bendsql) for instructions on how to install BendSQL using various package managers.

### Deploy Databend

1. Pull and run the Databend image as a container with the following command:

:::note

- When starting the Databend Docker container, you can specify the username and password using the environment variables `QUERY_DEFAULT_USER` and `QUERY_DEFAULT_PASSWORD`. If these variables are not provided, a default root user will be created without a password.
- The command below also creates a SQL user (`databend`/`databend`) which you will need to use to connect to Databend later. If you make changes to the SQL user at this point, ensure that you maintain consistency throughout the entire process.
  :::

```shell
vim docker-compose.yml

services:
  minio:
    image: docker.io/minio/minio
    command: server /data
    ports:
      - "9000:9000"
    environment:
      - MINIO_ACCESS_KEY=MINIO_ADMIN
      - MINIO_SECRET_KEY=MINIO_SECRET
    volumes:
      - ./data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 5s
      retries: 3
  databend:
    image: datafuselabs/databend
    environment:
      - QUERY_DEFAULT_USER=databend
      - QUERY_DEFAULT_PASSWORD=databend
      - QUERY_STORAGE_TYPE=s3
      - AWS_S3_ENDPOINT=http://minio:9000
      - AWS_S3_BUCKET=databend
      - AWS_ACCESS_KEY_ID=MINIO_ADMIN
      - AWS_SECRET_ACCESS_KEY=MINIO_SECRET
    ports:
      - "3307:3307"
      - "8000:8000"
      - "8080:8080"
    depends_on:
      minio:
        condition: service_healthy
```

2. Start Databend

```shell
docker compose up
```

### Connect to Databend

Launch a terminal on your local machine, then run the following command to connect to Databend:

```shell
bendsql -u databend -p databend
```

```shell
Welcome to BendSQL 0.24.1-f1f7de0(2024-12-04T12:31:18.526234000Z).
Connecting to localhost:8000 as user databend.
Connected to Databend Query v1.2.697-d40f88cc51(rust-1.85.0-nightly-2025-02-14T11:30:59.842308760Z)
Loaded 1411 auto complete keywords from server.
Started web server at 127.0.0.1:8080
```

You're all set! Now, you can execute a simple query to verify the deployment:

```sql
🐳 databend@default:) CREATE OR REPLACE TABLE students (uid Int16, name String, age Int16);
🐳 databend@default:) INSERT INTO students VALUES (8888, 'Alice', 50);

╭─────────────────────────╮
│ number of rows inserted │
│          UInt64         │
├─────────────────────────┤
│                       1 │
╰─────────────────────────╯
1 row written in 0.059 sec. Processed 1 row, 19 B (16.95 rows/s, 322 B/s)

🐳 databend@default:) SELECT * FROM students;

╭──────────────────────────────────────────────────────╮
│       uid       │       name       │       age       │
│ Nullable(Int16) │ Nullable(String) │ Nullable(Int16) │
├─────────────────┼──────────────────┼─────────────────┤
│            8888 │ Alice            │              50 │
╰──────────────────────────────────────────────────────╯
1 row read in 0.008 sec. Processed 1 row, 28 B (125 rows/s, 3.42 KiB/s)
```

<!-- <LanguageFileParse
cn={<VideoCN />}
/> -->