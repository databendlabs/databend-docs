---
title: Deploying on Docker
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

In this guide, you will deploy Databend along with [MinIO](https://min.io/) using [Docker](https://www.docker.com/) for a containerized setup on an [Amazon EC2](https://aws.amazon.com/ec2/) Ubuntu virtual machine.

:::note non-production use only
The MinIO deployment covered in this guide is only suitable for development and demonstration. Due to the limited resources in a single-machine environment, it is not recommended for production environments or performance testing.
:::

<StepsWrap>
<StepContent number="1">

### Set up Environment

Before you start, launch an instance on Amazon EC2 and install the Docker engine.

1. Log into the [Amazon EC2 console](https://console.aws.amazon.com/ec2/), and launch an Ubuntu instance with a memory capacity of at least 8 GiB. Once the instance is up, you can find the public IP address and the private IP address assigned to the instance on the instance details page.

![Alt text](/img/deploy/docker-instance.png)

2. Create a security group, and add an inbound rule to allow access to your instance through port `9001`, then add the security group to the instance.

![Alt text](/img/deploy/docker-create-sg.png)

3. Connect to your instance. There are many ways to connect to your instance from a local machine. For more information, see [https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-to-linux-instance.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-to-linux-instance.html).

4. Follow the [Docker User Manual](https://docs.docker.com/engine/install/ubuntu/) to install the Docker engine on your instance.

</StepContent>
<StepContent number="2">

### Deploy MinIO

1. Pull and run the MinIO image as a container with the following command:

:::note

- We change the console address to `9001` here to avoid port conflicts.
- The command also sets the root user credentials (`ROOTUSER`/`CHANGEME123`) which you will need to provide for authentication in the next steps. If you make changes to the root user credentials at this point, ensure that you maintain consistency throughout the entire process.
  :::

```shell
mkdir -p ${HOME}/minio/data

docker run -d \
   --name minio \
   --user $(id -u):$(id -g) \
   --net=host \
   -e "MINIO_ROOT_USER=ROOTUSER" \
   -e "MINIO_ROOT_PASSWORD=CHANGEME123" \
   -v ${HOME}/minio/data:/data \
   minio/minio server /data --console-address ":9001"
```

2. Run the command `docker logs minio` to find the MinIO API and console (WebUI) addresses in the log message:

```shell
docker logs minio

Formatting 1st pool, 1 set(s), 1 drives per set.
WARNING: Host local has more than 0 drives of set. A host failure will result in data becoming unavailable.
MinIO Object Storage Server
Copyright: 2015-2024 MinIO, Inc.
License: GNU AGPLv3 [https://www.gnu.org/licenses/agpl-3.0.html](https://www.gnu.org/licenses/agpl-3.0.html)
Version: RELEASE.2024-04-06T05-26-02Z (go1.21.9 linux/amd64)

// highlight-next-line
API: http://172.31.15.63:9000  http://172.17.0.1:9000  http://127.0.0.1:9000
// highlight-next-line
WebUI: http://172.31.15.63:9001 http://172.17.0.1:9001 http://127.0.0.1:9001

Docs: https://min.io/docs/minio/linux/index.html
Status:         1 Online, 0 Offline.
STARTUP WARNINGS:
- The standard parity is set to 0. This can lead to data loss.
```

3. Open your web browser on your local machine and visit the MinIO console using the WebUI address shown in the logs above (replace the IP address with your instance's public IP address). For example, if your instance's public IP address is `3.142.131.212`, then your MinIO console address would be `http://3.142.131.212:9001`.

![Alt text](/img/deploy/docker-minio.png)

4. Log into the MinIO console with the credentials `ROOTUSER`/`CHANGEME123`, and create a bucket named `databend`.

![Alt text](/img/deploy/docker-bucket.png)

</StepContent>

<StepContent number="3">

### Deploy Databend

1. Pull and run the Databend image as a container with the following command:

:::note

- Replace the `AWS_S3_ENDPOINT` value with your MinIO API address as shown in the MinIO log message returned by `docker logs minio`.
- When starting the Databend Docker container, you can specify the username and password using the environment variables `QUERY_DEFAULT_USER` and `QUERY_DEFAULT_PASSWORD`. If these variables are not provided, a default root user will be created without a password.
- The command below also creates a SQL user (`databend`/`databend`) which you will need to use to connect to Databend later. If you make changes to the SQL user at this point, ensure that you maintain consistency throughout the entire process.
  :::

```shell
docker run -d \
    --name databend \
    --net=host \
    -v meta_storage_dir:/var/lib/databend/meta \
    -v log_dir:/var/log/databend \
    -e QUERY_DEFAULT_USER=databend \
    -e QUERY_DEFAULT_PASSWORD=databend \
    -e QUERY_STORAGE_TYPE=s3 \
    -e AWS_S3_ENDPOINT=http://172.31.15.63:9000 \
    -e AWS_S3_BUCKET=databend \
    -e AWS_ACCESS_KEY_ID=ROOTUSER \
    -e AWS_SECRET_ACCESS_KEY=CHANGEME123 \
    datafuselabs/databend
```

2. Run the command `docker logs databend` to check the Databend log message and ensure the Databend container has started successfully:

```shell
docker logs databend

==> QUERY_CONFIG_FILE is not set, using default: /etc/databend/query.toml
==> /tmp/std-meta.log <==
<jemalloc>: Number of CPUs detected is not deterministic. Per-CPU arena disabled.
Databend Metasrv

Version: v1.2.410-4b8cd16f0c-simd(1.77.0-nightly-2024-04-08T12:27:32.972822624Z)
Working DataVersion: V002(2023-07-22: Store snapshot in a file)

Raft Feature set:
    Server Provide: { append:v0, install_snapshot:v0, install_snapshot:v1, vote:v0 }
    Client Require: { append:v0, install_snapshot:v0, vote:v0 }

On Disk Data:
    Dir: /var/lib/databend/meta
    DataVersion: V001(2023-05-15: Get rid of compat, use only openraft v08 data types)
    In-Upgrading: None

Log:
    File: enabled=true, level=INFO, dir=/var/log/databend, format=json
    Stderr: enabled=false(To enable: LOG_STDERR_ON=true or RUST_LOG=info), level=WARN, format=text
    OTLP: enabled=false, level=INFO, endpoint=http://127.0.0.1:4317, labels=
    Tracing: enabled=false, capture_log_level=INFO, otlp_endpoint=http://127.0.0.1:4317
Id: 0
Raft Cluster Name: foo_cluster
Raft Dir: /var/lib/databend/meta
Raft Status: single

HTTP API
   listening at 127.0.0.1:28002
gRPC API
   listening at 127.0.0.1:9191
   advertise:  -
Raft API
   listening at 127.0.0.1:28004
   advertise:  ip-172-31-15-63:28004

Upgrade on-disk data
    From: V001(2023-05-15: Get rid of compat, use only openraft v08 data types)
    To:   V002(2023-07-22: Store snapshot in a file)
Begin upgrading: version: V001, upgrading: V002
Write header: version: V001, upgrading: V002
tree raft_state not found
tree raft_log not found
Found state machine trees: []
Found min state machine id: 18446744073709551615
No state machine tree, skip upgrade
Finished upgrading: version: V002, upgrading: None
Write header: version: V002, upgrading: None
Wait for 180s for active leader...
Leader Id: 0
    Metrics: id=0, Leader, term=1, last_log=Some(3), last_applied=Some(1-0-3), membership={log_id:Some(1-0-3), voters:[{0:{EmptyNode}}], learners:[]}

Register this node: {id=0 raft=ip-172-31-15-63:28004 grpc=}

    Register-node: Ok

Databend Metasrv started

==> /tmp/std-query.log <==
<jemalloc>: Number of CPUs detected is not deterministic. Per-CPU arena disabled.
Databend Query

Version: v1.2.410-4b8cd16f0c(rust-1.77.0-nightly-2024-04-08T12:20:44.288903419Z)

Logging:
    file: enabled=true, level=INFO, dir=/var/log/databend, format=json
    stderr: enabled=false(To enable: LOG_STDERR_ON=true or RUST_LOG=info), level=WARN, format=text
    otlp: enabled=false, level=INFO, endpoint=http://127.0.0.1:4317, labels=
    query: enabled=false, dir=, otlp_endpoint=, labels=
    tracing: enabled=false, capture_log_level=INFO, otlp_endpoint=http://127.0.0.1:4317
Meta: connected to endpoints [
    "0.0.0.0:9191",
]
Memory:
    limit: unlimited
    allocator: jemalloc
    config: percpu_arena:percpu,oversize_threshold:0,background_thread:true,dirty_decay_ms:5000,muzzy_decay_ms:5000
Cluster: standalone
Storage: s3 | bucket=databend,root=,endpoint=http://172.31.15.63:9000
Cache: none
Builtin users: databend

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

</StepContent>

<StepContent number="4">

### Connect to Databend

In this step, you'll connect to Databend using [BendSQL](../../../30-sql-clients/00-bendsql/index.md) from your local machine.

1. Install BendSQL to your local machine. For instructions, see [Installing BendSQL](../../../30-sql-clients/00-bendsql/index.md#installing-bendsql).

2. Launch a terminal on your local machine, then run the command `bendsql -h <instance_public_ip> -u databend -p databend` to establish a connection with Databend. For example, if your instance's public IP address is `3.142.131.212`, the command would be `bendsql -h 3.142.131.212 -u databend -p databend`.

```shell
bendsql -h 3.142.131.212 -u databend -p databend

Welcome to BendSQL 0.16.0-homebrew.
Connecting to 3.142.131.212:8000 as user databend.
Connected to Databend Query v1.2.410-4b8cd16f0c(rust-1.77.0-nightly-2024-04-08T12:20:44.288903419Z)
```

You're all set! Now, you can execute a simple query to verify the deployment:

```sql
databend@3.142.131.212:8000/default> select now();

SELECT
  NOW()

┌────────────────────────────┐
│            now()           │
│          Timestamp         │
├────────────────────────────┤
│ 2024-04-17 17:53:56.307155 │
└────────────────────────────┘
1 row read in 0.178 sec. Processed 1 row, 1 B (5.62 row/s, 5 B/s)
```

</StepContent>
</StepsWrap>