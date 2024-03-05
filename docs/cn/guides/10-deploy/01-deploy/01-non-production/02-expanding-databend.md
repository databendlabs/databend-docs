---
title: 扩展 Databend
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

如果您已经有了一个 Databend 实例，您可以通过添加一个或多个查询节点来扩展它，以获得更强大的计算能力。本主题解释如何添加一个新的查询节点。

按照以下说明向现有的 Databend 实例添加一个新的查询节点：

<StepsWrap>
<StepContent number="1" title="配置新查询节点">

1. 在文件夹 `/usr/local/databend/etc` 中复制文件 `databend-query-node.toml`，将其粘贴到同一文件夹中，并命名为 `databend-query-node2.toml`。

2. 打开文件 `databend-query-node2.toml`，修改参数值如下：

```toml
# 用于管理员重置 API。
admin_api_address = "127.0.0.1:8082"

# 集群 flight RPC。
flight_api_address = "127.0.0.1:9092"
```

:::tip

**保持相同的集群 ID**。当您为集群设置一个新的查询节点时，确保所有节点的集群 ID 都相同。查询节点使用此 ID 来决定加入哪个集群，并注册到相应的 Meta 节点。

:::

</StepContent>
<StepContent number="2" title="启动新查询节点">

1. 打开一个终端窗口并导航到文件夹 `/usr/local/databend/bin`。

2. 运行以下命令以启动查询节点：

```shell
./databend-query -c ./databend-query-node2.toml 2>&1 > query.node2.log&
```

</StepContent>
<StepContent number="3" title="检查新查询节点">

1. 运行以下命令以检查新节点是否成功启动：

```shell
curl -I  http://127.0.0.1:8082/v1/health
```

2. 检查集群信息：

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