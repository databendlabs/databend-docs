---
title: Manage Query Warehouse through SQL on Premise
sidebar_label: Manage Query Warehouse through SQL
description: How to manage scalable and flexible query warehouse through SQL on premise.
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='Dynamic Cluster'/>


This topic explains how to manage scalable and flexible query warehouse through SQL on premise.

## Understand Warehouse

![Warehouse On Premise](/img/deploy/on-premise-warehouse.png)

**Scenario Description**
Previously, we introduced to deploy databend using static `tenant_id` and `cluster_id` in the [deployment](https://docs.databend.com/guides/self-hosted/deploy/production/metasrv-deploy#step-2-deploy-query-nodes).

For on-premise deployments to be successful, it's essential to have a skilled DevOps team in place to effectively manage the deployment and configuration. This includes:
1. Strategically routing queries to various clusters to enhance concurrency during peak usage times.
2. Adjusting cluster sizes by restarting nodes and reallocating them to different clusters as needed.
3. Implementing a robust load balancing strategy for cluster nodes, which can present unique challenges in an on-premise environment.

Databend's on-premise warehouse SQL commands provide a powerful solution to let user built a multi-cluster query warehouse within several seconds. These commands enable you to:

- Build and manage multiple query warehouses to improve query concurrency during peak hours
- Dynamically route queries across different clusters to handle peak traffic periods
- Implement intelligent load balancing across cluster nodes
- Seamlessly reallocate nodes between warehouses and clusters with zero downtime

This flexibility allows you to optimize resource utilization and maintain high availability while adapting to changing workload demands in your on-premise deployment.

### Warehouse related concepts

The following concepts are important to understand when working with warehouses in Databend:
- **Warehouse**: A collection of compute resources that users interact with to execute SQL queries. It can internally contain multiple clusters to handle concurrent query workloads.

- **Cluster**: An abstract concept representing a group of compute resources. Each SQL query will try to use all nodes's resources(including CPU, memory, disk, etc.) to finish the query. A warehouse consists of multiple clusters, with each cluster being physically isolated. When increased concurrent processing capacity is needed for a warehouse, new clusters can be added. In previous static configured `tenant_id` and `cluster_id` deployment, the warehouse is a single cluster warehouse named `cluster_id`.

- **Node Group**: A grouping of nodes that can either correspond one-to-one with nodes or have multiple nodes belonging to the same group. it can be understand as some sort of label help node to be allocated to different warehouse and cluster.

## Deploy Databend Query with System Managed Warehouse

- Change Your Query Configuration.

```toml title='databend-query.toml'
[query]
....
# To enable warehouse feature, you MUST not set cluster_id
# cluster_id = "test_cluster"
...
[query.resources_management]
type = "system_managed"
node_group = "node_group"
...
```

- Start Databend Query

```shell
./databend-query --config databend-query.toml
```


## Using SQL to manage your on-premise warehouse

### Check current online nodes in the tenant

```sql
show online nodes;

┌──────────────────────────────────────────────────────────────────────────────────────────-─────┐
│           id           │      type     │ node_group │ warehouse │ cluster │     version        │
├────────────────────────┼───────────────┼────────────┼───────────┼─────────┼────────────────────┤
│ 9rabYMxa0ReDyZe6F9igH5 │ SystemManaged │ log_node   │           │         │ v1.2.686-nightly   │
│ CbzfLlTVO29EhkZXdeR625 │ SystemManaged │ log_node   │           │         │ v1.2.686-nightly   │
│ O0kOetbvkFjxrQ2kx4uMI  │ SystemManaged │ dev_node   │           │         │ v1.2.686-nightly   │
│ R2epWlGVd8S0maSTuwbsv4 │ SystemManaged │ dev_node   │           │         │ v1.2.686-nightly   │
│ SoZcaT4gmhVoGKcChlDw93 │ SystemManaged │ infra_node │           │         │ v1.2.686-nightly   │
│ UeNVzwHCXhxJTTB4Xonj07 │ SystemManaged │ dev_node   │           │         │ v1.2.686-nightly   │
│ Zu7rmhVZ2s2HqTUCdFBdu2 │ SystemManaged │ infra_node │           │         │ v1.2.686-nightly   │
│ bRubWZEzIibFgRgFad2MS3 │ SystemManaged │ infra_node │           │         │ v1.2.686-nightly   │
│ ilPer0ps5wWnEDOLIlk821 │ SystemManaged │ infra_node │           │         │ v1.2.686-nightly   │
│ shnWu1TC41sAxVwJMIVQF3 │ SystemManaged │ infra_node │           │         │ v1.2.686-nightly   │
└───────────────────────────────────────────────────────────────────────────────────────────---──┘
``` 

###  Create a single cluster warehouse with 2 nodes
this command will create a warehouse named `test_warehouse_1` with 2 nodes.
```sql
root@localhost:8000/default> create warehouse test_warehouse_1 with warehouse_size = 2;

root@localhost:8000/default> show online nodes;

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           id           │      type     │ node_group │     warehouse    │ cluster │           version           │
├────────────────────────┼───────────────┼────────────┼──────────────────┼─────────┼─────────────────────────────┤
│ 9rabYMxa0ReDyZe6F9igH5 │ SystemManaged │ log_node   │                  │         │ v1.2.686-nightly           │
│ CbzfLlTVO29EhkZXdeR625 │ SystemManaged │ log_node   │                  │         │ v1.2.686-nightly           │
│ O0kOetbvkFjxrQ2kx4uMI  │ SystemManaged │ dev_node   │                  │         │ v1.2.686-nightly           │
│ R2epWlGVd8S0maSTuwbsv4 │ SystemManaged │ dev_node   │                  │         │ v1.2.686-nightly           │
│ SoZcaT4gmhVoGKcChlDw93 │ SystemManaged │ infra_node │ test_warehouse_1 │ default │ v1.2.686-nightly           │
│ UeNVzwHCXhxJTTB4Xonj07 │ SystemManaged │ dev_node   │                  │         │ v1.2.686-nightly           │
│ Zu7rmhVZ2s2HqTUCdFBdu2 │ SystemManaged │ infra_node │ test_warehouse_1 │ default │ v1.2.686-nightly           │
│ bRubWZEzIibFgRgFad2MS3 │ SystemManaged │ infra_node │                  │         │ v1.2.686-nightly           │
│ ilPer0ps5wWnEDOLIlk821 │ SystemManaged │ infra_node │                  │         │ v1.2.686-nightly           │
│ shnWu1TC41sAxVwJMIVQF3 │ SystemManaged │ infra_node │                  │         │ v1.2.686-nightly           │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Get all existing warehouses

```sql
root@localhost:8000/default> show warehouses;

┌───────────────────────────────────────────┐
│    warehouse   │      type      │  status │
├────────────────┼────────────────┼─────────┤
│ test_warehouse │ System-Managed │ Running │
└───────────────────────────────────────────┘
```

### Use one of the existing warehouses to run query
system.clusters is a system table that stores the information of all clusters, and their nodes.

```sql
root@localhost:8000/default> use warehouse test_warehouse_1;

root@(test_warehouse_1)/default> select * from system.clusters;

┌───────────────────────────────────────────────────────────────────────────────────────────┐
│          name          │          cluster         │    host   │  port  │     version      │
├────────────────────────┼──────────────────────────┼───────────┼────────┼──────────────────┤
│ SoZcaT4gmhVoGKcChlDw93 │ test_warehouse_1/default │ 127.0.0.1 │  27498 │ v1.2.686-nightly │
│ Zu7rmhVZ2s2HqTUCdFBdu2 │ test_warehouse_1/default │ 127.0.0.1 │  29798 │ v1.2.686-nightly │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

### Add clusters to an existing warehouse
Add clusters to an existing warehouse will allow the warehouse to route queries to the new clusters, thus far increase the concurrency of the warehouse.

:::note
Currently, warehouse will forward queries to different clusters randomly.
:::

```sql
root@localhost:8000/default> alter warehouse test_warehouse add cluster test_cluster with cluster_size = 3;

alter warehouse test_warehouse add cluster test_cluster with cluster_size = 3


root@localhost:8000/default> show online nodes;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           id           │      type     │ node_group │    warehouse   │    cluster   │           version           │
├────────────────────────┼───────────────┼────────────┼────────────────┼──────────────┼─────────────────────────────┤
│ 9rabYMxa0ReDyZe6F9igH5 │ SystemManaged │ log_node   │                │              │ v1.2.686-nightly            │
│ CbzfLlTVO29EhkZXdeR625 │ SystemManaged │ log_node   │                │              │ v1.2.686-nightly            │
│ O0kOetbvkFjxrQ2kx4uMI  │ SystemManaged │ dev_node   │ test_warehouse │ test_cluster │ v1.2.686-nightly            │
│ R2epWlGVd8S0maSTuwbsv4 │ SystemManaged │ dev_node   │ test_warehouse │ test_cluster │ v1.2.686-nightly            │
│ SoZcaT4gmhVoGKcChlDw93 │ SystemManaged │ infra_node │ test_warehouse │ test_cluster │ v1.2.686-nightly            │
│ UeNVzwHCXhxJTTB4Xonj07 │ SystemManaged │ dev_node   │                │              │ v1.2.686-nightly            │
│ Zu7rmhVZ2s2HqTUCdFBdu2 │ SystemManaged │ infra_node │                │              │ v1.2.686-nightly            │
│ bRubWZEzIibFgRgFad2MS3 │ SystemManaged │ infra_node │                │              │ v1.2.686-nightly            │
│ ilPer0ps5wWnEDOLIlk821 │ SystemManaged │ infra_node │ test_warehouse │ default      │ v1.2.686-nightly            │
│ shnWu1TC41sAxVwJMIVQF3 │ SystemManaged │ infra_node │ test_warehouse │ default      │ v1.2.686-nightly            │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Using node group to create and manage warehouse

Databend allow user to create multi-cluster warehouse with different node group.  nodes under the same node group will be allocated randomly to designated warehouse. 


#### Create a warehouse in designated node groups
```sql
root@localhost:8000/default> create warehouse test_warehouse(assign 1 nodes from log_node, assign 2 nodes from infra_node);

root@localhost:8000/default> show online nodes;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           id           │      type     │ node_group │    warehouse   │ cluster │           version           │
├────────────────────────┼───────────────┼────────────┼────────────────┼─────────┼─────────────────────────────┤
│ 6yCaMTMAZbP6nSsNfzkSG5 │ SystemManaged │ log_node   │                │         │ v1.2.686-nightly            │
│ 8g0E9LxG3mk2eBhKNT9DT2 │ SystemManaged │ log_node   │ test_warehouse │ default │ v1.2.686-nightly            │
│ AJ4V671FSZiWz2NUIWg6w5 │ SystemManaged │ dev_node   │                │         │ v1.2.686-nightly            │
│ DQUhMHYSdKqML5HJFhVbn4 │ SystemManaged │ infra_node │                │         │ v1.2.686-nightly            │
│ Ji2SZp1zsJQHLyBUTDcrm1 │ SystemManaged │ infra_node │                │         │ v1.2.686-nightly            │
│ a4XEkpidlCSuRkB7cMlCv4 │ SystemManaged │ dev_node   │                │         │ v1.2.686-nightly            │
│ dtawAX7FT56iJJv6rER6R2 │ SystemManaged │ infra_node │                │         │ v1.2.686-nightly            │
│ jze3JfzDyY2amoN7Zbq3u6 │ SystemManaged │ infra_node │ test_warehouse │ default │ v1.2.686-nightly            │
│ s7Yfg7OgXPHAX7pETAbcc  │ SystemManaged │ dev_node   │                │         │ v1.2.686-nightly            │
│ tM8lj2NOTTtTwjnQIzCwI6 │ SystemManaged │ infra_node │ test_warehouse │ default │ v1.2.686-nightly            │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Add a cluster to an existing warehouse, cluster nodes come from different node groups
```sql
root@localhost:8000/default> alter warehouse test_warehouse add cluster test_cluster (assign 1 nodes from dev_node, assign 1 nodes from infra_node);

root@localhost:8000/default> show online nodes;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           id           │      type     │ node_group │    warehouse   │    cluster   │           version           │
├────────────────────────┼───────────────┼────────────┼────────────────┼──────────────┼─────────────────────────────┤
│ DZB0EWAz4EiR9UnndkQY92 │ SystemManaged │ dev_node   │                │              │ v1.2.686-nightly            │
│ GFkSBv96W9bWBa85n5sC87 │ SystemManaged │ infra_node │                │              │ v1.2.686-nightly            │
│ WwSuc1P3f58CuEd6JcO4L3 │ SystemManaged │ infra_node │                │              │ v1.2.686-nightly            │
│ cjHBOKg8Q39aL30S1FpGN6 │ SystemManaged │ log_node   │                │              │ v1.2.686-nightly            │
│ eAlj9SBIdJPRNDjERwAve4 │ SystemManaged │ infra_node │ test_warehouse │ test_cluster │ v1.2.686-nightly            │
│ hYCjglpJvjglu8krdYGgL  │ SystemManaged │ infra_node │ test_warehouse │ default      │ v1.2.686-nightly            │
│ nrMfUZljjKQFMPP7H61GX1 │ SystemManaged │ dev_node   │                │              │ v1.2.686-nightly            │
│ tEIG103u3Yd7UGS5Fd3mh  │ SystemManaged │ log_node   │ test_warehouse │ default      │ v1.2.686-nightly            │
│ wXgSNxxOTOkjazEPLbDVF3 │ SystemManaged │ infra_node │ test_warehouse │ default      │ v1.2.686-nightly            │
│ xqWmN2SR1wRjMUt4T2Oy66 │ SystemManaged │ dev_node   │ test_warehouse │ test_cluster │ v1.2.686-nightly            │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Add nodes to an existing warehouse, cluster nodes come from different node groups

```sql
root@localhost:8000/default> alter warehouse test_warehouse assign nodes(assign 1 nodes from dev_node for default, assign 1 nodes from infra_node for default);

root@localhost:8000/default> show online nodes;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           id           │      type     │ node_group │    warehouse   │ cluster │           version           │
├────────────────────────┼───────────────┼────────────┼────────────────┼─────────┼─────────────────────────────┤
│ 6yCaMTMAZbP6nSsNfzkSG5 │ SystemManaged │ log_node   │                │         │ v1.2.686-nightly            │
│ 8g0E9LxG3mk2eBhKNT9DT2 │ SystemManaged │ log_node   │ test_warehouse │ default │ v1.2.686-nightly            │
│ AJ4V671FSZiWz2NUIWg6w5 │ SystemManaged │ dev_node   │                │         │ v1.2.686-nightly            │
│ DQUhMHYSdKqML5HJFhVbn4 │ SystemManaged │ infra_node │                │         │ v1.2.686-nightly            │
│ Ji2SZp1zsJQHLyBUTDcrm1 │ SystemManaged │ infra_node │                │         │ v1.2.686-nightly            │
│ a4XEkpidlCSuRkB7cMlCv4 │ SystemManaged │ dev_node   │                │         │ v1.2.686-nightly            │
│ dtawAX7FT56iJJv6rER6R2 │ SystemManaged │ infra_node │ test_warehouse │ default │ v1.2.686-nightly            │
│ jze3JfzDyY2amoN7Zbq3u6 │ SystemManaged │ infra_node │ test_warehouse │ default │ v1.2.686-nightly            │
│ s7Yfg7OgXPHAX7pETAbcc  │ SystemManaged │ dev_node   │ test_warehouse │ default │ v1.2.686-nightly            │
│ tM8lj2NOTTtTwjnQIzCwI6 │ SystemManaged │ infra_node │ test_warehouse │ default │ v1.2.686-nightly            │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Remove Nodes from cluster of a Warehouse by Node Group

```sql
root@localhost:8000/default> alter warehouse test_warehouse unassign nodes(unassign 1 nodes from dev_node for default, unassign 2 nodes from infra_node for default);

root@localhost:8000/default> show online nodes;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           id           │      type     │ node_group │    warehouse   │ cluster │           version           │
├────────────────────────┼───────────────┼────────────┼────────────────┼─────────┼─────────────────────────────┤
│ 6yCaMTMAZbP6nSsNfzkSG5 │ SystemManaged │ log_node   │                │         │ v1.2.686-nightly            │
│ 8g0E9LxG3mk2eBhKNT9DT2 │ SystemManaged │ log_node   │ test_warehouse │ default │ v1.2.686-nightly            │
│ AJ4V671FSZiWz2NUIWg6w5 │ SystemManaged │ dev_node   │                │         │ v1.2.686-nightly            │
│ DQUhMHYSdKqML5HJFhVbn4 │ SystemManaged │ infra_node │                │         │ v1.2.686-nightly            │
│ Ji2SZp1zsJQHLyBUTDcrm1 │ SystemManaged │ infra_node │                │         │ v1.2.686-nightly            │
│ a4XEkpidlCSuRkB7cMlCv4 │ SystemManaged │ dev_node   │                │         │ v1.2.686-nightly            │
│ dtawAX7FT56iJJv6rER6R2 │ SystemManaged │ infra_node │                │         │ v1.2.686-nightly            │
│ jze3JfzDyY2amoN7Zbq3u6 │ SystemManaged │ infra_node │                │         │ v1.2.686-nightly            │
│ s7Yfg7OgXPHAX7pETAbcc  │ SystemManaged │ dev_node   │                │         │ v1.2.686-nightly            │
│ tM8lj2NOTTtTwjnQIzCwI6 │ SystemManaged │ infra_node │ test_warehouse │ default │ v1.2.686-nightly            │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
