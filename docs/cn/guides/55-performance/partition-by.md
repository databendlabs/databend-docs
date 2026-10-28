---
title: Fuse 表分区
---

# 使用分区加速裁剪并优化数据布局

`PARTITION BY` 会将 Fuse 表的数据按规则物理隔离。Databend 不会让不同分区值的数据块（Block）和段（Segment）跨越分区边界，同时会把分区值记录在元数据中，从而在查询时跳过不可能满足条件的分区。

当大型表经常按时间范围、租户、区域或其他稳定维度过滤时，可以使用表分区。对于高基数键，可通过 `BUCKET()` 创建数量固定的哈希分区。

## 解决什么问题？

| 问题 | 影响 | `PARTITION BY` 的作用 |
|------|------|----------------------|
| 查询只需要大型表中的少量数据 | 仍需检查无关的 Segment 和 Block | 在扫描前通过分区元数据排除无关分区 |
| 时序数据跨越许多天或月份 | 查询近期数据时还会读取历史数据 | 使用日期表达式将数据划分为时间分区 |
| 自然键基数很高 | 每个值一个分区会造成严重碎片化 | `BUCKET()` 将键映射到固定数量的哈希分区 |
| 分布式写入产生大量小 Block | 多个节点可能分别写入同一分区 | 哈希写入分布将同一分区值路由到同一个 Writer |

## 分区与聚类的区别

`PARTITION BY` 和 `CLUSTER BY` 可以配合使用：

| 特性 | `PARTITION BY` | `CLUSTER BY` |
|------|----------------|--------------|
| 物理保证 | Block 和 Segment 不会跨越分区边界 | 数据按键排序，相近值尽量存放在一起 |
| 主要作用 | 分区级裁剪和物理隔离 | 在分区内部进行更细粒度的 Block 裁剪 |
| 典型基数 | 低基数或有明确上限 | 中高基数 |
| 常见表达式 | `DATE_TRUNC(day, event_time)`、`region`、`BUCKET(32, customer_id)` | `event_time`、`customer_id`、`(region, event_time)` |
| 维护方式 | 写入、Mutation、Compaction 和 Recluster 都会保留分区边界 | 通过 Clustering 和 Recluster 维护 |

同一张表可以同时定义两者。分区键不会自动成为用户可见 Cluster Key 的一部分：

```sql
CREATE TABLE events (
    event_time TIMESTAMP,
    tenant_id  BIGINT,
    payload    VARIANT
)
PARTITION BY (DATE_TRUNC(day, event_time))
CLUSTER BY (tenant_id, event_time);
```

## 快速开始

创建一张按天分区的表：

```sql
CREATE TABLE events (
    event_id   BIGINT,
    event_time TIMESTAMP,
    event_type STRING
)
PARTITION BY (DATE_TRUNC(day, event_time));
```

后续写入都会遵循分区边界：

```sql
INSERT INTO events VALUES
    (1, '2026-07-08 10:00:00', 'login'),
    (2, '2026-07-08 18:30:00', 'purchase'),
    (3, '2026-07-09 09:15:00', 'logout');
```

查询时，时间条件可裁剪无关的日期分区：

```sql
EXPLAIN
SELECT *
FROM events
WHERE event_time >= TIMESTAMP '2026-07-08'
  AND event_time <  TIMESTAMP '2026-07-09';
```

在 `EXPLAIN` 输出中，对比 `partitions total` 和 `partitions scanned`，并查看 `range pruning` 统计。扫描分区数减少，说明分区裁剪已经生效。

## 分区策略

### 按时间分区

对 Timestamp 或 Date 列应用确定性表达式：

```sql
-- 按天分区
PARTITION BY (DATE_TRUNC(day, event_time))

-- 按月分区
PARTITION BY (DATE_TRUNC(month, event_time))
```

