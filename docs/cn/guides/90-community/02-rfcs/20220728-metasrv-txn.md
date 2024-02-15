---
title: Databend-meta中的事务支持
description: 
  Databend-meta中的事务支持
---

Databend-meta通过`KVApi`支持事务，事务参数包括：

* condition: `condition`是一系列的谓词列表。如果所有谓词都成功，则执行`if_then`操作，否则执行`else_then`操作。
* if_then: `if_then`是当所有条件评估为真时将要执行的操作列表。
* else_then: `else_then`是当不是所有条件都评估为真时将要执行的操作列表。

`condition`是`TxnCondition`的列表，包括以下字段：

* key: 用于比较的字符串格式的键。
* target: 键值的目标，可以是键的最后一次成功的upsert操作序列号，或者是键的字节值。
* expected: 条件的预期结果，结果包括`EQ`、`GT`等。

`is_then`和`else_then`是`TxnOp`的列表，它是以下类型之一：

* TxnGetRequest get: 获取键的值和序列。
* TxnPutRequest put: 放置键的值。
* TxnDeleteRequest delete: 删除一个键。
* TxnDeleteByPrefixRequest delete_by_prefix: 删除所有带有前缀字符串的键。