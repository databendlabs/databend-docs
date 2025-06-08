---
title: Fuse Engine 工作原理
---

## Fuse Engine

Fuse Engine 是 Databend 的核心存储引擎，专为在**云对象存储 (cloud object storage)** 上高效管理 **PB 级**数据而优化。默认情况下，在 Databend 中创建的表会自动使用此引擎 (`ENGINE=FUSE`)。其设计灵感源于 Git，基于快照的架构支持强大的数据版本控制（如时间回溯 (Time Travel)），并通过先进的剪枝 (pruning) 和索引技术提供**高查询性能**。

本文档将介绍其核心概念与工作原理。


## 核心概念

Fuse Engine 使用三个核心结构来组织数据，其设计与 Git 类似：

*   **快照 (Snapshot) (类似 Git Commit)：** 不可变的引用，通过指向特定的 Segment 来定义表在某个时间点的状态。支持时间回溯。
*   **段 (Segment) (类似 Git Tree)：** Block 的集合，包含用于快速数据跳过（即剪枝）的汇总统计信息。可在多个 Snapshot 之间共享。
*   **块 (Block) (类似 Git Blob)：** 不可变的数据文件（Parquet 格式），其中包含实际的行数据和详细的列级统计信息，用于实现细粒度的剪枝。


```
                         Table HEAD
                             │
                             ▼
     ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
     │  SEGMENT A    │◄────│  SNAPSHOT 2   │────►│  SEGMENT B    │
     │               │     │ Previous:     │     │               │
     └───────┬───────┘     │ SNAPSHOT 1    │     └───────┬───────┘
             │             └───────────────┘             │
             │                     │                     │
             │                     ▼                     │
             │             ┌───────────────┐             │
             │             │  SNAPSHOT 1   │             │
             │             │               │             │
             │             └───────────────┘             │
             │                                           │
             ▼                                           ▼
     ┌───────────────┐                           ┌───────────────┐
     │   BLOCK 1     │                           │   BLOCK 2     │
     │ (cloud.txt)   │                           │(warehouse.txt)│
     └───────────────┘                           └───────────────┘
```



## 写入工作原理

当您向表中添加数据时，Fuse Engine 会创建一系列对象。下面我们逐步了解这个过程：

### 步骤 1：创建表

```sql
CREATE TABLE git(file VARCHAR, content VARCHAR);
```

此时，表已存在但不包含任何数据：

```
(空表，无数据)
```

### 步骤 2：插入第一条数据

```sql
INSERT INTO git VALUES('cloud.txt', '2022/05/06, Databend, Cloud');
```

第一次插入后，Fuse Engine 会创建初始的 Snapshot、Segment 和 Block：

```
         Table HEAD
             │
             ▼
     ┌───────────────┐
     │  SNAPSHOT 1   │
     │               │
     └───────┬───────┘
             │
             ▼
     ┌───────────────┐
     │  SEGMENT A    │
     │               │
     └───────┬───────┘
             │
             ▼
     ┌───────────────┐
     │   BLOCK 1     │
     │ (cloud.txt)   │
     └───────────────┘
```

### 步骤 3：插入更多数据

```sql
INSERT INTO git VALUES('warehouse.txt', '2022/05/07, Databend, Warehouse');
```

当我们插入更多数据时，Fuse Engine 会创建一个新的 Snapshot，该快照同时引用原始 Segment 和一个新的 Segment：

```
                         Table HEAD
                             │
                             ▼
     ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
     │  SEGMENT A    │◄────│  SNAPSHOT 2   │────►│  SEGMENT B    │
     │               │     │ Previous:     │     │               │
     └───────┬───────┘     │ SNAPSHOT 1    │     └───────┬───────┘
             │             └───────────────┘             │
             │                     │                     │
             │                     ▼                     │
             │             ┌───────────────┐             │
             │             │  SNAPSHOT 1   │             │
             │             │               │             │
             │             └───────────────┘             │
             │                                           │
             ▼                                           ▼
     ┌───────────────┐                           ┌───────────────┐
     │   BLOCK 1     │                           │   BLOCK 2     │
     │ (cloud.txt)   │                           │(warehouse.txt)│
     └───────────────┘                           └───────────────┘
```

## 读取工作原理

当您查询数据时，Fuse Engine 会使用智能剪枝来高效地查找所需数据：