分区粒度应与常见过滤条件匹配，同时应保证每个分区足够大，避免碎片化。高吞吐事件数据通常适合按天分区；数据量较小的历史数据通常更适合按月分区。

### 按原值分区

如果某列的取值集合较小且稳定，可直接使用该列：

```sql
CREATE TABLE regional_sales (
    region     STRING,
    order_id   BIGINT,
    order_date DATE,
    amount     DECIMAL(18, 2)
)
PARTITION BY (region);
```

Region、Country、Tenant Tier 等有明确取值范围的业务维度适合直接分区。不要直接按唯一 ID 分区。

### 使用 `BUCKET()` 进行哈希分区

`BUCKET(<count>, <column>)` 会以确定性方式将支持的数据映射到 `0` 至 `<count> - 1` 范围内的无符号分区编号。桶数量必须是 `1` 至 `4294967295` 范围内的整数字面量。

```sql
CREATE TABLE customer_events (
    customer_id BIGINT,
    event_time  TIMESTAMP,
    payload     VARIANT
)
PARTITION BY (BUCKET(32, customer_id));
```

如果查询经常按高基数列做等值过滤，而为每个不同值创建独立分区又不现实，可以使用哈希分区。

`BUCKET()` 支持 Integer、String、Date 和 Timestamp 类型。详情参见 [`BUCKET()`](/sql/sql-functions/hash-functions/bucket)。

### 复合分区

列出多个表达式即可定义复合分区键：

```sql
CREATE TABLE tenant_events (
    tenant_id  BIGINT,
    event_time TIMESTAMP,
    payload    VARIANT
)
PARTITION BY (
    DATE_TRUNC(month, event_time),
    BUCKET(16, tenant_id)
);
```

每个分区表达式只能引用一个源列。如果需要按两列分区，应像上例一样分别列出表达式；不支持 `tenant_id + another_id` 这类同时引用多列的表达式。

<a id="hash-distributed-writes"></a>

### 哈希分布式写入

对于分布式或高并发写入，可以在分区表上设置 `WRITE_DISTRIBUTION_MODE = 'hash'`：

```sql
CREATE TABLE customer_events (
    customer_id BIGINT,
    event_time  TIMESTAMP,
    payload     VARIANT
)
PARTITION BY (BUCKET(32, customer_id))
WRITE_DISTRIBUTION_MODE = 'hash';
```

该模式会对计算后的分区键执行哈希分发，在本地排序前，将相同分区值的行路由到同一个 Writer。当多个节点或 Pipeline 同时写入相同分区时，这有助于减少小 Block 碎片。

`WRITE_DISTRIBUTION_MODE` 支持以下取值：

- `'none'`（默认）：写入前不重新分发数据。
- `'hash'`：按分区键重新分发数据，必须同时定义 `PARTITION BY`。

哈希分发会引入网络 Shuffle。它适用于分布式或并行导入，并且优化后的 Block 布局能够抵消 Shuffle 成本的场景；对于小规模、单 Writer 写入，通常不会带来收益。

:::caution[不开哈希分发时，无序输入会很慢]
使用默认的 `WRITE_DISTRIBUTION_MODE = 'none'` 时，数据按到达顺序写入。如果输入数据的分区值逐行混杂，Databend 会写出大量很小的 Block，导入会变得很慢。请给表设置 `WRITE_DISTRIBUTION_MODE = 'hash'`，或者按分区键对输入排序：

```sql
INSERT INTO events SELECT ... FROM source ORDER BY DATE_TRUNC(day, event_time);
```
:::

## 为已有表添加分区键 {/* #add-partition-key-to-existing-table */}

`ALTER TABLE ... PARTITION BY` 只修改表定义。已有数据不会重新分布，之后执行 `OPTIMIZE TABLE` 或 `RECLUSTER` 也不会。只有之后写入的数据才会分区。

