---
title: Fuse 引擎工作原理
---

## Fuse 引擎

Fuse 引擎是 Databend 的核心存储引擎，专为在**云对象存储**上高效管理 **PB 级**数据而设计。默认情况下，在 Databend 中创建的表会自动使用此引擎（`ENGINE=FUSE`）。受 Git 启发，其基于 Snapshot 的设计支持强大的数据版本控制（如 Time Travel），并通过先进的剪枝和索引技术提供**高查询性能**。

本文档解释其核心概念和工作原理。

## 核心概念

Fuse 引擎使用三个核心结构组织数据，类似于 Git：

*   **Snapshots (类似 Git Commits):** 不可变的引用，通过指向特定 Segments 定义表在某个时间点的状态。支持 Time Travel。
*   **Segments (类似 Git Trees):** Blocks 的集合，包含用于快速数据跳过（剪枝）的汇总统计信息。可在 Snapshots 间共享。
*   **Blocks (类似 Git Blobs):** 不可变的数据文件（Parquet 格式），保存实际行数据和详细的列级统计信息，用于细粒度剪枝。

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

向表中添加数据时，Fuse 引擎会创建对象链。过程如下：

### 步骤 1：创建表

```sql
CREATE TABLE git(file VARCHAR, content VARCHAR);
```

此时表无数据：

```
(空表，无数据)
```

### 步骤 2：插入第一条数据

```sql
INSERT INTO git VALUES('cloud.txt', '2022/05/06, Databend, Cloud');
```

首次插入后，Fuse 引擎创建初始 Snapshot、Segment 和 Block：

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

插入新数据时，Fuse 引擎创建新 Snapshot，引用原始 Segment 和新 Segment：

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

查询数据时，Fuse 引擎通过智能剪枝高效定位数据：

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
             │                                    (跳过 - 不包含
             │                                     'cloud.txt')
             ▼
     ┌───────────────┐
     │   BLOCK 1     │
     │    CHECK      │
     └───────┬───────┘
             │
             │ ✓ (包含 'cloud.txt')
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

Fuse 引擎的 Snapshot 架构支持强大数据管理能力：

### Time Travel

查询任意时间点的历史数据。支持数据分支、标记和治理，提供完整审计跟踪与错误恢复。

### Zero-Copy Schema Evolution

修改表结构（添加列、删除列、重命名、更改类型）**无需重写底层数据文件**。

- 变更仅为记录在新 Snapshots 中的元数据操作。
- 瞬时完成，无需停机，避免高成本数据迁移。旧数据仍可通过原始模式访问。

## 查询加速的高级索引（Fuse 引擎）

除基础 Block/Segment 剪枝外，Fuse 引擎提供专用二级索引加速特定查询：

| 索引类型          | 简要描述                                         | 加速查询类型                         | 示例查询片段                   |
| :---------------- | :----------------------------------------------- | :----------------------------------- | :----------------------------- |
| **Aggregate Index** | 为指定分组预计算聚合结果                         | 加速 `COUNT`, `SUM`, `AVG` + `GROUP BY` | `SELECT COUNT(*)... GROUP BY city` |
| **Full-Text Index** | 文本关键词快速搜索的倒排索引                     | `MATCH` 文本搜索（如日志）           | `WHERE MATCH(log_entry, 'error')` |
| **JSON Index**      | 索引 JSON 文档内特定路径/键                      | 基于 JSON 路径/值的过滤              | `WHERE event_data:user.id = 123` |
| **Bloom Filter Index** | 概率性检查跳过不匹配 Blocks                      | 快速点查找（`=`）和 `IN` 列表过滤    | `WHERE user_id = 'xyz'` |

## 对比：Databend Fuse 引擎 vs. Apache Iceberg

_**注意：** 此对比聚焦**表格式功能**。作为 Databend 原生表格式，Fuse 持续演进以提升**可用性与性能**。功能基于当前版本，未来可能变更。_

| 功能                 | Apache Iceberg                     | Databend Fuse 引擎                 |
| :------------------- | :--------------------------------- | :--------------------------------- |
| **Metadata Structure**  | Manifest Lists → Manifest Files → Data Files | **Snapshot** → Segments → Blocks   |
| **Statistics Levels**   | File-level (+Partition)            | **Multi-level** (Snapshot, Segment, Block) → 更细粒度剪枝 |
| **Pruning Power**       | Good (File/Partition stats)        | **Excellent** (多级统计 + 二级索引) |
| **Schema Evolution**    | Supported (Metadata change)        | **Zero-Copy** (仅元数据，瞬时)     |
| **Data Clustering**     | Sorting (On write)                 | **Automatic** Optimization (后台)  |
| **Streaming Support**   | Basic streaming ingestion          | **Advanced Incremental** (插入/更新跟踪) |