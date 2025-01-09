---
title: 通过 SQL 管理本地查询计算集群
sidebar_label: 通过 SQL 管理查询计算集群
description: 如何通过 SQL 在本地管理可扩展且灵活的查询计算集群。
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.681"/>

import EEFeature from '@site/src/components/EEFeature';


本主题解释了如何通过 SQL 在本地管理可扩展且灵活的查询计算集群。

## 理解计算集群

![本地计算集群](/img/deploy/on-premise-warehouse.png)

**场景描述**
之前，我们在[部署](https://docs.databend.com/guides/deploy/deploy/production/metasrv-deploy#step-2-deploy-query-nodes)中介绍了如何使用静态的 `tenant_id` 和 `cluster_id` 来部署 Databend。

为了使本地部署成功，必须有一个熟练的 DevOps 团队来有效管理部署和配置。这包括：
1. 在高峰使用时间策略性地将查询路由到不同的集群以提高并发性。
2. 根据需要重新启动节点并将其重新分配到不同的集群来调整集群大小。
3. 为集群节点实施稳健的负载均衡策略，这在本地环境中可能会带来独特的挑战。

Databend 的本地计算集群 SQL 命令提供了一个强大的解决方案，让用户在几秒钟内构建一个多集群查询计算集群。这些命令使您能够：

- 构建和管理多个查询计算集群，以提高高峰时段的查询并发性
- 动态地将查询路由到不同的集群以处理高峰流量
- 在集群节点之间实施智能负载均衡
- 无缝地在计算集群和集群之间重新分配节点，实现零停机

这种灵活性使您能够优化资源利用率，并在本地部署中适应不断变化的工作负载需求，同时保持高可用性。

### 计算集群相关概念

在使用 Databend 中的计算集群时，理解以下概念非常重要：
- **计算集群**：用户与之交互以执行 SQL 查询的计算资源集合。它内部可以包含多个集群来处理并发查询工作负载。

- **集群**：表示一组计算资源的抽象概念。每个 SQL 查询将尝试使用所有节点的资源（包括 CPU、内存、磁盘等）来完成查询。一个计算集群由多个集群组成，每个集群在物理上是隔离的。当需要增加计算集群的并发处理能力时，可以添加新的集群。在之前静态配置的 `tenant_id` 和 `cluster_id` 部署中，计算集群是一个名为 `cluster_id` 的单集群计算集群。

- **节点组**：节点的分组，可以与节点一一对应，也可以有多个节点属于同一个组。可以理解为某种标签，帮助节点分配到不同的计算集群和集群。

## 使用系统管理的计算集群部署 Databend Query

- 更改您的查询配置。

```toml title='databend-query.toml'
[query]
....
# 要启用计算集群功能，您必须不设置 cluster_id
# cluster_id = "test_cluster"
...
[query.resources_management]
type = "system_managed"
node_group = "node_group"
...
```

- 启动 Databend Query

```shell
./databend-query --config databend-query.toml
```

## 使用 SQL 管理您的本地计算集群

### 检查租户中当前在线的节点

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

### 创建一个包含 2 个节点的单集群计算集群
此命令将创建一个名为 `test_warehouse_1` 的计算集群，包含 2 个节点。
```sql
root@localhost:8000/default> create warehouse test_warehouse_1 with warehouse_size = 2;

create warehouse test_warehouse_1 with warehouse_size = 2


root@localhost:8000/default> show online nodes;

show online nodes

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

### 获取所有现有的计算集群

```sql
root@localhost:8000/default> show warehouses;

show warehouses

┌───────────────────────────────────────────┐
│    warehouse   │      type      │  status │
├────────────────┼────────────────┼─────────┤
│ test_warehouse │ System-Managed │ Running │
└───────────────────────────────────────────┘
```

### 使用现有的计算集群之一来运行查询
system.clusters 是一个系统表，存储所有集群及其节点的信息。

```sql
root@localhost:8000/default> use warehouse test_warehouse_1;

use warehouse test_warehouse_1


root@(test_warehouse_1)/default> select * from system.clusters;

SELECT * FROM system.clusters

┌───────────────────────────────────────────────────────────────────────────────────────────┐
│          name          │          cluster         │    host   │  port  │     version      │
├────────────────────────┼──────────────────────────┼───────────┼────────┼──────────────────┤
│ SoZcaT4gmhVoGKcChlDw93 │ test_warehouse_1/default │ 127.0.0.1 │  27498 │ v1.2.686-nightly │
│ Zu7rmhVZ2s2HqTUCdFBdu2 │ test_warehouse_1/default │ 127.0.0.1 │  29798 │ v1.2.686-nightly │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

### 向现有计算集群添加集群
向现有计算集群添加集群将使计算集群能够将查询路由到新集群，从而大大提高计算集群的并发性。

:::note
目前，计算集群会随机将查询转发到不同的集群。
:::

```sql
root@localhost:8000/default> alter warehouse test_warehouse add cluster test_cluster with cluster_size = 3;

alter warehouse test_warehouse add cluster test_cluster with cluster_size = 3


root@localhost:8000/default> show online nodes;

show online nodes

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

### 使用节点组创建和管理计算集群

Databend 允许用户使用不同的节点组创建和管理多集群计算集群。同一节点组下的节点将被随机分配到指定的计算集群。

#### 在指定的节点组中创建计算集群
```sql
root@localhost:8000/default> create warehouse test_warehouse(assign 1 nodes from log_node, assign 2 nodes from infra_node);

create warehouse test_warehouse(assign 1 nodes from log_node, assign 2 nodes from infra_node)


root@localhost:8000/default> show online nodes;

show online nodes

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

#### 向现有计算集群添加集群，集群节点来自不同的节点组
```sql
root@localhost:8000/default> alter warehouse test_warehouse add cluster test_cluster (assign 1 nodes from dev_node, assign 1 nodes from infra_node);

alter warehouse test_warehouse add cluster test_cluster (assign 1 nodes from dev_node, assign 1 nodes from infra_node)


root@localhost:8000/default> show online nodes;

show online nodes
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

#### 向现有计算集群添加节点，集群节点来自不同的节点组

```sql
root@localhost:8000/default> alter warehouse test_warehouse assign nodes(assign 1 nodes from dev_node for default, assign 1 nodes from infra_node for default);

alter warehouse test_warehouse assign nodes(assign 1 nodes from dev_node for default, assign 1 nodes from infra_node for default)


root@localhost:8000/default> show online nodes;

show online nodes

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

#### 从计算集群的集群中按节点组移除节点

```sql
root@localhost:8000/default> alter warehouse test_warehouse unassign nodes(unassign 1 nodes from dev_node for default, unassign 2 nodes from infra_node for default);

alter warehouse test_warehouse unassign nodes(unassign 1 nodes from dev_node for default, unassign 2 nodes from infra_node for default)


root@localhost:8000/default> show online nodes;

show online nodes

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