| 表的状态 | 结果 |
|---|---|
| 空表 | 推荐。之后导入的数据全部分区。 |
| 已有数据 | 执行成功，但已有数据不做分区裁剪，对已有行执行 `UPDATE`、`DELETE` 或 `MERGE INTO` 会报错 `serialized block contains more than one partition`。需要按下面的方法重写数据。 |
| 已有相同的分区键 | 无变化。 |
| 已有不同的分区键 | 报错 `PARTITION BY is already defined ...; changing it is not supported`。需要先删除分区键。 |
| 非 Fuse 表 | 报错 `ALTER TABLE PARTITION BY is not supported for engine ...`。 |

**空表**：先添加分区键，再导入数据。

```sql
ALTER TABLE events PARTITION BY (DATE_TRUNC(month, event_time));
INSERT INTO events SELECT * FROM source;
```

**已有数据的表**：添加分区键，然后重写整张表。请保留 `ORDER BY`，否则重写会产生大量很小的 Block，速度很慢。

```sql
ALTER TABLE events PARTITION BY (DATE_TRUNC(month, event_time));
INSERT OVERWRITE events SELECT * FROM events ORDER BY DATE_TRUNC(month, event_time);
```

**更换分区键**：先删除，再添加新的分区键，然后重写整张表。

```sql
ALTER TABLE events DROP PARTITION KEY;
ALTER TABLE events PARTITION BY (DATE_TRUNC(day, event_time));
INSERT OVERWRITE events SELECT * FROM events ORDER BY DATE_TRUNC(day, event_time);
```

`DROP PARTITION KEY` 不会重写数据。它会停止分区裁剪，并把 `WRITE_DISTRIBUTION_MODE` 重置为 `'none'`。

## 修改行的分区键值 {/* #updating-the-partition-key-value-of-a-row */}

`UPDATE` 和 `MERGE INTO` 可以修改行的分区键值，该行会移动到新值对应的分区，不需要额外操作。

```sql
-- 把这一行从 9 月分区移到 10 月分区。
UPDATE events SET event_time = '2026-10-05 12:00:00' WHERE event_id = 42;
```

移动一行需要重写该行，代价高于原地更新。

## 表达式规则与表结构变更

Fuse 表的分区表达式需要遵循以下规则：

- 每个表达式必须是确定性的，并且只能引用一个源列。
- 复合分区应使用多个表达式，不能使用一个同时引用多列的表达式。
- `BUCKET()` 的桶数量必须是 `1` 至 `4294967295` 范围内的整数字面量。
- 分区键引用的列不能删除，也不能修改数据类型。
- 重命名被引用的列时，Databend 会同步更新保存的分区表达式。
- 不能通过 `SET OPTIONS` 修改内部 `partition_by` 元数据。
- 此处介绍的 `PARTITION BY` 适用于 Fuse 表，其他引擎可能具有不同的分区语法和语义。

## 最佳实践

| 建议 | 原因 |
|------|------|
| 让分区表达式匹配常用过滤条件 | 使优化器能够尽早排除分区 |
| 优先选择低基数或有明确上限的键 | 避免产生大量小分区和元数据 |
| 对高基数等值查询键使用 `BUCKET()` | 将分区数量控制在可预测范围内 |
| 同时使用分区键和 Cluster Key | 在每个分区内提供更细粒度的裁剪 |
| 使用有代表性的写入并发度进行测试 | 判断哈希分布式写入能否减少碎片 |
| 使用 `EXPLAIN` 验证 | 确认查询条件是否减少了 `partitions scanned` |

:::tip[适用场景]
- 按天或月过滤的事件表和日志表
- 按租户过滤的多租户表
- 取值范围有限的区域或分类数据
- 使用固定桶数量处理高基数等值查询
:::

:::note[不适合分区的场景]
小表、没有稳定过滤模式的表，以及会产生大量微小分区的键，通常无法从物理分区中获益。此时仅使用 [Cluster Key](00-cluster-key.md) 可能更合适。
:::
