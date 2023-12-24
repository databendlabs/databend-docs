---
title: Memory 引擎
---

## 语法

```sql
CREATE TABLE table_name (
  column_name1 column_type1,
  column_name2 column_type2,
  ...
) ENGINE = Memory;
```

## 使用场景

该引擎仅用于开发和测试目的。不建议在生产环境中使用。

虽然 Memory 引擎提供了一些优势，但也有一些限制：

- 有限的存储容量：可以存储的数据量受服务器可用内存的限制。这使得 Memory 引擎不适用于大型数据集。

- 服务器故障时数据丢失：由于所有数据都存储在内存中，如果托管 Databend 实例的服务器发生故障，所有存储在内存中的数据都将丢失。