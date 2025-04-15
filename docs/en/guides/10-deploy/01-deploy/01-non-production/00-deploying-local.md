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

### Deploy MinIO

1. Pull and run the MinIO image as a container with the following command:

:::note

- We change the console address to `9001` here to avoid port conflicts.
- The command also sets the root user credentials (`ROOTUSER`/`CHANGEME123`) which you will need to provide for authentication in the next steps. If you make changes to the root user credentials at this point, ensure that you maintain consistency throughout the entire process.
  :::

```shell
docker run -d --name minio \
  -e "MINIO_ACCESS_KEY=ROOTUSER" \
  -e "MINIO_SECRET_KEY=CHANGEME123" \
  -p 9000:9000 \
  -p 9001:9001 \
  minio/minio server /data \
    --address :9000 \
    --console-address :9001
```

2. Run the command `docker logs minio` to find the MinIO API and console (WebUI) addresses in the log message:

```shell
docker logs minio
```

```
INFO: WARNING: MINIO_ACCESS_KEY and MINIO_SECRET_KEY are deprecated.
         Please use MINIO_ROOT_USER and MINIO_ROOT_PASSWORD
INFO: Formatting 1st pool, 1 set(s), 1 drives per set.
INFO: WARNING: Host local has more than 0 drives of set. A host failure will result in data becoming unavailable.
MinIO Object Storage Server
Copyright: 2015-2025 MinIO, Inc.
License: GNU AGPLv3 - https://www.gnu.org/licenses/agpl-3.0.html
Version: RELEASE.2025-04-03T14-56-28Z (go1.24.2 linux/arm64)

API: http://172.17.0.2:9000  http://127.0.0.1:9000
WebUI: http://172.17.0.2:9001 http://127.0.0.1:9001

Docs: https://docs.min.io
INFO:
 You are running an older version of MinIO released 5 days before the latest release
 Update: Run `mc admin update ALIAS`
```

3. Open your web browser on your local machine and visit the MinIO console using the WebUI address shown (`http://127.0.0.1:9001`) in the logs above.

![Alt text](/img/deploy/docker-minio.png)

4. Log into the MinIO console with the credentials `ROOTUSER`/`CHANGEME123`, and create a bucket named `databend`.

![Alt text](/img/deploy/docker-bucket.png)

### Deploy Databend

1. Pull and run the Databend image as a container with the following command:

:::note

- When starting the Databend Docker container, you can specify the username and password using the environment variables `QUERY_DEFAULT_USER` and `QUERY_DEFAULT_PASSWORD`. If these variables are not provided, a default root user will be created without a password.
- The command below also creates a SQL user (`databend`/`databend`) which you will need to use to connect to Databend later. If you make changes to the SQL user at this point, ensure that you maintain consistency throughout the entire process.
  :::

```shell
docker run -d \
  --name databend \
  -p 3307:3307 \
  -p 8000:8000 \
  -p 8124:8124 \
  -p 8900:8900 \
  -e QUERY_DEFAULT_USER=databend \
  -e QUERY_DEFAULT_PASSWORD=databend \
  -e QUERY_STORAGE_TYPE=s3 \
  -e AWS_S3_ENDPOINT=http://host.docker.internal:9000 \
  -e AWS_S3_BUCKET=databend \
  -e AWS_ACCESS_KEY_ID=ROOTUSER \
  -e AWS_SECRET_ACCESS_KEY=CHANGEME123 \
  datafuselabs/databend
```

2. Run the command `docker logs databend` to check the Databend log message and ensure the Databend container has started successfully:

```shell
docker logs databend
```