```
Query: SELECT * FROM git WHERE file = 'cloud.txt';

                         Table HEAD
                             │
                             ▼
     ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
     │  SEGMENT A    │◄────│  SNAPSHOT 2   │────►│  SEGMENT B    │
     │    CHECK      │     │               │     │    CHECK      │
     └───────┬───────┘     └───────────────┘     └───────────────┘
             │                                          ✗
             │                                    (Skip - doesn't contain
             │                                     'cloud.txt')
             ▼
     ┌───────────────┐
     │   BLOCK 1     │
     │    CHECK      │
     └───────┬───────┘
             │
             │ ✓ (Contains 'cloud.txt')
             ▼
        Read this block
```

### 智能剪枝过程

```
┌─────────────────────────────────────────┐
│ Query: WHERE file = 'cloud.txt'         │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Check SEGMENT A                         │
│ Min file value: 'cloud.txt'             │
│ Max file value: 'cloud.txt'             │
│                                         │
│ Result: ✓ Might contain 'cloud.txt'     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Check SEGMENT B                         │
│ Min file value: 'warehouse.txt'         │
│ Max file value: 'warehouse.txt'         │
│                                         │
│ Result: ✗ Cannot contain 'cloud.txt'    │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Check BLOCK 1 in SEGMENT A              │
│ Min file value: 'cloud.txt'             │
│ Max file value: 'cloud.txt'             │
│                                         │
│ Result: ✓ Contains 'cloud.txt'          │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Read only BLOCK 1                       │
└─────────────────────────────────────────┘
```

## 基于快照的功能

Fuse Engine 的快照架构支持强大的数据管理功能：

### 时间回溯 (Time Travel)

可以查询任意时间点的数据状态。支持数据分支、打标和治理，并提供完整的审计追踪和错误恢复能力。

### 零拷贝模式演进 (Zero-Copy Schema Evolution)

修改表结构（添加/删除列、重命名、更改类型）**无需重写任何底层数据文件**。

- 所有变更都属于元数据操作，会被记录在新的 Snapshot 中。
- 此操作是即时完成的，无需停机，并避免了成本高昂的数据迁移。旧数据仍可通过其原始模式进行访问。


## 查询加速的高级索引 (Fuse Engine)

除了使用统计信息进行基本的块/段剪枝外，Fuse Engine 还提供专门的二级索引 (secondary indexes) 来进一步加速特定的查询模式：

| 索引类型          | 简要描述                                         | 加速的查询类型...                         | 示例查询片段                   |
| :------------------ | :-------------------------------------------------------- | :-------------------------------------------------- | :-------------------------------------- |
| **聚合索引 (Aggregate Index)** | 为指定分组预计算聚合结果       | 更快的 `COUNT`、`SUM`、`AVG`... + `GROUP BY`          | `SELECT COUNT(*)... GROUP BY city`      |
| **全文索引 (Full-Text Index)** | 用于在文本内进行快速关键词搜索的倒排索引        | 使用 `MATCH` 的文本搜索（例如日志）              | `WHERE MATCH(log_entry, 'error')`     |
| **JSON 索引 (JSON Index)**      | 索引 JSON 文档中的特定路径或键       | 对特定 JSON 路径或值的过滤             | `WHERE event_data:user.id = 123`      |
| **布隆过滤器索引 (Bloom Filter Index)** | 通过概率性检查快速跳过不匹配的块 | 快速点查找 (`=`) 和 `IN` 列表过滤      | `WHERE user_id = 'xyz'` |



## 对比：Databend Fuse Engine vs. Apache Iceberg

_**注意：** 此对比专门关注**表格式功能**。作为 Databend 的原生表格式，Fuse 在不断演进，旨在改善**可用性和性能**。所示功能为当前状态，未来可能会有变化。_

| 功能                 | Apache Iceberg                     | Databend Fuse Engine                 |
| :---------------------- | :--------------------------------- | :----------------------------------- |
| **元数据结构**  | Manifest Lists -> Manifest Files -> Data Files | **Snapshot** -> Segments -> Blocks   |
| **统计级别**   | 文件级 (+ 分区)            | **多级** (Snapshot, Segment, Block) → 更精细的剪枝 |
| **剪枝能力**       | 良好 (文件/分区统计)      | **卓越** (多级统计 + 二级索引) |
| **模式演进**    | 支持 (元数据变更)        | **零拷贝** (仅元数据，即时完成) |
| **数据聚簇**     | 排序 (写入时)     | **自动**优化 (后台) |
| **流式支持**   | 基本的流式摄取          | **高级增量** (跟踪 Insert/Update) |