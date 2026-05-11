---
title: 表版本管理
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='TABLE VERSIONING'/>

表版本管理允许您为 FUSE 表的特定快照创建命名引用。这些引用不受自动保留清理的影响，为您提供稳定、可读的历史表状态指针。

:::note
表版本管理是一个实验性功能，使用前需要启用：

```sql
SET enable_experimental_table_ref = 1;
```
:::

## 快照标签

快照标签通过名称固定表的某个时间点状态。创建后，标签会持有对特定快照的引用，您可以随时通过 [AT](../../20-query-syntax/03-query-at.md) 子句查询该状态，无需记录快照 ID 或时间戳。

**使用场景：**
- **发布检查点**：在数据管道运行前后标记表状态，便于比较或回滚。
- **审计与合规**：保留命名快照用于监管审查，无需担心保留期过期。
- **安全实验**：标记当前状态，运行实验性转换，然后查询标签验证变更。
- **可复现分析**：固定数据集版本，确保仪表板和报告始终引用相同数据。

**工作原理：**

快照标签为快照附加一个可读的名称。只要标签存在，被引用的快照就会受到保护，不会被 vacuum 和垃圾回收清理 — 即使保留期已过。

- 不带 `RETAIN` 的标签会一直存在，直到显式删除。
- 带 `RETAIN <n> { DAYS | SECONDS }` 的标签会在指定时间后，在下次 vacuum 操作时自动移除。

**SQL 命令：**

| 命令 | 说明 |
|------|------|
| [CREATE SNAPSHOT TAG](01-create-snapshot-tag.md) | 在表快照上创建命名标签 |
| [DROP SNAPSHOT TAG](02-drop-snapshot-tag.md) | 删除快照标签 |
| [FUSE_TAG](../../../20-sql-functions/16-system-functions/fuse_tag.md) | 列出表上所有快照标签 |