```shell
==> QUERY_CONFIG_FILE is not set, using default: /etc/databend/query.toml
==> /tmp/std-meta.log <==
Databend Metasrv

Version: v1.2.697-d40f88cc51-simd(1.85.0-nightly-2025-02-14T11:57:01.874747910Z)
Working DataVersion: V004(2024-11-11: WAL based raft-log)

Raft Feature set:
    Server Provide: { append:v0, install_snapshot:v1, install_snapshot:v3, vote:v0 }
    Client Require: { append:v0, install_snapshot:v3, vote:v0 }

Disk  Data: V002(2023-07-22: Store snapshot in a file); Upgrading: None
      Dir: /var/lib/databend/meta

Log   File:   enabled=true, level='Warn,databend_=Info,openraft=Info', dir=/var/log/databend, format=json, limit=48
      Stderr: enabled=false(To enable: LOG_STDERR_ON=true or RUST_LOG=info), level=WARN, format=text
Raft  Id: 0; Cluster: foo_cluster
      Dir: /var/lib/databend/meta
      Status: single

HTTP API listen at: 127.0.0.1:28002
gRPC API listen at: 127.0.0.1:9191 advertise: -
Raft API listen at: 127.0.0.1:28004 advertise: 055b9e5d09a9:28004

Upgrade ondisk data if out of date: V002
    Find and clean previous unfinished upgrading
Upgrade on-disk data
    From: V002(2023-07-22: Store snapshot in a file)
    To:   V003(2024-06-27: Store snapshot in rotbl)
    No V002 snapshot, skip upgrade
    Finished upgrading: V003
Upgrade on-disk data
    From: V003(2024-06-27: Store snapshot in rotbl)
    To:   V004(2024-11-11: WAL based raft-log)
    Upgrade V003 raft log in sled db to V004
    Clean upgrading: V003 -> V004 (cleaning)
    Remove V003 log from sled db
        Removing sled tree: header
        Removing sled tree: raft_log
        Removing sled tree: raft_state
    Done: Remove V003 log from sled db
        Removing: /var/lib/databend/meta/heap
        Removing: /var/lib/databend/meta/conf
        Removing: /var/lib/databend/meta/db
        Removing: /var/lib/databend/meta/DO_NOT_USE_THIS_DIRECTORY_FOR_ANYTHING
    Finished upgrading: V004
Upgrade ondisk data finished: V004
Wait for 180s for active leader...
Leader Id: 0
    Metrics: id=0, Leader, term=1, last_log=Some(3), last_applied=Some(T1-N0.3), membership={log_id:Some(T1-N0.3), {voters:[{0:EmptyNode}], learners:[]}}

Register this node: {id=0 raft=055b9e5d09a9:28004 grpc=}

    Register-node: Ok

Databend Metasrv started

==> /tmp/std-query.log <==
Databend Query

Version: v1.2.697-d40f88cc51(rust-1.85.0-nightly-2025-02-14T11:30:59.842308760Z)

Logging:
    file: enabled=true, level='INFO', dir=/var/log/databend, format=json, limit=48
    stderr: enabled=false(To enable: LOG_STDERR_ON=true or RUST_LOG=info), level=WARN, format=text

Meta: connected to endpoints [
    "0.0.0.0:9191",
]

Memory:
    limit: unlimited
    allocator: jemalloc
    config: percpu_arena:percpu,oversize_threshold:0,background_thread:true,dirty_decay_ms:5000,muzzy_decay_ms:5000

Cluster: standalone

Storage: s3 | bucket=databend,root=,endpoint=http://host.docker.internal:9000
Disk cache:
    storage: none
    path: DiskCacheConfig { max_bytes: 21474836480, path: "./.databend/_cache", sync_data: true }
    reload policy: reset

Builtin users: databend

Builtin UDFs:

Admin
    listened at 0.0.0.0:8080
MySQL
    listened at 0.0.0.0:3307
    connect via: mysql -u${USER} -p${PASSWORD} -h0.0.0.0 -P3307
Clickhouse(http)
    listened at 0.0.0.0:8124
    usage:  echo 'create table test(foo string)' | curl -u${USER} -p${PASSWORD}: '0.0.0.0:8124' --data-binary  @-
echo '{"foo": "bar"}' | curl -u${USER} -p${PASSWORD}: '0.0.0.0:8124/?query=INSERT%20INTO%20test%20FORMAT%20JSONEachRow' --data-binary @-
Databend HTTP
    listened at 0.0.0.0:8000
    usage:  curl -u${USER} -p${PASSWORD}: --request POST '0.0.0.0:8000/v1/query/' --header 'Content-Type: application/json' --data-raw '{"sql": "SELECT avg(number) FROM numbers(100000000)"}'
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
databend@localhost:8000/default> SELECT NOW();

SELECT NOW()

┌────────────────────────────┐
│            now()           │
│          Timestamp         │
├────────────────────────────┤
│ 2025-04-10 03:14:06.778815 │
└────────────────────────────┘
1 row read in 0.003 sec. Processed 1 row, 1 B (333.33 rows/s, 333 B/s)
```

<!-- <LanguageFileParse
cn={<VideoCN />}
/> -->