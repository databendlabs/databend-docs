---
title: SUSPEND WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

暂停一个计算集群，释放相关的机器资源，但不会删除该计算集群。

当您暂停一个计算集群时，它会释放与该计算集群相关的机器资源。但是，此操作可能会在尝试与计算集群交互时导致问题。具体来说，如果您尝试使用或查询一个已暂停的计算集群，您可能会遇到错误，表明该计算集群不可用。例如，尝试运行 SHOW ONLINE NODES 或其他引用已暂停计算集群的命令将导致错误。要解决此问题，您需要退出当前会话并重新连接。

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

## Syntax

```sql
SUSPEND WAREHOUSE <warehouse_name>
```

## Examples

此示例暂停 `test_warehouse` 计算集群：

```sql
SUSPEND WAREHOUSE test_warehouse;
```