---
title: 持续数据管道
---

在 Databend 中构建 CDC（Change Data Capture）流程只需两种原语：

- **Stream**：捕获表的 INSERT/UPDATE/DELETE，一直保留到被消费。
- **Task**：按计划或在 Stream 有新数据时自动运行 SQL。

## 快速入口

- [示例 1：仅追加 Stream](./01-stream.md#示例-1仅追加-stream) – 捕获插入并写入目标表。
- [示例 2：标准 Stream](./01-stream.md#示例-2标准-stream含-update-delete) – 了解更新、删除在 Stream 中的表现。
- [示例 3：增量 Join](./01-stream.md#示例-3增量-join--计算) – 使用 `WITH CONSUME` 做批式增量聚合。
- [示例 1：定时 COPY 任务](./02-task.md#示例-1定时-copy) – 两个任务生成并导入 Parquet。
- [示例 2：Stream 条件任务](./02-task.md#示例-2基于-stream-的条件任务) – 只有 Stream 有增量时才触发。

## 为什么选择 Databend CDC

- **轻量**：Stream 只保存尚未消费的增量。
- **事务一致**：消费 Stream 的语句成功才会清空，失败即回滚。
- **增量友好**：配合 `WITH CONSUME` 能多次运行同一 SQL，每次只处理新数据。
- **自动化**：Task 让任何 SQL 都能定时/触发执行。

先完成 Stream 示例，再组合 Task，即可搭建自己的持续数据管道。
