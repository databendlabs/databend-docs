---
title: Deploying Databend Cluster
sidebar_label: Deploying Databend Cluster
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<!-- import LanguageFileParse from '@site/src/components/LanguageDocs/file-parse'
import VideoCN from '@site/docs/fragment/10-metasrv-deploy-cnvideo.md' -->

Databend recommends deploying a cluster with a minimum of three meta nodes and one query node for production environments. To gain a better understanding of Databend cluster deployment, see [Understanding Databend Deployments](../00-understanding-deployment-modes.md), which will familiarize you with the concept. This topic aims to provide a practical guide for deploying a Databend cluster.

## Before You Begin

Before you start, make sure you have completed the following preparations:

- Plan your deployment. This topic is based on the following cluster deployment plan, which involves setting up a meta cluster comprising three meta nodes and a query cluster consisting of two query nodes:

| Node #  | IP Address        | First Meta Node? | Tenant ID | Cluster ID |
| ------- | ----------------- | ----------------- | --------- | ---------- |
| Meta-1  | 172.16.125.128/24 | Yes               | -         | -          |
| Meta-2  | 172.16.125.129/24 | No                | -         | -          |
| Meta-3  | 172.16.125.130/24 | No                | -         | -          |
| Query-1 | 172.16.125.131/24 | -                 | default   | default    |
| Query-2 | 172.16.125.132/24 | -                 | default   | default    |

- Download and extract the latest Databend package to each node.

```shell title='Example:'
root@meta-1:/usr# mkdir databend && cd databend
root@meta-1:/usr/databend# curl -O https://repo.databend.com/databend/v1.2.410/databend-v1.2.410-aarch64-unknown-linux-gnu.tar.gz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  333M  100  333M    0     0  18.5M      0  0:00:18  0:00:18 --:--:-- 16.4M
root@meta-1:/usr/databend# tar -xzvf databend-v1.2.410-aarch64-unknown-linux-gnu.tar.gz
```

## Step 1: Deploy Meta Nodes

1. Configure the file [databend-meta.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) in each meta node:

   - Ensure that the **id** parameter in [raft_config] is set to a unique value.
   - Set the **single** parameter to _true_ for the leader meta node.
   - For follower meta nodes, comment out the **single** parameter using the # symbol, then add a parameter named **join** and provide an array of the IP addresses of the other meta nodes as its value.

| Parameter               | Meta-1         | Meta-2                                          | Meta-3                                          |
| ----------------------- | -------------- | ----------------------------------------------- | ----------------------------------------------- |
| grpc_api_advertise_host | 172.16.125.128 | 172.16.125.129                                  | 172.16.125.130                                  |
| id                      | 1              | 2                                               | 3                                               |
| raft_listen_host        | 172.16.125.128 | 172.16.125.129                                  | 172.16.125.130                                  |
| raft_advertise_host     | 172.16.125.128 | 172.16.125.129                                  | 172.16.125.130                                  |
| single                  | true           | /                                               | /                                               |
| join                    | /              | ["172.16.125.128:28004","172.16.125.130:28004"] | ["172.16.125.128:28004","172.16.125.129:28004"] |

```shell
cd configs && nano databend-meta.toml
```

<Tabs>
  <TabItem value="Meta-1" label="Meta-1" default>

```toml title="databend-meta.toml"
log_dir                 = "/var/log/databend"
admin_api_address       = "0.0.0.0:28002"
grpc_api_address        = "0.0.0.0:9191"
# databend-query fetch this address to update its databend-meta endpoints list,
# in case databend-meta cluster changes.
grpc_api_advertise_host = "172.16.125.128"

[raft_config]
id            = 1
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28004

# Assign raft_{listen|advertise}_host in test config.
# This allows you to catch a bug in unit tests when something goes wrong in raft meta nodes communication.
raft_listen_host = "172.16.125.128"
raft_advertise_host = "172.16.125.128"

# Start up mode: single node cluster
single        = true
```

  </TabItem>
  <TabItem value="Meta-2" label="Meta-2">

```toml title="databend-meta.toml"
log_dir                 = "/var/log/databend"
admin_api_address       = "0.0.0.0:28002"
grpc_api_address        = "0.0.0.0:9191"
# databend-query fetch this address to update its databend-meta endpoints list,
# in case databend-meta cluster changes.
grpc_api_advertise_host = "172.16.125.129"

[raft_config]
id            = 2
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28004

# Assign raft_{listen|advertise}_host in test config.
# This allows you to catch a bug in unit tests when something goes wrong in raft meta nodes communication.
raft_listen_host = "172.16.125.129"
raft_advertise_host = "172.16.125.129"

# Start up mode: single node cluster
# single        = true
join            = ["172.16.125.128:28004", "172.16.125.130:28004"]
```

  </TabItem>
  <TabItem value="Meta-3" label="Meta-3">

