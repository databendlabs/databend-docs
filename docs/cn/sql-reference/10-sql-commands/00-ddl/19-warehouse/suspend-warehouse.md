---
title: SUSPEND WAREHOUSE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.687"/>

挂起集群，释放关联的机器资源，但不删除集群。

当您挂起一个集群时，它会释放与该集群关联的机器资源。但是，在尝试与集群交互时，此操作可能会导致问题。具体来说，如果尝试使用或查询挂起的集群，可能会遇到指示集群不可用的错误。例如，试图运行 SHOW ONLINE NODES 或引用挂起集群的其他命令将导致错误。要解决这个问题，您需要退出当前会话并重新连接。

```sql title='Example:'
root@(test_warehouse)/default> suspend warehouse test_warehouse;

suspend warehouse test_warehouse

0 row read in 0.036 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@(test_warehouse)/default> show online nodes;
error: APIError: fail to POST http://localhost:8000/v1/query: BadRequest:(400 Bad Request)[400]Some(400) UnknownWarehouse. Code: 2406, Text = Not find the 'test_warehouse' warehouse; it is possible that all nodes of the warehouse have gone offline. Please exit the client and reconnect, or use `use warehouse <new_warehouse>`.

root@(test_warehouse_1)/default> exit
Bye~

root@localhost:8000/default> show online nodes;

show online nodes

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           id           │      type     │ node_group │ warehouse │ cluster │           version           │
│         String         │     String    │   String   │   String  │  String │            String           │
├────────────────────────┼───────────────┼────────────┼───────────┼─────────┼─────────────────────────────┤
│ 9rabYMxa0ReDyZe6F9igH5 │ SystemManaged │ log_node   │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ CbzfLlTVO29EhkZXdeR625 │ SystemManaged │ log_node   │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ O0kOetbvkFjxrQ2kx4uMI  │ SystemManaged │ dev_node   │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ R2epWlGVd8S0maSTuwbsv4 │ SystemManaged │ dev_node   │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ SoZcaT4gmhVoGKcChlDw93 │ SystemManaged │ infra_node │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ UeNVzwHCXhxJTTB4Xonj07 │ SystemManaged │ dev_node   │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ Zu7rmhVZ2s2HqTUCdFBdu2 │ SystemManaged │ infra_node │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ bRubWZEzIibFgRgFad2MS3 │ SystemManaged │ infra_node │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ ilPer0ps5wWnEDOLIlk821 │ SystemManaged │ infra_node │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ shnWu1TC41sAxVwJMIVQF3 │ SystemManaged │ infra_node │           │         │ v1.2.665-nightly-bcb2c16f67 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
10 rows read in 0.133 sec. Processed 0 rows, 0 B (0 row/s, 0 B/s)
```

## 语法

```sql
SUSPEND WAREHOUSE <warehouse_name>
```

## 例子

下面的例子挂起了 `test_warehouse` 集群：

```sql
SUSPEND WAREHOUSE test_warehouse;
```
