---
title: 扩展独立的 Databend
sidebar_label: 扩展独立的 Databend
description:
  如何扩展独立的 Databend
---

## 扩展独立的 Databend

如果您已经有了一个独立的 Databend，您可以通过添加一个或多个查询节点来扩展它，以获得更强大的计算能力。

在本主题中，我们将向现有的独立 Databend 添加一个新的查询节点。

### 部署独立的 Databend
按照[使用自托管对象存储进行部署](./01-deploying-databend.md)来部署本地独立的 Databend 和 MinIO。

### 部署新的查询节点
1. 在文件夹 `/usr/local/databend/etc` 中复制文件 `databend-query-node.toml`，将其粘贴到同一文件夹中，并命名为 `databend-query-node2.toml`。

2. 打开文件 `databend-query-node2.toml`，将参数值修改如下：

```toml
# 用于管理员重置 API。
admin_api_address = "127.0.0.1:8082"

# 集群 flight RPC。
flight_api_address = "127.0.0.1:9092"
```

:::tip

**保持相同的集群 ID**。当您为集群设置新的查询节点时，请确保所有节点的集群 ID 相同。查询节点使用此 ID 来决定加入哪个集群，并注册到相应的 Meta 节点。

:::

3. 打开一个终端窗口并导航到文件夹 `/usr/local/databend/bin`。

4. 运行以下命令以启动查询节点：

```shell
./databend-query -c ./databend-query-node2.toml 2>&1 > query.node2.log&
```

5. 运行以下命令以检查新节点是否成功启动：

```shell
curl -I  http://127.0.0.1:8082/v1/health
```

6. 检查集群信息：
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

## 下一步

在部署 Databend 之后，您可能需要了解以下主题：

- [加载和卸载数据](/guides/load-data)：在 Databend 中管理数据的导入/导出。
- [可视化](/guides/visualize)：将 Databend 与可视化工具集成以获得洞察。