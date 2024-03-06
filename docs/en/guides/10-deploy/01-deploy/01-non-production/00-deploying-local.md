---
title: Docker & Local Deployments
---
import FunctionDescription from '@site/src/components/FunctionDescription';
import GetLatest from '@site/src/components/GetLatest';
import DetailsWrap from '@site/src/components/DetailsWrap';
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

To quickly access Databend features and gain practical expertise, you have the following deployment options:

- [Deploying with Docker](#deploying-databend-on-docker): You can deploy Databend along with [MinIO](https://min.io/) on Docker for a containerized setup.
- [Deploying on Local Machine](#deploying-a-local-databend): You can opt for a local deployment and use the file system as storage if object storage is unavailable.

:::note non-production use only

- Object storage is a requirement for production use of Databend. The file system should only be used for evaluation, testing, and non-production scenarios.
- It is not recommended to deploy Databend on top of MinIO for production environments or performance testing purposes.
:::

## Deploying with Docker

Before you start, ensure that you have Docker installed on your system.

<StepsWrap>
<StepContent number="1" title="Deploy MinIO">

1. Pull and run the MinIO image as a container with the following command:

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

:::note
We change the console address to `:9001` here to avoid port conflicts.
:::

Please be aware that the command above also sets the root user credentials (ROOTUSER/CHANGEME123) which you will need to provide for authentication in the next steps. If you make changes to the root user credentials at this point, ensure that you maintain consistency throughout the entire process.

You can confirm that the MinIO container has started successfully by checking for the following message in the terminal:

```shell
❯ docker logs minio
Formatting 1st pool, 1 set(s), 1 drives per set.
WARNING: Host local has more than 0 drives of set. A host failure will result in data becoming unavailable.
MinIO Object Storage Server
Copyright: 2015-2024 MinIO, Inc.
License: GNU AGPLv3 <https://www.gnu.org/licenses/agpl-3.0.html>
Version: RELEASE.2024-01-05T22-17-24Z (go1.21.5 linux/arm64)

Status:         1 Online, 0 Offline.
S3-API: http://192.168.106.3:9000  http://172.17.0.1:9000  http://192.168.5.1:9000  http://127.0.0.1:9000
Console: http://192.168.106.3:9001 http://172.17.0.1:9001 http://192.168.5.1:9001 http://127.0.0.1:9001

Documentation: https://min.io/docs/minio/linux/index.html
Warning: The standard parity is set to 0. This can lead to data loss.
```

2. Open your web browser and visit http://127.0.0.1:9001/ (login credentials: ROOTUSER/CHANGEME123). Create a bucket named **databend**.

</StepContent>

<StepContent number="2" title="Deploy Databend">

Pull and run the Databend image as a container with the following command:

```shell
docker run -d \
    --name databend \
    --net=host \
    -v meta_storage_dir:/var/lib/databend/meta \
    -v log_dir:/var/log/databend \
    -e QUERY_DEFAULT_USER=databend \
    -e QUERY_DEFAULT_PASSWORD=databend \
    -e QUERY_STORAGE_TYPE=s3 \
    -e AWS_S3_ENDPOINT=http://${IP}:9000 \
    -e AWS_S3_BUCKET=databend \
    -e AWS_ACCESS_KEY_ID=ROOTUSER \
    -e AWS_SECRET_ACCESS_KEY=CHANGEME123 \
    datafuselabs/databend
```

> There ${IP} is 192.168.106.3 or 192.168.5.1, The application needs to access s3. So if you don't know ${IP}, you can refer to the output of `docker logs minio` 

When starting the Databend Docker container, you can specify the username and password using the environment variables QUERY_DEFAULT_USER and QUERY_DEFAULT_PASSWORD. If these variables are not provided, a default root user will be created without a password. The command above creates a SQL user (databend/databend) which you will need to use to connect to Databend in the next step. If you make changes to the SQL user at this point, ensure that you maintain consistency throughout the entire process.

You can confirm that the Databend container has started successfully by checking for the following message in the terminal:

```shell
❯ docker logs databend
==> QUERY_CONFIG_FILE is not set, using default: /etc/databend/query.toml
==> /tmp/std-meta.log <==
Databend Metasrv

Version: v1.2.287-nightly-8930689add-simd(1.75.0-nightly-2024-01-07T22:13:53.249351145Z)
Working DataVersion: V002(2023-07-22: Store snapshot in a file)

Raft Feature set:
    Server Provide: { append:v0, install_snapshot:v0, install_snapshot:v1, vote:v0 }
    Client Require: { append:v0, install_snapshot:v0, vote:v0 }

On Disk Data:
    Dir: /var/lib/databend/meta
    DataVersion: V0(2023-04-21: compatible with openraft v07 and v08, using openraft::compat)
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
   advertise:  colima:28004

Upgrade on-disk data
    From: V0(2023-04-21: compatible with openraft v07 and v08, using openraft::compat)
    To:   V001(2023-05-15: Get rid of compat, use only openraft v08 data types)
Begin upgrading: version: V0, upgrading: V001
Write header: version: V0, upgrading: V001
tree raft_state not found
tree raft_log not found
Upgraded 0 records
Finished upgrading: version: V001, upgrading: None
Write header: version: V001, upgrading: None
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

Register this node: {id=0 raft=colima:28004 grpc=}

    Register-node: Ok

Databend Metasrv started

==> /tmp/std-query.log <==
Databend Query

Version: v1.2.287-nightly-8930689add(rust-1.75.0-nightly-2024-01-07T22:05:46.363097970Z)

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
Storage: s3 | bucket=databend,root=,endpoint=http://127.0.0.1:9000
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

<StepContent number="3" title="Connect to Databend">

To establish a connection with Databend, you'll use the BendSQL CLI tool in this step. For instructions on how to install and operate BendSQL, see [BendSQL](../../../30-sql-clients/00-bendsql/index.md).

1. To establish a connection with Databend using the SQL user (databend/databend), run the following command:

```shell
❯ bendsql -udatabend -pdatabend
Welcome to BendSQL 0.12.1-homebrew.
Connecting to localhost:8000 as user databend.
Connected to DatabendQuery v1.2.287-nightly-8930689add(rust-1.75.0-nightly-2024-01-07T22:05:46.363097970Z)

databend@localhost:8000/default>
```

2. To verify the deployment, you can create a table and insert some data with BendSQL:

```shell
databend@localhost:8000/default> CREATE DATABASE test;
0 row written in 0.042 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

databend@localhost:8000/default> use test;
0 row read in 0.028 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

databend@localhost:8000/test> CREATE TABLE mytable(a int);
0 row written in 0.053 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

databend@localhost:8000/test> INSERT INTO mytable VALUES(1);
1 row written in 0.108 sec. Processed 1 row, 5 B (9.27 row/s, 46 B/s)

databend@localhost:8000/test> INSERT INTO mytable VALUES(2);
1 row written in 0.102 sec. Processed 1 row, 5 B (9.81 row/s, 49 B/s)

databend@localhost:8000/test> INSERT INTO mytable VALUES(3);
1 row written in 0.120 sec. Processed 1 row, 5 B (8.33 row/s, 41 B/s)

databend@localhost:8000/test> select * from mytable;
┌─────────────────┐
│        a        │
│ Nullable(Int32) │
├─────────────────┤
│               1 │
│               2 │
│               3 │
└─────────────────┘
3 rows read in 0.066 sec. Processed 3 rows, 15 B (45.2 rows/s, 225 B/s)
```

As the table data is stored in the bucket, you will notice an increase in the bucket size from 0.

![Alt text](@site/docs/public/img/deploy/minio-deployment-verify.png)

</StepContent>
</StepsWrap>

## Deploying on Local Machine

Follow the instructions below to deploy Databend on your local machine.

<StepsWrap>

<StepContent number="1" title="Download Databend">

1. Download the installation package suitable for your platform from the [Download](/download) page.

2. Extract the installation package to a local directory.

</StepContent>

<StepContent number="2" title="Start Databend">

1. Configure an admin user. You will utilize this account to connect to Databend. For more information, see [Configuring Admin Users](../../04-references/01-admin-users.md). For this example, uncomment the following lines to choose this account:

```sql  title="databend-query.toml"
[[query.users]]
name = "root"
auth_type = "no_password"
```

2. Open a terminal and navigate to the folder where the extracted files and folders are stored.

3. Run the script **start.sh** in the folder **scripts**:
    MacOS might prompt an error saying "*databend-meta can't be opened because Apple cannot check it for malicious software.*". To proceed, open **System Settings** on your Mac, select **Privacy & Security** on the left menu, and click **Open Anyway** for databend-meta in the **Security** section on the right side. Do the same for the error on databend-query.

```shell
./scripts/start.sh
```
:::tip
In case you encounter the subsequent error messages while attempting to start Databend:

```shell
==> query.log <==
: No getcpu support: percpu_arena:percpu
: option background_thread currently supports pthread only
Databend Query start failure, cause: Code: 1104, Text = failed to create appender: Os { code: 13, kind: PermissionDenied, message: "Permission denied" }.
```

Run the following commands and try starting Databend again:

```shell
sudo mkdir /var/log/databend
sudo mkdir /var/lib/databend
sudo chown -R $USER /var/log/databend
sudo chown -R $USER /var/lib/databend
```
:::

3. Run the following command to verify Databend has started successfully:

```shell
ps aux | grep databend

---
eric             12789   0.0  0.0 408495808   1040 s003  U+    2:16pm   0:00.00 grep databend
eric             12781   0.0  0.5 408790416  38896 s003  S     2:15pm   0:00.05 bin/databend-query --config-file=configs/databend-query.toml
eric             12776   0.0  0.3 408654368  24848 s003  S     2:15pm   0:00.06 bin/databend-meta --config-file=configs/databend-meta.toml
```

</StepContent>

<StepContent number="3" title="Connect to Databend">

To establish a connection with Databend, you'll use the BendSQL CLI tool in this step. For instructions on how to install and operate BendSQL, see [BendSQL](../../../30-sql-clients/00-bendsql/index.md).

1. To establish a connection with a local Databend, execute the following command:

```shell
eric@Erics-iMac ~ % bendsql
Welcome to BendSQL 0.13.2-4419bda(2024-02-02T04:21:46.064145000Z).
Connecting to localhost:8000 as user root.
Connected to DatabendQuery v1.2.252-nightly-193ed56304(rust-1.75.0-nightly-2023-12-12T22:07:25.371440000Z)

root@localhost:8000/default> 
```

2. Query the Databend version to verify the connection:

```sql
root@localhost> SELECT VERSION();

SELECT
  VERSION()

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                          version()                                                         │
│                                                           String                                                           │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DatabendQuery v1.1.75-nightly-59eea5df495245b9475f81a28c7b688f013aac05(rust-1.72.0-nightly-2023-06-28T01:04:32.054683000Z) │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
1 row in 0.024 sec. Processed 1 rows, 1B (41.85 rows/s, 41B/s)
```

</StepContent>
</StepsWrap>

## Next Steps

After deploying Databend, you might need to learn about the following topics:

- [Load & Unload Data](/guides/load-data): Manage data import/export in Databend.
- [Visualize](/guides/visualize): Integrate Databend with visualization tools for insights.
