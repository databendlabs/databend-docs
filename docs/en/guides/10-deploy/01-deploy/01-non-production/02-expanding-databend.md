---
title: Expanding Databend
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

If you already have a Databend instance, you can expand it by adding one or more Query nodes to obtain more powerful computing capability. This topic explains how to add a new Query node.

Follow the instructions below to add a new Query node to an existing Databend instance:

<StepsWrap>
<StepContent number="1" title="Configure New Query Node">

1. Make a copy of the file `databend-query-node.toml` in the folder `/usr/local/databend/etc`, paste it to the same folder with a name `databend-query-node2.toml`.

2. Open the file `databend-query-node2.toml`, modify the values for the parameters as below:

```toml
# For admin RESET API.
admin_api_address = "127.0.0.1:8082"

# Cluster flight RPC.
flight_api_address = "127.0.0.1:9092"
```

:::tip

**Keep the same cluster ID**. When you set up a new Query node for a cluster, make sure all the cluster IDs are the same across the nodes. A Query node uses this ID to decide which cluster to join and registers to the corresponding Meta node.

:::

</StepContent>
<StepContent number="2" title="Start New Query Node">

1. Open a terminal window and navigate to the folder `/usr/local/databend/bin`.

2. Run the following command to start the Query node:

```shell
./databend-query -c ./databend-query-node2.toml 2>&1 > query.node2.log&
```

</StepContent>
<StepContent number="3" title="Check New Query Node">

1. Run the following command to check if the new node was started successfully:

```shell
curl -I  http://127.0.0.1:8082/v1/health
```

2. Check the cluster information:

```sql
mysql -h127.0.0.1 -uroot -P3308
SELECT * FROM system.clusters
+------------------------+-----------+------+
| name                   | host      | port |
+------------------------+-----------+------+
| QXyxUbieMYMV6OGrjoDKL6 | 127.0.0.1 | 9092 |
| Y1lJiseTjCLwpVRYItQ2f3 | 127.0.0.1 | 9091 |
+------------------------+-----------+------+
```
</StepContent>
</StepsWrap>