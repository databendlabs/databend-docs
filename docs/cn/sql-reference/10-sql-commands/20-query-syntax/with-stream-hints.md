---
title: WITH Stream Hints
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.670"/>

使用 hints 指定各种流配置选项，以控制流的处理方式。

另请参阅：[WITH CONSUME](with-consume.md)

## 语法

```sql
SELECT ...
FROM <stream_name> WITH (<hint1> = <value1>[, <hint2> = <value2>, ...])
```

以下列出了可用的 hints，包括它们的描述和优化流处理的推荐用法：

| Hint             | Description                                                                                                                                                                               |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `CONSUME`        | 指定此查询是否将消费流。默认为 `False`。                                                                                                                                                              |
| `MAX_BATCH_SIZE` | 定义从流中处理的每个批次的最大行数。<br/>- 如果未指定，则处理流中的所有行。<br/>- 不允许在事务中更改同一流的 `MAX_BATCH_SIZE`，否则将导致错误。<br/>- 对于具有大量变更积压的流，例如长时间未消费的流，*不*建议设置 `MAX_BATCH_SIZE` 或使用较小的值，因为它可能会降低捕获效率。 |

## 示例

在演示之前，让我们创建一个表，在其上定义一个流，并插入两行数据。

```sql
CREATE TABLE t1(a int);
CREATE STREAM s ON TABLE t1;
INSERT INTO t1 values(1);
INSERT INTO t1 values(2);
```

以下演示了在查询流时，`MAX_BATCH_SIZE` hint 如何影响每个批次处理的行数。当 `MAX_BATCH_SIZE` 设置为 1 时，每个批次包含单行，而设置为 2 时，将在单个批次中处理两行。

```sql
SELECT * FROM s WITH (CONSUME = FALSE, MAX_BATCH_SIZE = 1);

-[ RECORD 1 ]-----------------------------------
               a: 1
   change$action: INSERT
change$is_update: false
   change$row_id: de75bebeeb6b4a54bfe05d4d14c83757000000

SELECT * FROM s WITH (CONSUME = FALSE, MAX_BATCH_SIZE = 2);

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               2 │ INSERT        │ false            │ d2c02e411db84d269dc9f6e32d8444bc000000 │
│               1 │ INSERT        │ false            │ de75bebeeb6b4a54bfe05d4d14c83757000000 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

以下显示了查询流时 `CONSUME` hint 的工作方式。当 `CONSUME = TRUE` 且 ` MAX_BATCH_SIZE = 1` 时，每个查询从流中消费一行。

```sql
SELECT * FROM s WITH (CONSUME = TRUE, MAX_BATCH_SIZE = 1);

-[ RECORD 1 ]-----------------------------------
               a: 1
   change$action: INSERT
change$is_update: false
   change$row_id: de75bebeeb6b4a54bfe05d4d14c83757000000

SELECT * FROM s WITH (CONSUME = TRUE, MAX_BATCH_SIZE = 1);

-[ RECORD 1 ]-----------------------------------
               a: 2
   change$action: INSERT
change$is_update: false
   change$row_id: d2c02e411db84d269dc9f6e32d8444bc000000
```