```toml title="databend-meta.toml"
log_dir                 = "/var/log/databend"
admin_api_address       = "0.0.0.0:28002"
grpc_api_address        = "0.0.0.0:9191"
# databend-query fetch this address to update its databend-meta endpoints list,
# in case databend-meta cluster changes.
grpc_api_advertise_host = "172.16.125.130"

[raft_config]
id            = 3
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28004

# Assign raft_{listen|advertise}_host in test config.
# This allows you to catch a bug in unit tests when something goes wrong in raft meta nodes communication.
raft_listen_host = "172.16.125.130"
raft_advertise_host = "172.16.125.130"

# Start up mode: single node cluster
# single        = true
join            = ["172.16.125.128:28004", "172.16.125.129:28004"]
```

  </TabItem>
</Tabs>

2. To start the meta nodes, run the following script on each node: Start with the leader node (Meta-1) and then proceed with the follower nodes sequentially.

```shell
cd .. && cd bin
./databend-meta -c ../configs/databend-meta.toml > meta.log 2>&1 &
```

3. Once all the meta nodes have started, you can check them using the following curl command:

```shell
curl 172.16.125.128:28002/v1/cluster/nodes
[{"name":"1","endpoint":{"addr":"172.16.125.128","port":28004},"grpc_api_advertise_address":"172.16.125.128:9191"},{"name":"2","endpoint":{"addr":"172.16.125.129","port":28004},"grpc_api_advertise_address":"172.16.125.129:9191"},{"name":"3","endpoint":{"addr":"172.16.125.130","port":28004},"grpc_api_advertise_address":"172.16.125.130:9191"}]
```

## Step 2: Deploy Query Nodes

1. Configure the file [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) in each query node. The following list only includes the parameters you need to set in each query node to reflect the deployment plan outlined in this document.

   - Set the tenant ID and cluster ID according to the deployment plan.
   - Set the **endpoints** parameter to an array of the IP addresses of the meta nodes.

| Parameter  | Query-1 / Query-2                                                   |
| ---------- | ------------------------------------------------------------------- |
| tenant_id  | default                                                             |
| cluster_id | default                                                             |
| endpoints  | ["172.16.125.128:9191","172.16.125.129:9191","172.16.125.130:9191"] |

```shell
cd configs/
nano databend-query.toml
```

<Tabs>
  <TabItem value="Query-1" label="Query-1" default>

```toml title="databend-query.toml"
...

tenant_id = "default"
cluster_id = "default"

...

[meta]
# It is a list of `grpc_api_advertise_host:<grpc-api-port>` of databend-meta config
endpoints = ["172.16.125.128:9191","172.16.125.129:9191","172.16.125.130:9191"]
...
```

  </TabItem>
    <TabItem value="Query-2" label="Query-2">

```toml title="databend-query.toml"
...

tenant_id = "default"
cluster_id = "default"

...

[meta]
# It is a list of `grpc_api_advertise_host:<grpc-api-port>` of databend-meta config
endpoints = ["172.16.125.128:9191","172.16.125.129:9191","172.16.125.130:9191"]
...
```

  </TabItem>
</Tabs>

2. For each query node, you also need to configure the object storage and admin users in the file [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml). For detailed instructions, see [here](../01-non-production/01-deploying-databend.md#deploying-a-query-node).

3. Run the following script on each query node to start them:

```shell
cd .. && cd bin
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

## Step 3: Verify Deployment

Connect to one of the query nodes using [BendSQL](/guides/sql-clients/bendsql/), and retrieve information about the existing query nodes:

```shell
bendsql -h 172.16.125.131
Welcome to BendSQL 0.16.0-homebrew.
Connecting to 172.16.125.131:8000 as user root.
Connected to Databend Query v1.2.410-4b8cd16f0c(rust-1.77.0-nightly-2024-04-08T12:21:53.785045868Z)

root@172.16.125.131:8000/default> SELECT * FROM system.clusters;

SELECT
  *
FROM
  system.clusters

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│          name          │ cluster │      host      │  port  │                                 version                                 │
├────────────────────────┼─────────┼────────────────┼────────┼─────────────────────────────────────────────────────────────────────────┤
│ 7rwadq5otY2AlBDdT25QL4 │ default │ 172.16.125.132 │   9090 │ v1.2.410-4b8cd16f0c(rust-1.77.0-nightly-2024-04-08T12:21:53.785045868Z) │
│ cH331pYsoFmvMSZXKRrn2  │ default │ 172.16.125.131 │   9090 │ v1.2.410-4b8cd16f0c(rust-1.77.0-nightly-2024-04-08T12:21:53.785045868Z) │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
2 rows read in 0.031 sec. Processed 2 rows, 327 B (64.1 rows/s, 10.23 KiB/s)
```

## Next Steps

After deploying Databend, you might need to learn about the following topics:

- [Load & Unload Data](/guides/load-data): Manage data import/export in Databend.
- [Visualize](/guides/visualize): Integrate Databend with visualization tools for insights.

<!-- <LanguageFileParse
cn={<VideoCN />}
/> -->
