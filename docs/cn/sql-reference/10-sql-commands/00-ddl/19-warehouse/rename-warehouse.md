---
title: RENAME WAREHOUSE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.687"/>

将现有集群重命名为新名称。

当您重命名集群时，如果尝试使用重命名的集群而不首先退出并重新连接，会话将遇到错误。这是因为会话仍然引用旧的集群名称。若要解决此问题，请退出当前会话，然后在尝试使用重命名的集群之前重新连接。

```sql title='Example:'
root@(test_warehouse_1)/default> rename warehouse test_warehouse_1 to test_warehouse;

rename warehouse test_warehouse_1 to test_warehouse

0 row read in 0.027 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@(test_warehouse_1)/default> use warehouse test_warehouse;
error: APIError: fail to POST http://localhost:8000/v1/query: BadRequest:(500 Internal Server Error)[500]Some(500) UnknownWarehouse. Code: 2406, Text = Unknown warehouse or self managed warehouse "test_warehouse_1"
(while in warehouse request forward).

root@(test_warehouse_1)/default> exit
Bye~

root@localhost:8000/default> use warehouse test_warehouse;

use warehouse test_warehouse

0 row read in 0.019 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)
```

## 语法

```sql
RENAME WAREHOUSE <current_name> TO <new_name>
```

## 例子

下面的例子将 `test_warehouse_1` 重命名为 `test_warehouse`：

```sql
RENAME WAREHOUSE test_warehouse_1 TO test_warehouse;
```
