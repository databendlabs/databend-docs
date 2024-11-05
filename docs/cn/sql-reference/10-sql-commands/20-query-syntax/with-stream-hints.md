---
title: WITH Stream Hints
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.670"/>

使用提示指定各种流配置选项，以控制流的处理方式。

另请参阅: [WITH CONSUME](with-consume.md)

## 语法

```sql
SELECT ...
FROM <stream_name> WITH (<hint1> = <value1>[, <hint2> = <value2>, ...])
```

以下列出了可用的提示，包括它们的描述和推荐的用法，以优化流处理：

| 提示             | 描述                                                                                                                                                                               |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `CONSUME`        | 指定此查询是否会消费流。默认为 `False`。                                                                                                                |
| `MAX_BATCH_SIZE` | 定义从流中处理的每批次最大行数。<br/>- 如果未指定，则处理流中的所有行。<br/>- 不允许在同一事务中为同一流更改 `MAX_BATCH_SIZE`，否则会导致错误。<br/>- 对于有大量积压更改的流，例如当流长时间未被消费时，不建议设置 `MAX_BATCH_SIZE` 或使用较小的值，因为这可能会降低捕获效率。 |

## 示例

在演示之前，我们先创建一个表，在其上定义一个流，并插入两行数据。

```sql
CREATE TABLE t1(a int);
CREATE STREAM s ON TABLE t1;
INSERT INTO t1 values(1);
INSERT INTO t1 values(2);
```

以下演示了 `MAX_BATCH_SIZE` 提示如何影响查询流时每批次处理的行数。将 `MAX_BATCH_SIZE` 设置为 1 时，每批次包含一行，而将其设置为 2 时，则在一个批次中处理两行。

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

以下展示了在查询流时 `CONSUME` 提示的操作方式。将 `CONSUME = TRUE` 和 `MAX_BATCH_SIZE = 1` 设置时，每次查询会从流中消费一行。

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