---
title: databend-meta中的事务支持
description: 
  databend-meta中的事务支持
---

Databend-meta 通过 `KVApi` 支持事务，事务参数包括：

* condition: `condition` 是一个谓词列表。如果所有谓词都成功，则执行 `if_then`，否则执行 `else_then` 操作。
* if_then: `if_then` 是一个操作列表，当所有条件评估为真时执行。
* else_then: `else_then` 是一个操作列表，当并非所有条件评估为真时执行。

`condition` 是一个 `TxnCondition` 列表，包含以下字段：

* key: 用于比较的字符串格式键。
* target: 与键值进行比较的目标，可以是键的最后一次成功 upsert 操作的序列号，或者是键的字节值。
* expected: 条件的预期结果，结果包括 `EQ`, `GT` 等。

`is_then` 和 `else_then` 是一个 `TxnOp` 列表，类型包括：

* TxnGetRequest get: 获取键的值和序列。
* TxnPutRequest put: 设置键的值。
* TxnDeleteRequest delete: 删除键。
* TxnDeleteByPrefixRequest delete_by_prefix: 删除所有具有前缀字符串的键。