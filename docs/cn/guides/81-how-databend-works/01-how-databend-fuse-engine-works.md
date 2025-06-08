---
title: Fuse Engine 工作原理
---

## Fuse Engine

Fuse Engine 是 Databend 的核心存储引擎，专为在**云对象存储 (cloud object storage)** 上高效管理 **PB 级**数据而优化。默认情况下，在 Databend 中创建的表会自动使用此引擎 (`ENGINE=FUSE`)。其设计灵感源于 Git，基于快照 (snapshot) 的架构支持强大的数据版本控制功能（如时间回溯 (Time Travel)），并通过先进的剪枝 (pruning) 和索引技术提供**卓越的查询性能**。

本文档将阐述其核心概念和工作原理。


## 核心概念

Fuse Engine 借鉴 Git 的设计，使用三种核心结构来组织数据：

*   **快照 (Snapshot) (类似 Git 的 Commit)：** 不可变的引用，通过指向特定的段 (Segment) 来定义表在某个时间点的状态，是实现时间回溯 (Time Travel) 的基础。
*   **段 (Segment) (类似 Git 的 Tree)：** 块 (Block) 的集合，包含用于快速数据跳过（即剪枝）的摘要统计信息，可在不同快照之间共享。
*   **块 (Block) (类似 Git 的 Blob)：** 不可变的数据文件（采用 Parquet 格式），其中包含实际的行数据以及用于细粒度剪枝的详细列级统计信息。


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

当您向表中添加数据时，Fuse Engine 会创建一系列环环相扣的对象。下面我们分步解析此过程：

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

第一次插入后，Fuse Engine 会创建初始的快照、段和块：

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

当我们插入更多数据时，Fuse Engine 会创建一个新的快照，该快照同时引用原始段和一个新段：

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

当您查询数据时，Fuse Engine 会利用智能剪枝来高效地查找所需数据：

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

Fuse Engine 的快照架构支持多种强大的数据管理功能：

### 时间回溯 (Time Travel)

查询数据在任意时间点的状态。支持数据分支、打标和治理，并提供完整的审计追踪和错误恢复能力。

### 零拷贝模式演进 (Zero-Copy Schema Evolution)

修改表结构（如添加/删除列、重命名、更改类型）时，**无需重写任何底层数据文件**。

- 所有变更都属于元数据层面的操作，并记录在新的快照中。
- 此过程瞬时完成，无需停机，并避免了成本高昂的数据迁移。旧数据仍可通过其原始模式进行访问。


## 用于查询加速的高级索引 (Fuse Engine)

除了利用统计信息进行基本的块/段剪枝外，Fuse Engine 还提供专门的二级索引 (secondary indexes) 以进一步加速特定的查询模式：

| 索引类型 | 简要描述 | 加速的查询类型 | 示例查询片段 |
| :--- | :--- | :--- | :--- |
| **聚合索引 (Aggregate Index)** | 为指定分组预先计算聚合结果 | 加速 `COUNT`, `SUM`, `AVG`... + `GROUP BY` 查询 | `SELECT COUNT(*)... GROUP BY city` |
| **全文索引 (Full-Text Index)** | 用于在文本内进行快速关键字搜索的倒排索引 | 使用 `MATCH` 进行文本搜索（例如日志） | `WHERE MATCH(log_entry, 'error')` |
| **JSON 索引 (JSON Index)** | 为 JSON 文档中的特定路径或键建立索引 | 基于特定 JSON 路径或值进行筛选 | `WHERE event_data:user.id = 123` |
| **布隆过滤器索引 (Bloom Filter Index)** | 一种概率性检查方法，可快速跳过不匹配的数据块 | 快速点查询 (`=`) 和 `IN` 列表筛选 | `WHERE user_id = 'xyz'` |



## 对比：Databend Fuse Engine vs. Apache Iceberg

_**注意：** 此对比专门关注**表格式 (table format) 功能**。作为 Databend 的原生表格式，Fuse 持续演进，旨在提升**易用性 (usability) 和性能**。所示功能为当前版本的功能，未来可能会发生变化。_

| 功能 | Apache Iceberg | Databend Fuse Engine |
| :--- | :--- | :--- |
| **元数据结构** | Manifest Lists -> Manifest Files -> Data Files | **Snapshot** -> Segments -> Blocks |
| **统计信息级别** | 文件级 (+ 分区) | **多级** (Snapshot, Segment, Block) → 实现更精细的剪枝 |
| **剪枝能力** | 良好 (基于文件/分区统计信息) | **卓越** (多级统计信息 + 二级索引) |
| **模式演进** | 支持 (元数据变更) | **零拷贝** (仅元数据，瞬时完成) |
| **数据聚类** | 排序 (写入时) | **自动**优化 (后台进行) |
| **流式处理支持** | 基础的流式摄取 | **高级增量处理** (跟踪 Insert/Update) |