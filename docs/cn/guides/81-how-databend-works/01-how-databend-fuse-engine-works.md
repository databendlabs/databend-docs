---
title: Fuse Engine 的工作原理
---

## Fuse Engine

Fuse Engine 是 Databend 的核心存储引擎，经过优化，可以高效地管理 **PB 级别** 的数据，这些数据存储在 **云对象存储** 上。默认情况下，在 Databend 中创建的表会自动使用此引擎 (`ENGINE=FUSE`)。受到 Git 的启发，其基于快照的设计实现了强大的数据版本控制（如时间回溯），并通过高级的剪枝和索引提供 **高查询性能**。

本文档解释了它的核心概念以及它的工作原理。

## 核心概念

Fuse Engine 使用三个核心结构来组织数据，与 Git 类似：

*   **快照（类似于 Git 提交）：** 不可变的引用，通过指向特定的 Segment 来定义表在某个时间点的状态。支持时间回溯。
*   **Segment（类似于 Git 树）：** Block 的集合，包含用于快速数据跳过（剪枝）的摘要统计信息。可以在快照之间共享。
*   **Block（类似于 Git Blob）：** 不可变的数据文件（Parquet 格式），包含实际的行和详细的列级统计信息，用于细粒度的剪枝。

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

当你向表中添加数据时，Fuse Engine 会创建一个对象链。让我们逐步了解这个过程：

### 步骤 1：创建表

```sql
CREATE TABLE git(file VARCHAR, content VARCHAR);
```

此时，表已存在，但不包含任何数据：

```
(Empty table with no data)
```

### 步骤 2：插入第一条数据

```sql
INSERT INTO git VALUES('cloud.txt', '2022/05/06, Databend, Cloud');
```

在第一次插入后，Fuse Engine 会创建初始快照、segment 和 block：

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

当我们插入更多数据时，Fuse Engine 会创建一个新的快照，该快照同时引用原始 segment 和新的 segment：

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

当你查询数据时，Fuse Engine 使用智能剪枝来高效地查找你的数据：

```
Query: SELECT * FROM git WHERE file = 'cloud.txt';

                         Table HEAD
                             │
                             ▼
     ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
     │  SEGMENT A    │◄────│  SNAPSHOT 2   │────►│  SEGMENT B    │
     │    CHECK      │     │               │     │    CHECK      │
     └───────┬───────┘     └───────────────┘     └───────┬───────┘
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

Fuse Engine 的快照架构实现了强大的数据管理功能：

### 时间回溯


查询任何时间点存在的数据。通过完整的审计跟踪和错误恢复，实现数据分支、标记和治理。

### 零拷贝 Schema 演进

修改表的结构（添加列、删除列、重命名、更改类型），**无需重写任何底层数据文件**。

- 更改是仅元数据的操作，记录在新的快照中。
- 这是即时的，不需要停机，并避免了昂贵的数据迁移任务。旧数据仍然可以使用其原始 schema 访问。

## 用于查询加速的高级索引（Fuse Engine）

除了使用统计信息进行基本块/段修剪之外，Fuse Engine 还提供专门的二级索引，以进一步加速特定的查询模式：

| 索引类型            | 简要描述                                                     | 加速的查询类型...                               | 示例查询片段                              |
| :------------------ | :----------------------------------------------------------- | :-------------------------------------------------- | :-------------------------------------- |
| **Aggregate Index** | 预先计算指定组的聚合结果                                   | 更快的 `COUNT`、`SUM`、`AVG`... + `GROUP BY`          | `SELECT COUNT(*)... GROUP BY city`      |
| **Full-Text Index** | 用于在文本中快速关键字搜索的倒排索引                           | 使用 `MATCH` 的文本搜索（例如，日志）                  | `WHERE MATCH(log_entry, 'error')`     |
| **JSON Index**      | 索引 JSON 文档中的特定路径/键                               | 过滤特定 JSON 路径/值                               | `WHERE event_data:user.id = 123`      |
| **Bloom Filter Index** | 概率性检查以快速跳过不匹配的块                             | 快速点查找 (`=`) 和 `IN` 列表过滤                   | `WHERE user_id = 'xyz'` |

## 比较：Databend Fuse Engine vs. Apache Iceberg

_**注意：** 此比较专门关注**表格式功能**。作为 Databend 的原生表格式，Fuse 不断发展，旨在提高**可用性和性能**。显示的功能是当前的；预计会有变化。_

| 功能                   | Apache Iceberg                     | Databend Fuse Engine                 |
| :---------------------- | :--------------------------------- | :----------------------------------- |
| **Metadata Structure**  | Manifest Lists -> Manifest Files -> Data Files | **Snapshot** -> Segments -> Blocks   |
| **Statistics Levels**   | 文件级别（+分区）                    | **多级别**（快照、段、块）→ 更精细的修剪 |
| **Pruning Power**       | 良好（文件/分区统计）                | **优秀**（多级别统计 + 二级索引）         |
| **Schema Evolution**    | 支持（元数据更改）                   | **零拷贝**（仅元数据，即时）            |
| **Data Clustering**     | 排序（写入时）                       | **自动**优化（后台）                   |
| **Streaming Support**   | 基本流式摄取                       | **高级增量**（插入/更新跟踪）            |